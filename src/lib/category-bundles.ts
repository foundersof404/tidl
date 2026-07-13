import type { CategorySlug } from "@/lib/categories";
import type { ProductSlug } from "@/types/quiz";
import { SITE_IMAGES } from "@/lib/site-assets";
export type CategoryBundleItem = {
  label: string;
  detail: string;
};

export type CategoryBundle = {
  categorySlug: CategorySlug;
  badge: string;
  title: string;
  lead: string;
  image: string;
  productSlug: ProductSlug | null;
  monthlyPrice: number | null;
  priceNote: string;
  includes: readonly CategoryBundleItem[];
  ctaLabel: string;
  secondaryLabel: string;
  comingSoon?: boolean;
};

export const CATEGORY_BUNDLES: Record<CategorySlug, CategoryBundle> = {
  "weight-loss": {
    categorySlug: "weight-loss",
    badge: "Recommended protocol",
    title: "GLP-1 Weight Loss Care Bundle",
    lead:
      "Everything in one physician-guided plan: intake review, pre-dosed TIDL Pen, discreet pharmacy shipping, and ongoing telehealth support.",
    image: SITE_IMAGES.products.penPrimary,
    productSlug: "glp-1-weight-loss",
    monthlyPrice: 299,
    priceNote: "Provider review, prescription, and delivery included",
    includes: [
      { label: "Medical intake + provider review", detail: "Licensed doctor in your state" },
      { label: "Pre-dosed TIDL Pen", detail: "Dose set to your prescription" },
      { label: "US pharmacy fulfillment", detail: "Cold-chain when required" },
      { label: "Ongoing care messaging", detail: "Reorder and check-ins in one place" },
    ],
    ctaLabel: "Start this protocol",
    secondaryLabel: "View program details",
  },
  testosterone: {
    categorySlug: "testosterone",
    badge: "Available now",
    title: "TRT Care Bundle",
    lead:
      "Lab-guided testosterone therapy with provider review, personalized dosing, and discreet US pharmacy delivery.",
    image: SITE_IMAGES.services.testosterone,
    productSlug: null,
    monthlyPrice: null,
    priceNote: "Pricing confirmed after provider review of your labs and intake",
    includes: [
      { label: "Symptom + lab review", detail: "Provider-led protocol design" },
      { label: "Personalized Rx", detail: "Dose matched to your levels" },
      { label: "Discreet shipping", detail: "Licensed US pharmacy" },
      { label: "Follow-up monitoring", detail: "Adjust as labs evolve" },
    ],
    ctaLabel: "Start intake for TRT",
    secondaryLabel: "How TRT works",
  },
  longevity: {
    categorySlug: "longevity",
    badge: "Available now",
    title: "Longevity Protocol Bundle",
    lead:
      "Physician-supervised peptide and metabolic care for recovery, sleep, and long-term performance — with the same medical standards as GLP-1.",
    image: SITE_IMAGES.services.longevity,
    productSlug: null,
    monthlyPrice: null,
    priceNote: "Pricing confirmed after provider review of your goals and intake",
    includes: [
      { label: "Goal-based intake", detail: "Recovery, sleep, metabolic focus" },
      { label: "Provider protocol", detail: "Prescribed only when appropriate" },
      { label: "Pen or Rx format", detail: "Matched to your plan" },
      { label: "Care team access", detail: "Message anytime" },
    ],
    ctaLabel: "Start longevity intake",
    secondaryLabel: "Learn the approach",
  },
  "metabolic-health": {
    categorySlug: "metabolic-health",
    badge: "Coming soon",
    title: "Metabolic Health Bundle",
    lead:
      "Physician-guided metabolic support for energy, glucose balance, and sustainable body composition — built on the same intake-to-door care path.",
    image: SITE_IMAGES.services.weightLoss,
    productSlug: null,
    monthlyPrice: null,
    priceNote: "Intake today reserves your place when this hub launches",
    includes: [
      { label: "Metabolic intake", detail: "History, goals, and lifestyle" },
      { label: "Provider review", detail: "Prescription when appropriate" },
      { label: "Pharmacy fulfillment", detail: "Discreet US shipping" },
      { label: "Progress check-ins", detail: "Adjust as you go" },
    ],
    ctaLabel: "Start metabolic intake",
    secondaryLabel: "Explore related care",
    comingSoon: true,
  },
  performance: {
    categorySlug: "performance",
    badge: "Coming soon",
    title: "Performance Protocol Bundle",
    lead:
      "Clinically supervised performance care for strength, drive, and recovery — legitimate prescriptions, not gray-market shortcuts.",
    image: SITE_IMAGES.services.testosterone,
    productSlug: null,
    monthlyPrice: null,
    priceNote: "Start intake to get matched when performance protocols launch",
    includes: [
      { label: "Performance intake", detail: "Training, recovery, goals" },
      { label: "Licensed review", detail: "Doctor in your state" },
      { label: "Personalized plan", detail: "Only when medically fit" },
      { label: "Discreet delivery", detail: "US pharmacy network" },
    ],
    ctaLabel: "Start performance intake",
    secondaryLabel: "See how care works",
    comingSoon: true,
  },
  recovery: {
    categorySlug: "recovery",
    badge: "Coming soon",
    title: "Recovery Care Bundle",
    lead:
      "Physician-guided recovery protocols for sleep, repair, and bounce-back — with the same medical oversight as every TIDL treatment.",
    image: SITE_IMAGES.services.longevity,
    productSlug: null,
    monthlyPrice: null,
    priceNote: "Complete intake now; we notify you when recovery care is live",
    includes: [
      { label: "Recovery intake", detail: "Sleep, stress, repair goals" },
      { label: "Provider protocol", detail: "Prescribed when appropriate" },
      { label: "Pharmacy shipping", detail: "Plain packaging" },
      { label: "Ongoing support", detail: "Message your care team" },
    ],
    ctaLabel: "Start recovery intake",
    secondaryLabel: "How recovery care works",
    comingSoon: true,
  },
};

export function getCategoryBundle(slug: CategorySlug): CategoryBundle {
  return CATEGORY_BUNDLES[slug];
}
