import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { CategoryDefinition, CategorySlug, CategoryTimelineStep } from "@/lib/categories";

gsap.registerPlugin(ScrollTrigger);

type CategoryHowSectionProps = {
  category: CategoryDefinition;
  steps: readonly CategoryTimelineStep[];
  onStartIntake: () => void;
};

type PathCopy = {
  title: string;
  chips: readonly string[];
};

const PATH_COPY: Record<CategorySlug, PathCopy> = {
  "weight-loss": {
    title: "GLP-1 care, intake to pen.",
    chips: ["~5 min intake", "Licensed review", "Pre-dosed pen", "Discreet delivery"],
  },
  "metabolic-health": {
    title: "Metabolic care without the clinic wait.",
    chips: ["~5 min intake", "Doctor review", "Protocol set", "Pharmacy ship"],
  },
  testosterone: {
    title: "TRT with labs, review, and follow-through.",
    chips: ["Symptom intake", "Lab review", "Personalized Rx", "Discreet ship"],
  },
  longevity: {
    title: "Longevity protocols, physician-led.",
    chips: ["Goal intake", "Provider review", "Pen or Rx", "Cold-chain ship"],
  },
  performance: {
    title: "Performance care that clears medical review.",
    chips: ["Training intake", "Doctor review", "Matched protocol", "US pharmacy"],
  },
  recovery: {
    title: "Recovery care built around sleep and repair.",
    chips: ["~5 min intake", "Licensed review", "Repair protocol", "Plain packaging"],
  },
};

const titleEase = [0.22, 1, 0.36, 1] as const;
const chipEase = [0.34, 1.45, 0.64, 1] as const;

export function CategoryHowSection({ category, steps, onStartIntake }: CategoryHowSectionProps) {
  const copy = PATH_COPY[category.slug];
  const visibleSteps = useMemo(() => steps.slice(0, 4), [steps]);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin || visibleSteps.length === 0) return;

    const pick = (sel: string) =>
      gsap.utils.toArray<HTMLElement>(root.querySelectorAll(sel)).filter(Boolean);

    const beats = pick("[data-path-beat]");
    const dots = pick("[data-path-dot]");
    const thread = threadRef.current;
    const cursor = cursorRef.current;

    if (reduce) {
      gsap.set(beats, { clearProps: "all", opacity: 1, y: 0, filter: "none" });
      gsap.set(dots, { clearProps: "all", scale: 1, opacity: 1 });
      if (thread) gsap.set(thread, { scaleY: 1 });
      if (cursor) gsap.set(cursor, { top: "100%" });
      setActiveIndex(visibleSteps.length - 1);
      return;
    }

    let cancelled = false;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const setIndex = (index: number) => {
        const clamped = Math.max(0, Math.min(visibleSteps.length - 1, index));
        setActiveIndex(clamped);
      };

      mm.add("(min-width: 901px)", () => {
        gsap.set(beats, { opacity: 0.22, y: 48, filter: "blur(6px)" });
        gsap.set(dots, { scale: 0.65, opacity: 0.35 });
        if (thread) gsap.set(thread, { scaleY: 0, transformOrigin: "top center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 2.8, visibleSteps.length * window.innerHeight * 0.85)}`,
            pin: pin,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                visibleSteps.length - 1,
                Math.floor(self.progress * visibleSteps.length),
              );
              setIndex(idx);
            },
          },
        });

        visibleSteps.forEach((_, index) => {
          const beat = beats[index];
          const dot = dots[index];
          if (!beat) return;

          const segmentStart = index / visibleSteps.length;
          const segmentMid = (index + 0.55) / visibleSteps.length;

          tl.to(
            beat,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.22,
              ease: "power2.out",
            },
            segmentStart,
          ).to(
            beat,
            {
              opacity: index === visibleSteps.length - 1 ? 1 : 0.18,
              y: index === visibleSteps.length - 1 ? 0 : -24,
              filter: index === visibleSteps.length - 1 ? "blur(0px)" : "blur(4px)",
              duration: 0.18,
              ease: "power2.in",
            },
            segmentMid,
          );

          if (dot) {
            tl.to(
              dot,
              { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(2)" },
              segmentStart + 0.02,
            );
            if (index < visibleSteps.length - 1) {
              tl.to(dot, { scale: 0.75, opacity: 0.45, duration: 0.12 }, segmentMid);
            }
          }
        });

        if (thread) {
          tl.to(thread, { scaleY: 1, duration: 0.95, ease: "none" }, 0);
        }
        if (cursor) {
          tl.to(cursor, { top: "100%", duration: 0.95, ease: "none" }, 0);
        }
      });

      mm.add("(max-width: 900px)", () => {
        gsap.set(beats, { opacity: 0, y: 32 });
        gsap.set(dots, { scale: 1, opacity: 1 });
        if (thread) gsap.set(thread, { scaleY: 1 });

        beats.forEach((beat, index) => {
          gsap.to(beat, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 82%",
              once: true,
            },
            onComplete: () => setIndex(index),
          });
        });
      });
    }, root);

    requestAnimationFrame(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [visibleSteps, reduce]);

  const activeStep = visibleSteps[activeIndex] ?? visibleSteps[0];
  const titleWords = copy.title.split(" ");

  return (
    <section
      ref={rootRef}
      className="cat-path"
      id="cat-how"
      data-site-header-theme="light"
      aria-label="How care starts"
    >
      <div className="cat-path-ambient" aria-hidden="true">
        <span className="cat-path-grid" />
        <span className="cat-path-glow" />
      </div>

      <div className="cat-path-pin" ref={pinRef}>
        <div className="cat-path-inner">
          <div className="cat-path-layout">
            <aside className="cat-path-aside">
              <motion.p
                className="cat-path-kicker"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: titleEase }}
              >
                {category.kicker}
              </motion.p>

              <h2 className="cat-path-title" aria-label={copy.title}>
                {titleWords.map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    className="cat-path-title-word"
                    initial={reduce ? false : { opacity: 0, y: 28, rotateX: 40 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.55, delay: index * 0.06, ease: chipEase }}
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </h2>

              <ul className="cat-path-chips" aria-label="Care pathway">
                {copy.chips.map((chip, index) => (
                  <motion.li
                    key={chip}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.12 + index * 0.07, ease: titleEase }}
                    className={activeIndex === index ? "is-active" : undefined}
                  >
                    {chip}
                  </motion.li>
                ))}
              </ul>

              <div className="cat-path-live" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep?.step ?? "0"}
                    className="cat-path-live-inner"
                    initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.38, ease: titleEase }}
                  >
                    <span className="cat-path-live-index">{activeStep?.step}</span>
                    <span className="cat-path-live-duration">{activeStep?.duration}</span>
                    <strong className="cat-path-live-label">{activeStep?.label}</strong>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                className="cat-path-cta cat-btn cat-btn--primary"
                onClick={onStartIntake}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2, ease: titleEase }}
                whileHover={reduce ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                {category.ctaLabel}
              </motion.button>
            </aside>

            <div className="cat-path-runway">
              <div className="cat-path-rail" aria-hidden="true">
                <div className="cat-path-rail-track">
                  <div ref={threadRef} className="cat-path-rail-thread" />
                  <div ref={cursorRef} className="cat-path-rail-cursor" />
                </div>
                <ol className="cat-path-dots">
                  {visibleSteps.map((step, index) => (
                    <li key={step.step} data-path-dot className={activeIndex >= index ? "is-lit" : ""}>
                      <span>{step.step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <ol className="cat-path-beats">
                {visibleSteps.map((step) => (
                  <li key={step.step}>
                    <article className="cat-path-beat" data-path-beat>
                      <p className="cat-path-beat-duration">{step.duration}</p>
                      <h3 className="cat-path-beat-title">{step.label}</h3>
                      <p className="cat-path-beat-body">{step.detail}</p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
