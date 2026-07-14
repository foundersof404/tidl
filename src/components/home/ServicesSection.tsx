import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { ServicesClosing } from "./ServicesClosing";
import { SERVICES_INTRO } from "@/lib/services-content";
import { CATEGORIES, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { getCatalogProductsByCategory, type CatalogProduct } from "@/lib/product-catalog";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
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


const TAGLINES: Record<CategorySlug, string> = {
  "weight-loss": "Metabolic reset",
  "metabolic-health": "Metabolic balance",
  testosterone: "Endocrine recalibration",
  longevity: "Cellular maintenance",
  performance: "Peak output",
  recovery: "Tissue repair",
};

const FEATURED_ORDER: Partial<Record<ProductSlug, number>> = {
  "glp-1-weight-loss": 0,
  retatrutide: 1,
  "mots-c": 0,
  "nad-plus": 0,
  "cjc-1295-ipamorelin": 0,
  "bpc-157": 0,
  wolverine: 1,
};

type CabinetProduct = {
  slug: ProductSlug;
  name: string;
  form: string;
  benefit: string;
  monthly: number;
  image: string;
  popular?: boolean;
};

type CabinetCategory = {
  slug: CategorySlug;
  index: string;
  label: string;
  tagline: string;
  summary: string;
  molecule: string;
  products: CabinetProduct[];
};

function categoryToGoal(slug: CategorySlug): GoalId {
  if (slug === "testosterone") return "hormonal-health";
  return slug;
}

function productsForCategory(
  categorySlug: CategorySlug,
  liveMap: Record<string, LiveProduct>,
): CabinetProduct[] {
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
        form: catalog.form === "pen" ? "TIDL Pen" : "Peptide protocol",
        benefit:
          peptide?.outcomes?.[0] ??
          marketing?.outcomes?.[0] ??
          catalog.highlights[0] ??
          catalog.headline,
        monthly,
        // Local transparent cutouts read as 3D product shots — pharmacy API
        // assets ship on a white pack background and flatten the cabinet.
        image: resolvePeptideOnlyImage(catalog.slug),
        popular: catalog.slug === "glp-1-weight-loss" || catalog.slug === "wolverine",
      };
    });
}

function buildCategories(liveMap: Record<string, LiveProduct>): CabinetCategory[] {
  return CATEGORY_SLUGS.map((slug, i) => {
    const category = CATEGORIES[slug];
    const products = productsForCategory(slug, liveMap);
    const molecule = products.length
      ? products
          .map((p) => {
            const peptide = getPeptideDef(p.slug);
            return peptide?.compound ?? p.name;
          })
          .slice(0, 3)
          .join(" · ")
      : "Physician-guided protocol";

    return {
      slug,
      index: String(i + 1).padStart(2, "0"),
      label: category.navLabel,
      tagline: TAGLINES[slug],
      summary: category.lead,
      molecule,
      products,
    };
  });
}

export function ServicesSection() {
  const reduceMotion = useReducedMotion();
  const { map: liveMap, loading } = useLiveCatalog();
  const { openModal } = useQuizModal();
  const categories = useMemo(() => buildCategories(liveMap), [liveMap]);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollLockUntil = useRef(0);
  const activeIdxRef = useRef(0);
  const railProgressRef = useRef<HTMLDivElement>(null);
  const hintProgressRef = useRef<HTMLSpanElement>(null);
  const active = categories[activeIdx] ?? categories[0];
  const next = categories[(activeIdx + 1) % categories.length];
  const scrollRef = useRef<HTMLDivElement>(null);
  const cabinetInViewRef = useRef(false);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;
    let listening = false;

    const compute = () => {
      raf = 0;
      if (!cabinetInViewRef.current) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const pct = `${progress * 100}%`;
      if (railProgressRef.current) railProgressRef.current.style.height = pct;
      if (hintProgressRef.current) hintProgressRef.current.style.width = pct;

      if (performance.now() < scrollLockUntil.current) return;

      const n = categories.length;
      const raw = Math.min(n - 1, Math.floor(progress * n));
      const prev = activeIdxRef.current;
      let nextIdx = raw;
      if (raw !== prev) {
        const boundary = (Math.min(raw, prev) + 1) / n;
        const dist = Math.abs(progress - boundary);
        if (Math.abs(raw - prev) === 1 && dist < 0.045) nextIdx = prev;
      }
      if (nextIdx !== prev) {
        activeIdxRef.current = nextIdx;
        setActiveIdx(nextIdx);
      }
    };

    const onScroll = () => {
      if (!cabinetInViewRef.current) return;
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    };

    const startListening = () => {
      if (listening) return;
      listening = true;
      compute();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };

    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        cabinetInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) startListening();
        else stopListening();
      },
      { rootMargin: "120px 0px 120px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      stopListening();
    };
  }, [categories.length]);

  const select = (i: number) => {
    activeIdxRef.current = i;
    setActiveIdx(i);
    scrollLockUntil.current = performance.now() + 900;
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(rect.height - vh, 0);
    if (total <= 0 || window.matchMedia("(max-width: 900px)").matches) return;
    // Land mid-segment so hysteresis does not bounce back to the previous pathway.
    const target =
      rect.top + window.scrollY + ((i + 0.5) / categories.length) * total;
    window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const nextLabel =
    activeIdx < categories.length - 1 ? next?.label : null;

  if (!active) return null;

  return (
    <div className="services-cabinet-wrap">
      <div
        ref={scrollRef}
        className="svc-cab-scroll"
        style={{ ["--svc-cab-n" as string]: categories.length }}
      >
        <section
          className="services container-full svc-cab"
          id="services"
          data-site-header-theme="dark"
          aria-label="Treatment discovery"
        >
          <div className="svc-cab-ambient" aria-hidden="true" />

          <div className="container-fluid svc-cab-shell">
            <header className="svc-cab-header">
              <p className="services-intro-kicker svc-cab-eyebrow">
                <span className="svc-cab-dot" aria-hidden="true" />
                {SERVICES_INTRO.kicker}
              </p>
              <h2 className="svc-cab-title">
                <span className="svc-cab-title-plate">Pick your goal.</span>
                <span className="svc-cab-title-sub">Six pathways. One standard of care.</span>
              </h2>
              {loading ? (
                <p className="services-intro-status" aria-live="polite">
                  Updating live pricing…
                </p>
              ) : null}
            </header>

            <div className="svc-cab-stage">
              <nav className="svc-cab-rail" aria-label="Treatment categories">
                <p className="svc-cab-rail-kicker">Pathways</p>
                <ol>
                  {categories.map((c, i) => {
                    const isActive = i === activeIdx;
                    const isPast = i < activeIdx;
                    return (
                      <li key={c.slug}>
                        <button
                          type="button"
                          className={`svc-cab-rail-item${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}`}
                          onClick={() => select(i)}
                          aria-current={isActive ? "true" : undefined}
                        >
                          <span className="svc-cab-rail-index" aria-hidden="true">
                            {c.index}
                          </span>
                          <span className="svc-cab-rail-copy">
                            <span className="svc-cab-rail-label">{c.label}</span>
                            <span className="svc-cab-rail-tagline">{c.tagline}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <div className="svc-cab-rail-track" aria-hidden="true">
                  <div ref={railProgressRef} className="svc-cab-rail-track-fill" />
                </div>
              </nav>

              <div className="svc-cab-specimen" aria-hidden="true">
                <div className="svc-cab-vial-stage">
                  <div className="svc-cab-plinth">
                    <div className="svc-cab-plinth-top" />
                    <div className="svc-cab-plinth-side" />
                  </div>

                  {categories.map((c, i) => (
                    <div
                      key={c.slug}
                      className={`svc-cab-vial-wrap${i === activeIdx ? " is-active" : ""}`}
                      aria-hidden={i !== activeIdx}
                    >
                      {c.products[0] ? (
                        <img
                          src={c.products[0].image}
                          alt=""
                          className="svc-cab-product-shot"
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      ) : (
                        <SpecimenMark index={c.index} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="svc-cab-caption">
                  <span className="svc-cab-caption-kicker">
                    Pathway {active.index}
                    <span className="svc-cab-caption-of"> / {String(categories.length).padStart(2, "0")}</span>
                  </span>
                  <span className="svc-cab-caption-molecule">{active.molecule}</span>
                </div>
              </div>

              <div className="svc-cab-brief-stage">
                {categories.map((c, i) => (
                  <div
                    key={c.slug}
                    className={`svc-cab-brief${i === activeIdx ? " is-active" : ""}`}
                    aria-hidden={i !== activeIdx}
                  >
                    <div className="svc-cab-brief-head">
                      <span className="svc-cab-brief-index">
                        {c.index} / {String(categories.length).padStart(2, "0")}
                      </span>
                      <h3 className="svc-cab-brief-title heading-02">{c.label}</h3>
                      <p className="svc-cab-brief-summary p2-regular">{c.summary}</p>
                    </div>

                    {c.products.length > 0 ? (
                      <ul className="svc-cab-inventory" aria-label={`${c.label} treatments`}>
                        {c.products.map((p) => (
                          <li key={p.slug}>
                            <Link
                              to="/products/$slug"
                              params={{ slug: p.slug }}
                              className={`svc-cab-product${p.popular ? " is-popular" : ""}`}
                              tabIndex={i === activeIdx ? undefined : -1}
                            >
                              <span className="svc-cab-product-thumb">
                                <img src={p.image} alt="" loading="lazy" decoding="async" />
                              </span>
                              <span className="svc-cab-product-copy">
                                <span className="svc-cab-product-row">
                                  <span className="svc-cab-product-form">{p.form}</span>
                                  {p.popular ? (
                                    <span className="svc-cab-product-flag">Best seller</span>
                                  ) : null}
                                </span>
                                <strong className="svc-cab-product-name">{p.name}</strong>
                                <span className="svc-cab-product-foot">
                                  {p.monthly > 0 ? (
                                    <span className="svc-cab-product-price">
                                      <em>From</em>
                                      <b>{formatCurrency(p.monthly)}</b>
                                      <i>/mo</i>
                                    </span>
                                  ) : (
                                    <span className="svc-cab-product-price svc-cab-product-price--consult">
                                      Provider pathway
                                    </span>
                                  )}
                                  <span className="svc-cab-product-cta" aria-hidden="true">
                                    <ArrowUpRight size={14} strokeWidth={2.2} />
                                  </span>
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="svc-cab-empty">
                        <p className="p2-regular">
                          Personalized {c.label.toLowerCase()} starts with a provider review. Pricing
                          is set after your assessment.
                        </p>
                      </div>
                    )}

                    <div className="svc-cab-brief-cta">
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className="svc-cab-btn-primary"
                        tabIndex={i === activeIdx ? undefined : -1}
                      >
                        Explore {c.label}
                        <ArrowUpRight size={16} strokeWidth={2.2} />
                      </Link>
                      <button
                        type="button"
                        className="svc-cab-btn-ghost"
                        tabIndex={i === activeIdx ? undefined : -1}
                        onClick={() => openModal({ goal: categoryToGoal(c.slug) })}
                      >
                        <Plus size={14} strokeWidth={2.2} />
                        Start free assessment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="svc-cab-filmstrip" role="tablist" aria-label="Treatment categories">
              {categories.map((c, i) => (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIdx}
                  className={`svc-cab-film${i === activeIdx ? " is-active" : ""}`}
                  onClick={() => select(i)}
                >
                  <span className="svc-cab-film-idx">{c.index}</span>
                  <span className="svc-cab-film-label">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="svc-cab-scrollhint" aria-hidden="true">
              <span className="svc-cab-scrollhint-track">
                <span ref={hintProgressRef} className="svc-cab-scrollhint-fill" />
              </span>
              <span className="svc-cab-scrollhint-copy">
                {nextLabel
                  ? `Scroll · next ${nextLabel}`
                  : `${activeIdx + 1} / ${categories.length} · end of pathways`}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="svc-cab-closing" data-site-header-theme="dark">
        <div className="container-fluid svc-cab-shell">
          <div className="svc-cab-closing-panel">
            <ServicesClosing />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecimenMark({ index }: { index: string }) {
  return (
    <div className="svc-cab-mark">
      <span>{index}</span>
      <em>TIDL</em>
    </div>
  );
}
