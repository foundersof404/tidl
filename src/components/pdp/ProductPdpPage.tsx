import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { getProductBySlug } from "@/lib/products";
import { lockPageScroll, unlockPageScroll } from "@/lib/age-gate";
import type { ProductSlug } from "@/types/quiz";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useSiteHeaderState } from "@/hooks/useSiteHeaderState";
import { useLiveCatalog, resolveDisplayMonthlyPrice } from "@/lib/prescribe-rx/use-live-catalog";
import { mergeSandboxIntoPdp } from "@/lib/prescribe-rx/merge-sandbox-pdp";
import { getPdpContent } from "./data/pdp-data-registry";
import { PdpDataProvider } from "./PdpDataProvider";
import { PdpHeroSection } from "./PdpHeroSection";
import {
  PdpFeatureCards,
  PdpHowItWorks,
  PdpSupportSection,
  PdpTreatmentGrid,
  PdpSafetyStrip,
} from "./PdpMinimalSections";
import { PdpFaqSection } from "./PdpFaqSection";
import { PdpButton } from "./pdp-ui";
import "../home/home.css";
import "./pdp.css";
import "./pdp-redesign.css";

type ProductPdpPageProps = {
  slug: ProductSlug;
};

function ProductPdpPageInner({ slug }: ProductPdpPageProps) {
  const basePdp = getPdpContent(slug);
  const baseProduct = getProductBySlug(slug)!;
  const { map: liveCatalog } = useLiveCatalog();
  const live = liveCatalog[slug];

  const pdp = mergeSandboxIntoPdp(basePdp, live);

  const product = {
    ...baseProduct,
    name: basePdp.heroProduct.name,
    monthlyPrice: resolveDisplayMonthlyPrice(baseProduct.monthlyPrice, live?.price),
    image: pdp.heroImage,
    description: pdp.heroProduct.summary,
  };

  // Keep buy-box price in sync with live sandbox when available.
  const syncedPdp = {
    ...pdp,
    heroProduct: {
      ...pdp.heroProduct,
      startingPrice: product.monthlyPrice,
      priceNote:
        "Pay once for this treatment package. Includes provider review, prescription, and discreet delivery when approved.",
      ctaLabel: "Get started",
    },
  };

  const { openModal } = useQuizModal();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { pinned: headerPinned, theme: headerTheme, transparent: headerTransparent } =
    useSiteHeaderState({ defaultTheme: "light" });

  const openQuiz = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      openModal({ product: slug, goal: syncedPdp.goal });
    },
    [openModal, syncedPdp.goal, slug],
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
    { href: "#hero", label: "Product" },
    { href: "#features", label: "Overview" },
    { href: "#how", label: "How it works" },
    { href: "#included", label: "Included" },
    { href: "#treatments", label: "Treatments" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <PdpDataProvider data={syncedPdp}>
      <div className="pdp-page hm-page">
        <div className="pdp-hero-stage site-chrome-stage">
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

          <div className="pdp-hero-surface">
            <SiteHeader
              navLinks={navLinks}
              menuItems={navLinks}
              menuOpen={mobileNavOpen}
              pinned={headerPinned}
              transparent={headerTransparent}
              theme={headerTheme}
              onToggleMenu={() => setMobileNavOpen((open) => !open)}
              onCloseMenu={() => setMobileNavOpen(false)}
            />

            <PdpHeroSection heroRef={heroRef} onStart={openQuiz} />
          </div>
        </div>

        <PdpFeatureCards onStart={openQuiz} />
        <PdpHowItWorks onStart={openQuiz} />
        <PdpSupportSection onStart={openQuiz} />
        <PdpTreatmentGrid />
        <PdpSafetyStrip />
        <PdpFaqSection />

        <div className="pdp-footer-zone" data-pdp-header-theme="dark">
          <SiteFooter onGetStarted={openQuiz} />
        </div>

        <div
          className={`pdp-sticky-cta${stickyVisible ? " visible" : ""}`}
          aria-hidden={!stickyVisible}
        >
          {stickyVisible ? (
            <div className="pdp-sticky-inner">
              <div className="pdp-sticky-copy">
                <strong>{product.name}</strong>
                <span>One package · Provider review · Discreet delivery</span>
              </div>
              <PdpButton className="pdp-sticky-btn" label="Get started" onClick={openQuiz} />
            </div>
          ) : null}
        </div>
      </div>
    </PdpDataProvider>
  );
}

export default function ProductPdpPage({ slug }: ProductPdpPageProps) {
  return <ProductPdpPageInner slug={slug} />;
}

export function Glp1PdpPage() {
  return <ProductPdpPage slug="glp-1-weight-loss" />;
}
