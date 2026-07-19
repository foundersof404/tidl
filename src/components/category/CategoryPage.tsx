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
import {
  getCatalogItemsForCategory,
  getProductSlugsForCategory,
} from "@/lib/category-products";
import { CATEGORY_GOAL_MAP } from "@/lib/category-recommendations";
import { getGoalFromProduct } from "@/lib/products";
import { useLiveCatalog } from "@/lib/prescribe-rx/use-live-catalog";
import type { GoalId, ProductSlug } from "@/types/quiz";
import { CategoryAfterSection } from "./CategoryAfterSection";
import { CategoryAmbient } from "./CategoryAmbient";
import { CategoryFaqSection } from "./CategoryFaqSection";
import { CategoryExperienceSection } from "./CategoryExperienceSection";
import { CategoryFormularySection } from "./CategoryFormularySection";
import { CategoryHero } from "./CategoryHero";
import { CategoryTrustSection } from "./CategoryTrustSection";
import "../home/home.css";
import "./category.css";

type CategoryPageProps = {
  slug: CategorySlug;
};

const CATEGORY_GOALS: Record<CategorySlug, GoalId> = CATEGORY_GOAL_MAP;

export function CategoryPage({ slug }: CategoryPageProps) {
  const category = getCategory(slug);
  const { openModal } = useQuizModal();
  const { products: catalogProducts, loading: sandboxLoading } = useLiveCatalog();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroLive, setHeroLive] = useState(false);
  const reduce = useReducedMotion();
  const { pinned: headerPinned, theme: headerTheme, transparent: headerTransparent } =
    useSiteHeaderState({ defaultTheme: "light" });

  const productSlugs = useMemo(() => getProductSlugsForCategory(category.slug), [category.slug]);

  const catalogItems = useMemo(
    () => getCatalogItemsForCategory(catalogProducts, category.slug),
    [catalogProducts, category.slug],
  );

  const openQuiz = useCallback(
    (productSlug?: ProductSlug) => (e?: MouseEvent) => {
      e?.preventDefault();
      const goal = CATEGORY_GOALS[category.slug];
      if (productSlug) {
        openModal({
          product: productSlug,
          goal: getGoalFromProduct(productSlug) ?? goal,
        });
        return;
      }
      if (productSlugs[0]) {
        openModal({
          product: productSlugs[0],
          goal: getGoalFromProduct(productSlugs[0]) ?? goal,
        });
        return;
      }
      openModal({ goal });
    },
    [productSlugs, category.slug, openModal],
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

  const fromPrice = useMemo(() => {
    const prices = catalogItems
      .map((p) => p.consumerPrice ?? p.price ?? p.retailPrice)
      .filter((price): price is number => price != null && price > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  }, [catalogItems]);

  const faqItems = category.faqItems
    .filter((item) => !/\bpen\b/i.test(item.q) && !/\bpen\b/i.test(item.a))
    .slice(0, 4);

  return (
    <div className={`cat-page cat-page--sales cat-page--calm cat-page--${slug}`}>
      <div className="cat-hero-stage site-chrome-stage">
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
                fromPrice={sandboxLoading ? null : fromPrice}
                productCount={catalogItems.length || productSlugs.length}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Category-specific emotional recognition, unique composition per goal */}
      <CategoryExperienceSection slug={slug} />

      {/* Trust */}
      <CategoryTrustSection category={category} />

      {/* Product formulary, all sandbox products for this category */}
      <CategoryFormularySection category={category} />

      {/* 4. After-life emotional close */}
      <CategoryAfterSection category={category} onStartIntake={() => openQuiz()()} />

      <CategoryFaqSection
        category={category}
        items={faqItems}
        onStartIntake={() => openQuiz()()}
      />

      <div data-site-header-theme="dark">
        <SiteFooter onGetStarted={openQuiz()} />
      </div>
    </div>
  );
}
