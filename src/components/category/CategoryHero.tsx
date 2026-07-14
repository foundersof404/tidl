import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  type CategoryDefinition,
  type CategorySlug,
} from "@/lib/categories";
import { getCatalogPrice } from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import { catReveal, catStagger } from "./category-motion";

type CategoryHeroProps = {
  category: CategoryDefinition;
  slug: CategorySlug;
  onGetStarted: () => void;
};

function scrollToFormulary() {
  document.getElementById("category-formulary")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CategoryHero({ category, slug, onGetStarted }: CategoryHeroProps) {
  const reduce = useReducedMotion();
  const reveal = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : catReveal;
  const leadPrice = category.productSlugs
    .map((productSlug) => getCatalogPrice(productSlug))
    .find((price) => price > 0);

  return (
    <section className="cat-hero cat-hero--sales" data-site-header-theme="light">
      <motion.div
        className="cat-hero-inner"
        initial="hidden"
        animate="show"
        variants={catStagger}
      >
        <motion.nav className="cat-filter-nav" aria-label="Care categories" variants={reveal}>
          {CATEGORY_SLUGS.map((item) => {
            const active = item === slug;
            return (
              <Link
                key={item}
                to={`/category/${item}`}
                className={`cat-filter-pill${active ? " cat-filter-pill--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {active ? <span className="cat-filter-pill-glow" aria-hidden="true" /> : null}
                <span className="cat-filter-pill-label">{CATEGORIES[item].navLabel}</span>
              </Link>
            );
          })}
        </motion.nav>

        <motion.p className="cat-kicker" variants={reveal}>
          <span className="cat-kicker-dot" aria-hidden="true" />
          {category.kicker}
        </motion.p>

        <motion.h1 className="cat-editorial-title" variants={reveal}>
          {category.headline}
        </motion.h1>

        <motion.p className="cat-editorial-lead" variants={reveal}>
          {category.lead}
        </motion.p>

        {leadPrice != null ? (
          <motion.p className="cat-hero-price" variants={reveal}>
            From <strong>{formatCurrency(leadPrice)}</strong>
            <span>/mo</span>
          </motion.p>
        ) : null}

        <motion.ul className="cat-hero-proof" variants={reveal}>
          {category.pillars.slice(0, 3).map((pillar) => (
            <li key={pillar.title}>{pillar.title}</li>
          ))}
        </motion.ul>

        <motion.div className="cat-hero-actions" variants={reveal}>
          <button type="button" className="cat-btn cat-btn--primary" onClick={onGetStarted}>
            {category.ctaLabel}
          </button>
          <button type="button" className="cat-btn cat-btn--ghost" onClick={scrollToFormulary}>
            {category.productSlugs.length > 0 ? "Shop treatments" : "See how it works"}
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
          src={category.heroImage}
          alt=""
          loading="eager"
          decoding="async"
          className="cat-hero-img"
        />
      </motion.div>
    </section>
  );
}
