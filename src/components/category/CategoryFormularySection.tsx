import { useMemo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { formatCurrency } from "@/lib/pricing";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
import {
  getCatalogItemsForCategory,
  getProductSlugsForCategory,
  type CategoryCatalogItem,
} from "@/lib/category-products";
import type { CategoryDefinition, CategorySlug } from "@/lib/categories";
import type { ProductSlug } from "@/types/quiz";
import { useLiveCatalog } from "@/lib/prescribe-rx/use-live-catalog";
import { CATEGORY_GOAL_MAP } from "@/lib/category-recommendations";
import "./category-formulary.css";

type CategoryFormularySectionProps = {
  category: CategoryDefinition;
};

/** Typed PDP route. GLP-1 has a dedicated path; all others use /products/$slug. */
function ProductPdpLink({
  slug,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  slug: ProductSlug;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  if (slug === "glp-1-weight-loss") {
    return (
      <Link to="/products/glp-1-weight-loss" className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/products/$slug" params={{ slug }} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function tileImage(item: CategoryCatalogItem): string {
  if (item.imageUrl) return item.imageUrl;
  if (item.marketedSlug) return resolvePeptideOnlyImage(item.marketedSlug);
  return "";
}

function tilePrice(item: CategoryCatalogItem): number | null {
  const price = item.consumerPrice ?? item.price ?? item.retailPrice ?? null;
  return price != null && price > 0 ? price : null;
}

/**
 * Every Details click should land on a real PDP.
 * Prefer the matched marketed slug; otherwise the best category product.
 */
function resolvePdpSlug(item: CategoryCatalogItem, category: CategorySlug): ProductSlug {
  if (item.marketedSlug) return item.marketedSlug;

  const candidates = getProductSlugsForCategory(category);
  const lower = item.name.toLowerCase();

  for (const slug of candidates) {
    const tokens = slug.split("-").filter((token) => token.length > 2 && token !== "plus");
    if (
      tokens.every((token) => lower.includes(token)) ||
      tokens.some((token) => lower.includes(token))
    ) {
      return slug;
    }
  }

  return candidates[0] ?? "retatrutide";
}

/**
 * Dense e-com formulary with every active sandbox SKU mapped to this category.
 * Details always opens the product PDP page.
 */
export function CategoryFormularySection({ category }: CategoryFormularySectionProps) {
  const { openModal } = useQuizModal();
  const { products: catalogProducts, loading, catalogTotal } = useLiveCatalog();

  const products = useMemo(
    () => getCatalogItemsForCategory(catalogProducts, category.slug),
    [catalogProducts, category.slug],
  );
  const goal = CATEGORY_GOAL_MAP[category.slug];

  const openIntake = (productSlug: ProductSlug | null) => {
    if (productSlug) {
      openModal({ product: productSlug, goal });
      return;
    }
    openModal({ goal });
  };

  return (
    <section
      className="cform cform--calm cform--grid"
      id="category-formulary"
      data-site-header-theme="light"
      aria-label={`${category.title} treatments`}
    >
      <div className="cform-inner">
        <header className="cform-head">
          <p className="cform-kicker">
            <span className="cform-kicker-dot" aria-hidden="true" />
            Formulary
          </p>
          <h2 className="cform-title">
            {products.length > 0
              ? `${category.navLabel} catalog`
              : `${category.navLabel} care pathway`}
            <span>
              {loading
                ? "Loading live sandbox catalog…"
                : products.length > 0
                  ? `${products.length} peptide package${products.length === 1 ? "" : "s"} from the sandbox catalog${catalogTotal > 0 ? ` (${catalogTotal} total SKUs)` : ""}. Tap Details for the full product page.`
                  : "Start intake. A licensed provider will match your pathway."}
            </span>
          </h2>
        </header>

        {products.length > 0 ? (
          <div className="cform-grid" role="list">
            {products.map((item) => {
              const price = tilePrice(item);
              const image = tileImage(item);
              const pdpSlug = resolvePdpSlug(item, category.slug);

              return (
                <article key={item.id} className="cform-tile" role="listitem">
                  <ProductPdpLink
                    slug={pdpSlug}
                    className="cform-tile-hit"
                    aria-label={`View ${item.name} product page`}
                  >
                    <TileMedia image={image} />
                    <TileCopy item={item} price={price} />
                  </ProductPdpLink>

                  <div className="cform-tile-actions">
                    <ProductPdpLink
                      slug={pdpSlug}
                      className="cform-btn cform-btn--primary cform-btn--compact"
                    >
                      Details
                      <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
                    </ProductPdpLink>
                    <button
                      type="button"
                      className="cform-btn cform-btn--ghost cform-btn--compact"
                      onClick={() => openIntake(item.marketedSlug ?? pdpSlug)}
                    >
                      Intake
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="cform-empty">
            <h3>
              {loading
                ? "Loading catalog…"
                : category.slug === "testosterone"
                  ? "Start with a provider-guided TRT pathway"
                  : `${category.title} protocols coming online`}
            </h3>
            <p>
              {loading
                ? "Pulling live sandbox packages…"
                : category.slug === "testosterone"
                  ? "Licensed review of labs and symptoms before any prescription. Begin intake now."
                  : `Start the assessment. We’ll match you to the right ${category.navLabel.toLowerCase()} protocol.`}
            </p>
            {!loading ? (
              <button
                type="button"
                className="cform-btn cform-btn--primary"
                onClick={() => openModal({ goal })}
              >
                {category.ctaLabel}
                <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function TileMedia({ image }: { image: string }) {
  return (
    <div className="cform-tile-media" aria-hidden="true">
      {image ? (
        <img src={image} alt="" className="cform-tile-img" loading="lazy" decoding="async" />
      ) : (
        <span className="cform-tile-placeholder" />
      )}
    </div>
  );
}

function TileCopy({
  item,
  price,
}: {
  item: CategoryCatalogItem;
  price: number | null;
}) {
  return (
    <div className="cform-tile-copy">
      <p className="cform-tile-meta">
        <span>{item.formHint}</span>
        {item.strength ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.strength}</span>
          </>
        ) : null}
      </p>
      <h3 className="cform-tile-name">{item.name}</h3>
      {price != null ? (
        <p className="cform-tile-price">{formatCurrency(price)}</p>
      ) : (
        <p className="cform-tile-price cform-tile-price--muted">After review</p>
      )}
      {item.sku ? <p className="cform-tile-sku">{item.sku}</p> : null}
    </div>
  );
}
