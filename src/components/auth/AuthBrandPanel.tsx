import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { SITE_IMAGES } from "@/lib/site-assets";

export type AuthMode = "signin" | "signup";

type AuthBrandPanelProps = {
  mode: AuthMode;
};

export function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
  const reduce = useReducedMotion();

  return (
    <aside className="auth-brand" aria-label="TIDL brand">
      <motion.img
        className="auth-brand-photo"
        src={SITE_IMAGES.auth.brand}
        alt="Elite runner mid-stride across a mountain ridge above the clouds at sunrise"
        initial={reduce ? false : { scale: 1.06, opacity: 0.72 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="auth-brand-grade" aria-hidden="true" />
      <div className="auth-brand-bloom" aria-hidden="true" />
      <div className="auth-brand-haze" aria-hidden="true" />
      <div className="auth-brand-grain" aria-hidden="true" />
      <div className="auth-brand-vignette" aria-hidden="true" />

      {!reduce ? (
        <div className="auth-brand-particles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <div className="auth-brand-chrome">
        <Link to="/" className="auth-brand-mark" aria-label="TIDL home">
          <img src="/tidl_logo.png" alt="" />
          <span>TIDL</span>
        </Link>
        <Link to="/" className="auth-brand-exit">
          Return
        </Link>
      </div>

      <motion.div
        className="auth-brand-story"
        initial={reduce ? false : { opacity: 0, x: -28, y: -22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.35, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="auth-brand-eyebrow"
          initial={reduce ? false : { opacity: 0, x: -16, y: -12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.48, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Performance membership
        </motion.p>
        <motion.p
          className="auth-brand-line"
          initial={reduce ? false : { opacity: 0, x: -20, y: -14 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.62, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {mode === "signin"
            ? "Quiet power. Measured progress."
            : "Begin where excellence is the baseline."}
        </motion.p>
      </motion.div>
    </aside>
  );
}
