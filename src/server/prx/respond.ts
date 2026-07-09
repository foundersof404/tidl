import { PrxApiError } from "@/lib/prescribe-rx/types";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json({ ok: true as const, data }, init);
}

export function jsonError(message: string, status = 500, details?: unknown) {
  return Response.json({ ok: false as const, error: message, details }, { status });
}

export async function readJsonBody<T = unknown>(request: Request): Promise<T | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return (await request.json()) as T;
}

export function handlePrxRouteError(error: unknown) {
  if (error instanceof PrxApiError) {
    return jsonError(error.message, error.status, error.body);
  }

  if (error instanceof Error) {
    return jsonError(error.message, 500);
  }

  return jsonError("Unexpected server error", 500);
}

export function getIdempotencyKey(request: Request): string | undefined {
  return request.headers.get("Idempotency-Key") ?? request.headers.get("idempotency-key") ?? undefined;
}
