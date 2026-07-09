import type { PrxConfig, PrxRole } from "./types";

/** Legacy per-role keys — optional overrides if PRX ever issues separate tokens in production. */
const ROLE_ENV_KEYS: Record<PrxRole, string> = {
  patient: "PRX_TOKEN_PATIENT",
  client: "PRX_TOKEN_CLIENT",
  provider: "PRX_TOKEN_PROVIDER",
  sales_organization: "PRX_TOKEN_SALES_ORG",
};

function readEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  return undefined;
}

/**
 * Sandbox: PrescribeRx generates one API token (e.g. `1450|abc...`).
 * Production may add role-specific tokens later — those map to PRX_TOKEN_* overrides.
 */
export function getPrxApiToken(): string {
  const token =
    readEnv("PRX_API_TOKEN") ??
    readEnv("PRX_TOKEN_CLIENT") ??
    readEnv(ROLE_ENV_KEYS.client);

  if (!token) {
    throw new Error(
      "Missing PrescribeRx API token. Set PRX_API_TOKEN in .env.local (see prescribe-rx-sandbox-tokens.md)",
    );
  }

  return token;
}

export function getPrxConfig(): PrxConfig {
  const baseUrl = readEnv("PRX_API_BASE_URL") ?? "https://demo.prescribe-rx.com/api/v1";
  const sharedToken = getPrxApiToken();

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiToken: sharedToken,
    /** @deprecated Sandbox uses one token; role overrides are optional for future production. */
    tokens: {
      patient: readEnv(ROLE_ENV_KEYS.patient) ?? sharedToken,
      client: readEnv(ROLE_ENV_KEYS.client) ?? sharedToken,
      provider: readEnv(ROLE_ENV_KEYS.provider) ?? sharedToken,
      sales_organization: readEnv(ROLE_ENV_KEYS.sales_organization) ?? sharedToken,
    },
  };
}

export function getPrxToken(role: PrxRole = "client"): string {
  const roleToken = readEnv(ROLE_ENV_KEYS[role]);
  if (roleToken) return roleToken;
  return getPrxApiToken();
}

export function isPrxConfigured(): boolean {
  return Boolean(
    readEnv("PRX_API_TOKEN") ?? readEnv("PRX_TOKEN_CLIENT") ?? readEnv(ROLE_ENV_KEYS.client),
  );
}

const ENCOUNTER_TYPE_ENV_KEYS: Record<string, string> = {
  "glp-1-weight-loss": "PRX_GLP1_ENCOUNTER_TYPE_SLUG",
};

const DEFAULT_ENCOUNTER_TYPE_SLUGS: Record<string, string> = {
  "glp-1-weight-loss": "glp-1-screening",
};

/** Encounter type slug for POST /telehealth/intake/unified. */
export function getPrxEncounterTypeSlug(productSlug?: string): string {
  if (productSlug) {
    const envKey = ENCOUNTER_TYPE_ENV_KEYS[productSlug] ?? "PRX_ENCOUNTER_TYPE_SLUG";
    const fromEnv = readEnv(envKey);
    if (fromEnv) return fromEnv;
    const mapped = DEFAULT_ENCOUNTER_TYPE_SLUGS[productSlug];
    if (mapped) return mapped;
  }

  return readEnv("PRX_ENCOUNTER_TYPE_SLUG") ?? "glp-1-screening";
}

const PRODUCT_TYPE_SLUG_ENV_KEYS: Record<string, string> = {
  "glp-1-weight-loss": "PRX_GLP1_PRODUCT_TYPE_SLUG",
};

const DEFAULT_PRODUCT_TYPE_SLUGS: Record<string, string> = {
  "glp-1-weight-loss": "tirzepatide",
};

/** PRX product_type_slug for unified intake (e.g. tirzepatide). */
export function getPrxProductTypeSlug(productSlug: string): string {
  const envKey = PRODUCT_TYPE_SLUG_ENV_KEYS[productSlug] ?? "PRX_DEFAULT_PRODUCT_TYPE_SLUG";
  return readEnv(envKey) ?? DEFAULT_PRODUCT_TYPE_SLUGS[productSlug] ?? "tirzepatide";
}

/** True on demo sandbox unless PRX_SANDBOX=false. */
export function isPrxSandbox(): boolean {
  const flag = readEnv("PRX_SANDBOX");
  if (flag === "false" || flag === "0") return false;
  const baseUrl = readEnv("PRX_API_BASE_URL") ?? "https://demo.prescribe-rx.com/api/v1";
  return baseUrl.includes("demo.prescribe-rx.com");
}
