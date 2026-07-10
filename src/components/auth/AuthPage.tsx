import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthBrandPanel, type AuthMode } from "./AuthBrandPanel";
import "./auth.css";

export type { AuthMode };

type AuthPageProps = {
  initialMode?: AuthMode;
};

const EMAIL_DEMO = "alex@tidl.health";

function useTypewriterLoop(text: string, enabled: boolean) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!enabled) {
      setOutput("");
      return;
    }

    let i = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      if (!deleting) {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
        timer = window.setTimeout(tick, 72 + Math.random() * 40);
        return;
      }

      i -= 1;
      setOutput(text.slice(0, Math.max(i, 0)));
      if (i <= 0) {
        deleting = false;
        timer = window.setTimeout(tick, 700);
        return;
      }
      timer = window.setTimeout(tick, 38 + Math.random() * 24);
    };

    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [enabled, text]);

  return output;
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 8s2.5-4.5 6.5-4.5c1.1 0 2.1.3 2.9.7M14.5 8s-1 1.8-2.8 3.1M2.5 2.5l11 11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.4 8.4c0-1.7 1.4-2.5 1.4-2.5-.8-1.1-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6-.5 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.7 2.2 1.7.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.8 2.2-1.6.4-.6.7-1.2.9-1.8-2.1-.8-2.1-3.1-2.1-3.2ZM10.5 3.6c.5-.6.8-1.4.7-2.2-.7.1-1.6.5-2.1 1.1-.5.5-.9 1.3-.8 2.1.8.1 1.6-.4 2.2-1Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M9 7.2v3.5h4.9c-.2 1.1-.8 2-1.7 2.6l2.8 2.1c1.6-1.5 2.6-3.7 2.6-6.3 0-.6-.1-1.2-.2-1.8H9z"
      />
      <path
        fill="#34A853"
        d="M4.1 10.7l-.7.5-2.4 1.8C2.5 15.4 5.5 17.5 9 17.5c2.4 0 4.4-.8 5.9-2.1l-2.8-2.1c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8z"
      />
      <path
        fill="#4A90E2"
        d="M1 4.9C.4 6.1 0 7.5 0 9s.4 2.9 1 4.1l3.1-2.4C3.8 9.9 3.6 9.5 3.6 9c0-.5.2-.9.4-1.3L1 4.9z"
      />
      <path
        fill="#FBBC05"
        d="M9 3.5c1.3 0 2.5.5 3.4 1.3l2.5-2.5C13.4.9 11.4 0 9 0 5.5 0 2.5 2.1 1 5l3.1 2.4C4.6 5.1 6.6 3.5 9 3.5z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 1.2 9.8 2.7v2.8c0 2.4-1.6 3.9-3.8 4.7C3.8 9.4 2.2 7.9 2.2 5.5V2.7L6 1.2Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function AthleteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="2.4" r="1.2" stroke="currentColor" strokeWidth="1" />
      <path
        d="M3.2 10.5 4.4 6.2 6 7.4l1.6-1.2 1.2 4.3M4.4 6.2 2.8 4.8M7.6 6.2l1.6-1.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConciergeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.2 7.2V5.4a3.8 3.8 0 0 1 7.6 0v1.8M2.2 7.2h1.4v2.2H2.2V7.2Zm6.2 0h1.4v2.2H8.4V7.2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LineField({
  label,
  children,
  trailing,
  ghost,
  forceActive = false,
}: {
  label: string;
  children: ReactNode;
  trailing?: ReactNode;
  ghost?: string;
  forceActive?: boolean;
}) {
  return (
    <label className={`auth-line-field${forceActive || Boolean(ghost) ? " is-active" : ""}`}>
      {children}
      <span className="auth-line-label">{label}</span>
      {ghost !== undefined ? (
        <span className="auth-line-ghost" aria-hidden="true">
          {ghost}
          <span className="auth-line-caret" />
        </span>
      ) : null}
      <span className="auth-line-bar" aria-hidden="true" />
      {trailing}
    </label>
  );
}

export function AuthPage({ initialMode = "signin" }: AuthPageProps) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const emailDemoEnabled = !reduce && !emailFocused && emailValue.length === 0;
  const emailGhost = useTypewriterLoop(EMAIL_DEMO, emailDemoEnabled);

  const copy = useMemo(
    () =>
      mode === "signin"
        ? {
            title: "Welcome back.",
            lead: "Continue your pursuit of better performance.",
            submit: "Continue",
            switchPrompt: "New to the membership?",
            switchAction: "Request access",
          }
        : {
            title: "Begin membership.",
            lead: "Enter the ecosystem built for measured excellence.",
            submit: "Continue",
            switchPrompt: "Already a member?",
            switchAction: "Sign in",
          },
    [mode],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(
      mode === "signin"
        ? "Sign-in is design-only for now — authentication wiring comes next."
        : "Membership creation is design-only for now — authentication wiring comes next.",
    );
  }

  function socialToast() {
    setToast("Social sign-in is design-only for now — coming with auth wiring.");
  }

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="auth-page" data-site-header-theme="dark">
      <div className="auth-stage">
        <AuthBrandPanel mode={mode} />

        <main className="auth-panel">
          <div className="auth-panel-atmosphere" aria-hidden="true">
            <div className="auth-panel-bleed" />
            <div className="auth-panel-orb auth-panel-orb--a" />
            <div className="auth-panel-orb auth-panel-orb--b" />
            <div className="auth-panel-noise" />
            <div className="auth-panel-vignette" />
            {!reduce ? (
              <div className="auth-panel-particles">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          <motion.div
            className="auth-glass"
            style={{
              backdropFilter: "blur(24px) saturate(1.15)",
              WebkitBackdropFilter: "blur(24px) saturate(1.15)",
            }}
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, ease, delay: 0.15 }}
          >
            <div className="auth-glass-sheen" aria-hidden="true" />

            <div className="auth-glass-head">
              <div className="auth-glass-brand">
                <img src="/tidl_logo.png" alt="" />
                <span>TIDL</span>
              </div>
              <p className="auth-glass-kicker">Performance membership</p>
            </div>

            <div className="auth-mode" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                className={`auth-mode-btn${mode === "signin" ? " is-active" : ""}`}
                onClick={() => {
                  setMode("signin");
                  setToast(null);
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`auth-mode-btn${mode === "signup" ? " is-active" : ""}`}
                onClick={() => {
                  setMode("signup");
                  setToast(null);
                }}
              >
                Join
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
              >
                <h1 className="auth-title">{copy.title}</h1>
                <p className="auth-lead">{copy.lead}</p>

                <form className="auth-form" onSubmit={onSubmit} noValidate>
                  {mode === "signup" ? (
                    <div className="auth-field-row">
                      <LineField label="First name">
                        <input
                          name="firstName"
                          autoComplete="given-name"
                          placeholder=" "
                        />
                      </LineField>
                      <LineField label="Last name">
                        <input
                          name="lastName"
                          autoComplete="family-name"
                          placeholder=" "
                        />
                      </LineField>
                    </div>
                  ) : null}

                  <LineField
                    label="Email"
                    ghost={emailDemoEnabled ? emailGhost : undefined}
                    forceActive={emailFocused || emailValue.length > 0 || emailDemoEnabled}
                  >
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder=" "
                      required
                      value={emailValue}
                      onChange={(event) => setEmailValue(event.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </LineField>

                  <LineField
                    label="Password"
                    trailing={
                      <button
                        type="button"
                        className="auth-eye"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    }
                  >
                    <input
                      className="auth-input--password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      placeholder=" "
                      required
                    />
                  </LineField>

                  {mode === "signin" ? (
                    <div className="auth-form-meta">
                      <button type="button" className="auth-text-btn">
                        Forgot password?
                      </button>
                    </div>
                  ) : null}

                  <motion.button
                    type="submit"
                    className="auth-submit"
                    whileHover={reduce ? undefined : { y: -1 }}
                    whileTap={reduce ? undefined : { scale: 0.985 }}
                  >
                    <span>{copy.submit}</span>
                    <ArrowIcon />
                  </motion.button>
                </form>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <div className="auth-social">
                  <button type="button" className="auth-social-btn" onClick={socialToast}>
                    <AppleIcon />
                    Apple
                  </button>
                  <button type="button" className="auth-social-btn" onClick={socialToast}>
                    <GoogleIcon />
                    Google
                  </button>
                </div>

                <p className="auth-footnote">
                  {copy.switchPrompt}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setToast(null);
                    }}
                  >
                    {copy.switchAction}
                  </button>
                </p>

                <ul className="auth-trust">
                  <li>
                    <ShieldIcon />
                    End-to-end encrypted
                  </li>
                  <li>
                    <AthleteIcon />
                    Trusted by elite athletes
                  </li>
                  <li>
                    <ConciergeIcon />
                    24/7 concierge support
                  </li>
                </ul>

                <AnimatePresence>
                  {toast ? (
                    <motion.p
                      className="auth-toast"
                      role="status"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      {toast}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
