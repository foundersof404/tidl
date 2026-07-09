type ApiSuccess<T> = { ok: true; data: T };
type ApiFailure = { ok: false; error: string; details?: unknown };

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  if (!response.ok || !payload.ok) {
    const details =
      !payload.ok && payload.details && typeof payload.details === "object"
        ? (payload.details as { message?: unknown }).message
        : undefined;
    const message =
      !payload.ok
        ? typeof details === "string" && details.length > 0
          ? details
          : payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload.data;
}

export async function fetchPrxHealth() {
  const response = await fetch("/api/prx/health");
  return parseApiResponse<{
    configured: boolean;
    baseUrl: string;
    checks: Record<string, { status: number; ok: boolean }>;
  }>(response);
}

export async function fetchPrxProducts() {
  const response = await fetch("/api/prx/products");
  return parseApiResponse<unknown>(response);
}

export async function fetchPrxCatalog() {
  const response = await fetch("/api/prx/catalog");
  return parseApiResponse<unknown>(response);
}

export type PrxCheckoutRequest = {
  quiz: import("@/types/quiz").QuizFormData;
  checkout: import("@/types/order").CheckoutFormData;
  product: {
    slug: string;
    name: string;
    monthlyPrice: number;
    dosage: string;
    goal: import("@/types/quiz").GoalId | null;
  };
};

export type PrxCheckoutResult = {
  intake: unknown;
  path: string;
  encounterId?: string;
  encounterNumber?: string;
  patientChartId?: string;
  orderId?: string;
  idempotencyKey: string;
};

export async function submitPrxCheckout(body: PrxCheckoutRequest, idempotencyKey: string) {
  const response = await fetch("/api/prx/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  return parseApiResponse<PrxCheckoutResult>(response);
}

export async function savePrxIntake(quiz: import("@/types/quiz").QuizFormData, step: number) {
  const response = await fetch("/api/prx/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quiz, step }),
  });
  return parseApiResponse<unknown>(response);
}
