import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { getIdempotencyKey, handlePrxRouteError, jsonOk, readJsonBody } from "@/server/prx/respond";

export const Route = createFileRoute("/api/prx/orders")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const prx = createPrxClient();
          const data = await prx.get("/orders");
          return jsonOk(data);
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const prx = createPrxClient();
          const body = await readJsonBody(request);
          const idempotencyKey = getIdempotencyKey(request);
          const headers = idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined;
          const data = await prx.post("/orders", body, { headers });
          return jsonOk(data, { status: 201 });
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
