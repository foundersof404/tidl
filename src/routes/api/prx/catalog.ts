import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { handlePrxRouteError, jsonOk } from "@/server/prx/respond";

export const Route = createFileRoute("/api/prx/catalog")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const prx = createPrxClient();
          const data = await prx.get("/catalog");
          return jsonOk(data);
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
