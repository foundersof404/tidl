import { type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePdpData } from "./PdpDataProvider";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { settle } from "./pdp-ui";

const LEFT_MESSAGES = [
  "Sitting out dating",
  "Hiding from photos",
  "Starting over every Monday",
] as const;

const RIGHT_MESSAGES = [
  "Saying yes to plans",
  "Clothes that feel like you",
  "A protocol you can keep",
] as const;

type PdpBeforeAfterSectionProps = {
  onStart: (e: MouseEvent) => void;
};

/** Life-shift section — slider flanked by before/after messages. */
export function PdpBeforeAfterSection({ onStart }: PdpBeforeAfterSectionProps) {
  const { heroProduct } = usePdpData();
  const reduceMotion = useReducedMotion();

  return (
    <section className="pdp-shift pdp-shift--v2" id="life-shift" data-pdp-header-theme="light">
      <div className="pdp-shift-inner">
        <motion.header
          className="pdp-shift-head"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: settle }}
        >
          <span className="pdp-kicker">Before / After</span>
          <h2 className="pdp-shift-title">
            Before the plan.
            <span> After momentum.</span>
          </h2>
          <p className="pdp-shift-lead">
            Showing up in your life again — with {heroProduct.name} under licensed provider care.
          </p>
        </motion.header>

        <motion.div
          className="pdp-shift-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: settle }}
        >
          <aside className="pdp-shift-flank pdp-shift-flank--before">
            <span className="pdp-shift-flank-label">Before</span>
            {LEFT_MESSAGES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </aside>

          <BeforeAfterSlider
            className="pdp-shift-slider"
            beforeSrc="/pdp/patient-before.png"
            afterSrc="/pdp/AFTER.png"
            beforeLabel="Before"
            afterLabel="After"
          />

          <aside className="pdp-shift-flank pdp-shift-flank--after">
            <span className="pdp-shift-flank-label">After</span>
            {RIGHT_MESSAGES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </aside>
        </motion.div>

        <motion.div
          className="pdp-shift-cta"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: settle }}
        >
          <p>Five-minute intake. A licensed provider reviews your plan before anything ships.</p>
          <a href="#get-started" className="pdp-shift-btn" onClick={onStart}>
            Start your free assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
