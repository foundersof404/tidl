import { type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { usePdpData } from "./PdpDataProvider";
import { settle } from "./pdp-ui";

type PdpBeforeAfterSectionProps = {
  onStart: (e: MouseEvent) => void;
};

const TECH_STRIP = [
  { k: "Active", v: "Tirzepatide GLP-1/GIP" },
  { k: "Rhythm", v: "Weekly protocol" },
  { k: "Care", v: "Provider-guided" },
  { k: "Form", v: "Peptide protocol" },
] as const;

/** Life-shift — title + slider only; tech strip underneath. Weight-loss only. */
export function PdpBeforeAfterSection({ onStart }: PdpBeforeAfterSectionProps) {
  const { goal } = usePdpData();
  const reduceMotion = useReducedMotion();

  if (goal !== "weight-loss") return null;

  return (
    <section className="pdp-shift pdp-shift--v2" id="life-shift" data-pdp-header-theme="light">
      <div className="pdp-shift-inner pdp-shift-inner--wide">
        <motion.header
          className="pdp-shift-head"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: settle }}
        >
          <h2 className="pdp-shift-title pdp-shift-title--plain">Feel like you again</h2>
        </motion.header>

        <motion.div
          className="pdp-shift-stage pdp-shift-stage--solo"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: settle }}
        >
          <div className="pdp-shift-stage-core">
            <BeforeAfterSlider
              className="pdp-shift-slider"
              beforeSrc="/pdp/patient-before.png"
              afterSrc="/pdp/AFTER.png"
              showLabels={false}
              showHint={false}
            />
          </div>
        </motion.div>

        <div className="pdp-shift-tech" aria-label="Treatment details">
          {TECH_STRIP.map((item) => (
            <div key={item.k} className="pdp-shift-tech-item">
              <span>{item.k}</span>
              <strong>{item.v}</strong>
            </div>
          ))}
        </div>

        <p className="pdp-shift-disclaimer">
          *Illustrative patient journey. Individual results vary. Prescription required.
        </p>

        <motion.div
          className="pdp-shift-cta"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: settle }}
        >
          <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
            Take the 5-minute quiz
          </button>
        </motion.div>
      </div>
    </section>
  );
}
