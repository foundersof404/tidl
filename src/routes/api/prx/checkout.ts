import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import {
  getPrxEncounterTypeSlug,
  getPrxProductTypeSlug,
  isPrxSandbox,
} from "@/lib/prescribe-rx/env";
import { PrxApiError } from "@/lib/prescribe-rx/types";
import {
  extractEncounterId,
  extractEncounterNumber,
  extractOrderId,
  extractPatientChartId,
} from "@/server/prx/extract";
import { mapCheckoutToUnifiedIntakePayload, type PrxCheckoutBody } from "@/server/prx/mappers";
import {
  getIdempotencyKey,
  handlePrxRouteError,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/server/prx/respond";

const UNIFIED_INTAKE_PATH = "/telehealth/intake/unified";

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

          const intakePayload = mapCheckoutToUnifiedIntakePayload(body, {
            idempotencyKey,
            sandbox: isPrxSandbox(),
            encounterTypeSlug: getPrxEncounterTypeSlug(body.product.slug),
            productTypeSlug: getPrxProductTypeSlug(body.product.slug),
          });

          let intake: unknown;
          try {
            intake = await prx.post(UNIFIED_INTAKE_PATH, intakePayload, {
              headers: { "Idempotency-Key": idempotencyKey },
            });
          } catch (error) {
            if (error instanceof PrxApiError) {
              const prxMessage =
                typeof error.body === "object" &&
                error.body != null &&
                "message" in error.body &&
                typeof (error.body as { message: unknown }).message === "string"
                  ? (error.body as { message: string }).message
                  : undefined;
              return jsonError(
                prxMessage ?? "Failed to submit unified intake to PrescribeRx",
                error.status,
                error.body,
              );
            }
            throw error;
          }

          return jsonOk(
            {
              intake,
              path: UNIFIED_INTAKE_PATH,
              encounterId: extractEncounterId(intake),
              encounterNumber: extractEncounterNumber(intake),
              patientChartId: extractPatientChartId(intake),
              orderId: extractOrderId(intake),
              idempotencyKey,
            },
            { status: 201 },
          );
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
