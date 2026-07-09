import { createFileRoute } from "@tanstack/react-router";
import { handlePrxRouteError, jsonError, jsonOk } from "@/server/prx/respond";

function readEnv(key: string): string | undefined {
  return typeof process !== "undefined" ? process.env[key] : undefined;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function signBody(secret: string, rawBody: string): Promise<{ hex: string; base64: string }> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  return { hex: bufferToHex(signature), base64: bufferToBase64(signature) };
}

async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const normalized = signatureHeader.replace(/^sha256=/i, "").trim();
  const { hex, base64 } = await signBody(secret, rawBody);
  return timingSafeEqualStrings(normalized, hex) || timingSafeEqualStrings(normalized, base64);
}

export const Route = createFileRoute("/api/webhooks/prescribe-rx")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const secret = readEnv("PRX_WEBHOOK_SECRET");

          if (secret) {
            const signature =
              request.headers.get("x-prx-signature") ??
              request.headers.get("x-prescriberx-signature") ??
              request.headers.get("x-hub-signature-256");

            const valid = await verifyWebhookSignature(rawBody, signature, secret);
            if (!valid) {
              return jsonError("Invalid webhook signature", 401);
            }
          }

          const event = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
          const eventType = String(event.type ?? event.event ?? event.status ?? "unknown");

          console.info("[prx-webhook]", eventType, event);

          return jsonOk({ received: true, eventType });
        } catch (error) {
          return handlePrxRouteError(error);
        }
      },
    },
  },
});
