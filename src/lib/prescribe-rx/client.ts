import { getPrxConfig, getPrxToken } from "./env";
import { PrxApiError, type PrxClient, type PrxRequestInit, type PrxRole } from "./types";

function joinUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
}

function createRoleClient(role: PrxRole, baseUrl: string, token: string): PrxClient {
  async function request<T>(path: string, init: PrxRequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

    const hasBody = init.body != null;
    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(joinUrl(baseUrl, path), {
      ...init,
      headers,
    });

    const body = await parseResponseBody(response);
    if (!response.ok) {
      const message =
        typeof body === "object" && body != null && "message" in body
          ? String((body as { message: unknown }).message)
          : `PrescribeRx request failed (${response.status})`;
      throw new PrxApiError(message, response.status, body);
    }

    return body as T;
  }

  return {
    role,
    request,
    get: (path, init) => request(path, { ...init, method: "GET" }),
    post: (path, body, init) =>
      request(path, {
        ...init,
        method: "POST",
        body: body == null ? undefined : JSON.stringify(body),
      }),
    put: (path, body, init) =>
      request(path, {
        ...init,
        method: "PUT",
        body: body == null ? undefined : JSON.stringify(body),
      }),
    patch: (path, body, init) =>
      request(path, {
        ...init,
        method: "PATCH",
        body: body == null ? undefined : JSON.stringify(body),
      }),
    delete: (path, init) => request(path, { ...init, method: "DELETE" }),
  };
}

export function createPrxClient(role: PrxRole = "client"): PrxClient {
  const { baseUrl } = getPrxConfig();
  const token = getPrxToken(role);
  return createRoleClient(role, baseUrl, token);
}

export const prxPatient = () => createPrxClient("patient");
export const prxClient = () => createPrxClient("client");
export const prxProvider = () => createPrxClient("provider");
export const prxSalesOrg = () => createPrxClient("sales_organization");
