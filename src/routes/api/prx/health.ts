import { createFileRoute } from "@tanstack/react-router";
import { createPrxClient } from "@/lib/prescribe-rx/client";
import { isPrxConfigured, getPrxConfig } from "@/lib/prescribe-rx/env";
import { PrxApiError } from "@/lib/prescribe-rx/types";
import { handlePrxRouteError, jsonOk, jsonError } from "@/server/prx/respond";

export const Route = createFileRoute("/api/prx/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!isPrxConfigured()) {
            return jsonError("PRX_API_TOKEN is not configured", 503);
          }

          const { baseUrl } = getPrxConfig();
          const prx = createPrxClient();
          const paths = ["/products", "/catalog", "/me"] as const;
          const checks: Record<string, { status: number; ok: boolean }> = {};

          for (const path of paths) {
            try {
              await prx.get(path);
              checks[path] = { status: 200, ok: true };
            } catch (error) {
              const status = error instanceof PrxApiError ? error.status : 500;
              checks[path] = { status, ok: false };
            }
          }

          const healthy = Object.values(checks).some((c) => c.ok);

          return jsonOk(
            { configured: true, baseUrl, checks, healthy },
            { status: healthy ? 200 : 502 },
          );
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
