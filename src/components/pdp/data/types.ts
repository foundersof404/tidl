import type { GoalId, ProductSlug } from "@/types/quiz";
import type { ProductForm } from "@/lib/product-catalog";
import type { Testimonial } from "@/lib/testimonials";

export type HeroProduct = {
  name: string;
  descriptor: string;
  summary: string;
  rating: number;
  reviewCount: string;
  startingPrice: number;
  priceNote: string;
  perks: readonly { label: string; detail: string }[];
  specs: readonly { label: string; detail: string }[];
  trustNote: string;
  ctaLabel: string;
};

export type SafetyPillar = {
  id: string;
  num: string;
  label: string;
  detail: string;
};

export type TimelineStep = {
  step: string;
  label: string;
  detail: string;
  duration: string;
};

export type FaqItem = {
  id: number;
  cat: string;
  q: string;
  a: string;
};

export type ReviewStat = {
  value: string;
  label: string;
};

export type IncludedItem = {
  id: string;
  num: string;
  title: string;
  detail: string;
  callsign: string;
  shortLabel: string;
  accent?: boolean;
};

export type PenShowcaseFeature = {
  num: string;
  label: string;
  sub: string;
};

export type PenShowcaseStat = {
  target: number;
  suffix?: string;
  tag: string;
  sub: string;
};

export type PenShowcaseContent = {
  kicker: string;
  headlineLine1: string;
  headlineEmphasis: string;
  leftFeatures: readonly [PenShowcaseFeature, PenShowcaseFeature];
  rightFeatures: readonly [PenShowcaseFeature, PenShowcaseFeature];
  stats: readonly [PenShowcaseStat, PenShowcaseStat, PenShowcaseStat, PenShowcaseStat];
  penAlt: string;
  videoTitle?: string;
  videoEmbedUrl?: string;
};

export type PdpPageContent = {
  slug: ProductSlug;
  goal: GoalId;
  productForm: ProductForm;
  heroProduct: HeroProduct;
  heroImage: string;
  penImage: string;
  showPenShowcase: boolean;
  penShowcase?: PenShowcaseContent;
  outcomePhrases: readonly string[];
  includedPhrases: readonly string[];
  includedItems: readonly IncludedItem[];
  safetyPillars: readonly SafetyPillar[];
  verticalTimeline: readonly TimelineStep[];
  faqItems: readonly FaqItem[];
  reviews: readonly Testimonial[];
  reviewStats: readonly ReviewStat[];
};
