import { motion, useReducedMotion } from "framer-motion";
import {
  type CategoryDefinition,
  type CategorySlug,
} from "@/lib/categories";
import { formatCurrency } from "@/lib/pricing";
import { catReveal, catStagger } from "./category-motion";

type CategoryHeroProps = {
  category: CategoryDefinition;
  slug: CategorySlug;
  onGetStarted: () => void;
  /** Lowest live sandbox package price for this category, when available. */
  fromPrice?: number | null;
  productCount?: number;
};

const HERO_IMAGES: Record<CategorySlug, string> = {
  "weight-loss": "/category/weight-loss/hero.png",
  "metabolic-health": "/category/metabolic-health/hero.png",
  testosterone: "/category/testosterone/hero.png",
  longevity: "/category/longevity/hero.png",
  performance: "/category/performance/hero.png",
  recovery: "/category/recovery/hero.png",
};

const HERO_TRUTHS: Record<CategorySlug, string> = {
  "weight-loss": "Done restarting. Ready for a plan that stays.",
  "metabolic-health": "Done planning life around the crash.",
  testosterone: "Done wondering where your drive went.",
  longevity: "Done treating aging like a spectator sport.",
  performance: "Done letting recovery cap the work.",
  recovery: "Done waking up as tired as you went to bed.",
};

function scrollToFormulary() {
  document.getElementById("category-formulary")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CategoryHero({
  category,
  slug,
  onGetStarted,
  fromPrice,
  productCount = 0,
}: CategoryHeroProps) {
  const reduce = useReducedMotion();
  const reveal = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : catReveal;

  return (
    <section
      className={`cat-hero cat-hero--sales cat-hero--calm cat-hero--${slug}`}
      data-site-header-theme="light"
    >
      <motion.div
        className="cat-hero-inner"
        initial="hidden"
        animate="show"
        variants={catStagger}
      >
        <motion.p className="cat-kicker" variants={reveal}>
          <span className="cat-kicker-dot" aria-hidden="true" />
          {category.kicker}
        </motion.p>

        <motion.p className="cat-hero-truth" variants={reveal}>
          {HERO_TRUTHS[slug]}
        </motion.p>

        <motion.h1 className="cat-editorial-title" variants={reveal}>
          {category.headline}
        </motion.h1>

        <motion.p className="cat-editorial-lead" variants={reveal}>
          {category.lead}
        </motion.p>

        {fromPrice != null && fromPrice > 0 ? (
          <motion.p className="cat-hero-price" variants={reveal}>
            From <strong>{formatCurrency(fromPrice)}</strong>
            {productCount > 1 ? (
              <span className="cat-hero-price-note"> · {productCount} protocols</span>
            ) : null}
          </motion.p>
        ) : null}

        <motion.div className="cat-hero-actions" variants={reveal}>
          <button type="button" className="cat-btn cat-btn--primary" onClick={onGetStarted}>
            {category.ctaLabel}
          </button>
          <button type="button" className="cat-btn cat-btn--ghost" onClick={scrollToFormulary}>
            {productCount > 0 ? "Browse treatments" : "See how care works"}
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="cat-hero-visual"
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cat-hero-visual-glow" aria-hidden="true" />
        <img
          src={HERO_IMAGES[slug]}
          alt=""
          loading="eager"
          decoding="async"
          className="cat-hero-img"
        />
      </motion.div>
    </section>
  );
}
