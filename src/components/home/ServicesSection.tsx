import { useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
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
    body: "Quieter food noise. Steadier progress.",
  },
  "metabolic-health": {
    title: "Metabolic",
    body: "Energy that lasts past 3PM.",
  },
  testosterone: {
    title: "Testosterone",
    body: "Drive, strength, mornings back.",
  },
  longevity: {
    title: "Longevity",
    body: "More life in your years.",
  },
  performance: {
    title: "Performance",
    body: "Work. Recover. Keep pace.",
  },
  recovery: {
    title: "Recovery",
    body: "Repair is part of the work.",
  },
};

const GOAL_IMAGES: Record<CategorySlug, string> = {
  "weight-loss": "/goals/weight-loss.png",
  "metabolic-health": "/goals/metabolic.png",
  testosterone: "/goals/testosterone.png",
  longevity: "/goals/longevity.png",
  performance: "/goals/performance.png",
  recovery: "/goals/recovery.png",
};

function buildGoals(): GoalCard[] {
  return CATEGORY_SLUGS.map((slug) => ({
    slug,
    title: GOAL_COPY[slug].title,
    body: GOAL_COPY[slug].body,
    image: GOAL_IMAGES[slug],
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

export function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const goals = buildGoals();

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".goals-outcomes__card");
    if (!card) return;
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = card.offsetWidth + gap;
    if (step <= 0) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = Math.round(el.scrollLeft / step) * step + step * dir;
    el.scrollTo({ left: Math.max(0, Math.min(max, next)), behavior: "smooth" });
  };

  return (
    <section className="goals-outcomes" id="services" aria-label="Care pathways and outcomes">
      {/* Pick your goal */}
      <div
        className="goals-outcomes__goals"
        data-site-header-theme="light"
      >
        <div className="goals-outcomes__inner goals-outcomes__inner--valve">
          <div className="goals-outcomes__valve">
            <h2 className="goals-outcomes__title goals-outcomes__title--plaque">
              <span>Pick</span>
              <span>your</span>
              <span>goal.</span>
            </h2>

            <div className="goals-outcomes__scroller-wrap goals-outcomes__scroller-wrap--from-title">
              <div className="goals-outcomes__scroller" ref={scrollerRef}>
                {goals.map((goal, index) => (
                  <Link
                    key={goal.slug}
                    to="/category/$slug"
                    params={{ slug: goal.slug }}
                    className="goals-outcomes__card"
                    style={{ "--goal-i": index } as CSSProperties}
                  >
                    <div className="goals-outcomes__card-media">
                      <img src={goal.image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <span className="goals-outcomes__card-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
          </div>
        </div>

        <div className="goals-outcomes__nav" aria-label="Goal carousel controls">
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

        <TreatmentDisclosure />
      </div>
    </section>
  );
}
