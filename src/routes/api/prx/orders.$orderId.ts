import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { handlePrxRouteError, jsonOk } from "@/server/prx/respond";

export const Route = createFileRoute("/api/prx/orders/$orderId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const prx = createPrxClient();
          const data = await prx.get(`/orders/${params.orderId}`);
          return jsonOk(data);
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
