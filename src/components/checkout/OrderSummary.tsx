import {
  calculateOrderPricing,
  CHECKOUT_DEMO_ZERO,
  CHECKOUT_SANDBOX,
  formatCurrency,
  getCatalogListPrice,
} from "@/lib/pricing";
import { getRecommendedTreatment } from "@/lib/products";
import { useLiveProduct } from "@/lib/prescribe-rx/use-live-catalog";
import type { QuizFormData } from "@/types/quiz";
import "./checkout.css";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 4 5v5.2c0 3.4 2.4 6.5 6 7.3 3.6-.8 6-3.9 6-7.3V5l-6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 13.5h1.2M16.3 13.5H17.5M4.5 13.5h9.3M4.5 13.5V6.8h6.8l2.5 2.6v4.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.8" cy="13.5" r="1.3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14.5" cy="13.5" r="1.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="5" y="9" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 9V6.8a3 3 0 1 1 6 0V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OrderSummary({ quizData }: { quizData: QuizFormData }) {
  const product = getRecommendedTreatment(quizData.goal, quizData.productSlug);
  const pricing = calculateOrderPricing(product);
  const listPrice = getCatalogListPrice(product);
  const live = useLiveProduct(product.slug);

  return (
    <>
      <div className="checkout-card">
        <h2 className="checkout-card-title" style={{ margin: 0 }}>
          Order summary
        </h2>

        {CHECKOUT_DEMO_ZERO ? (
          <p className="checkout-demo-banner" role="status">
            Demo checkout — <strong>$0 due today</strong>. PDP list price stays{" "}
            {formatCurrency(listPrice)}/mo. Payment is recorded in PrescribeRx sandbox as a $0
            reference capture (no real charge).
          </p>
        ) : CHECKOUT_SANDBOX ? (
          <p className="checkout-demo-banner" role="status">
            Sandbox checkout — priced at the catalog list price{" "}
            <strong>{formatCurrency(listPrice)}/mo</strong>. Payment is recorded in PrescribeRx as a{" "}
            <code>reference_captured</code> external sale (no real charge).
          </p>
        ) : null}

        <div className="checkout-product-card" style={{ marginTop: 16 }}>
          <div className="checkout-product-visual">
            <img src={live?.image ?? product.image} alt="" loading="lazy" />
          </div>
          <div className="checkout-product-copy">
            <span className="checkout-product-brand">{product.brandName}</span>
            <h3 className="checkout-product-name">{live?.name ?? product.name}</h3>
            <span className="checkout-product-tag">{product.tag}</span>
            <span className="checkout-product-dose">{product.dosage}</span>
            {live?.sku ? (
              <span className="checkout-product-sku">Sandbox SKU · {live.sku}</span>
            ) : null}
            {live?.id ? (
              <span className="checkout-product-sku">Catalog ID · {live.id.slice(0, 8)}…</span>
            ) : null}
          </div>
        </div>

        <div className="checkout-summary-lines">
          <div className="checkout-summary-line">
            <span>Monthly treatment (PDP list)</span>
            <strong className={CHECKOUT_DEMO_ZERO ? "checkout-price-list" : undefined}>
              {formatCurrency(listPrice)}
            </strong>
          </div>
          {live?.price != null ? (
            <div className="checkout-summary-line">
              <span>Sandbox catalog price</span>
              <strong>{formatCurrency(live.price)}</strong>
            </div>
          ) : null}
          <div className="checkout-summary-line">
            <span>Charged today · treatment</span>
            <strong>{formatCurrency(pricing.treatmentMonthly)}</strong>
          </div>
          <div className="checkout-summary-line">
            <span>Physician consultation</span>
            <strong>{formatCurrency(pricing.consultationFee)}</strong>
          </div>
          <div className="checkout-summary-line">
            <span>Shipping</span>
            <strong>{pricing.shipping === 0 ? "Free" : formatCurrency(pricing.shipping)}</strong>
          </div>
          <div className="checkout-summary-line">
            <span>Estimated tax</span>
            <strong>{formatCurrency(pricing.tax)}</strong>
          </div>
        </div>

        <div className="checkout-summary-total">
          <span>Due today</span>
          <span>{formatCurrency(pricing.total)}</span>
        </div>

        <p className="checkout-summary-note" style={{ marginTop: 14 }}>
          {CHECKOUT_DEMO_ZERO
            ? "PrescribeRx payment record: mode reference_captured · amount $0 · is_sandbox. Test card OK: 4111 1111 1111 1111, any future expiry, any CVC."
            : CHECKOUT_SANDBOX
              ? `PrescribeRx payment record: mode reference_captured · amount ${formatCurrency(pricing.total)} · is_sandbox. Test card OK: 4111 1111 1111 1111, any future expiry, any CVC.`
              : "A licensed physician reviews every assessment. Treatment is prescribed only when medically appropriate."}
        </p>
      </div>

      <div className="checkout-card">
        <div className="checkout-delivery-row">
          <span className="checkout-delivery-icon">
            <TruckIcon />
          </span>
          <div className="checkout-delivery-copy">
            <strong>Discreet delivery · 2–5 business days</strong>
            <span>Plain outer packaging from a licensed US pharmacy. Cold-chain when required.</span>
          </div>
        </div>
      </div>

      <div className="checkout-trust-row">
        <div className="checkout-trust-item">
          <ShieldIcon />
          <span>Physician reviewed</span>
        </div>
        <div className="checkout-trust-item">
          <TruckIcon />
          <span>Discreet ship</span>
        </div>
        <div className="checkout-trust-item">
          <LockIcon />
          <span>Encrypted</span>
        </div>
      </div>
    </>
  );
}
