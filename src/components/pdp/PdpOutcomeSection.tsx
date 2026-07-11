import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { usePdpData } from "./PdpDataProvider";
import { settle } from "./pdp-ui";

function OutcomePhrase({ phrase, index }: { phrase: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const reduceMotion = useReducedMotion();
  const fromX = index % 2 === 0 ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      className="pdp-outcome-full-row"
      initial={reduceMotion ? false : { opacity: 0, x: fromX, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.68, delay: index * 0.1, ease: settle }}
    >
      <motion.span
        className="pdp-outcome-full-index"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.08 + index * 0.1, ease: settle }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
      <motion.p
        className="pdp-outcome-full-phrase"
        initial={reduceMotion ? false : { opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.7, delay: 0.14 + index * 0.1, ease: settle }}
      >
        {phrase}
      </motion.p>
      <motion.span
        className="pdp-outcome-full-rule"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0.4 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.2 + index * 0.1, ease: settle }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export function PdpOutcomeSection() {
  const { outcomePhrases } = usePdpData();
  const headRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.55 });
  const titleInView = useInView(titleRef, { once: true, amount: 0.65 });
  const reduceMotion = useReducedMotion();
  const titleWords = "Who this is for".split(" ");

  return (
    <section className="pdp-outcome-full" id="outcome" data-pdp-header-theme="light">
      <div className="pdp-outcome-full-inner">
        <div className="pdp-outcome-full-head" ref={headRef}>
          <motion.span
            className="pdp-kicker"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: settle }}
          >
            Built for you
          </motion.span>
          <h2 className="pdp-outcome-full-title" ref={titleRef}>
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block"
                initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={titleInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.55, delay: index * 0.07, ease: settle }}
              >
                {word}
                {index < titleWords.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))}
          </h2>
        </div>

        <div className="pdp-outcome-full-list">
          {outcomePhrases.map((phrase, index) => (
            <OutcomePhrase key={phrase} phrase={phrase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
