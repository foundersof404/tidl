import { motion, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";
import { usePdpData } from "./PdpDataProvider";

type PdpTransformationSectionProps = {
  onStart: (e?: MouseEvent) => void;
};

/** Short emotional beat — one headline, one line, one CTA. */
export function PdpTransformationSection({ onStart }: PdpTransformationSectionProps) {
  const { marketing } = usePdpData();
  const reduce = useReducedMotion();
  if (!marketing) return null;

  return (
    <section className="pdp-manifesto pdp-manifesto--simple" id="transform" data-pdp-header-theme="light">
      <motion.div
        className="pdp-manifesto-simple"
        initial={reduce ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="pdp-manifesto-kicker">This is you</p>
        <h2>{marketing.emotionalHeadline}</h2>
        <p className="pdp-manifesto-sub">{marketing.emotionalSub}</p>
        <p className="pdp-manifesto-dream">{marketing.dream}</p>
        <button type="button" className="pdp-campaign-cta" onClick={onStart}>
          Start my intake
        </button>
      </motion.div>
    </section>
  );
}
