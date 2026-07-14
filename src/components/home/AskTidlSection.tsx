import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ASK_TIDL_ANSWERS,
  ASK_TIDL_FALLBACK,
  ASK_TIDL_PLACEHOLDER_QS,
  ASK_TIDL_PROMPTS,
  ASK_TIDL_SECTION,
} from "@/lib/ask-tidl-content";

export type AskTidlSectionHandle = {
  focusInput: () => void;
};

const BOT_CYCLE_MS = 6000;
const BOT_VISIBLE_START = 0.08 * BOT_CYCLE_MS;
const BOT_VISIBLE_END = 0.55 * BOT_CYCLE_MS;

function AskTidlBot({ reduce }: { reduce: boolean }) {
  const reactId = useId().replace(/:/g, "");
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    if (reduce) return;

    let waveOn: ReturnType<typeof setTimeout> | undefined;
    let waveOff: ReturnType<typeof setTimeout> | undefined;

    const runCycle = () => {
      waveOn = setTimeout(() => setWaving(true), BOT_VISIBLE_START);
      waveOff = setTimeout(() => setWaving(false), BOT_VISIBLE_END);
    };

    runCycle();
    const interval = setInterval(runCycle, BOT_CYCLE_MS);

    return () => {
      clearInterval(interval);
      if (waveOn) clearTimeout(waveOn);
      if (waveOff) clearTimeout(waveOff);
    };
  }, [reduce]);

  const g = (name: string) => `ask-bot-${name}-${reactId}`;

  return (
    <div
      className={`ask-bot-wrap${waving ? " is-waving" : ""}${reduce ? " is-static" : ""}`}
      id="askTidlBot"
      aria-hidden="true"
    >
      <svg viewBox="0 0 52 64" fill="none">
        <defs>
          <linearGradient id={g("head")} x1="10" y1="12" x2="42" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A2620" />
            <stop offset="100%" stopColor="#0E0C08" />
          </linearGradient>
          <linearGradient id={g("body")} x1="13" y1="36" x2="39" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD950" />
            <stop offset="45%" stopColor="#F3C300" />
            <stop offset="100%" stopColor="#BE9800" />
          </linearGradient>
          <linearGradient id={g("arm")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3C300" />
            <stop offset="100%" stopColor="#BE9800" />
          </linearGradient>
          <radialGradient id={g("eye")} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF7CC" />
            <stop offset="55%" stopColor="#F3C300" />
            <stop offset="100%" stopColor="#BE9800" />
          </radialGradient>
          <radialGradient id={g("core")} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFFDF6" />
            <stop offset="60%" stopColor="#F3C300" />
            <stop offset="100%" stopColor="#BE9800" />
          </radialGradient>
          <radialGradient id={g("tip")} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFF7CC" />
            <stop offset="60%" stopColor="#F3C300" />
            <stop offset="100%" stopColor="#BE9800" />
          </radialGradient>
          <filter id={g("soft")} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={g("drop")} x="-40%" y="-20%" width="180%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        <ellipse cx="26" cy="60" rx="15" ry="3" fill="#000000" opacity="0.12" />

        <g filter={`url(#${g("drop")})`}>
          <line x1="26" y1="4" x2="26" y2="12" stroke="#BE9800" strokeWidth="2" />
          <circle cx="26" cy="3.2" r="3.4" fill={`url(#${g("tip")})`} filter={`url(#${g("soft")})`} />

          <rect x="10" y="12" width="32" height="24" rx="9" fill={`url(#${g("head")})`} />
          <path
            d="M14 16c4-2 10-3 16-2"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <rect x="13.5" y="19" width="25" height="11" rx="5.5" fill="#0A0906" opacity="0.9" />
          <circle cx="19.5" cy="24.5" r="3.6" fill={`url(#${g("eye")})`} filter={`url(#${g("soft")})`} />
          <circle cx="32.5" cy="24.5" r="3.6" fill={`url(#${g("eye")})`} filter={`url(#${g("soft")})`} />

          <rect x="13" y="36" width="26" height="20" rx="8" fill={`url(#${g("body")})`} />
          <path
            d="M16 39c4-1.4 16-1.4 20 0"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="26" cy="46" r="3.6" fill={`url(#${g("core")})`} filter={`url(#${g("soft")})`} />

          <g className="ask-bot-arm ask-bot-arm--left">
            <rect x="8" y="39" width="7" height="14" rx="3.5" fill={`url(#${g("arm")})`} />
          </g>
          <g className="ask-bot-arm ask-bot-arm--right">
            <rect x="37" y="39" width="7" height="14" rx="3.5" fill={`url(#${g("arm")})`} />
          </g>
        </g>
      </svg>
    </div>
  );
}

const ORBS = [
  { className: "ask-orb ask-orb--a", delay: 0 },
  { className: "ask-orb ask-orb--b", delay: 1.2 },
  { className: "ask-orb ask-orb--c", delay: 2.4 },
  { className: "ask-orb ask-orb--d", delay: 0.6 },
  { className: "ask-orb ask-orb--e", delay: 1.8 },
] as const;

const NODES = Array.from({ length: 14 }, (_, i) => i);

function AskAmbient({ reduce }: { reduce: boolean }) {
  return (
    <div className="ask-ambient" aria-hidden="true">
      <div className="ask-ambient-wash ask-ambient-wash--top" />
      <div className="ask-ambient-wash ask-ambient-wash--right" />
      <div className="ask-ambient-wash ask-ambient-wash--bottom" />
      <div className="ask-ambient-mesh" />
      <div className="ask-ambient-ring ask-ambient-ring--tl" />
      <div className="ask-ambient-ring ask-ambient-ring--br" />

      {!reduce ? (
        <>
          <div className="ask-ambient-beam ask-ambient-beam--top" />
          <div className="ask-ambient-beam ask-ambient-beam--right" />
          <div className="ask-ambient-rise" />
          {ORBS.map((orb) => (
            <span key={orb.className} className={orb.className} style={{ animationDelay: `${orb.delay}s` }} />
          ))}
          <div className="ask-ambient-nodes">
            {NODES.map((i) => (
              <span key={i} className={`ask-node ask-node--${i + 1}`} />
            ))}
          </div>
          <svg className="ask-ambient-paths" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path className="ask-path ask-path--1" d="M-40 180 C 220 40, 420 320, 640 210 S 980 40, 1240 160" />
            <path className="ask-path ask-path--2" d="M-40 420 C 180 520, 380 280, 620 390 S 940 560, 1240 430" />
            <path className="ask-path ask-path--3" d="M-40 640 C 260 560, 480 720, 720 610 S 1020 500, 1240 680" />
          </svg>
        </>
      ) : null}
    </div>
  );
}

export const AskTidlSection = forwardRef<AskTidlSectionHandle>(function AskTidlSection(_, ref) {
  const reduceMotion = useReducedMotion();
  const [askInput, setAskInput] = useState("");
  const [askFocused, setAskFocused] = useState(false);
  const [askPlaceholder, setAskPlaceholder] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [askThinking, setAskThinking] = useState(false);
  const [askDisplayed, setAskDisplayed] = useState("");
  const [inView, setInView] = useState(false);

  const askInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const ansTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ansTyperRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => askInputRef.current?.focus(),
  }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAskPlaceholder(ASK_TIDL_SECTION.placeholder);
      return;
    }

    let qi = 0;
    let ci = 0;
    let del = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function type() {
      const q = ASK_TIDL_PLACEHOLDER_QS[qi];
      setAskPlaceholder(q.slice(0, ci));
      if (!del) {
        ci++;
        if (ci > q.length) {
          del = true;
          timeoutId = setTimeout(type, 1700);
          return;
        }
      } else {
        ci--;
        if (ci < 0) {
          del = false;
          ci = 0;
          qi = (qi + 1) % ASK_TIDL_PLACEHOLDER_QS.length;
        }
      }
      timeoutId = setTimeout(type, del ? 24 : 44);
    }

    timeoutId = setTimeout(type, 44);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (ansTimerRef.current) clearTimeout(ansTimerRef.current);
      if (ansTyperRef.current) clearInterval(ansTyperRef.current);
    };
  }, []);

  const handleAsk = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setActiveQuestion(trimmed);
    setAskThinking(true);
    setAskDisplayed("");

    if (ansTimerRef.current) clearTimeout(ansTimerRef.current);
    if (ansTyperRef.current) clearInterval(ansTyperRef.current);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = ASK_TIDL_ANSWERS[trimmed] || ASK_TIDL_FALLBACK;

    ansTimerRef.current = setTimeout(() => {
      setAskThinking(false);
      if (reduce) {
        setAskDisplayed(full);
        return;
      }

      let i = 0;
      ansTyperRef.current = setInterval(() => {
        i++;
        setAskDisplayed(full.slice(0, i));
        if (i >= full.length && ansTyperRef.current) clearInterval(ansTyperRef.current);
      }, 12);
    }, 720);
  }, []);

  const reveal = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section
      ref={sectionRef}
      className={`ask-tidl-wrap${inView ? " ask-tidl-wrap--live" : ""}`}
      data-site-header-theme="light"
      id="askTidl"
    >
      <AskAmbient reduce={!!reduceMotion} />

      <div className="ask-tidl">
        <motion.header
          className="ask-tidl-head"
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
          }}
        >
          <motion.p className="ask-kicker" variants={reveal}>
            <span className="ask-kicker-dot" aria-hidden="true" />
            {ASK_TIDL_SECTION.kicker}
          </motion.p>
          <motion.h2 className="ask-h heading-01" variants={reveal}>
            {ASK_TIDL_SECTION.titleLine1}
            <br />
            <em>{ASK_TIDL_SECTION.titleEmphasis}</em>
          </motion.h2>
        </motion.header>

        <motion.div
          className="ask-tidl-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.75, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AskTidlBot reduce={!!reduceMotion} />

          <div className="ask-panel">
            <div className="ask-panel-mesh" aria-hidden="true" />

            <div className="ask-panel-top">
              <div className="ask-panel-brand">
                <span className="ask-panel-brand-name">✦ Ask TIDL</span>
                <span className="ask-panel-brand-meta">Clinical knowledge, powered by AI</span>
              </div>
              <div className="ask-panel-live" aria-live="polite">
                <span className="ask-panel-live-dot" aria-hidden="true" />
                {ASK_TIDL_SECTION.statusLabel}
              </div>
            </div>

            <div className="ask-panel-main">
              <div className={`ask-composer${askFocused ? " focus" : ""}${askInput.trim() ? " filled" : ""}`}>
                <input
                  ref={askInputRef}
                  className="ask-composer-input"
                  id="askIn"
                  type="text"
                  aria-label="Ask TIDL anything"
                  placeholder={askPlaceholder}
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  onFocus={() => setAskFocused(true)}
                  onBlur={() => setAskFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAsk(askInput);
                  }}
                />
                <button
                  type="button"
                  className="ask-composer-go"
                  aria-label="Submit question"
                  onClick={() => handleAsk(askInput)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h12M13 7l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="ask-suggest" aria-label="Suggested questions">
                <span className="ask-suggest-label">Try</span>
                <div className="ask-suggest-list">
                  {ASK_TIDL_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`ask-suggest-item${activeQuestion === q ? " active" : ""}`}
                      onClick={() => {
                        setAskInput(q);
                        handleAsk(q);
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`ask-reply${activeQuestion ? " open" : ""}`}
                aria-live="polite"
                aria-hidden={!activeQuestion}
              >
                {activeQuestion ? (
                  <div className="ask-reply-q">
                    <span className="ask-reply-tag">You asked</span>
                    <p>{activeQuestion}</p>
                  </div>
                ) : null}
                <div className={`ask-reply-progress${askThinking ? " on" : ""}`} aria-hidden="true" />
                <div className="ask-reply-body">
                  <span className="ask-reply-tag">TIDL</span>
                  <p className={`ask-reply-text${askDisplayed || askThinking ? " on" : ""}`}>
                    {askDisplayed}
                    {askThinking ? <span className="ask-cursor" aria-hidden="true" /> : null}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="ask-note">{ASK_TIDL_SECTION.disclaimer}</p>
      </div>
    </section>
  );
});
