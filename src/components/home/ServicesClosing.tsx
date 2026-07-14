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
