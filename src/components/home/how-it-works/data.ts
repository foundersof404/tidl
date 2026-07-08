import type { ComponentType, SVGProps } from "react";
import {
  DeliveryIcon,
  GoalsIcon,
  HealthIcon,
  MinutesIcon,
  PlanIcon,
  ProviderIcon,
  ReorderIcon,
  ReviewIcon,
  SupportIcon,
} from "./icons";
import { SITE_IMAGES } from "@/lib/site-assets";

export type ImageMotion = "slideRight" | "crossfade" | "slideUp";

export interface HiWCard {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface HiWStep {
  id: number;
  timelineLabel: string;
  headline: string;
  body: string;
  image: string;
  imageMotion: ImageMotion;
  cards: HiWCard[];
}

export const HIW_STEPS: HiWStep[] = [
  {
    id: 0,
    timelineLabel: "Take the Quiz",
    headline: "Take the quiz.",
    body:
      "Answer a few questions about your health and performance goals. Five minutes on your phone, and it doubles as your medical intake, so there is nothing to fill out twice.",
    image: SITE_IMAGES.howItWorks[0],
    imageMotion: "slideRight",
    cards: [
      {
        title: "Your goals",
        description: "What you want to improve",
        Icon: GoalsIcon,
      },
      {
        title: "Health history",
        description: "A few quick medical questions",
        Icon: HealthIcon,
      },
      {
        title: "Five minutes",
        description: "Done on your phone, anytime",
        Icon: MinutesIcon,
      },
    ],
  },
  {
    id: 1,
    timelineLabel: "Licensed Review",
    headline: "From licensed pharmacies to your door.",
    body:
      "Prescribed by licensed providers, filled by US pharmacies, and shipped in discreet, temperature-safe packaging. Clinical rigor without the clinic.",
    image: SITE_IMAGES.howItWorks[1],
    imageMotion: "crossfade",
    cards: [
      {
        title: "Licensed provider",
        description: "Reviewed by a doctor in your state",
        Icon: ProviderIcon,
      },
      {
        title: "Personalized plan",
        description: "Treatment matched to you",
        Icon: PlanIcon,
      },
      {
        title: "Medical review",
        description: "Every intake read before prescribing",
        Icon: ReviewIcon,
      },
    ],
  },
  {
    id: 2,
    timelineLabel: "Delivery & Support",
    headline: "Real change, tracked over time.",
    body:
      "Consistent, physician-guided treatment that supports steady progress you can measure, week after week.",
    image: SITE_IMAGES.howItWorks[2],
    imageMotion: "slideUp",
    cards: [
      {
        title: "Discreet delivery",
        description: "Shipped from a licensed pharmacy",
        Icon: DeliveryIcon,
      },
      {
        title: "Ongoing support",
        description: "Message your care team anytime",
        Icon: SupportIcon,
      },
      {
        title: "Easy reorders",
        description: "Refills in a tap",
        Icon: ReorderIcon,
      },
    ],
  },
];

export const HIW_SUPPORTING =
  "Three steps from quiz to your door. Doctor-prescribed treatment built for measurable, lasting performance.";
