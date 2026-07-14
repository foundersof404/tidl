import type { PrxEncounterTypeSchema, PrxSchemaField } from "@/lib/prescribe-rx/encounter-schema";

type Address = { street?: string; city?: string; state?: string; zip?: string };
type Height = { feet?: number | null; inches?: number | null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Sentinel the quiz uses for "patient reported none" — never a real entry. */
const NONE_TOKEN = "__none__";

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v)).filter((v) => v && v !== NONE_TOKEN);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((v) => v && v !== NONE_TOKEN);
  }
  return [];
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Turn the dynamic quiz's slug-keyed answers into a PRX unified-intake payload.
 *
 * Each schema field's `maps_to` decides where its value lands: identity/contact
 * → `patient`, height/weight → `vitals`, allergy/medication/condition search →
 * `medical_history`, and everything else (tier-3 clinical questions) → `answers`,
 * keyed by slug — matching POST /telehealth/intake/unified.
 */
export function buildIntakeFromSchema(
  schema: PrxEncounterTypeSchema,
  answers: Record<string, unknown>,
  options: { sandbox: boolean; consent?: boolean },
) {
  const fieldBySlug = new Map<string, PrxSchemaField>();
  for (const step of schema.steps) {
    for (const field of step.fields) fieldBySlug.set(field.slug, field);
  }

  const patient: Record<string, unknown> = {};
  const vitals: Record<string, unknown> = {};
  const medicalHistory: Record<string, unknown> = {};
  const tier3: Record<string, unknown> = {};

  for (const [slug, value] of Object.entries(answers)) {
    if (isEmpty(value)) continue;
    const mapsTo = fieldBySlug.get(slug)?.maps_to;

    switch (mapsTo) {
      case "first_name":
        patient.first_name = value;
        break;
      case "last_name":
        patient.last_name = value;
        break;
      case "email":
        patient.email = value;
        break;
      case "mobile_phone":
      case "phone":
        patient.phone = value;
        break;
      case "date_of_birth":
        patient.date_of_birth = value;
        break;
      case "gender":
        patient.gender = value;
        break;
      case "addresses.primary": {
        if (isRecord(value)) {
          const addr = value as Address;
          patient.shipping_address = {
            street: addr.street,
            city: addr.city,
            state: (addr.state ?? "").slice(0, 2).toUpperCase(),
            zip: addr.zip,
            country: "US",
          };
        }
        break;
      }
      case "height_inches": {
        if (isRecord(value)) {
          const h = value as Height;
          const inches = (h.feet ?? 0) * 12 + (h.inches ?? 0);
          if (inches > 0) vitals.height_inches = inches;
        }
        break;
      }
      case "weight_lbs":
        if (typeof value === "number") vitals.weight_lbs = value;
        break;
      case "bmi":
        break;
      case "allergies": {
        const arr = toStringArray(value);
        if (arr.length > 0) medicalHistory.allergies = arr;
        break;
      }
      case "medications": {
        const arr = toStringArray(value);
        if (arr.length > 0) medicalHistory.medications = arr;
        break;
      }
      case "conditions": {
        const arr = toStringArray(value);
        if (arr.length > 0) medicalHistory.conditions = arr;
        break;
      }
      default:
        // Tier-3 encounter-specific question — send raw, keyed by slug.
        tier3[slug] = value;
    }
  }

  if (patient.shipping_address) patient.billing_same_as_shipping = true;

  // Completing the assessment records telehealth consent (unless caller opts out).
  const consents =
    options.consent === false
      ? undefined
      : [
          {
            consent_type: 6,
            consent_text:
              "I consent to telehealth services and understand a licensed physician will review my assessment.",
            signed_at: new Date().toISOString(),
          },
        ];

  return {
    ...(options.sandbox ? { is_sandbox: true } : {}),
    encounter_type_slug: schema.encounter_type.slug,
    patient,
    ...(Object.keys(vitals).length > 0 ? { vitals } : {}),
    ...(Object.keys(medicalHistory).length > 0 ? { medical_history: medicalHistory } : {}),
    ...(Object.keys(tier3).length > 0 ? { answers: tier3 } : {}),
    ...(consents ? { consents } : {}),
  };
}
