import { useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import outcomesHero from "@/assets/ChatGPT Image Jul 17, 2026, 04_07_48 AM.png";
import aiEditorialHero from "@/assets/tidl-ai-hero.png";
import penPeptideHero from "@/assets/tidl-pen-peptide-hero.png";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
import { SERVICES_INTRO } from "@/lib/services-content";
import "./goals-outcomes.css";

type GoalCard = {
  slug: CategorySlug;
  title: string;
  body: string;
  image: string;
};

const GOAL_COPY: Record<CategorySlug, { title: string; body: string }> = {
  "weight-loss": {
    title: "Weight Loss",
    body: "Clinically guided GLP-1 treatments to help you lose weight and keep it off.",
  },
  "metabolic-health": {
    title: "Metabolic",
    body: "Support your metabolism, energy, and overall health.",
  },
  testosterone: {
    title: "Testosterone",
    body: "Optimize performance, strength, and vitality at every stage.",
  },
  longevity: {
    title: "Longevity",
    body: "Proactive care to help you live longer, stronger, and healthier.",
  },
  performance: {
    title: "Performance",
    body: "Enhance endurance, focus, and everyday performance.",
  },
  recovery: {
    title: "Recovery",
    body: "Recover faster, reduce inflammation, and support long-term wellness.",
  },
};

const GOAL_PEPTIDES: Record<CategorySlug, string> = {
  "weight-loss": "glp-1-weight-loss",
  "metabolic-health": "mots-c",
  testosterone: "sermorelin",
  longevity: "nad-plus",
  performance: "cjc-1295-ipamorelin",
  recovery: "wolverine",
};

const ASSURANCE = [
  { k: "HIPAA", v: "Encrypted end-to-end" },
  { k: "US Licensed", v: "50-state clinicians" },
  { k: "LegitScript", v: "Certified pharmacy" },
  { k: "24/7", v: "Care team access" },
] as const;

const BIOMARKERS = [
  { k: "HbA1c", v: "5.2", w: 82 },
  { k: "LDL", v: "88", w: 64 },
  { k: "hs-CRP", v: "0.6", w: 90 },
] as const;

const PATHWAY_STEPS = [
  { label: "Intake", cx: 56, cy: 78, width: 86 },
  { label: "Match", cx: 248, cy: 38, width: 84 },
  { label: "Review", cx: 448, cy: 78, width: 92 },
  { label: "Deliver", cx: 640, cy: 38, width: 98 },
] as const;

const CARE_PATH = "M 56 78 C 126 78, 174 38, 248 38 S 374 78, 448 78 S 566 38, 640 38";

function PathwayMap({
  live,
  pathwayRef,
}: {
  live: boolean;
  pathwayRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={pathwayRef}
      className={`goals-outcomes__pathway${live ? " goals-outcomes__pathway--live" : ""}`}
      role="img"
      aria-label="Care flow: Intake, Match, Review, Deliver"
    >
      <svg className="goals-outcomes__pathway-svg" viewBox="0 0 696 122" aria-hidden="true">
        <title>Intake, Match, Review, Deliver</title>
        <defs>
          <linearGradient id="goPathGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#71695c" stopOpacity="0.35" />
            <stop offset="38%" stopColor="#f3c300" stopOpacity="0.95" />
            <stop offset="72%" stopColor="#f7d84a" stopOpacity="1" />
            <stop offset="100%" stopColor="#be9800" stopOpacity="0.9" />
          </linearGradient>
          <filter id="goPathGlow" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="goals-outcomes__pathway-rail-ambient" d={CARE_PATH} />
        <path className="goals-outcomes__pathway-rail-track" d={CARE_PATH} />
        <path
          className="goals-outcomes__pathway-rail"
          d={CARE_PATH}
          pathLength={1}
        />
        <path
          className="goals-outcomes__pathway-signal"
          d={CARE_PATH}
          pathLength={1}
          filter="url(#goPathGlow)"
        />
        {PATHWAY_STEPS.map((step, index) => (
          <g
            key={step.label}
            className={`goals-outcomes__pathway-node-g goals-outcomes__pathway-node-g--${index + 1}`}
          >
            <g transform={`translate(${step.cx} ${step.cy - 25})`}>
              <g className="goals-outcomes__pathway-label-g">
                <rect
                  className="goals-outcomes__pathway-label-bg"
                  x={-step.width / 2}
                  y="-12"
                  width={step.width}
                  height="24"
                  rx="12"
                />
                <circle
                  className="goals-outcomes__pathway-label-dot"
                  cx={-step.width / 2 + 13}
                  cy="0"
                  r="2.5"
                />
                <text
                  className="goals-outcomes__pathway-label"
                  x={-step.width / 2 + 23}
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {step.label}
                </text>
              </g>
            </g>
            <circle
              className="goals-outcomes__pathway-node-halo"
              cx={step.cx}
              cy={step.cy}
              r="17"
            />
            <circle
              className="goals-outcomes__pathway-node-ring"
              cx={step.cx}
              cy={step.cy}
              r="11.5"
            />
            <circle className="goals-outcomes__pathway-node" cx={step.cx} cy={step.cy} r="6" />
            <circle className="goals-outcomes__pathway-node-core" cx={step.cx} cy={step.cy} r="2" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function buildGoals(): GoalCard[] {
  return CATEGORY_SLUGS.map((slug) => ({
    slug,
    title: GOAL_COPY[slug].title,
    body: GOAL_COPY[slug].body,
    image: resolvePeptideOnlyImage(GOAL_PEPTIDES[slug]),
  }));
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ServicesSectionProps = {
  onStartIntake?: (e?: MouseEvent) => void;
};

function TreatmentDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="goals-outcomes__disclosure" aria-label="Important treatment information">
      <p className="goals-outcomes__disclosure-summary">
        TIDL connects adults 18+ with licensed medical providers. Completing an assessment does not
        guarantee a prescription; treatment is prescribed only when medically appropriate.
      </p>
      <button
        type="button"
        className="goals-outcomes__disclosure-toggle"
        aria-expanded={open}
        aria-controls="goals-treatment-disclosure"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "Read less" : "Read more"}</span>
        <span className="goals-outcomes__disclosure-toggle-icon" aria-hidden="true" />
      </button>
      <div
        id="goals-treatment-disclosure"
        className={`goals-outcomes__disclosure-content${
          open ? " goals-outcomes__disclosure-content--open" : ""
        }`}
        aria-hidden={!open}
      >
        <p>
          Medical intake answers, vitals, and prescriptions are processed through PrescribeRx, the
          clinical platform behind TIDL care. If treatment is approved, it is fulfilled by a
          licensed US pharmacy. Product availability, eligibility, pricing, and delivery timing may
          vary by treatment and state. Your provider will review benefits, risks, alternatives, and
          follow-up needs before prescribing.
        </p>
      </div>
    </aside>
  );
}

export function ServicesSection({ onStartIntake }: ServicesSectionProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const goalsRef = useRef<HTMLDivElement | null>(null);
  const pathwayRef = useRef<HTMLDivElement | null>(null);
  const [goalsLive, setGoalsLive] = useState(false);
  const [pathwayLive, setPathwayLive] = useState(false);
  const goals = buildGoals();

  useEffect(() => {
    const el = goalsRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGoalsLive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => setGoalsLive(true));
        io.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = pathwayRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPathwayLive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => setPathwayLive(true));
        io.disconnect();
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.7 * dir, behavior: "smooth" });
  };

  return (
    <section className="goals-outcomes" id="services" aria-label="Care pathways and outcomes">
      {/* Pick your goal */}
      <div
        ref={goalsRef}
        className={`goals-outcomes__goals${goalsLive ? " goals-outcomes__goals--live" : ""}`}
        data-site-header-theme="dark"
      >
        <div className="goals-outcomes__inner">
          <header className="goals-outcomes__head">
            <p className="goals-outcomes__kicker">{SERVICES_INTRO.kicker}</p>
            <div className="goals-outcomes__title-lockup">
              <svg
                className="goals-outcomes__title-mark"
                viewBox="0 0 720 150"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <g className="goals-outcomes__title-mark-splatter">
                  <circle cx="55" cy="46" r="4" />
                  <circle cx="78" cy="76" r="7" />
                  <circle cx="101" cy="39" r="3" />
                  <circle cx="122" cy="65" r="5" />
                  <circle cx="648" cy="104" r="3" />
                  <circle cx="669" cy="91" r="5" />
                </g>
                <path
                  className="goals-outcomes__title-mark-stroke goals-outcomes__title-mark-stroke--wide"
                  d="M112 92 C205 57 323 43 430 55 C519 65 587 84 646 102"
                />
                <path
                  className="goals-outcomes__title-mark-stroke goals-outcomes__title-mark-stroke--fine"
                  d="M138 109 C252 79 368 74 480 83 C548 88 594 98 628 108"
                />
              </svg>
              <h2 className="goals-outcomes__title">Pick your goal.</h2>
            </div>
          </header>
          <div className="goals-outcomes__nav">
            <button
              type="button"
              className="goals-outcomes__nav-btn"
              aria-label="Previous goals"
              onClick={() => scrollBy(-1)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="goals-outcomes__nav-btn goals-outcomes__nav-btn--primary"
              aria-label="Next goals"
              onClick={() => scrollBy(1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="goals-outcomes__scroller-wrap">
          <div className="goals-outcomes__scroller" ref={scrollerRef}>
            {goals.map((goal, index) => (
              <Link
                key={goal.slug}
                to="/category/$slug"
                params={{ slug: goal.slug }}
                className="goals-outcomes__card"
              >
                <span className="goals-outcomes__card-badge">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="goals-outcomes__card-media">
                  <img src={goal.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="goals-outcomes__card-body">
                  <h3 className="goals-outcomes__card-title">{goal.title}</h3>
                </div>
                <span className="goals-outcomes__card-arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
            ))}
            <div className="goals-outcomes__scroller-end" aria-hidden="true" />
          </div>
        </div>

        <div className="goals-outcomes__feature-pair">
          <div className="goals-outcomes__pathway-product goals-outcomes__pathway-product--ai">
            <img
              src={aiEditorialHero}
              alt="A thoughtful person considering health questions with TIDL Intelligence"
              width={1024}
              height={1024}
              className="goals-outcomes__pathway-product-image"
              loading="lazy"
              decoding="async"
            />
            <a
              className="goals-outcomes__pathway-product-cta"
              href="#askTidl"
            >
              Ask TIDL AI
            </a>
          </div>
          <div className="goals-outcomes__pathway-product">
            <img
              src={penPeptideHero}
              alt="TIDL Pen and peptide vial with 24/7 care team access"
              width={1024}
              height={1024}
              className="goals-outcomes__pathway-product-image"
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              className="goals-outcomes__pathway-product-cta"
              onClick={onStartIntake}
            >
              Start your assessment
            </button>
          </div>
        </div>

        <PathwayMap live={pathwayLive} pathwayRef={pathwayRef} />

        <TreatmentDisclosure />
      </div>

      {/* Built around better outcomes */}
      <div className="goals-outcomes__outcomes" data-site-header-theme="light">
        <div className="goals-outcomes__outcomes-wash" aria-hidden="true" />

        <div className="goals-outcomes__outcomes-grid">
          <div className="goals-outcomes__outcomes-copy">
            <div className="goals-outcomes__badge">
              <span className="goals-outcomes__badge-dot" aria-hidden="true" />
              Clinician-led care
            </div>
            <h2 className="goals-outcomes__outcomes-title">
              Built around <em>better</em> outcomes.
            </h2>

            <ul className="goals-outcomes__assurance">
              {ASSURANCE.map((item) => (
                <li key={item.k}>
                  <span className="goals-outcomes__assurance-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="goals-outcomes__assurance-k">{item.k}</div>
                    <div className="goals-outcomes__assurance-v">{item.v}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="goals-outcomes__actions">
              <button
                type="button"
                className="goals-outcomes__cta-primary"
                onClick={onStartIntake}
              >
                Start your assessment
                <span aria-hidden="true">→</span>
              </button>
              <a className="goals-outcomes__cta-secondary" href="#journey">
                How it works
              </a>
            </div>
          </div>

          <div className="goals-outcomes__visual">
            <div className="goals-outcomes__visual-bg" aria-hidden="true" />
            <div className="goals-outcomes__visual-grid" aria-hidden="true" />

            <img
              src={outcomesHero}
              alt="A smiling man viewing his personalized health progress on his phone"
              width={1277}
              height={1232}
              className="goals-outcomes__hero-img"
              draggable={false}
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 600 120"
              className="goals-outcomes__ekg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="goEkgFade" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#be9800" stopOpacity="0" />
                  <stop offset="20%" stopColor="#be9800" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#be9800" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M 0 60 L 80 60 L 100 60 L 115 30 L 130 90 L 145 45 L 160 60 L 260 60 L 280 60 L 295 25 L 310 95 L 325 50 L 340 60 L 460 60 L 480 60 L 495 40 L 510 80 L 525 60 L 600 60"
                fill="none"
                stroke="url(#goEkgFade)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="goals-outcomes__float goals-outcomes__float--rx">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "#111",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      fontStyle: "italic",
                    }}
                  >
                    Rx
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#8a8a8a",
                    }}
                  >
                    Protocol · 04
                  </span>
                </div>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#10b981",
                    boxShadow: "0 0 0 3px rgba(16,185,129,0.15)",
                  }}
                  aria-hidden="true"
                />
              </div>
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "#111" }}>
                Metabolic Reset
              </div>
              <div
                style={{
                  marginTop: 12,
                  height: 4,
                  borderRadius: 999,
                  background: "#f0ebe3",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "68%",
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #f3c300, #be9800)",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10.5,
                  color: "#5f5f5f",
                }}
              >
                <span>Week 8 of 12</span>
                <span style={{ fontWeight: 500, color: "#111" }}>On track</span>
              </div>
            </div>

            <div className="goals-outcomes__float goals-outcomes__float--stat">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#8a8a8a",
                  }}
                >
                  12 Weeks
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 5v14M5 12l7 7 7-7"
                    stroke="#be9800"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: "#111",
                  }}
                >
                  24
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>%</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13.5, fontWeight: 500, color: "#111" }}>
                Body Fat
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10.5,
                  color: "#5f5f5f",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: "#10b981",
                  }}
                  aria-hidden="true"
                />
                Verified · lab-measured
              </div>
            </div>

            <div className="goals-outcomes__float goals-outcomes__float--team">
              <div style={{ display: "flex" }}>
                {["#f3c300", "#8fa98f", "#111111"].map((color) => (
                  <span
                    key={color}
                    style={{
                      width: 28,
                      height: 28,
                      marginLeft: color === "#f3c300" ? 0 : -8,
                      borderRadius: 999,
                      border: "2px solid #fff",
                      background: color,
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#111" }}>Care team online</div>
                <div style={{ fontSize: 10, color: "#5f5f5f" }}>Avg reply · 4 min</div>
              </div>
            </div>

            <div className="goals-outcomes__float goals-outcomes__float--bio">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#8a8a8a",
                  }}
                >
                  Biomarkers
                </span>
                <span style={{ fontSize: 10, fontWeight: 500, color: "#059669" }}>↑ improving</span>
              </div>
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {BIOMARKERS.map((row) => (
                  <div key={row.k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 56, fontSize: 10.5, color: "#5f5f5f" }}>{row.k}</span>
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 999,
                        background: "#f0ebe3",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${row.w}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: "#111",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: 32,
                        textAlign: "right",
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#111",
                      }}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="goals-outcomes__spacer" />
      </div>
    </section>
  );
}
