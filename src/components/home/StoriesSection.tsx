import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HOME_STORIES, type Testimonial } from "@/lib/testimonials";
import { STORIES_SECTION, TESTIMONIAL_NOTES } from "@/lib/stories-content";

const settle = [0.22, 1, 0.36, 1] as const;

function buildMarqueeRows(items: Testimonial[]) {
  return [
    {
      items,
      direction: "left" as const,
      speed: 56,
      label: "Patient reviews row one",
    },
    {
      items: [...items].reverse(),
      direction: "right" as const,
      speed: 64,
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
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
  }, [reduceMotion]);

  return (
    <h2 ref={ref} className="tst-title-reveal heading-01">
      <motion.span
        className="tst-title-reveal-inner"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={active ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.55, ease: settle }}
      >
        {title}
      </motion.span>
      <motion.span
        className="tst-title-rule"
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        animate={active ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.2, ease: settle }}
      />
    </h2>
  );
}

function AnimatedNote() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loopMotion, setLoopMotion] = useState(true);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, [reduceMotion]);

  useEffect(() => {
    if (!active || !loopMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIAL_NOTES.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [active, loopMotion]);

  return (
    <div ref={ref} className="tst-note" aria-live="polite">
      <span className="tst-note-rule" aria-hidden="true" />

      <div className="tst-note-copy">
        <AnimatePresence mode="wait">
          <motion.p
            key={TESTIMONIAL_NOTES[index]}
            className="tst-note-text p2-regular"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: settle }}
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
      {story.portraitImage ? (
        <div className="tst-marquee-media" aria-hidden="true">
          <img
            src={story.portraitImage}
            alt=""
            className={`tst-marquee-portrait${
              story.figure === "man" ? " tst-marquee-portrait--man" : ""
            }`}
            loading="lazy"
            decoding="async"
            width={44}
            height={44}
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
  const loop = useMemo(() => buildLoopItems(items), [items]);

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
  const shellRef = useRef<HTMLDivElement>(null);
  const [marqueeActive, setMarqueeActive] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setMarqueeActive(Boolean(entry?.isIntersecting)),
      { rootMargin: "80px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="tst-sec" id={id} data-site-header-theme="light">
      <div className="tst-inner">
        <header className="tst-head">
          <SectionTitle title={title} />
        </header>
      </div>

      <div
        ref={shellRef}
        className={`tst-marquee-shell${marqueeActive ? " is-active" : ""}`}
      >
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
