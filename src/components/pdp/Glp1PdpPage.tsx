import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { getProductBySlug } from "@/lib/products";
import { formatCurrency } from "@/lib/pricing";
import { lockPageScroll, unlockPageScroll } from "@/lib/age-gate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TidlWordmark } from "@/components/brand/TidlWordmark";
import { PenShowcaseSection } from "./PenShowcaseSection";
import { PdpHeroSection } from "./PdpHeroSection";
import { PdpVerticalTimeline } from "./PdpVerticalTimeline";
import { PdpReviewsSection } from "./PdpReviewsSection";
import { PdpSafetySection } from "./PdpSafetySection";
import { PdpCtaBand } from "./PdpCtaBand";
import { PdpFaqSection } from "./PdpFaqSection";
import { PdpOutcomeSection } from "./PdpOutcomeSection";
import { PdpIncludedSection } from "./PdpIncludedSection";
import { PdpButton, Reveal } from "./pdp-ui";
import "../home/home.css";
import "./pdp.css";

const PRODUCT_SLUG = "glp-1-weight-loss" as const;
const GOAL = "weight-loss" as const;

function ArrowRight() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Glp1PdpPage() {
  const product = getProductBySlug(PRODUCT_SLUG)!;
  const { openModal } = useQuizModal();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const openQuiz = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      openModal({ product: PRODUCT_SLUG, goal: GOAL });
    },
    [openModal],
  );

  useEffect(() => {
    if (!mobileNavOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [mobileNavOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const navLinks = [
    { href: "#journey", label: "Your path" },
    { href: "#how-pen-works", label: "The Pen" },
    { href: "#included", label: "What's included" },
    { href: "#reviews", label: "Reviews" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <div className="pdp-page">
      <div className="tdl-bar" id="tdlBar">
        <div className="tdl-bar-inner">
          <span className="tdl-msg">TIDL is now a telehealth platform. Care that delivers results.</span>
          <Link to="/" className="tdl-link">
            Learn more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="pdp-hero-stage">
        <div className="pdp-hero-surface">
          <div id="navbar" className="navbar-wrap">
            <div className="navbar">
              <div className="nabvar-info">
                <Link to="/" className="nav-logo _02 w-inline-block" aria-label="TIDL home">
                  <TidlWordmark variant="light" />
                </Link>
                <div className="navbar-info-left">
                  {navLinks.map(({ href, label }) => (
                    <div key={label} className="nav-dropdown w-dropdown">
                      <div className="navitem-toggle w-dropdown-toggle">
                        <a href={href} className="nav-items-wrap light w-inline-block">
                          <div className="nav-item">{label}</div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="navbar-middle">
                <Link to="/" className="nav-logo w-inline-block" aria-label="TIDL home">
                  <TidlWordmark variant="light" />
                </Link>
              </div>

              <div className="navbar-right">
                <div className="navbar-right-btns">
                  <a href="#get-started" onClick={openQuiz} className="button-03 light w-inline-block">
                    <div className="button-outside-wrap">
                      <div className="btn-text-outside-03">
                        <div className="btn-text-inside-03">
                          <div className="button-text-03">Get started</div>
                          <div className="button-text-03">Get started</div>
                        </div>
                      </div>
                      <div className="btn-icon-outside-03">
                        <div className="btn-icon-inside-03">
                          <div className="btn-icon-03 w-embed">
                            <ArrowRight />
                          </div>
                          <div className="btn-icon-03 w-embed">
                            <ArrowRight />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="button-line-02 light" />
                  </a>
                </div>
              </div>

              <button
                type="button"
                className="nav-toggle-btn-wrap"
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileNavOpen((open) => !open)}
              >
                <div className={`nav-toogle-btn ${mobileNavOpen ? "close" : "menu"} light w-embed`}>
                  {mobileNavOpen ? (
                    <svg width="100%" height="100%" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.219 6.51595C16.589 6.14639 17.1741 6.13164 17.5256 6.48275C17.8771 6.83382 17.8623 7.41787 17.4924 7.78743L13.6624 11.6126L17.4924 15.4378C17.8624 15.8073 17.877 16.3914 17.5256 16.7425C17.1741 17.0936 16.589 17.0789 16.219 16.7093L12.3899 12.8841L8.56079 16.7093C8.19082 17.0789 7.60565 17.0936 7.25415 16.7425C6.90281 16.3914 6.91744 15.8073 7.28735 15.4378L11.1165 11.6126L7.28735 7.78743C6.91756 7.41788 6.90275 6.83381 7.25415 6.48275C7.60565 6.13164 8.19082 6.14639 8.56079 6.51595L12.3899 10.3402L16.219 6.51595Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18.5791 15.289C19.1022 15.2891 19.5263 15.6924 19.5264 16.1894C19.5264 16.6865 19.1022 17.0897 18.5791 17.0898H5.94727C5.4241 17.0898 5 16.6865 5 16.1894C5.00004 15.6924 5.42412 15.2891 5.94727 15.289H18.5791ZM18.5791 10.4892C19.1021 10.4893 19.5261 10.8918 19.5264 11.3886C19.5264 11.8857 19.1022 12.2889 18.5791 12.289H5.94727C5.4241 12.289 5 11.8857 5 11.3886C5.00027 10.8918 5.42426 10.4893 5.94727 10.4892H18.5791ZM18.5791 5.68844C19.1022 5.68852 19.5264 6.09178 19.5264 6.58883C19.5263 7.08583 19.1022 7.48914 18.5791 7.48922H5.94727C5.42412 7.48917 5.00005 7.08585 5 6.58883C5 6.09177 5.4241 5.68849 5.94727 5.68844H18.5791Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
              </button>

              <div className={`menu-wrap _02${mobileNavOpen ? " open" : ""}`}>
                <div className="menu-inside-info">
                  <Link to="/" className="nav-logo _03 w-inline-block" onClick={() => setMobileNavOpen(false)} aria-label="TIDL home">
                    <TidlWordmark variant="dark" />
                  </Link>
                  <button type="button" className="nav-toggle-btn-wrap" aria-label="Close menu" onClick={() => setMobileNavOpen(false)}>
                    <div className="nav-toogle-btn close w-embed">
                      <svg width="100%" height="100%" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.219 6.51595C16.589 6.14639 17.1741 6.13164 17.5256 6.48275C17.8771 6.83382 17.8623 7.41787 17.4924 7.78743L13.6624 11.6126L17.4924 15.4378C17.8624 15.8073 17.877 16.3914 17.5256 16.7425C17.1741 17.0936 16.589 17.0789 16.219 16.7093L12.3899 12.8841L8.56079 16.7093C8.19082 17.0789 7.60565 17.0936 7.25415 16.7425C6.90281 16.3914 6.91744 15.8073 7.28735 15.4378L11.1165 11.6126L7.28735 7.78743C6.91756 7.41788 6.90275 6.83381 7.25415 6.48275C7.60565 6.13164 8.19082 6.14639 8.56079 6.51595L12.3899 10.3402L16.219 6.51595Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="menu-top">
                  <div className="menu-body _01">
                    <div className="menu-body-item">
                      {[{ href: "#outcome", label: "Who it's for" }, ...navLinks, { href: "#pricing", label: "Pricing" }].map(
                        ({ href, label }) => (
                          <a
                            key={label}
                            href={href}
                            className="dropdown-text-outside w-inline-block"
                            onClick={() => setMobileNavOpen(false)}
                          >
                            <div className="dropdown-inside-texts">
                              <div className="dropdown-inside-text">{label}</div>
                              <div className="dropdown-inside-text">{label}</div>
                            </div>
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PdpHeroSection heroRef={heroRef} onStart={openQuiz} />
        </div>
      </div>

      <PdpOutcomeSection />

      <PdpVerticalTimeline />

      <PenShowcaseSection />

      <PdpIncludedSection />

      <section className="pdp-section" id="pricing">
        <div className="pdp-section-shell">
          <div className="pdp-section-inner">
            <Reveal>
              <div className="pdp-pricing">
                <span className="pdp-kicker">{product.name}</span>
                <p className="pdp-price">{formatCurrency(product.monthlyPrice)}/month</p>
                <p className="pdp-price-sub">
                  Includes provider review, prescription, and pen delivery. Pricing may vary based on your treatment plan.
                </p>
                <div className="pdp-price-includes">
                  <span>Doctor review</span>
                  <span>Prescription</span>
                  <span>Pre-dosed pen</span>
                  <span>Ongoing care</span>
                </div>
                <PdpButton label="Choose this plan" onClick={openQuiz} />
                <p className="pdp-note" style={{ marginTop: 18, marginBottom: 0 }}>
                  HSA and FSA cards accepted at checkout.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PdpSafetySection />

      <PdpReviewsSection />

      <PdpCtaBand onStart={openQuiz} />

      <PdpFaqSection />

      <div className="pdp-footer-zone">
        <SiteFooter onGetStarted={openQuiz} />
      </div>

      <div className={`pdp-sticky-cta${stickyVisible ? " visible" : ""}`} aria-hidden={!stickyVisible}>
        <div className="pdp-sticky-inner">
          <div className="pdp-sticky-copy">
            <strong>Ready to start?</strong>
            <span>5-minute intake · Doctor-reviewed · Discreet delivery</span>
          </div>
          <PdpButton className="pdp-sticky-btn" label="Get started" onClick={openQuiz} />
        </div>
      </div>
    </div>
  );
}
