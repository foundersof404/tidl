import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { PrxApiError } from "@/lib/prescribe-rx/types";
import {
  mapCheckoutToOrderPayload,
  mapQuizToPatientPayload,
  type PrxCheckoutBody,
} from "@/server/prx/mappers";
import {
  getIdempotencyKey,
  handlePrxRouteError,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/server/prx/respond";

function extractPatientId(patient: unknown): string | number | undefined {
  if (patient == null || typeof patient !== "object") return undefined;
  const record = patient as Record<string, unknown>;
  const id = record.id ?? record.patient_id ?? record.patientId;
  if (typeof id === "string" || typeof id === "number") return id;
  return undefined;
}

export const Route = createFileRoute("/api/prx/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await readJsonBody<PrxCheckoutBody>(request);
          if (!body?.quiz || !body?.checkout || !body?.product) {
            return jsonError("Missing quiz, checkout, or product payload", 400);
          }

          const idempotencyKey = getIdempotencyKey(request) ?? body.idempotencyKey ?? crypto.randomUUID();
          const prx = createPrxClient();
          const patientPayload = mapQuizToPatientPayload(body.quiz, body.checkout);

          let patient: unknown;
          try {
            patient = await prx.post("/patients", patientPayload);
          } catch (error) {
            if (error instanceof PrxApiError) {
              return jsonError("Failed to create patient in PrescribeRx", error.status, error.body);
            }
            throw error;
          }

          const patientId = extractPatientId(patient);
          const orderPayload = mapCheckoutToOrderPayload(patient, body, patientId);

          let order: unknown;
          try {
            order = await prx.post("/orders", orderPayload, {
              headers: { "Idempotency-Key": idempotencyKey },
            });
          } catch (error) {
            if (error instanceof PrxApiError) {
              if (error.status === 404 || error.status === 405) {
                return jsonOk(
                  {
                    patient,
                    patientId,
                    order: null,
                    orderSubmissionSkipped: true,
                    note: "Patient saved in PrescribeRx. Order creation is not available on this sandbox endpoint yet.",
                    idempotencyKey,
                  },
                  { status: 201 },
                );
              }
              return jsonError("Failed to create order in PrescribeRx", error.status, error.body);
            }
            throw error;
          }

          return jsonOk({ patient, order, patientId, idempotencyKey }, { status: 201 });
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
