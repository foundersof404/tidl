import type { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  CATALOG_PRODUCTS,
  PRODUCT_PATHS,
  getCatalogProduct,
} from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import type { ProductSlug } from "@/types/quiz";
import { usePdpData } from "./PdpDataProvider";

const PRODUCT_ORDER = CATALOG_PRODUCTS.map((product) => product.slug);

const WEIGHT_LOSS_LEFT = [
  "Quieter food noise",
  "Steady appetite control",
] as const;

const WEIGHT_LOSS_RIGHT = [
  "Doctor-prescribed",
  "Pen + how-to included",
] as const;

function productNeighbors(slug: ProductSlug) {
  const index = PRODUCT_ORDER.indexOf(slug);
  const total = PRODUCT_ORDER.length;
  return {
    prev: PRODUCT_ORDER[(index - 1 + total) % total],
    next: PRODUCT_ORDER[(index + 1) % total],
  };
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="pdp-hero-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "is-on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

type PdpHeroSectionProps = {
  heroRef: React.RefObject<HTMLElement | null>;
  onStart: (e: MouseEvent) => void;
};

/**
 * Product-first PDP hero — peptide vial is the hero visual (not lifestyle photos).
 */
export function PdpHeroSection({ heroRef, onStart }: PdpHeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const { slug, heroProduct, heroImage, goal, outcomePhrases, includedPhrases } = usePdpData();
  const catalog = getCatalogProduct(slug);
  const name = catalog?.shortName ?? heroProduct.name;
  const { prev, next } = productNeighbors(slug);
  const isWeightLoss = goal === "weight-loss";
  const whatItDoes =
    heroProduct.specs.find((s) => /what it does/i.test(s.label))?.detail ??
    heroProduct.summary;

  const leftPhrases = isWeightLoss ? WEIGHT_LOSS_LEFT : outcomePhrases.slice(0, 2);
  const rightPhrases = isWeightLoss ? WEIGHT_LOSS_RIGHT : includedPhrases.slice(0, 2);

  return (
    <section className="pdp-hero pdp-hero-prod" id="hero" ref={heroRef} data-pdp-header-theme="light">
      <div className="pdp-hero-prod-shell">
        <motion.div
          className="pdp-hero-prod-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="pdp-hero-prod-kicker">{heroProduct.descriptor}</p>

          <h1 className="pdp-hero-prod-title">
            <span className="pdp-hero-prod-brand">TIDL</span>
            {name}
          </h1>

          <p className="pdp-hero-prod-price">
            {formatCurrency(heroProduct.startingPrice)}
            <span>/mo</span>
          </p>

          <div className="pdp-hero-prod-rating">
            <strong>{heroProduct.rating}</strong>
            <StarRow rating={heroProduct.rating} />
            <span>{heroProduct.reviewCount} reviews</span>
          </div>

          <p className="pdp-hero-prod-lead">{whatItDoes}</p>

          <p className="pdp-hero-prod-includes">
            {heroProduct.perks.map((perk) => perk.label).join(" · ")}
          </p>

          <div className="pdp-hero-prod-actions">
            <button type="button" className="pdp-hero-prod-cta" onClick={onStart}>
              {heroProduct.ctaLabel}
            </button>
            <Link to={PRODUCT_PATHS[prev]} className="pdp-hero-prod-nav" aria-label="Previous product">
              ‹
            </Link>
            <Link to={PRODUCT_PATHS[next]} className="pdp-hero-prod-nav" aria-label="Next product">
              ›
            </Link>
          </div>

          <p className="pdp-hero-prod-price-note">{heroProduct.priceNote}</p>
        </motion.div>

        <motion.div
          className="pdp-hero-prod-stage pdp-hero-prod-stage--vial"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pdp-hero-prod-glow" aria-hidden="true" />

          <div className="pdp-hero-prod-side-msg pdp-hero-prod-side-msg--left">
            {leftPhrases.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <img
            className="pdp-hero-prod-img"
            src={heroImage}
            alt={`${name} by TIDL`}
            loading="eager"
            fetchPriority="high"
          />

          <div className="pdp-hero-prod-side-msg pdp-hero-prod-side-msg--right">
            {rightPhrases.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </motion.div>
      </div>

      <p className="pdp-hero-prod-trust">{heroProduct.trustNote}</p>
    </section>
  );
}
