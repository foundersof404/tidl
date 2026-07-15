import type { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CATALOG_PRODUCTS,
  getCatalogProduct,
} from "@/lib/product-catalog";
import { getProductBySlug } from "@/lib/products";
import { formatCurrency } from "@/lib/pricing";
import { useLiveCatalog, resolveDisplayMonthlyPrice } from "@/lib/prescribe-rx/use-live-catalog";
import { usePdpData } from "./PdpDataProvider";
import { Reveal } from "./pdp-ui";

type StartProps = { onStart: (e: MouseEvent) => void };

const HOW_STEPS = [
  {
    n: "1",
    title: "Choose this treatment",
    body: "Pick the product you want. You pay for that treatment package — no membership plan.",
  },
  {
    n: "2",
    title: "Provider evaluation",
    body: "Answer a short health intake. A licensed provider reviews what’s right for you.",
  },
  {
    n: "3",
    title: "Personalized protocol",
    body: "If prescribed, your dose and instructions are set for you — not a one-size plan.",
  },
  {
    n: "4",
    title: "Delivered to your door",
    body: "Pharmacy fulfillment ships discreetly. Many patients start the same week.",
  },
] as const;

const SUPPORT_ITEMS = [
  {
    id: "plan",
    title: "A personalized treatment",
    body: "Your provider sets dose and instructions from your intake — one package, clear protocol.",
  },
  {
    id: "msg",
    title: "Messaging with licensed providers",
    body: "Questions about treatment, side effects, or progress — a real care team answers.",
  },
  {
    id: "pen",
    title: "TIDL Pen + how-to",
    body: "Every peptide shipment includes a pen and step-by-step instructions.",
  },
  {
    id: "ship",
    title: "Discreet delivery",
    body: "Plain packaging from a licensed US pharmacy. Cold-chain when needed.",
  },
] as const;

export function PdpFeatureCards({ onStart }: StartProps) {
  const { slug, heroProduct, goal, heroImage } = usePdpData();
  const catalog = getCatalogProduct(slug);
  const name = catalog?.shortName ?? heroProduct.name;
  const isWeightLoss = goal === "weight-loss";
  const cards = [
    {
      title: "Doctor prescribed",
      body: `${name} is prescribed only after provider review.`,
      image: heroImage,
    },
    {
      title: isWeightLoss ? "Targets appetite pathways" : "Built for your goal",
      body: isWeightLoss
        ? "Works on pathways linked to fullness and quieter food noise."
        : heroProduct.summary.slice(0, 120) + (heroProduct.summary.length > 120 ? "…" : ""),
      image: "/pdp/hero-atmosphere.png",
    },
    {
      title: "Clear protocol",
      body: "A straightforward regimen with how-to guidance in every shipment.",
      image: "/pdp/patient-aspire.png",
    },
  ] as const;

  return (
    <section className="hm-section hm-features" id="features" data-pdp-header-theme="light">
      <div className="hm-shell">
        <div className="hm-features-head">
          <Reveal>
            <h2 className="hm-h2">{isWeightLoss ? "GLP-1 power, simply" : `${name}, simply`}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
              Get started
            </button>
          </Reveal>
        </div>
        <div className="hm-feature-grid">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={0.06 * i} className="hm-feature-card">
              <div className="hm-feature-media">
                <img src={card.image} alt="" loading="lazy" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PdpHowItWorks({ onStart }: StartProps) {
  return (
    <section className="hm-section hm-how" id="how" data-pdp-header-theme="light">
      <div className="hm-shell hm-how-grid">
        <Reveal className="hm-how-media">
          <img src="/pdp/patient-aspire.png" alt="Patient checking care on their phone" loading="lazy" />
        </Reveal>
        <div className="hm-how-copy">
          <Reveal>
            <h2 className="hm-h2">How it works</h2>
          </Reveal>
          <ol className="hm-steps">
            {HOW_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={0.05 * i} className="hm-step">
                <span className="hm-step-num" aria-hidden="true">
                  {step.n}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2}>
            <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
              Get started
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function PdpSupportSection({ onStart }: StartProps) {
  const [openId, setOpenId] = useState<string | null>("plan");

  return (
    <section className="hm-section hm-support" id="included" data-pdp-header-theme="light">
      <div className="hm-shell">
        <div className="hm-support-photos">
          <Reveal className="hm-support-photo">
            <img src="/pdp/patient-after.png" alt="" loading="lazy" />
          </Reveal>
          <Reveal delay={0.06} className="hm-support-photo">
            <img src="/pdp/hero-atmosphere.png" alt="" loading="lazy" />
          </Reveal>
          <Reveal delay={0.12} className="hm-support-photo">
            <img src="/peptides/glp-1-weight-loss.png" alt="" loading="lazy" />
          </Reveal>
        </div>

        <Reveal className="hm-support-intro">
          <h2 className="hm-h2 hm-h2-center">Complete care with every order</h2>
          <p className="hm-lede hm-lede-center">Along with medication, if eligible, you get:</p>
        </Reveal>

        <div className="hm-support-list">
          {SUPPORT_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className={`hm-support-item${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="hm-support-trigger"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span>{item.title}</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M4.5 6.75L9 11.25L13.5 6.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {open ? <p className="hm-support-panel">{item.body}</p> : null}
              </div>
            );
          })}
        </div>

        <div className="hm-center-cta">
          <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}

export function PdpTreatmentGrid() {
  const { slug } = usePdpData();
  const { map: liveCatalog } = useLiveCatalog();

  const items = CATALOG_PRODUCTS.slice(0, 4).map((product) => {
    const base = getProductBySlug(product.slug);
    const live = liveCatalog[product.slug];
    const price = resolveDisplayMonthlyPrice(base?.monthlyPrice ?? 0, live?.price);
    const formLabel =
      product.form === "pill" ? "Daily pill" : product.form === "pen" ? "Pen" : "Weekly injection";
    return { product, price, formLabel };
  });

  return (
    <section className="hm-section hm-treatments" id="treatments" data-pdp-header-theme="light">
      <div className="hm-shell">
        <Reveal className="hm-treatments-intro">
          <h2 className="hm-h2 hm-h2-center">Which treatment is right for you?</h2>
          <p className="hm-lede hm-lede-center">
            Options for different goals. A provider reviews your intake to help you find a match.
            You pay for the treatment you choose — no monthly plan.
          </p>
        </Reveal>

        <div className="hm-treat-grid">
          {items.map(({ product, price, formLabel }, i) => {
            const isCurrent = product.slug === slug;
            return (
              <Reveal key={product.slug} delay={0.05 * i} className="hm-treat-card">
                <Link
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className={`hm-treat-link${isCurrent ? " is-current" : ""}`}
                >
                  <div className="hm-treat-media">
                    <img src={product.image} alt="" loading="lazy" />
                  </div>
                  <h3>{product.shortName}</h3>
                  <p className="hm-treat-starts">Starts at</p>
                  <p className="hm-treat-price">{formatCurrency(price)}</p>
                  <p className="hm-treat-billing">one package · no plan</p>
                  <p className="hm-treat-benefit">{product.highlights[0]}</p>
                  <p className="hm-treat-how-label">How to take</p>
                  <p className="hm-treat-how">{formLabel}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PdpSafetyStrip() {
  const { safetyPillars, heroProduct } = usePdpData();

  return (
    <section className="hm-section hm-safety" id="safety" data-pdp-header-theme="light">
      <div className="hm-shell">
        <Reveal>
          <h2 className="hm-h2 hm-h2-center">Important safety information</h2>
          <p className="hm-lede hm-lede-center">{heroProduct.trustNote}</p>
        </Reveal>
        <div className="hm-safety-grid">
          {safetyPillars.slice(0, 4).map((pillar, i) => (
            <Reveal key={pillar.id} delay={0.04 * i} className="hm-safety-item">
              <strong>{pillar.label}</strong>
              <p>{pillar.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
