import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, X } from "lucide-react";
import { lockPageScroll, unlockPageScroll } from "@/lib/age-gate";
import { formatCurrency } from "@/lib/pricing";
import type { CategoryCatalogItem } from "@/lib/category-products";
import type { ProductSlug } from "@/types/quiz";

type CategorySandboxDetailDrawerProps = {
  item: CategoryCatalogItem | null;
  onClose: () => void;
  onStartIntake: (marketedSlug: ProductSlug | null) => void;
};

function Fact({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="cform-drawer-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ProductPdpLink({
  slug,
  className,
  children,
}: {
  slug: ProductSlug;
  className?: string;
  children: ReactNode;
}) {
  if (slug === "glp-1-weight-loss") {
    return (
      <Link to="/products/glp-1-weight-loss" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/products/$slug" params={{ slug }} className={className}>
      {children}
    </Link>
  );
}

/** Centered product-details modal. Marketed products can continue to their full PDP. */
export function CategorySandboxDetailDrawer({
  item,
  onClose,
  onStartIntake,
}: CategorySandboxDetailDrawerProps) {
  useEffect(() => {
    if (!item) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const sell =
    item.consumerPrice ?? item.price ?? item.retailPrice ?? null;
  const body =
    item.description?.trim() ||
    item.shortDescription?.trim() ||
    "Sandbox catalog listing. A licensed provider reviews appropriateness before any prescription.";

  return (
    <div className="cform-drawer-root" role="presentation">
      <button
        type="button"
        className="cform-drawer-backdrop"
        aria-label="Close product details"
        onClick={onClose}
      />
      <aside
        className="cform-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cform-drawer-title"
      >
        <header className="cform-drawer-head">
          <div>
            <p className="cform-drawer-kicker">
              {item.formHint}
              {item.strength ? ` · ${item.strength}` : ""}
            </p>
            <h2 id="cform-drawer-title" className="cform-drawer-title">
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            className="cform-drawer-close"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        {item.imageUrl ? (
          <div className="cform-drawer-media">
            <img src={item.imageUrl} alt="" loading="lazy" />
          </div>
        ) : null}

        <p className="cform-drawer-body">{body}</p>

        {sell != null && sell > 0 ? (
          <p className="cform-drawer-price">
            <em>Package</em>
            <b>{formatCurrency(sell)}</b>
          </p>
        ) : (
          <p className="cform-drawer-price">
            <em>Pricing</em>
            <b>After review</b>
          </p>
        )}

        <dl className="cform-drawer-facts">
          <Fact label="SKU" value={item.sku} />
          <Fact label="Form" value={item.formHint} />
          <Fact label="Strength" value={item.strength} />
          <Fact
            label="Consumer price"
            value={
              item.consumerPrice != null && item.consumerPrice > 0
                ? formatCurrency(item.consumerPrice)
                : null
            }
          />
          <Fact
            label="Retail price"
            value={
              item.retailPrice != null && item.retailPrice > 0
                ? formatCurrency(item.retailPrice)
                : null
            }
          />
          <Fact
            label="Wholesale"
            value={
              item.wholesalePrice != null && item.wholesalePrice > 0
                ? formatCurrency(item.wholesalePrice)
                : null
            }
          />
          <Fact label="Price type" value={item.priceType} />
          <Fact
            label="Rx required"
            value={item.rxRequired ? "Yes" : "No (catalog flag)"}
          />
          <Fact label="Product class ID" value={item.productClassId} />
          <Fact label="Product type ID" value={item.productTypeId} />
          <Fact label="Catalog ID" value={item.id} />
        </dl>

        {item.marketedSlug ? (
          <ProductPdpLink
            slug={item.marketedSlug}
            className="cform-more-link"
          >
            <span className="cform-more-dot" aria-hidden="true" />
            <span>More information</span>
            <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </ProductPdpLink>
        ) : null}

        <div className="cform-drawer-actions">
          <button
            type="button"
            className="cform-btn cform-btn--primary"
            onClick={() => onStartIntake(item.marketedSlug)}
          >
            Start intake
            <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </aside>
    </div>
  );
}
