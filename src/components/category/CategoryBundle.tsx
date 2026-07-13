import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import type { CategoryBundle } from "@/lib/category-bundles";
import { formatCurrency } from "@/lib/pricing";
import { PRODUCT_PATHS } from "@/lib/product-catalog";
import type { ProductSlug } from "@/types/quiz";
import { catReveal, catSpring, catStagger } from "./category-motion";

type CategoryBundleSectionProps = {
  bundle: CategoryBundle;
  onStartIntake: (productSlug?: ProductSlug) => void;
};

export function CategoryBundleSection({ bundle, onStartIntake }: CategoryBundleSectionProps) {
  const reduce = useReducedMotion();
  const reveal = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : catReveal;

  return (
    <section className="cat-bundle" id="cat-bundle" data-site-header-theme="light">
      <motion.div
        className="cat-bundle-inner"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={catStagger}
      >
        <motion.div className="cat-bundle-panel" variants={reveal}>
          <div className="cat-bundle-copy">
            <p className="cat-kicker">
              <span className="cat-kicker-dot" aria-hidden="true" />
              {bundle.badge}
            </p>
            <h2 className="cat-bundle-title">{bundle.title}</h2>
            <p className="cat-bundle-lead">{bundle.lead}</p>

            <ul className="cat-bundle-includes">
              {bundle.includes.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>

            <div className="cat-bundle-price-row">
              {bundle.monthlyPrice != null ? (
                <p className="cat-bundle-price">
                  From {formatCurrency(bundle.monthlyPrice)}
                  <span>/month</span>
                </p>
              ) : bundle.comingSoon ? (
                <p className="cat-bundle-price cat-bundle-price--soon">Launching soon</p>
              ) : (
                <p className="cat-bundle-price">Personalized pricing</p>
              )}
              <p className="cat-bundle-price-note">{bundle.priceNote}</p>
            </div>

            <div className="cat-bundle-actions">
              <motion.button
                type="button"
                className="cat-btn cat-btn--primary"
                onClick={() => onStartIntake(bundle.productSlug ?? undefined)}
                whileHover={reduce ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={catSpring}
              >
                {bundle.ctaLabel}
              </motion.button>
              {bundle.productSlug ? (
                <Link to={PRODUCT_PATHS[bundle.productSlug]} className="cat-btn cat-btn--ghost">
                  {bundle.secondaryLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  className="cat-btn cat-btn--ghost"
                  onClick={() => {
                    document.getElementById("cat-how")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {bundle.secondaryLabel}
                </button>
              )}
            </div>
          </div>

          <div className="cat-bundle-visual">
            <div className="cat-bundle-visual-glow" aria-hidden="true" />
            <img src={bundle.image} alt="" loading="lazy" className="cat-bundle-img" />
            {bundle.comingSoon ? <span className="cat-bundle-soon-chip">Coming soon</span> : null}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
