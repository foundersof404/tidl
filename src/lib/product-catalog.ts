import { getProductBySlug } from "@/lib/products";
import { PEPTIDE_DEFS, peptideToCatalogProduct } from "@/lib/peptides";
import { PRODUCT_SLUGS, type ProductSlug } from "@/types/quiz";
import type { CategorySlug } from "@/lib/categories";

export type ProductForm = "pen" | "pill" | "vial";

export type CatalogProduct = {
  slug: ProductSlug;
  categorySlug: CategorySlug;
  form: ProductForm;
  shortName: string;
  headline: string;
  summary: string;
  image: string;
  highlights: readonly string[];
};

const GLP1_CATALOG_PRODUCT: CatalogProduct = {
  slug: "glp-1-weight-loss",
  categorySlug: "weight-loss",
  form: "vial",
  shortName: "GLP-1 Weight Loss",
  headline: "Lose weight. Keep it off. Doctor-guided.",
  summary:
    "Doctor-prescribed tirzepatide (GLP-1/GIP) for steady, measurable weight loss — quieter food noise, lasting appetite control, and a clear weekly protocol. Includes a TIDL Pen with how-to. Licensed provider review. Discreet US pharmacy delivery.",
  image: "/peptides/glp-1-weight-loss.png",
  highlights: [
    "Licensed provider review",
    "TIDL Pen + how-to",
    "Personalized protocol",
    "Discreet shipping",
  ],
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  GLP1_CATALOG_PRODUCT,
  ...PEPTIDE_DEFS.map(peptideToCatalogProduct),
];

export function getCatalogProduct(slug: ProductSlug): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getCatalogProductsByCategory(categorySlug: CategorySlug): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter(
    (p) => p.categorySlug === categorySlug && p.form !== "pen",
  );
}

export function getCatalogPrice(slug: ProductSlug): number {
  return getProductBySlug(slug)?.monthlyPrice ?? 0;
}

export const PRODUCT_PATHS = Object.fromEntries(
  PRODUCT_SLUGS.map((slug) => [slug, `/products/${slug}`]),
) as Record<ProductSlug, `/products/${ProductSlug}`>;

export const CATEGORY_PATHS: Record<CategorySlug, `/category/${CategorySlug}`> = {
  "weight-loss": "/category/weight-loss",
  "metabolic-health": "/category/metabolic-health",
  testosterone: "/category/testosterone",
  longevity: "/category/longevity",
  performance: "/category/performance",
  recovery: "/category/recovery",
};
