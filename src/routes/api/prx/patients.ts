import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { handlePrxRouteError, jsonOk, readJsonBody } from "@/server/prx/respond";

export const Route = createFileRoute("/api/prx/patients")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const prx = createPrxClient();
          const data = await prx.get("/patients");
          return jsonOk(data);
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const prx = createPrxClient();
          const body = await readJsonBody(request);
          const data = await prx.post("/patients", body);
          return jsonOk(data, { status: 201 });
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
