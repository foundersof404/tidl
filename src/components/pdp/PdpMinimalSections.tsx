import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePdpData } from "./PdpDataProvider";
import { Reveal, settle } from "./pdp-ui";

type StartProps = { onStart: (e: MouseEvent) => void };

const WEIGHT_LOSS_DONE_PHRASES = [
  "You’re done starting over every Monday",
  "You’re done hiding from photos",
  "You’re done sitting out dates",
  "You’re done feeling rejected before you walk in",
  "You’re done of eating when you’re not even hungry",
  "You’re done of feeling lazy in your own body",
  "You’re done of clothes that don’t feel like you",
  "You’re done waiting to feel like yourself again",
] as const;

/** Emotional tickers — goal-aware “this is me” recognition, left → right. */
export function PdpUnderstandSection() {
  const { goal, marketing } = usePdpData();

  const phrases =
    marketing?.painPoints?.length
      ? [...marketing.painPoints]
      : goal === "weight-loss"
        ? [...WEIGHT_LOSS_DONE_PHRASES]
        : ["You’re ready for care that matches your goals"];

  const loop = [...phrases, ...phrases];

  return (
    <section className="hm-section hm-understand hm-understand--marquee" id="understand" data-pdp-header-theme="light">
      <div className="hm-shell hm-understand-head">
        <Reveal>
          <h2 className="hm-h2">This is you talking</h2>
        </Reveal>
      </div>

      <div className="hm-done-marquee" aria-label="Things you’re done with">
        <div className="hm-done-track">
          {loop.map((phrase, i) => (
            <span key={`${phrase}-${i}`} className="hm-done-item">
              <span className="hm-done-text">{phrase}</span>
              <span className="hm-done-dot" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Connected care path — four related steps around your peptide protocol. */
export function PdpHowItWorks(_props: StartProps) {
  const { heroImage } = usePdpData();
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      n: "01",
      verb: "Assess",
      whisper: "Five honest minutes on what you want to change.",
      image: "/pdp/how/assess.png",
    },
    {
      n: "02",
      verb: "Prescribe",
      whisper: "A licensed provider reviews you — only if it’s right.",
      image: "/pdp/how/prescribe.png",
    },
    {
      n: "03",
      verb: "Ship",
      whisper: "Your peptide protocol arrives discreet, pharmacy-set.",
      image: heroImage || "/pdp/how/ship.png",
    },
    {
      n: "04",
      verb: "Begin",
      whisper: "Clear guidance. Ongoing care. Keep going.",
      image: "/pdp/how/begin.png",
    },
  ] as const;

  return (
    <section className="hm-section hm-how hm-how--related" id="how" data-pdp-header-theme="light">
      <div className="hm-shell hm-how-related-head">
        <Reveal>
          <h2 className="hm-h2">How it works</h2>
          <p className="hm-lede">One path. Four connected steps. Your peptide care, start to finish.</p>
        </Reveal>
      </div>

      <ol className="hm-how-related">
        {steps.map((step, index) => (
          <motion.li
            key={step.n}
            className="hm-how-related-card"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: settle }}
          >
            <div className="hm-how-related-media">
              <img src={step.image} alt="" loading="lazy" />
            </div>
            <span className="hm-how-related-num">{step.n}</span>
            <h3>{step.verb}</h3>
            <p>{step.whisper}</p>
            {index < steps.length - 1 ? (
              <span className="hm-how-related-link" aria-hidden="true" />
            ) : null}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

