import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { lockPageScroll, unlockPageScroll } from "@/lib/age-gate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useSiteHeaderState } from "@/hooks/useSiteHeaderState";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  getCategory,
  type CategorySlug,
} from "@/lib/categories";
import { CATEGORY_GOAL_MAP } from "@/lib/category-recommendations";
import { getGoalFromProduct } from "@/lib/products";
import {
  filterEncountersForCategory,
  filterFeaturedForCategory,
  useHomeSandbox,
} from "@/lib/prescribe-rx/use-home-sandbox";
import type { GoalId, ProductSlug } from "@/types/quiz";
import { CategoryAmbient } from "./CategoryAmbient";
import { CategoryFaqSection } from "./CategoryFaqSection";
import { CategoryFormularySection } from "./CategoryFormularySection";
import { CategoryHero } from "./CategoryHero";
import { CategoryHowSection } from "./CategoryHowSection";
import { CategoryPenSection } from "./CategoryPenSection";
import { CategoryWhySection } from "./CategoryWhySection";
import { catReveal, catStagger } from "./category-motion";
import "../home/home.css";
import "./category.css";

type CategoryPageProps = {
  slug: CategorySlug;
};

const CATEGORY_GOALS: Record<CategorySlug, GoalId> = CATEGORY_GOAL_MAP;

export function CategoryPage({ slug }: CategoryPageProps) {
  const category = getCategory(slug);
  const { openModal } = useQuizModal();
  const { featured, encounters, catalogCount, loading: sandboxLoading } = useHomeSandbox();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroLive, setHeroLive] = useState(false);
  const reduce = useReducedMotion();
  const { pinned: headerPinned, theme: headerTheme, transparent: headerTransparent } =
    useSiteHeaderState({ defaultTheme: "light" });

  const openQuiz = useCallback(
    (productSlug?: ProductSlug) => (e?: MouseEvent) => {
      e?.preventDefault();
      const slugToUse = productSlug ?? category.productSlugs[0] ?? "glp-1-weight-loss";
      const goal = getGoalFromProduct(slugToUse) ?? CATEGORY_GOALS[category.slug];
      openModal({ product: slugToUse, goal });
    },
    [category.productSlugs, category.slug, openModal],
  );

  useEffect(() => {
    if (!mobileNavOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [mobileNavOpen]);

  useEffect(() => {
    const t = window.setTimeout(() => setHeroLive(true), 120);
    return () => window.clearTimeout(t);
  }, [slug]);

  const navLinks = CATEGORY_SLUGS.map((item) => ({
    to: `/category/${item}` as const,
    label: CATEGORIES[item].navLabel,
  }));

  const reveal = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : catReveal;
  const howSteps = category.howItWorks.slice(0, 4);
  const faqItems = category.faqItems.slice(0, 4);

  const liveProducts = useMemo(
    () => filterFeaturedForCategory(featured, category.productSlugs),
    [featured, category.productSlugs],
  );
  const pathways = useMemo(
    () => filterEncountersForCategory(encounters, category.slug),
    [encounters, category.slug],
  );

  return (
    <div className="cat-page cat-page--sales">
          <div className="cat-hero-stage site-chrome-stage">
            <div className="tdl-bar" id="tdlBar">
              <div className="tdl-bar-inner">
                <span className="tdl-msg">Physician-guided care. Discreet delivery. Real results.</span>
                <Link to="/" className="tdl-link">
                  Home
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="cat-hero-surface">
              <CategoryAmbient live={heroLive} />

              <SiteHeader
                navLinks={navLinks.map((item) => ({ href: item.to, label: item.label }))}
                menuOpen={mobileNavOpen}
                pinned={headerPinned}
                transparent={headerTransparent}
                theme={headerTheme}
                onToggleMenu={() => setMobileNavOpen((open) => !open)}
                onCloseMenu={() => setMobileNavOpen(false)}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={slug}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <CategoryHero
                    category={category}
                    slug={slug}
                    onGetStarted={() => openQuiz()()}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 1. Treatments / peptides — primary sales surface */}
          <CategoryFormularySection category={category} />

          {/* 2. Pen differentiator — cinematic product insight */}
          {category.penSpotlight ? (
            <CategoryPenSection
              category={category}
              slug={slug}
              onStartIntake={() => openQuiz()()}
            />
          ) : null}

          {/* 3. Path to purchase — premium pathway */}
          <CategoryHowSection
            category={category}
            steps={howSteps}
            onStartIntake={() => openQuiz()()}
          />

          {/* 4. Trust — cinematic clinical proof theater */}
          <CategoryWhySection
            category={category}
            liveProducts={liveProducts}
            pathways={pathways}
            catalogCount={catalogCount}
            sandboxLoading={sandboxLoading}
            onStartIntake={() => openQuiz()()}
          />

          {/* 5. FAQ — home-style accordion */}
          <CategoryFaqSection
            category={category}
            items={faqItems}
            onStartIntake={() => openQuiz()()}
          />

          <section className="cat-cta-band" data-site-header-theme="light">
            <motion.div
              className="cat-cta-inner"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={catStagger}
            >
              <motion.h2 className="cat-cta-title" variants={reveal}>
                Ready for {category.navLabel.toLowerCase()} that actually ships?
              </motion.h2>
              <motion.p className="cat-cta-lead" variants={reveal}>
                Five-minute intake. Licensed provider review. Discreet pharmacy delivery.
              </motion.p>
              <motion.button
                type="button"
                className="cat-btn cat-btn--primary"
                onClick={openQuiz()}
                variants={reveal}
                whileHover={reduce ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                {category.ctaLabel}
              </motion.button>
            </motion.div>
          </section>

          <div data-site-header-theme="dark">
            <SiteFooter onGetStarted={openQuiz()} />
          </div>
    </div>
  );
}

