# Pick your goal — full structure & design dump

Generated from the live codebase. Source of truth paths are listed below.

## File index

| Piece | Path |
|-------|------|
| Section component | `src/components/home/ServicesSection.tsx` |
| Closing statement | `src/components/home/ServicesClosing.tsx` |
| Styles (in `home.css`) | `src/components/home/home.css` (services blocks) |
| Intro / legacy cards copy | `src/lib/services-content.ts` |
| Mounted on homepage | `src/components/home/HomePage.tsx` — `<ServicesSection />`, nav `#services` |
| Category data | `src/lib/categories.ts` — `CATEGORY_SLUGS`, `CATEGORIES` |
| Product catalog filter | `src/lib/product-catalog.ts` — `getCatalogProductsByCategory` |

## Markup tree

```
section#services.services.container-full
  .container-fluid
    .services-content
      header.services-head
        p.services-intro-kicker
        h2.services-title-02.heading-01  "Pick your goal."
        p.services-intro-lead
        p.services-intro-status? (loading)
      .service-list
        article.service-item[.is-featured]
          .services-item-thumb._02
            img.service-thumb-img
            .service-item-thumb-text
          .service-item-body
            span.service-item-badge?
            p.service-item-text
            ul.svc-product-grid[.is-multi]
              li > a.svc-product-card[.is-popular] → /products/$slug
                span.svc-product-chip?
                .svc-product-visual > img
                .svc-product-body
                  span.svc-product-form
                  strong.svc-product-name
                  span.svc-product-benefit
                  .svc-product-price
                  span.svc-product-cta
            OR .svc-product-empty (testosterone pathway)
            .service-item-btns > Link.button-03 → /category/$slug
      ServicesClosing → .services-closing
```
---

## 1. `ServicesSection.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { ServicesClosing } from "./ServicesClosing";
import { SERVICES_INTRO } from "@/lib/services-content";
import { CATEGORIES, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import {
  getCatalogProductsByCategory,
  type CatalogProduct,
} from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import { getProductBySlug } from "@/lib/products";
import { getPeptideDef } from "@/lib/peptides";
import {
  resolveDisplayMonthlyPrice,
  useLiveCatalog,
  type LiveProduct,
} from "@/lib/prescribe-rx/use-live-catalog";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import type { GoalId, ProductSlug } from "@/types/quiz";

function ArrowRight() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURED_ORDER: Partial<Record<ProductSlug, number>> = {
  "glp-1-weight-loss": 0,
  retatrutide: 1,
  "mots-c": 0,
  "nad-plus": 0,
  "cjc-1295-ipamorelin": 0,
  "bpc-157": 0,
  wolverine: 1,
};

type GoalProduct = {
  slug: ProductSlug;
  name: string;
  benefit: string;
  formLabel: string;
  monthly: number;
  image: string;
  popular?: boolean;
};

type GoalCard = {
  categorySlug: CategorySlug;
  label: string;
  image: string;
  summary: string;
  badge?: string;
  featured?: boolean;
  products: GoalProduct[];
};

function categoryToGoal(slug: CategorySlug): GoalId {
  if (slug === "testosterone") return "hormonal-health";
  return slug;
}

function productsForCategory(
  categorySlug: CategorySlug,
  liveMap: Record<string, LiveProduct>,
): GoalProduct[] {
  return [...getCatalogProductsByCategory(categorySlug)]
    .sort((a, b) => (FEATURED_ORDER[a.slug] ?? 50) - (FEATURED_ORDER[b.slug] ?? 50))
    .map((catalog: CatalogProduct) => {
      const marketing = getProductBySlug(catalog.slug);
      const peptide = getPeptideDef(catalog.slug);
      const live = liveMap[catalog.slug];
      const monthly = resolveDisplayMonthlyPrice(marketing?.monthlyPrice ?? 0, live?.price);

      return {
        slug: catalog.slug,
        name:
          catalog.slug === "glp-1-weight-loss"
            ? "GLP-1 Weight Loss"
            : (peptide?.productName ?? peptide?.compound ?? catalog.shortName),
        benefit:
          peptide?.outcomes?.[0] ??
          marketing?.outcomes?.[0] ??
          catalog.highlights[0] ??
          catalog.headline,
        formLabel: catalog.form === "pen" ? "TIDL Pen" : "Peptide protocol",
        monthly,
        image: live?.image ?? catalog.image,
        popular: catalog.slug === "glp-1-weight-loss",
      };
    });
}

function buildGoalCards(liveMap: Record<string, LiveProduct>): GoalCard[] {
  return CATEGORY_SLUGS.map((slug) => {
    const category = CATEGORIES[slug];
    const products = productsForCategory(slug, liveMap);

    return {
      categorySlug: slug,
      label: category.navLabel,
      image: category.heroImage,
      summary: category.lead,
      featured: slug === "weight-loss",
      badge:
        slug === "weight-loss"
          ? "Most popular"
          : products.length > 0
            ? `${products.length} treatment${products.length === 1 ? "" : "s"}`
            : "Doctor pathway",
      products,
    };
  });
}

export function ServicesSection() {
  const { map: liveMap, loading } = useLiveCatalog();
  const { openModal } = useQuizModal();
  const cards = buildGoalCards(liveMap);
  const total = cards.length;

  return (
    <section className="services container-full" id="services" data-site-header-theme="dark">
      <div className="container-fluid">
        <div className="services-content">
          <header className="services-head">
            <p className="services-intro-kicker">{SERVICES_INTRO.kicker}</p>
            <h2 className="services-title-02 heading-01">Pick your goal.</h2>
            <p className="services-intro-lead">
              Six care pathways. Open a treatment card to see the plan, pricing, and product details.
            </p>
            {loading ? (
              <p className="services-intro-status" aria-live="polite">
                Updating live pricingâ€¦
              </p>
            ) : null}
          </header>

          <div
            className="service-list"
            style={{ ["--svc-total" as string]: String(total).padStart(2, "0") }}
          >
            {cards.map((card, index) => (
              <article
                key={card.categorySlug}
                className={`service-item${card.featured ? " is-featured" : ""}`}
                style={{ ["--svc-index" as string]: String(index + 1).padStart(2, "0") }}
              >
                <div className="services-item-thumb _02">
                  <img
                    src={card.image}
                    loading="lazy"
                    sizes="(max-width: 1728px) 100vw, 1728px"
                    alt=""
                    className="service-thumb-img"
                  />
                  <div className="service-item-thumb-text">{card.label}</div>
                </div>

                <div className="service-item-body">
                  {card.badge ? <span className="service-item-badge">{card.badge}</span> : null}
                  <p className="service-item-text p2-regular">{card.summary}</p>

                  {card.products.length > 0 ? (
                    <ul
                      className={`svc-product-grid${card.products.length > 1 ? " is-multi" : ""}`}
                      aria-label={`${card.label} treatments`}
                    >
                      {card.products.map((product) => (
                        <li key={product.slug}>
                          <Link
                            to="/products/$slug"
                            params={{ slug: product.slug }}
                            className={`svc-product-card${product.popular ? " is-popular" : ""}`}
                          >
                            {product.popular ? (
                              <span className="svc-product-chip">Best seller</span>
                            ) : null}

                            <div className="svc-product-visual">
                              <img src={product.image} alt="" loading="lazy" decoding="async" />
                            </div>

                            <div className="svc-product-body">
                              <span className="svc-product-form">{product.formLabel}</span>
                              <strong className="svc-product-name">{product.name}</strong>
                              <span className="svc-product-benefit">{product.benefit}</span>

                              {product.monthly > 0 ? (
                                <div className="svc-product-price">
                                  <span>From</span>
                                  <b>{formatCurrency(product.monthly)}</b>
                                  <i>/mo</i>
                                </div>
                              ) : null}

                              <span className="svc-product-cta">
                                View product
                                <span aria-hidden="true">â†’</span>
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="svc-product-empty">
                      <p>
                        Personalized {card.label.toLowerCase()} starts with a provider review. Open the
                        pathway or start a free assessment.
                      </p>
                      <div className="svc-product-empty-actions">
                        <Link
                          to="/category/$slug"
                          params={{ slug: card.categorySlug }}
                          className="svc-product-cta svc-product-cta--link"
                        >
                          View {card.label}
                          <span aria-hidden="true">â†’</span>
                        </Link>
                        <button
                          type="button"
                          className="svc-product-cta svc-product-cta--button"
                          onClick={() => openModal({ goal: categoryToGoal(card.categorySlug) })}
                        >
                          Start free assessment
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="service-item-btns">
                    <Link
                      to="/category/$slug"
                      params={{ slug: card.categorySlug }}
                      className="button-03 w-inline-block"
                    >
                      <div className="button-outside-wrap">
                        <div className="btn-text-outside-03">
                          <div className="btn-text-inside-03">
                            <div className="button-text-03">Browse {card.label}</div>
                            <div className="button-text-03">Browse {card.label}</div>
                          </div>
                        </div>
                        <div className="btn-icon-outside-03">
                          <div className="btn-icon-inside-03">
                            <div className="btn-icon-03 w-embed">
                              <ArrowRight />
                            </div>
                            <div className="btn-icon-03 w-embed">
                              <ArrowRight />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="button-line-02"></div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ServicesClosing />
        </div>
      </div>
    </section>
  );
}

```

---

## 2. `ServicesClosing.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const settle = [0.22, 1, 0.36, 1] as const;

const KICKER = "One standard of care";

const PHRASES = [
  { text: "Built around one thing:", highlight: false },
  { text: "it works.", highlight: true },
] as const;

function KickerReveal({ active }: { active: boolean }) {
  const chars = KICKER.split("");

  return (
    <span className="services-closing-kicker" aria-label={KICKER}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="services-closing-kicker-char"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.45,
            delay: 0.08 + i * 0.028,
            ease: settle,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function HeadlineReveal({ active, loopMotion }: { active: boolean; loopMotion: boolean }) {
  return (
    <p className="services-closing-headline">
      {PHRASES.map((phrase, i) => (
        <motion.span
          key={phrase.text}
          className={phrase.highlight ? "services-closing-highlight" : "services-closing-phrase"}
          initial={{ opacity: 0, y: 22, filter: "blur(10px)", rotateX: 18 }}
          animate={active ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 } : {}}
          transition={{
            duration: 0.62,
            delay: 0.42 + i * 0.16,
            ease: settle,
          }}
        >
          {phrase.highlight ? (
            <span className="services-closing-shimmer-wrap">
              <span className="services-closing-shimmer-text">{phrase.text}</span>
              <motion.span
                className="services-closing-shimmer-beam"
                aria-hidden="true"
                initial={{ x: "-120%", opacity: 0 }}
                animate={
                  active && loopMotion
                    ? {
                        x: ["-120%", "220%"],
                        opacity: [0, 1, 1, 0],
                      }
                    : {}
                }
                transition={
                  loopMotion
                    ? {
                        duration: 1.35,
                        delay: 1.05,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2.8,
                      }
                    : undefined
                }
              />
            </span>
          ) : (
            phrase.text
          )}
          {i < PHRASES.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </p>
  );
}

export function ServicesClosing() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loopMotion, setLoopMotion] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setLoopMotion(false);
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      {
        threshold: [0.2, 0.35],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`services-closing${active ? " services-closing-on" : ""}`}>
      <motion.span
        className="services-closing-orbit"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
        animate={active ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.9, ease: settle }}
      />
      <motion.span
        className="services-closing-frame services-closing-frame-tl"
        aria-hidden="true"
        initial={{ scale: 0, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.55, delay: 0.12, ease: settle }}
      />
      <motion.span
        className="services-closing-frame services-closing-frame-br"
        aria-hidden="true"
        initial={{ scale: 0, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.55, delay: 0.22, ease: settle }}
      />

      <KickerReveal active={active} />
      <HeadlineReveal active={active} loopMotion={loopMotion} />

      <motion.span
        className="services-closing-rule"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={active ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, delay: 1.05, ease: settle }}
      >
        {loopMotion ? (
          <motion.span
            className="services-closing-rule-beam"
            initial={{ left: "-32%" }}
            animate={active ? { left: ["-32%", "108%"] } : {}}
            transition={{
              duration: 2.2,
              delay: 1.35,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1.6,
            }}
          />
        ) : null}
      </motion.span>
    </div>
  );
}

```

---

## 3. `services-content.ts`

```ts
import { SITE_IMAGES } from "@/lib/site-assets";
import { CATEGORY_PATHS } from "@/lib/product-catalog";
import type { CategorySlug } from "@/lib/categories";

export type ServiceCardContent = {
  categorySlug: CategorySlug;
  label: string;
  image: string;
  summary: string;
  bullets: readonly string[];
  badge?: string;
  comingSoon?: boolean;
  comingSoonNote?: string;
  waitlistHref?: string;
  exploreLabel?: string;
  explorePath: `/category/${CategorySlug}`;
};

export const SERVICES_INTRO = {
  kicker: "Prescription care, delivered",
} as const;

export const SERVICE_CARDS: ServiceCardContent[] = [
  {
    categorySlug: "weight-loss",
    label: "Weight loss",
    image: SITE_IMAGES.services.weightLoss,
    summary:
      "GLP-1 treatment dosed for you by a doctor. Steady progress without crash diets, yo-yo cycles, or measuring at home.",
    bullets: [
      "Pre-dosed TIDL Pen, dose set to your Rx",
      "Provider reviews every intake",
      "Weekly routine: click, inject, track progress",
    ],
    badge: "Includes TIDL Pen",
    exploreLabel: "See Pricing & Plans",
    explorePath: CATEGORY_PATHS["weight-loss"],
  },
  {
    categorySlug: "testosterone",
    label: "Testosterone",
    image: SITE_IMAGES.services.testosterone,
    summary:
      "Energy, strength, drive, and focus. TRT built around your labs, symptoms, and how you actually live day to day.",
    bullets: [
      "Lab-guided dosing and ongoing monitoring",
      "Doctor in your state prescribes when appropriate",
      "Shipped from a US pharmacy in plain packaging",
    ],
    exploreLabel: "Explore TRT",
    explorePath: CATEGORY_PATHS.testosterone,
  },
  {
    categorySlug: "longevity",
    label: "Longevity",
    image: SITE_IMAGES.services.longevity,
    summary:
      "Peptide and metabolic protocols under physician supervision. Built for recovery, sleep, and long-term performance.",
    bullets: [
      "Peptide, NAD+, and recovery protocols under supervision",
      "Pen or prescription format based on your plan",
      "Message your care team anytime",
    ],
    exploreLabel: "Explore longevity",
    explorePath: CATEGORY_PATHS.longevity,
  },
];

```

---

## 4. Design CSS from `home.css` (Pick your goal / services)

### Core + product cards + closing (approx. lines 1722–2700)

```css
/* ===== Services: premium dark 3D cards ===== */
.services.container-full {
  background: #0b0a08;
  padding-top: 0;
  padding-bottom: 48px;
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  position: relative;
  overflow: hidden;
}

.services.container-full::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 8%, rgba(243, 195, 0, 0.1), transparent 34%),
    radial-gradient(circle at 88% 88%, rgba(243, 195, 0, 0.07), transparent 42%);
}

.services-content {
  position: relative;
  z-index: 1;
}

.services-title-02.heading-01 {
  color: #ffffff;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-flex;
  align-items: center;
  isolation: isolate;
}

.services-title-02.heading-01::before {
  content: "";
  position: absolute;
  left: -22px;
  right: -22px;
  top: 52%;
  height: 0.95em;
  transform: translateY(-50%) skewX(-14deg);
  z-index: -1;
  background: linear-gradient(90deg, rgba(243, 195, 0, 0.08), rgba(243, 195, 0, 0.3), rgba(243, 195, 0, 0.08));
  border: 1px solid rgba(243, 195, 0, 0.2);
  box-shadow: 0 0 0 1px rgba(243, 195, 0, 0.08) inset;
  animation: servicesTitlePulse 3.8s ease-in-out infinite;
}

.services-title-02.heading-01::after {
  content: "";
  position: absolute;
  left: -26px;
  width: 38px;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, rgba(214, 179, 108, 0), rgba(214, 179, 108, 0.95));
  animation: servicesTitleScan 2.1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

@keyframes servicesTitlePulse {
  0%, 100% { opacity: 0.65; transform: translateY(-50%) skewX(-14deg) scaleX(1); }
  50% { opacity: 0.95; transform: translateY(-50%) skewX(-14deg) scaleX(1.02); }
}

@keyframes servicesTitleScan {
  0% { left: -26px; opacity: 0; }
  18% { opacity: 1; }
  75% { left: calc(100% - 10px); opacity: 1; }
  100% { left: calc(100% + 6px); opacity: 0; }
}

.service-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.service-item {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: auto;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    linear-gradient(165deg, rgba(34, 31, 27, 0.98) 0%, rgba(11, 10, 8, 0.98) 70%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 26px 60px -28px rgba(0, 0, 0, 0.95);
  transform-style: preserve-3d;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    background 0.35s ease;
}

.service-item::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.24), rgba(243, 195, 0, 0.45), rgba(11, 10, 8, 0.2));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.52;
  transition: opacity 0.35s ease;
}

.service-item::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -22px;
  height: 42px;
  border-radius: 100%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7), transparent 68%);
  filter: blur(5px);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .service-item:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(243, 195, 0, 0.62);
    background:
      linear-gradient(165deg, rgba(39, 34, 27, 0.99) 0%, rgba(11, 10, 8, 0.99) 64%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 42px 90px -42px rgba(0, 0, 0, 0.98),
      0 16px 36px -20px rgba(243, 195, 0, 0.5);
  }

  .service-item:hover::before {
    opacity: 0.9;
  }

  .service-item:hover::after {
    opacity: 1;
  }

  .service-item:hover .service-thumb-img {
    transform: scale(1.08);
    filter: saturate(1) contrast(1.12) brightness(0.92);
  }

  .service-item:hover .services-item-thumb._02::after {
    transform: translateX(72%) rotate(8deg);
    opacity: 1;
  }

  .service-item:hover .service-item-text {
    color: rgba(255, 255, 255, 0.98);
    transform: translateY(-4px);
  }

  .service-item:hover .service-item-btns {
    transform: translateY(-4px);
  }

  .service-item:hover .service-item-btns .button-line-02 {
    transform: scaleX(1.35);
  }
}

.services-item-thumb._02 {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}

.services-item-thumb._02::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(8, 8, 8, 0.18) 0%, rgba(8, 8, 8, 0) 32%),
    linear-gradient(180deg, rgba(8, 8, 8, 0) 38%, rgba(8, 8, 8, 0.86) 100%);
  z-index: 2;
}

.services-item-thumb._02::after {
  content: "";
  position: absolute;
  inset: -36% -15%;
  background: linear-gradient(115deg, transparent 38%, rgba(214, 179, 108, 0.38) 50%, transparent 62%);
  transform: translateX(-62%) rotate(8deg);
  transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.service-item-thumb-text {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 3;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.service-item .service-item-thumb-text::before {
  content: var(--svc-index, "01") " / " var(--svc-total, "06");
  display: block;
  margin-bottom: 9px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.75);
}

.service-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  filter: saturate(0.88) contrast(1.06) brightness(0.82);
  transition:
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.5s ease;
}

.service-item-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 22px 20px 18px;
  gap: 16px;
  position: relative;
}

.service-item-text,
.service-item-btns {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.32s ease, opacity 0.32s ease;
}

.service-item-text {
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.72;
}

.service-item-btns .button-03 {
  color: rgb(255, 217, 46);
}

.service-item-btns .button-line-02 {
  background-color: rgb(243, 195, 0);
}

.service-item-coming-soon {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.52);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: default;
  user-select: none;
}

.service-item-coming-soon-wrap {
  display: grid;
  gap: 10px;
}

.service-item-coming-soon-note {
  margin: 0;
  max-width: 34ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.62);
}

.service-item-waitlist-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgb(243, 195, 0);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.service-item-waitlist-link:hover {
  color: rgb(255, 217, 46);
}

.home-objections {
  display: grid;
  gap: 18px;
  margin-top: 40px;
}

.home-objection-card {
  padding: 28px 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.home-objection-title {
  margin: 0 0 12px;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.home-objection-body {
  margin: 0;
  max-width: 62ch;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.68);
}

.home-objection-cta {
  margin-top: 18px;
}

@media (min-width: 900px) {
  .home-objections {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
  }
}

@media (min-width: 768px) {
  .services.container-full {
    padding-bottom: 60px;
    padding-left: 0;
    padding-right: 0;
  }

  .service-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .service-item {
    border-radius: 22px;
  }

  .services-item-thumb._02 {
    min-height: 360px;
  }
}

@media (min-width: 992px) {
  .services.container-full {
    padding-bottom: 72px;
  }

  .service-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }

  .service-item {
    min-height: 0;
    border-radius: 24px;
  }

  .services-item-thumb._02 {
    min-height: 432px;
  }
}

/* ===== Services intro, trust, bullets ===== */
.services-head {
  max-width: 920px;
  margin-inline: auto;
  text-align: center;
}

.services-intro-kicker {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgb(243, 195, 0);
}

.services-intro-lead {
  margin: 18px auto 0;
  max-width: 62ch;
  font-size: 1.02rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.68);
}

.services-trust-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
  max-width: 720px;
}

.services-trust-stat {
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.services-trust-stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(243, 195, 0);
}

.services-trust-stat-label {
  display: block;
  margin-top: 4px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
}

.service-item-badge {
  display: inline-flex;
  margin-bottom: 10px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(243, 195, 0, 0.35);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(243, 195, 0);
}

.service-item-bullets {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.service-item-bullets li {
  position: relative;
  padding-left: 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

.service-item-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(243, 195, 0);
}

.service-item-products {
  gap: 6px;
  margin-top: 16px;
}

.service-item.is-featured {
  border-color: rgba(243, 195, 0, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 28px 64px -24px rgba(0, 0, 0, 0.95),
    0 0 0 1px rgba(243, 195, 0, 0.18);
}

.service-item.is-featured .service-item-badge {
  background: rgba(243, 195, 0, 0.16);
}

.svc-product-grid {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 640px) {
  .svc-product-grid.is-multi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.svc-product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    linear-gradient(165deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%);
  overflow: hidden;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.svc-product-card:hover {
  transform: translateY(-3px);
  border-color: rgba(243, 195, 0, 0.55);
  background:
    linear-gradient(165deg, rgba(243, 195, 0, 0.14) 0%, rgba(255, 255, 255, 0.04) 72%);
  box-shadow: 0 18px 36px -22px rgba(243, 195, 0, 0.45);
}

.svc-product-card.is-popular {
  border-color: rgba(243, 195, 0, 0.48);
  box-shadow: 0 0 0 1px rgba(243, 195, 0, 0.14);
}

.svc-product-chip {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgb(243, 195, 0);
  color: #171310;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.svc-product-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 118px;
  padding: 14px 16px 8px;
  background:
    radial-gradient(circle at 50% 30%, rgba(243, 195, 0, 0.16), transparent 60%),
    rgba(0, 0, 0, 0.22);
}

.svc-product-visual img {
  width: min(100%, 96px);
  height: 88px;
  object-fit: contain;
  display: block;
}

.svc-product-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  padding: 4px 14px 14px;
}

.svc-product-form {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(243, 195, 0, 0.85);
}

.svc-product-name {
  font-size: 1rem;
  font-weight: 760;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: #fff;
}

.svc-product-benefit {
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.68);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.svc-product-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(243, 195, 0, 0.2);
}

.svc-product-price span {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.48);
}

.svc-product-price b {
  font-size: 1.2rem;
  font-weight: 820;
  letter-spacing: -0.03em;
  color: rgb(243, 195, 0);
  line-height: 1;
}

.svc-product-price i {
  font-style: normal;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
}

.svc-product-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
  font-size: 0.74rem;
  font-weight: 740;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(243, 195, 0);
}

.svc-product-card:hover .svc-product-cta {
  color: #ffd950;
}

.svc-product-empty {
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  border: 1px dashed rgba(243, 195, 0, 0.4);
  background: rgba(243, 195, 0, 0.07);
}

.svc-product-empty p {
  margin: 0 0 14px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.74);
}

.svc-product-empty-actions {
  display: grid;
  gap: 8px;
}

.svc-product-cta--link,
.svc-product-cta--button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}

.svc-product-cta--link {
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
}

.svc-product-cta--button {
  border: none;
  background: rgb(243, 195, 0);
  color: #171310;
}

.svc-product-cta--button:hover {
  background: #ffd950;
}

.services-intro-status {
  margin: 10px 0 0;
  font-size: 0.85rem;
  color: rgba(243, 195, 0, 0.85);
}

.services-trust-pillars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 40px;
}

.services-trust-pillar {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.services-trust-pillar-num {
  display: block;
  margin-bottom: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: rgb(190, 152, 0);
}

.services-trust-pillar-label {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.services-trust-pillar-detail {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.58);
}

@media (max-width: 900px) {
  .services-trust-stats,
  .services-trust-pillars {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 901px) and (max-width: 1100px) {
  .services-trust-pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ===== Services closing statement ===== */
.services-closing {
  margin-top: 28px;
  padding: 36px 28px 30px;
  text-align: center;
  position: relative;
  isolation: isolate;
  perspective: 1200px;
}

.services-closing-orbit {
  position: absolute;
  inset: 8% 10%;
  border-radius: 28px;
  pointer-events: none;
  z-index: -2;
  background:
    radial-gradient(circle at 50% 42%, rgba(243, 195, 0, 0.14), transparent 58%),
    linear-gradient(135deg, rgba(243, 195, 0, 0.08), rgba(11, 10, 8, 0));
  border: 1px solid rgba(243, 195, 0, 0.14);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 28px 70px -48px rgba(243, 195, 0, 0.45);
}

.services-closing-on .services-closing-orbit {
  animation: servicesClosingOrbit 9s ease-in-out infinite;
}

@keyframes servicesClosingOrbit {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.82; }
  50% { transform: scale(1.02) rotate(0.6deg); opacity: 1; }
}

.services-closing-frame {
  position: absolute;
  width: 34px;
  height: 34px;
  pointer-events: none;
  z-index: 1;
  border-color: rgba(214, 179, 108, 0.72);
  opacity: 0.9;
}

.services-closing-frame-tl {
  top: 14px;
  left: 18px;
  border-top: 2px solid;
  border-left: 2px solid;
  transform-origin: top left;
}

.services-closing-frame-br {
  right: 18px;
  bottom: 14px;
  border-right: 2px solid;
  border-bottom: 2px solid;
  transform-origin: bottom right;
}

.services-closing-kicker {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  font-family: var(--font-body);
  color: rgb(243, 195, 0);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-style: normal;
  margin-bottom: 20px;
}

.services-closing-kicker-char {
  display: inline-block;
  will-change: transform, opacity, filter;
}

.services-closing-headline {
  max-width: 920px;
  margin: 0 auto;
  color: #ffffff;
  font-size: clamp(28px, 3.4vw, 46px);
  line-height: 1.1;
  font-weight: 800;
}

.services-closing-phrase,
.services-closing-highlight {
  display: inline;
  transform-origin: center bottom;
  will-change: transform, opacity, filter;
}

.services-closing-shimmer-wrap {
  position: relative;
  display: inline-block;
  color: rgb(255, 217, 46);
  text-shadow: 0 0 28px rgba(243, 195, 0, 0.35);
  overflow: hidden;
}

.services-closing-shimmer-text {
  position: relative;
  z-index: 1;
}

.services-closing-shimmer-beam {
  position: absolute;
  inset: -20% -10%;
  z-index: 2;
  background: linear-gradient(
    105deg,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 236, 190, 0.85) 50%,
    rgba(255, 255, 255, 0) 65%
  );
  mix-blend-mode: screen;
  pointer-events: none;
}

.services-closing-rule {
  display: block;
  width: min(420px, 72vw);
  height: 2px;
  margin: 30px auto 0;
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  transform-origin: center;
  background: linear-gradient(90deg, rgba(243, 195, 0, 0.08), rgba(243, 195, 0, 0.42), rgba(243, 195, 0, 0.08));
}

.services-closing-rule-beam {
  position: absolute;
  inset: 0 auto 0 -30%;
  width: 30%;
  background: linear-gradient(90deg, rgba(214, 179, 108, 0), rgba(255, 232, 178, 0.95), rgba(214, 179, 108, 0));
}

@media (max-width: 479px) {
  .services-closing {
    margin-top: 36px;
    padding: 28px 16px 24px;
  }

  .services-closing-kicker {
    letter-spacing: 0.18em;
    font-size: 10px;
  }

  .services-closing-headline {
    font-size: clamp(24px, 7.2vw, 32px);
  }

  .services-closing-frame {
    width: 26px;
    height: 26px;
  }
}

/* Nav links Î“Ã‡Ã¶ subtle fade */
.nav-items-wrap {
  transition: opacity 0.35s ease;
}
.nav-items-wrap:hover {
  opacity: 0.7;
}

@media (prefers-reduced-motion: reduce) {
  .button-inside,
  .btn-text-inside-03,
  .btn-icon-inside-03,
  .button-line-02,
  .dropdown-inside-texts,
  .footer-link-line,
  .service-thumb-img,
  .service-item {
    transition: none;
  }
  .button-01:hover .button-inside,
  .button-03:hover .btn-text-inside-03,
  .button-03:hover .btn-icon-inside-03,
  .dropdown-text-outside:hover .dropdown-inside-texts,
  .service-item:hover .service-thumb-img,
  .service-item:hover .service-item-text,
  .service-item:hover .service-item-btns {
    transform: none;
  }
  .service-item:hover {
    transform: none;
  }
  .services-title-02.heading-01::before,
  .services-title-02.heading-01::after,
  .services-closing-on .services-closing-orbit,
  .services-closing-rule-beam,
  .services-closing-shimmer-beam {
    animation: none;
  }
  .footer-link-wrap:hover .footer-link-line {
    width: 0%;
  }
}
```

### Mobile overrides for services (approx. lines 3690–3766)

```css

  /* Services */
  .services.container-full {
    padding-top: 8px;
    padding-bottom: 56px;
  }

  .services-head {
    margin-bottom: 28px;
    padding: 0 4px;
  }

  .services-intro-kicker {
    font-size: 10px;
    letter-spacing: 0.2em;
  }

  .services-title-02.heading-01 {
    display: block;
    width: 100%;
    font-size: clamp(1.7rem, 7.8vw, 2.15rem);
    margin-bottom: 16px;
  }

  .services-title-02.heading-01::before {
    left: -8px;
    right: -8px;
    opacity: 0.75;
  }

  .services-title-02.heading-01::after {
    display: none;
  }

  .services-intro-lead {
    font-size: 0.94rem;
    line-height: 1.65;
    margin-top: 12px;
  }

  .service-list {
    gap: 18px;
  }

  .services-item-thumb._02 {
    min-height: 220px;
  }

  .service-item-body {
    padding: 20px 18px 16px;
  }

  .services-trust-pillars {
    gap: 12px;
    margin-top: 32px;
  }

  .services-trust-pillar {
    padding: 18px 16px;
    border-radius: 16px;
  }

  .services-closing {
    margin-top: 24px;
    padding: 32px 18px 28px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.02);
  }

  /* Pen */
  .tdlp5-sec {
    padding: 64px 20px 72px;
  }

  .tdlp5-head {
    margin-bottom: 32px;
  }
```

---

## Related data (not inlined — open these files)

- `src/lib/categories.ts` — 6 category definitions (`navLabel`, `lead`, `heroImage`, `productSlugs`)
- `src/lib/product-catalog.ts` — `getCatalogProductsByCategory`, GLP-1 + peptide catalog
- `src/lib/peptide-images.ts` / `peptide-image-map.json` — local `/peptides/*.png` assets

---

*End of dump.*
