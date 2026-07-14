import { useEffect, useState } from "react";
import {
  fetchPrxCatalogSnapshot,
  type PrxCatalogPackage,
  type PrxCatalogProduct,
} from "./browse-api";
import { CATALOG_KEYWORDS } from "@/lib/peptides";
import { getPeptideHandBox, getPeptideImageMap, resolvePeptideOnlyImage } from "@/lib/peptide-images";

export type LiveProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  formHint: string;
};

export type LiveProduct = {
  /** PrescribeRx product id */
  id: string | null;
  sku: string | null;
  name: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  retailPrice: number | null;
  wholesalePrice: number | null;
  consumerPrice: number | null;
  priceType: string | null;
  rxRequired: boolean | null;
  isActive: boolean | null;
  productClassId: string | null;
  productTypeId: string | null;
  /** Transparent local peptide PNG derived from the sandbox catalog image. */
  image: string;
  /** Original pharmacy catalog photo from PrescribeRx (preferred when present). */
  catalogImageUrl: string | null;
  beforeImage: string;
  afterImage: string;
  /** Parsed label facts from the sandbox product name. */
  handBox: ReturnType<typeof getPeptideHandBox>;
  fromSandbox: boolean;
  /** Sibling SKUs in the sandbox catalog that match this marketing product. */
  variants: LiveProductVariant[];
};

export type LiveCatalogMap = Record<string, LiveProduct>;

type LiveCatalogState = {
  map: LiveCatalogMap;
  catalogTotal: number;
  packages: PrxCatalogPackage[];
};

let cache: LiveCatalogState | null = null;
let inflight: Promise<LiveCatalogState> | null = null;

/** Sandbox demo prices are often ~$10 placeholders — keep marketing list price as primary. */
export function isSandboxPlaceholderPrice(price: number | null | undefined): boolean {
  return price != null && price > 0 && price <= 25;
}

export function resolveDisplayMonthlyPrice(
  marketingPrice: number,
  sandboxPrice: number | null | undefined,
): number {
  if (sandboxPrice == null || isSandboxPlaceholderPrice(sandboxPrice)) {
    return marketingPrice;
  }
  return sandboxPrice;
}

function matchProduct(
  products: PrxCatalogProduct[],
  keywords: readonly string[],
): PrxCatalogProduct | undefined {
  const active = products.filter((p) => p.isActive);
  const withImg = active.filter((p) => p.imageUrl);
  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    const hit = withImg.find((p) => p.name.toLowerCase().includes(kw));
    if (hit) return hit;
  }
  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    const hit = active.find((p) => p.name.toLowerCase().includes(kw));
    if (hit) return hit;
  }
  return undefined;
}

function matchVariants(
  products: PrxCatalogProduct[],
  keywords: readonly string[],
  primaryId: string | null,
): LiveProductVariant[] {
  const seen = new Set<string>();
  const rows: LiveProductVariant[] = [];
  const active = products.filter((p) => p.isActive);

  for (const product of active) {
    const name = product.name.toLowerCase();
    const hit = keywords.some((keyword) => name.includes(keyword.toLowerCase()));
    if (!hit || seen.has(product.id)) continue;
    seen.add(product.id);
    const formHint = /\bpen\b/i.test(product.name)
      ? "Pen"
      : /\blyophil/i.test(product.name)
        ? "Lyophilized vial"
        : /\bmg\b|\bmcg\b|\bml\b/i.test(product.name)
          ? "Vial / strength"
          : "Catalog SKU";
    rows.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      formHint,
    });
  }

  // Keep primary match first when present.
  if (primaryId) {
    rows.sort((a, b) => Number(b.id === primaryId) - Number(a.id === primaryId));
  }
  return rows.slice(0, 12);
}

function toLive(
  slug: string,
  products: PrxCatalogProduct[],
  keywords: readonly string[],
): LiveProduct {
  const match = matchProduct(products, keywords);
  const local = getPeptideImageMap()[slug];
  const catalogImageUrl = match?.imageUrl ?? null;
  const image = catalogImageUrl ?? local?.image ?? resolvePeptideOnlyImage(slug);
  const baseBox = getPeptideHandBox(slug);
  const handBox = {
    ...baseBox,
    catalogName: match?.name ?? baseBox.catalogName,
  };

  return {
    id: match?.id ?? local?.catalogId ?? null,
    sku: match?.sku ?? null,
    name: match?.name ?? local?.catalogName ?? slug,
    shortDescription: match?.shortDescription ?? match?.name ?? local?.catalogName ?? null,
    description: match?.description ?? match?.shortDescription ?? null,
    price: match?.price ?? null,
    retailPrice: match?.retailPrice ?? null,
    wholesalePrice: match?.wholesalePrice ?? null,
    consumerPrice: match?.consumerPrice ?? null,
    priceType: match?.priceType ?? null,
    rxRequired: match?.rxRequired ?? null,
    isActive: match?.isActive ?? null,
    productClassId: match?.productClassId ?? null,
    productTypeId: match?.productTypeId ?? null,
    image,
    catalogImageUrl,
    beforeImage: `/peptides/ba/${slug}-before.png`,
    afterImage: `/peptides/ba/${slug}-after.png`,
    handBox,
    fromSandbox: Boolean(match),
    variants: matchVariants(products, keywords, match?.id ?? null),
  };
}

function buildState(
  products: PrxCatalogProduct[],
  packages: PrxCatalogPackage[],
): LiveCatalogState {
  const map: LiveCatalogMap = {};
  for (const [slug, keywords] of Object.entries(CATALOG_KEYWORDS)) {
    map[slug] = toLive(slug, products, keywords);
  }
  return {
    map,
    catalogTotal: products.length,
    packages,
  };
}

async function loadLiveCatalog(): Promise<LiveCatalogState> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetchPrxCatalogSnapshot()
      .then((snap) => {
        cache = buildState(snap.products, snap.packages);
        return cache;
      })
      .catch(() => {
        const map: LiveCatalogMap = {};
        for (const slug of Object.keys(getPeptideImageMap())) {
          map[slug] = toLive(slug, [], CATALOG_KEYWORDS[slug] ?? [slug]);
        }
        cache = { map, catalogTotal: 0, packages: [] };
        return cache;
      });
  }
  return inflight;
}

/** Full sandbox catalog snapshot for featured TIDL products. */
export function useLiveCatalog(): {
  map: LiveCatalogMap;
  loading: boolean;
  catalogTotal: number;
  packages: PrxCatalogPackage[];
} {
  const [state, setState] = useState<LiveCatalogState>(
    cache ?? { map: {}, catalogTotal: 0, packages: [] },
  );
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setState(cache);
      setLoading(false);
      return;
    }
    let active = true;
    loadLiveCatalog().then((result) => {
      if (!active) return;
      setState(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    map: state.map,
    loading,
    catalogTotal: state.catalogTotal,
    packages: state.packages,
  };
}

export function useLiveProduct(slug: string): LiveProduct | undefined {
  const { map } = useLiveCatalog();
  return map[slug];
}
