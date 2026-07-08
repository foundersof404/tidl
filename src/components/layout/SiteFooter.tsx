import { useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { TidlWordmark } from "@/components/brand/TidlWordmark";
import { SITE_IMAGES, SOCIAL_ICONS } from "@/lib/site-assets";

const TREATMENT_LINKS = [
  { to: "/products/glp-1-weight-loss" as const, label: "Weight Loss" },
  { href: "/#services", label: "Longevity" },
  { href: "/#services", label: "Hormonal Health" },
  { href: "/#services", label: "Metabolic Care" },
  { href: "/#services", label: "Performance" },
  { href: "/#services", label: "Recovery" },
] as const;

const COMPANY_LINKS = [
  { href: "/#howItWorks", label: "How It Works" },
  { href: "/#faq", label: "FAQs" },
  { href: "/#services", label: "Find Your Treatment" },
  { href: "/#askTidl", label: "AI Discovery" },
] as const;

const CAREER_LINKS = [
  { href: "#", label: "For Professionals" },
  { href: "#", label: "For Providers" },
] as const;

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/", icon: SOCIAL_ICONS.facebook, label: "Facebook" },
  { href: "https://x.com/", icon: SOCIAL_ICONS.x, label: "X" },
  { href: "https://www.linkedin.com/", icon: SOCIAL_ICONS.linkedin, label: "LinkedIn" },
  { href: "https://www.instagram.com/", icon: SOCIAL_ICONS.instagram, label: "Instagram" },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="footer-link-wrap">
      <a href={href} className="footer-link">
        {label}
      </a>
      <div className="footer-link-line" />
    </div>
  );
}

function FooterRouterLink({ to, label }: { to: "/products/glp-1-weight-loss"; label: string }) {
  return (
    <div className="footer-link-wrap">
      <Link to={to} className="footer-link">
        {label}
      </Link>
      <div className="footer-link-line" />
    </div>
  );
}

type SiteFooterProps = {
  onGetStarted?: (e: MouseEvent) => void;
};

export function SiteFooter({ onGetStarted }: SiteFooterProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="footer-wrapper">
      <section className="footer container-full">
        <div className="container-fluid">
          <div className="footer-content">
            <div className="footer-wrap">
              <div className="footer-left">
                <div className="footer-left-head">
                  <div className="footer-left-title heading-03">Medical-grade care. Built to perform.</div>
                  <div className="footer-left-text p2-regular">
                    Doctor-prescribed GLP-1, TRT, and peptide treatments for weight, hormones, and recovery, delivered
                    discreetly to your door.
                  </div>
                  <div className="footer-left-btns">
                    <a
                      href="#"
                      onClick={onGetStarted}
                      data-wf--button-01--variant="model-another"
                      className="button-01 w-variant-4b7160f8-01ac-1908-f448-cd68b7651b2c button-03 w-inline-block"
                    >
                      <div className="button-outside-01">
                        <div className="button-inside">
                          <div className="button-text-01">Get started</div>
                          <div className="button-text-01">Take Quiz</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="footer-left-socials">
                  {SOCIAL_LINKS.map(({ href, icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-link w-inline-block"
                    >
                      <img src={icon} loading="lazy" alt={label} className="footer-social-ico" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="footer-right-wrap">
                <div className="footer-right">
                  <div className="footer-body">
                    <div className="title-small">Treatments</div>
                    <div className="footer-body-links">
                      {TREATMENT_LINKS.map((item) =>
                        "to" in item ? (
                          <FooterRouterLink key={item.label} to={item.to} label={item.label} />
                        ) : (
                          <FooterLink key={item.label} href={item.href} label={item.label} />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="footer-body">
                    <div className="title-small paragraph-01">Company</div>
                    <div className="footer-body-links">
                      {COMPANY_LINKS.map(({ href, label }) => (
                        <FooterLink key={label} href={href} label={label} />
                      ))}
                    </div>
                  </div>

                  <div className="footer-body">
                    <div className="title-small paragraph-01">Careers</div>
                    <div className="footer-body-links">
                      {CAREER_LINKS.map(({ href, label }) => (
                        <FooterLink key={label} href={href} label={label} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="footer-subscriber-box">
                  <div className="footer-subscriber-head">
                    <Link to="/" className="footer-logo-link w-inline-block" aria-label="TIDL home">
                      <TidlWordmark variant="dark" size="footer" />
                    </Link>
                    <div className="footer-subscriber-text p1-regular">
                      Health insights, treatment updates, and offers, straight to your inbox.
                    </div>
                  </div>
                  <div className="subscribe-form-block _02 w-form">
                    {submitted ? (
                      <div className="success-message w-form-done" style={{ display: "block" }}>
                        <div>Thank you! Your submission has been received!</div>
                      </div>
                    ) : (
                      <form
                        id="email-form"
                        name="email-form"
                        className="subscribe-form"
                        onSubmit={handleSubscribe}
                      >
                        <input
                          className="subscribe-field w-input"
                          maxLength={256}
                          name="email"
                          placeholder="Enter Your Email"
                          type="email"
                          required
                        />
                        <input type="submit" className="subsribe-submit w-button" value="Get Started" />
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright-wrap">
              <div className="footer-copyright-text">&copy; Copyright {new Date().getFullYear()}</div>
              <div className="extra-links">
                <div className="footer-link-wrap">
                  <div className="footer-link-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <img
        src={SITE_IMAGES.footer.decorative}
        loading="lazy"
        sizes="(max-width: 3149px) 100vw, 3149px"
        alt=""
        className="footer-btm-img"
      />
    </div>
  );
}
