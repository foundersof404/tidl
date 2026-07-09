export type PrxRole = "patient" | "client" | "provider" | "sales_organization";

export type PrxConfig = {
  baseUrl: string;
  /** Primary sandbox token (`{org_id}|{secret}`). */
  apiToken: string;
  /** Optional per-role overrides; sandbox typically uses one token for all. */
  tokens: Record<PrxRole, string | undefined>;
};

export type PrxRequestInit = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export type PrxClient = {
  role: PrxRole;
  request<T = unknown>(path: string, init?: PrxRequestInit): Promise<T>;
  get<T = unknown>(path: string, init?: PrxRequestInit): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, init?: PrxRequestInit): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, init?: PrxRequestInit): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, init?: PrxRequestInit): Promise<T>;
  delete<T = unknown>(path: string, init?: PrxRequestInit): Promise<T>;
};

export class PrxApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "PrxApiError";
    this.status = status;
    this.body = body;
  }
}
