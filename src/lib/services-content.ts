import { SITE_IMAGES } from "@/lib/site-assets";
import { CATEGORY_PATHS } from "@/lib/product-catalog";
import type { CategorySlug } from "@/lib/categories";

export type ServiceCardContent = {
  categorySlug: CategorySlug;
  label: string;
  image: string;
  summary: string;
  bullets: readonly string[];
  badge?: string;
  comingSoon?: boolean;
  comingSoonNote?: string;
  waitlistHref?: string;
  exploreLabel?: string;
  explorePath: `/category/${CategorySlug}`;
};

export const SERVICES_INTRO = {
  kicker: "Prescription care, delivered",
} as const;

export const SERVICE_CARDS: ServiceCardContent[] = [
  {
    categorySlug: "weight-loss",
    label: "Weight loss",
    image: SITE_IMAGES.services.weightLoss,
    summary:
      "GLP-1 treatment dosed for you by a doctor. Steady progress without crash diets, yo-yo cycles, or measuring at home.",
    bullets: [
      "Pre-dosed TIDL Pen, dose set to your Rx",
      "Provider reviews every intake",
      "Weekly routine: click, inject, track progress",
    ],
    badge: "Includes TIDL Pen",
    exploreLabel: "See Pricing & Plans",
    explorePath: CATEGORY_PATHS["weight-loss"],
  },
  {
    categorySlug: "testosterone",
    label: "Testosterone",
    image: SITE_IMAGES.services.testosterone,
    summary:
      "Energy, strength, drive, and focus. TRT built around your labs, symptoms, and how you actually live day to day.",
    bullets: [
      "Lab-guided dosing and ongoing monitoring",
      "Doctor in your state prescribes when appropriate",
      "Shipped from a US pharmacy in plain packaging",
    ],
    exploreLabel: "Explore TRT",
    explorePath: CATEGORY_PATHS.testosterone,
  },
  {
    categorySlug: "longevity",
    label: "Longevity",
    image: SITE_IMAGES.services.longevity,
    summary:
      "Peptide and metabolic protocols under physician supervision. Built for recovery, sleep, and long-term performance.",
    bullets: [
      "Peptide, NAD+, and recovery protocols under supervision",
      "Pen or prescription format based on your plan",
      "Message your care team anytime",
    ],
    exploreLabel: "Explore longevity",
    explorePath: CATEGORY_PATHS.longevity,
  },
];
