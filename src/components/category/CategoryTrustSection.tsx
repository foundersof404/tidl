import { motion, useReducedMotion } from "framer-motion";
import type { CategoryDefinition, CategorySlug } from "@/lib/categories";
import { catReveal, catStagger } from "./category-motion";

type CategoryTrustSectionProps = {
  category: CategoryDefinition;
};

const TRUST_LINE = [
  {
    id: "care",
    title: "Personalized care",
  },
  {
    id: "pharmacy",
    title: "US-based pharmacy",
  },
  {
    id: "peptide",
    title: "Peptide protocols",
  },
] as const;

const TRUST_IMAGES: Record<CategorySlug, string> = {
  "weight-loss": "/category/weight-loss/after.png",
  "metabolic-health": "/category/metabolic-health/evening.png",
  testosterone: "/category/testosterone/after.png",
  longevity: "/category/longevity/mood-2.png",
  performance: "/category/performance/ritual-2.png",
  recovery: "/category/recovery/stretch.png",
};

/** Calm trust line with one supporting lifestyle image. */
export function CategoryTrustSection({ category }: CategoryTrustSectionProps) {
  const reduce = useReducedMotion();
  const reveal = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : catReveal;

  return (
    <section
      className="cat-trust"
      id="cat-trust"
      data-site-header-theme="light"
      aria-label="What matters with TIDL"
    >
      <motion.div
        className="cat-trust-inner"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12%" }}
        variants={catStagger}
      >
        <div className="cat-trust-copy">
          <motion.p className="cat-trust-kicker" variants={reveal}>
            What matters for {category.navLabel.toLowerCase()}
          </motion.p>
          <motion.h2 className="cat-trust-title" variants={reveal}>
            Care should feel made for you.
          </motion.h2>
          <motion.p className="cat-trust-lead" variants={reveal}>
            Personal guidance, legitimate fulfillment, and a simpler way to stay consistent.
          </motion.p>

          <div className="cat-trust-grid">
            {TRUST_LINE.map((item) => (
              <motion.div key={item.id} className="cat-trust-item" variants={reveal}>
                <span aria-hidden="true" />
                <h3>{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.figure className="cat-trust-media" variants={reveal}>
          <img src={TRUST_IMAGES[category.slug]} alt="" loading="lazy" decoding="async" />
        </motion.figure>
      </motion.div>
    </section>
  );
}
