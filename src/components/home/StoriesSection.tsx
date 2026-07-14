import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HOME_STORIES, type Testimonial } from "@/lib/testimonials";
import { STORIES_SECTION, TESTIMONIAL_NOTES } from "@/lib/stories-content";

const settle = [0.22, 1, 0.36, 1] as const;

function buildMarqueeRows(items: Testimonial[]) {
  return [
    {
      items,
      direction: "left" as const,
      speed: 48,
      label: "Patient reviews row one",
    },
    {
      items: [...items].reverse(),
      direction: "right" as const,
      speed: 54,
      label: "Patient reviews row two",
    },
  ];
}

function buildLoopItems(items: Testimonial[]): Testimonial[] {
  if (items.length === 0) return [];
  return [...items, ...items];
}

function StarRating() {
  return (
    <div className="tst-stars tst-stars--sm" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1.5l1.75 3.54 3.9.57-2.82 2.75.67 3.88L8 10.35l-3.5 1.84.67-3.88L2.35 5.6l3.9-.57L8 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(false);
  const [loopMotion, setLoopMotion] = useState(true);
  const chars = title.split("");

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
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} className="tst-title-reveal heading-01" aria-label={title}>
      <span className="tst-title-reveal-inner">
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="tst-title-char"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
              duration: 0.55,
              delay: 0.12 + i * 0.045,
              ease: settle,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
      <motion.span
        className="tst-title-rule"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={active ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.55, ease: settle }}
      >
        {loopMotion ? (
          <motion.span
            className="tst-title-rule-beam"
            initial={{ left: "-40%" }}
            animate={active ? { left: ["-40%", "110%"] } : {}}
            transition={{
              duration: 1.8,
              delay: 1.1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2.4,
            }}
          />
        ) : null}
      </motion.span>
    </h2>
  );
}

function AnimatedNote() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loopMotion, setLoopMotion] = useState(true);
  const [index, setIndex] = useState(0);

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
      { threshold: 0.4, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !loopMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIAL_NOTES.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [active, loopMotion]);

  return (
    <div ref={ref} className="tst-note" aria-live="polite">
      <motion.span
        className="tst-note-rule"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={active ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: settle }}
      >
        {loopMotion ? (
          <motion.span
            className="tst-note-rule-beam"
            initial={{ left: "-45%" }}
            animate={active ? { left: ["-45%", "115%"] } : {}}
            transition={{
              duration: 2,
              delay: 0.9,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2.2,
            }}
          />
        ) : null}
      </motion.span>

      <div className="tst-note-copy">
        <AnimatePresence mode="wait">
          <motion.p
            key={TESTIMONIAL_NOTES[index]}
            className="tst-note-text p2-regular"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: settle }}
          >
            {TESTIMONIAL_NOTES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReviewCard({ story }: { story: Testimonial }) {
  return (
    <article className="tst-marquee-card">
      <span className="tst-marquee-card-ring" aria-hidden="true" />
      <span className="tst-marquee-card-ring tst-marquee-card-ring--trace" aria-hidden="true" />

      {story.portraitImage ? (
        <div className="tst-marquee-media" aria-hidden="true">
          <img
            src={story.portraitImage}
            alt=""
            className={`tst-marquee-portrait tst-marquee-portrait--hero${
              story.figure === "man" ? " tst-marquee-portrait--man" : ""
            }`}
            loading="lazy"
          />
        </div>
      ) : null}

      <blockquote className="tst-marquee-quote">&ldquo;{story.quote}&rdquo;</blockquote>

      <footer className="tst-marquee-footer">
        <div className="tst-marquee-author">
          <strong>{story.name}</strong>
          <span>{story.condition}</span>
        </div>
        <div className="tst-marquee-footer-end">
          <StarRating />
          <span className="tst-marquee-verified">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M5 8.5l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verified
          </span>
        </div>
      </footer>
      {story.result ? <p className="tst-marquee-result">{story.result}</p> : null}
    </article>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
  label,
}: {
  items: Testimonial[];
  direction: "left" | "right";
  speed: number;
  label: string;
}) {
  const loop = buildLoopItems(items);

  return (
    <div
      className={`tst-marquee-row tst-marquee-row--${direction}`}
      style={{ "--tst-speed": `${speed}s` } as CSSProperties}
      aria-label={label}
    >
      <div className="tst-marquee-track">
        {loop.map((story, index) => (
          <ReviewCard key={`${direction}-${story.name}-${index}`} story={story} />
        ))}
      </div>
    </div>
  );
}

export function StoriesSection({
  items = HOME_STORIES,
  id = "stories",
  title = STORIES_SECTION.title,
}: {
  items?: Testimonial[];
  id?: string;
  title?: string;
} = {}) {
  const rows = useMemo(() => buildMarqueeRows(items), [items]);

  return (
    <section className="tst-sec" id={id} data-site-header-theme="light">
      <div className="tst-inner">
        <header className="tst-head">
          <SectionTitle title={title} />
        </header>
      </div>

      <div className="tst-marquee-shell">
        <div className="tst-marquee">
          {rows.map((row) => (
            <MarqueeRow
              key={row.label}
              items={row.items}
              direction={row.direction}
              speed={row.speed}
              label={row.label}
            />
          ))}
        </div>
      </div>

      <div className="tst-inner">
        <AnimatedNote />
      </div>
    </section>
  );
}
