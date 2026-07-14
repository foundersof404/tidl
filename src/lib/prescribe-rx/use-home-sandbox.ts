import { useEffect, useState } from "react";
import { fetchPrxEncounterTypes } from "@/lib/prescribe-rx/browse-api";
import type { PrxEncounterTypeSummary } from "@/lib/prescribe-rx/encounter-schema";
import {
  resolveDisplayMonthlyPrice,
  useLiveCatalog,
  type LiveProduct,
} from "@/lib/prescribe-rx/use-live-catalog";
import { getPeptideDef } from "@/lib/peptides";
import { getProductBySlug } from "@/lib/products";
import type { CategorySlug } from "@/lib/categories";
import { PRODUCT_SLUGS, type ProductSlug } from "@/types/quiz";

/** All marketed products available from the sandbox catalog (11 — not the full catalog). */
export const HOME_FEATURED_SLUGS: readonly ProductSlug[] = PRODUCT_SLUGS;

/**
 * Care pathways we surface from the sandbox tenant, keyed by category page.
 */
export const CATEGORY_ENCOUNTER_SLUGS: Record<CategorySlug, readonly string[]> = {
  "weight-loss": ["glp-1-screening", "glp-1-re-assessment"],
  "metabolic-health": ["peptide-assessment", "peptide-reassessment"],
  testosterone: [
    "male-trt-consult",
    "male-trt-reassessment",
    "mens-sexual-health-ed-assessment",
    "female-hrt",
    "female-hrt-reassessment",
  ],
  longevity: ["peptide-assessment", "peptide-reassessment"],
  performance: ["peptide-assessment", "peptide-reassessment"],
  recovery: ["peptide-assessment", "peptide-reassessment"],
};

const ALL_ENCOUNTER_SLUGS = new Set(
  Object.values(CATEGORY_ENCOUNTER_SLUGS).flatMap((slugs) => [...slugs]),
);

let encounterCache: PrxEncounterTypeSummary[] | null = null;
let encounterInflight: Promise<PrxEncounterTypeSummary[]> | null = null;

async function loadHomeEncounters(): Promise<PrxEncounterTypeSummary[]> {
  if (encounterCache) return encounterCache;
  if (!encounterInflight) {
    encounterInflight = fetchPrxEncounterTypes()
      .then((list) => {
        const rows = Array.isArray(list?.data) ? list.data : [];
        encounterCache = rows.filter((e) => ALL_ENCOUNTER_SLUGS.has(e.slug));
        return encounterCache;
      })
      .catch(() => {
        encounterCache = [];
        return encounterCache;
      });
  }
  return encounterInflight;
}

export type HomeFeaturedPeptide = {
  slug: ProductSlug;
  live: LiveProduct;
  hook: string;
  outcomes: readonly string[];
  goalLabel: string;
  /** Curated marketing price ($199–$349); sandbox $10 placeholders stay in facts only. */
  displayPrice: number;
};

export type HomeSandboxData = {
  loading: boolean;
  featured: HomeFeaturedPeptide[];
  encounters: PrxEncounterTypeSummary[];
  catalogCount: number;
  packageCount: number;
};

function goalLabel(goal: string): string {
  switch (goal) {
    case "weight-loss":
      return "Weight loss";
    case "recovery":
      return "Recovery";
    case "performance":
      return "Performance";
    case "longevity":
      return "Longevity";
    case "metabolic-health":
      return "Metabolic health";
    case "hormonal-health":
      return "Hormonal health";
    default:
      return "Peptide care";
  }
}

/**
 * Sandbox fetch shared by homepage hero pricing and category formulary pages:
 * pull live catalog + encounter types, then map the marketed set.
 */
export function useHomeSandbox(): HomeSandboxData {
  const { map, loading: catalogLoading, catalogTotal, packages } = useLiveCatalog();
  const [encounters, setEncounters] = useState<PrxEncounterTypeSummary[]>([]);
  const [encLoading, setEncLoading] = useState(true);

  useEffect(() => {
    if (encounterCache) {
      setEncounters(encounterCache);
      setEncLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setEncLoading(true);
        const rows = await loadHomeEncounters();
        if (cancelled) return;
        setEncounters(rows);
      } finally {
        if (!cancelled) setEncLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured: HomeFeaturedPeptide[] = HOME_FEATURED_SLUGS.flatMap((slug) => {
    const live = map[slug];
    if (!live) return [];
    const def = getPeptideDef(slug);
    const hook =
      def?.hook ??
      (slug === "glp-1-weight-loss"
        ? "Doctor-prescribed GLP-1, dispensed from the sandbox catalog."
        : live.shortDescription ?? live.name);
    const outcomes =
      def?.outcomes ??
      ([
        live.handBox.formLabel,
        live.handBox.strength,
        live.handBox.productClass,
      ] as const);
    const product = getProductBySlug(slug);
    const marketingPrice = product?.monthlyPrice ?? 0;
    return [
      {
        slug,
        live,
        hook,
        outcomes: [...outcomes].slice(0, 3),
        goalLabel: goalLabel(def?.goal ?? product?.goal ?? "longevity"),
        displayPrice: resolveDisplayMonthlyPrice(marketingPrice, live.price),
      },
    ];
  });

  return {
    loading: catalogLoading || encLoading,
    featured,
    encounters,
    catalogCount: catalogTotal,
    packageCount: packages.length,
  };
}

/** Featured peptides that belong on a specific category page. */
export function filterFeaturedForCategory(
  featured: HomeFeaturedPeptide[],
  productSlugs: readonly ProductSlug[],
): HomeFeaturedPeptide[] {
  const allow = new Set(productSlugs);
  return featured.filter((item) => allow.has(item.slug));
}

/** Encounter pathways relevant to a specific category page. */
export function filterEncountersForCategory(
  encounters: PrxEncounterTypeSummary[],
  categorySlug: CategorySlug,
): PrxEncounterTypeSummary[] {
  const allow = new Set(CATEGORY_ENCOUNTER_SLUGS[categorySlug] ?? []);
  return encounters.filter((enc) => allow.has(enc.slug));
}
