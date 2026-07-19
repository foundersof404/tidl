import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import type { CatalogProduct } from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import type { ProductSlug } from "@/types/quiz";
import { catSpring } from "./category-motion";

type CategoryProductCardProps = {
  product: CatalogProduct;
  price: number;
  index: number;
  onStartIntake: (slug: ProductSlug) => void;
};

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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h12M13 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryProductCard({
  product,
  price,
  index,
  onStartIntake,
}: CategoryProductCardProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.article
      className={`cat-product-card cat-product-card--${product.form}`}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -10 }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      <div className="cat-product-card-glow" aria-hidden="true" />
      <span className={`cat-form-badge cat-form-badge--${product.form === "pen" ? "vial" : product.form}`}>
        {product.form === "pill"
          ? "Prescription protocol"
          : "Peptide vial"}
      </span>

      <div className="cat-product-actions-float" aria-label="Quick actions">
        <ProductPdpLink
          slug={product.slug}
          className="cat-action-btn"
          aria-label={`View ${product.shortName}`}
        >
          <EyeIcon />
        </ProductPdpLink>
        <button
          type="button"
          className="cat-action-btn cat-action-btn--gold"
          aria-label={`Start intake for ${product.shortName}`}
          onClick={() => onStartIntake(product.slug)}
        >
          <ArrowIcon />
        </button>
      </div>

      <ProductPdpLink slug={product.slug} className="cat-product-card-body" aria-label={`View ${product.shortName}`}>
        <motion.div className="cat-product-media" style={{ y: imgY }}>
          <img src={product.image} alt="" loading="lazy" />
        </motion.div>

        <div className="cat-product-copy">
          <p className="cat-product-eyebrow">{product.headline}</p>
          <h3 className="cat-product-name">{product.shortName}</h3>
          <p className="cat-product-summary">{product.summary}</p>
          <ul className="cat-product-highlights">
            {product.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className="cat-product-price">
            From {formatCurrency(price)}
            <span>/month</span>
          </p>
        </div>
      </ProductPdpLink>

      <div className="cat-product-actions">
        <ProductPdpLink slug={product.slug} className="cat-btn cat-btn--primary">
          View details
        </ProductPdpLink>
        <motion.button
          type="button"
          className="cat-btn cat-btn--ghost"
          onClick={() => onStartIntake(product.slug)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={catSpring}
        >
          Start intake
        </motion.button>
      </div>
    </motion.article>
  );
}
