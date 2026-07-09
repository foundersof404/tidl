import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { PrxApiError } from "@/lib/prescribe-rx/types";
import type { QuizFormData } from "@/types/quiz";
import { mapQuizToPatientPayload } from "@/server/prx/mappers";
import { handlePrxRouteError, jsonError, jsonOk, readJsonBody } from "@/server/prx/respond";

type IntakeBody = {
  quiz: QuizFormData;
  step?: number;
  checkout?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

const INTAKE_CANDIDATE_PATHS = ["/intakes", "/intake/sessions", "/telehealth/intake", "/unified-intake"] as const;

function canCreatePatientDraft(draft: ReturnType<typeof mapQuizToPatientPayload>): boolean {
  return Boolean(draft.email && draft.first_name && draft.last_name && draft.dob);
}

export const Route = createFileRoute("/api/prx/intake")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await readJsonBody<IntakeBody>(request);
          if (!body?.quiz) {
            return jsonError("Missing quiz payload", 400);
          }

          const patientDraft = mapQuizToPatientPayload(body.quiz, body.checkout);
          if (!canCreatePatientDraft(patientDraft)) {
            return jsonOk({
              skipped: true,
              reason: "incomplete_patient",
              step: body.step ?? null,
            });
          }

          const prx = createPrxClient();

          const intakePayload = {
            step: body.step ?? null,
            patient: patientDraft,
            quiz_snapshot: body.quiz,
            source: "tidl_quiz",
          };

          let lastError: PrxApiError | null = null;
          for (const path of INTAKE_CANDIDATE_PATHS) {
            try {
              const data = await prx.post(path, intakePayload);
              return jsonOk({ path, data });
            } catch (error) {
              if (error instanceof PrxApiError && error.status === 404) {
                lastError = error;
                continue;
              }
              if (error instanceof PrxApiError) throw error;
              throw error;
            }
          }

          const fallback = await prx.post("/patients", {
            ...patientDraft,
            intake_step: body.step ?? null,
            intake_status: "in_progress",
          });

          return jsonOk({
            path: "/patients",
            data: fallback,
            note: "Dedicated intake endpoint unavailable; saved as patient draft.",
            lastIntakeError: lastError?.message,
          });
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
