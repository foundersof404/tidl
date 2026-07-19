import { PEPTIDE_DEFS, CATALOG_KEYWORDS } from "@/lib/peptides";
import type { CategorySlug } from "@/lib/categories";
import type { PrxCatalogProduct } from "@/lib/prescribe-rx/browse-api";
import { PRODUCT_SLUGS, type ProductSlug } from "@/types/quiz";

/**
 * Canonical marketed category → product mapping derived from peptide defs (+ GLP-1).
 * Kept for PDP links and hero “featured” paths; the formulary now lists the full sandbox catalog.
 */
export function getProductSlugsForCategory(category: CategorySlug): ProductSlug[] {
  return PEPTIDE_DEFS.filter((p) => p.category === category).map(
    (p) => p.slug as ProductSlug,
  );
}

/** Goal label used when a category maps to a quiz goal. */
export function getCategoryGoalLabel(category: CategorySlug): string {
  switch (category) {
    case "weight-loss":
      return "Weight loss";
    case "metabolic-health":
      return "Metabolic health";
    case "testosterone":
      return "Hormonal health";
    case "longevity":
      return "Longevity";
    case "performance":
      return "Performance";
    case "recovery":
      return "Recovery";
    default:
      return "Peptide care";
  }
}

/**
 * Marketed product slugs that are not assigned to any site category.
 * Today every PRODUCT_SLUG is mapped; keep this for future catalog additions.
 */
export function getUnmappedProductSlugs(): ProductSlug[] {
  const mapped = new Set(
    (
      [
        "weight-loss",
        "metabolic-health",
        "testosterone",
        "longevity",
        "performance",
        "recovery",
      ] as const
    ).flatMap((slug) => getProductSlugsForCategory(slug)),
  );
  return PRODUCT_SLUGS.filter((slug) => !mapped.has(slug));
}

/**
 * Sandbox → site category mapping (first matching rule wins).
 *
 * Rules (keyword / name heuristics — PrescribeRx catalog has no site category field):
 * 1. weight-loss — GLP/GIP agonists & fat-loss peptides (tirzepatide, semaglutide, reta, GLP-3R, cagril*, AOD)
 * 2. testosterone — TRT / hormonal / sexual (testosterone, Male TRT, HCG, PT-141, kisspeptin, oxytocin)
 * 3. recovery — tissue-repair blends (BPC, TB-500, Wolverine, GLOW, KLOW, KPV, DSIP)
 * 4. performance — GH secretagogues / IGF (CJC, Ipamorelin, Tesamorelin, GHRP, ILGF)
 * 5. metabolic-health — metabolic / mito (MOTS-C, 5-Amino-1MQ, SS-31, glutathione, B12)
 * 6. longevity — NAD, GHK-Cu solo, Sermorelin, Epithalon, nootropics, melanotan, + default fallback
 */
const CATEGORY_NAME_RULES: readonly {
  category: CategorySlug;
  patterns: readonly RegExp[];
}[] = [
  {
    category: "weight-loss",
    patterns: [
      /\btirzepatide\b/i,
      /\bsemaglutide\b/i,
      /\bretatrutide\b/i,
      /\breta\b/i,
      /\bglp-?3/i,
      /\bcagril/i,
      /\baod\s*9604\b/i,
    ],
  },
  {
    category: "testosterone",
    patterns: [
      /\btestosterone\b/i,
      /\bmale\s+trt\b/i,
      /\bl5\s+smoke\b/i,
      /\bhcg\b/i,
      /\bpt-?141\b/i,
      /\bkisspeptin\b/i,
      /\boxytocin\b/i,
      /\bthyroid\b/i,
      /\bred\s+drop\b/i,
    ],
  },
  {
    category: "recovery",
    patterns: [
      /\bwolverine\b/i,
      /\bbpc-?157\b/i,
      /\btb-?500\b/i,
      /\bg\s*low\b/i,
      /\bglow\b/i,
      /\bklow\b/i,
      /\bkpv\b/i,
      /\bdsip\b/i,
    ],
  },
  {
    category: "performance",
    patterns: [
      /\bcjc\b/i,
      /\bipamorelin\b/i,
      /\btesamorelin\b/i,
      /\bghrp-?[26]\b/i,
      /\bilgf\b/i,
      /\bigf-?lr3\b/i,
    ],
  },
  {
    category: "metabolic-health",
    patterns: [
      /\bmots-?c\b/i,
      /\b5\s*amino\b/i,
      /\b1mq\b/i,
      /\bss-?31\b/i,
      /\bglutathione\b/i,
      /\bmethylcobalamin\b/i,
      /\bb12\b/i,
    ],
  },
  {
    category: "longevity",
    patterns: [
      /\bnad\+?\b/i,
      /\bghk-?cu\b/i,
      /\bghk\b/i,
      /\bsermorelin\b/i,
      /\bepithalon\b/i,
      /\bpinealon\b/i,
      /\bselank\b/i,
      /\bsemax\b/i,
      /\bta-?1\b/i,
      /\bmelanotan\b/i,
      /\bnuvera\b/i,
    ],
  },
];

const DEFAULT_SANDBOX_CATEGORY: CategorySlug = "longevity";

/** Map a sandbox catalog product name onto one of the 6 site categories. */
export function mapSandboxProductToCategory(name: string): CategorySlug {
  for (const rule of CATEGORY_NAME_RULES) {
    if (rule.patterns.some((re) => re.test(name))) return rule.category;
  }
  return DEFAULT_SANDBOX_CATEGORY;
}

/**
 * Best marketed ProductSlug for a sandbox catalog name, if any.
 * Uses CATALOG_KEYWORDS (longest keyword first) so specific SKUs win over broad tokens.
 */
export function matchMarketedSlugFromCatalogName(name: string): ProductSlug | null {
  const lower = name.toLowerCase();
  let best: { slug: ProductSlug; len: number } | null = null;

  for (const [slug, keywords] of Object.entries(CATALOG_KEYWORDS)) {
    for (const keyword of keywords) {
      const kw = keyword.toLowerCase();
      if (!lower.includes(kw)) continue;
      if (!best || kw.length > best.len) {
        best = { slug: slug as ProductSlug, len: kw.length };
      }
    }
  }

  return best?.slug ?? null;
}

export function inferFormHint(name: string): string {
  if (/\blyophil/i.test(name)) return "Lyophilized vial";
  if (/\bkit\b/i.test(name)) return "Kit";
  if (/\bmg\b|\bmcg\b|\bml\b|\biu\b/i.test(name)) return "Vial / strength";
  return "Peptide";
}

/** True when a sandbox SKU is a pen device (not a peptide vial / kit). */
export function isPenCatalogProduct(name: string): boolean {
  return /\bpen\b/i.test(name);
}

/** Pull a compact strength token from the catalog name when present. */
export function inferStrengthLabel(name: string): string | null {
  const match = name.match(
    /(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|iu)(?:\s*\/\s*\d+(?:\.\d+)?\s*(?:mg|mcg|ml|iu))?)/i,
  );
  return match?.[1]?.replace(/\s+/g, " ").trim() ?? null;
}

export type CategoryCatalogItem = {
  /** PrescribeRx product id */
  id: string;
  name: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  /** Resolved sell price (consumer → retail → base). */
  price: number | null;
  consumerPrice: number | null;
  retailPrice: number | null;
  wholesalePrice: number | null;
  priceType: string | null;
  rxRequired: boolean;
  isActive: boolean;
  imageUrl: string | null;
  productClassId: string | null;
  productTypeId: string | null;
  formHint: string;
  strength: string | null;
  category: CategorySlug;
  /** When this SKU matches a marketed TIDL product, link to its PDP. */
  marketedSlug: ProductSlug | null;
};

export function toCategoryCatalogItem(product: PrxCatalogProduct): CategoryCatalogItem {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    consumerPrice: product.consumerPrice,
    retailPrice: product.retailPrice,
    wholesalePrice: product.wholesalePrice,
    priceType: product.priceType,
    rxRequired: product.rxRequired,
    isActive: product.isActive,
    imageUrl: product.imageUrl,
    productClassId: product.productClassId,
    productTypeId: product.productTypeId,
    formHint: inferFormHint(product.name),
    strength: inferStrengthLabel(product.name),
    category: mapSandboxProductToCategory(product.name),
    marketedSlug: matchMarketedSlugFromCatalogName(product.name),
  };
}

/** All active sandbox peptide products for a site category (pens excluded), sorted by name. */
export function getCatalogItemsForCategory(
  products: readonly PrxCatalogProduct[],
  category: CategorySlug,
): CategoryCatalogItem[] {
  return products
    .filter((p) => p.isActive && !isPenCatalogProduct(p.name))
    .map(toCategoryCatalogItem)
    .filter((item) => item.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Counts per site category (active peptide products only — pens excluded). */
export function countCatalogByCategory(
  products: readonly PrxCatalogProduct[],
): Record<CategorySlug, number> {
  const counts: Record<CategorySlug, number> = {
    "weight-loss": 0,
    "metabolic-health": 0,
    testosterone: 0,
    longevity: 0,
    performance: 0,
    recovery: 0,
  };
  for (const product of products) {
    if (!product.isActive || isPenCatalogProduct(product.name)) continue;
    counts[mapSandboxProductToCategory(product.name)] += 1;
  }
  return counts;
}
