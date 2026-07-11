import { SITE_IMAGES } from "@/lib/site-assets";
import { GLP1_TESTIMONIALS } from "@/lib/testimonials";
import type { PdpPageContent } from "./types";
import { GLP1_PEN_SHOWCASE } from "./pen-showcase-content";

export const SHARED_SAFETY_PILLARS = [
  {
    id: "provider",
    num: "01",
    label: "Licensed providers",
    detail: "Care from verified medical professionals.",
  },
  {
    id: "pharmacy",
    num: "02",
    label: "US pharmacies",
    detail: "Dispensed by licensed US-based pharmacies.",
  },
  {
    id: "rx",
    num: "03",
    label: "Prescription only",
    detail: "Prescription-only treatments for your safety.",
  },
  {
    id: "private",
    num: "04",
    label: "Private by design",
    detail: "Discreet, confidential care from start to finish.",
  },
] as const;

export const SHARED_REVIEW_STATS = [
  { value: "4.9", label: "Average rating" },
  { value: "12k+", label: "Patients served" },
  { value: "50", label: "States covered" },
] as const;

export const SHARED_CARE_FAQ = [
  {
    id: 8,
    cat: "care",
    q: "Can I talk to my care team after I start?",
    a: "Anytime. Message your care team with questions about your treatment, side effects, or progress, and a real person answers.",
  },
  {
    id: 9,
    cat: "care",
    q: "What happens when I need a refill?",
    a: "Refills are a tap, not a project. Your provider keeps your prescription current based on how your treatment is going.",
  },
  {
    id: 10,
    cat: "care",
    q: "Can I pause or cancel?",
    a: "Yes. You're in control of your plan. Talk to your provider first if you're mid-treatment, since some medications shouldn't stop abruptly.",
  },
] as const;

export const SHARED_START_FAQ = [
  {
    id: 1,
    cat: "start",
    q: "Is TIDL legitimate and safe?",
    a: "Yes. TIDL is a telehealth platform that connects you with licensed medical providers. Every treatment is prescribed by a doctor licensed in your state and filled by a licensed US pharmacy.",
  },
  {
    id: 3,
    cat: "start",
    q: "Who reviews and prescribes my treatment?",
    a: "A licensed medical provider in your state reads your full intake before anything is prescribed. If they have questions, they'll reach out before moving forward.",
  },
] as const;

export const SHARED_DELIVERY_FAQ = [
  {
    id: 6,
    cat: "treat",
    q: "Is shipping discreet?",
    a: "Completely. Your treatment arrives in plain, unbranded outer packaging with nothing on the box that says what's inside.",
  },
  {
    id: 7,
    cat: "treat",
    q: "How is my medication kept safe in transit?",
    a: "Temperature-sensitive treatments ship in insulated, cold-chain packaging designed to keep them within a safe range door to door.",
  },
] as const;

export const GLP1_PDP_CONTENT: PdpPageContent = {
  slug: "glp-1-weight-loss",
  goal: "weight-loss",
  productForm: "pen",
  heroImage: SITE_IMAGES.pen,
  penImage: SITE_IMAGES.pen,
  showPenShowcase: true,
  penShowcase: GLP1_PEN_SHOWCASE,
  heroProduct: {
    name: "TIDL GLP-1 Weight Loss",
    descriptor: "Pre-dosed injector pen · Prescription only",
    summary:
      "Doctor-prescribed GLP-1 set to your dose in the TIDL Pen. Reviewed by a licensed provider and dispensed from a US pharmacy.",
    rating: 4.9,
    reviewCount: "280+",
    startingPrice: 199,
    priceNote: "Includes provider review, prescription & pen delivery",
    perks: [
      { label: "Doctor prescription", detail: "Licensed provider in your state" },
      { label: "Free shipping", detail: "Discreet, unbranded packaging" },
      { label: "Delivered in 24 hours", detail: "Cold-chain when required" },
    ],
    specs: [
      { label: "Weekly injection", detail: "One pre-dosed routine, no mixing" },
      { label: "FDA-approved medication", detail: "Prescribed when medically appropriate" },
      { label: "Pre-filled, tiny needle", detail: "No vials, syringes, or assembly" },
    ],
    trustNote: "Individual results vary. Prescription required.",
    ctaLabel: "Start 7-day free trial",
  },
  outcomePhrases: [
    "Doctor-guided weight loss",
    "Simple pre-dosed routine",
    "No mixing or measuring",
    "Discreet ongoing care",
  ],
  includedPhrases: [
    "Licensed provider review",
    "Personalized prescription",
    "Pre-dosed TIDL Pen",
    "Discreet delivery",
    "Ongoing care",
  ],
  includedItems: [
    {
      id: "provider",
      num: "01",
      title: "Licensed provider review",
      detail: "A doctor in your state reads your intake before anything is prescribed.",
      callsign: "REVIEW",
      shortLabel: "Provider",
    },
    {
      id: "rx",
      num: "02",
      title: "Personalized prescription",
      detail: "Your GLP-1 dose is set to your assessment — not a one-size protocol.",
      callsign: "SCRIPT",
      shortLabel: "Rx",
    },
    {
      id: "pen",
      num: "03",
      title: "Pre-dosed TIDL Pen",
      detail: "Ready to inject. No mixing, no measuring, no guesswork.",
      callsign: "PEN",
      shortLabel: "Pen",
      accent: true,
    },
    {
      id: "delivery",
      num: "04",
      title: "Discreet delivery",
      detail: "Shipped from a licensed US pharmacy in plain packaging, cold-chain when needed.",
      callsign: "SHIP",
      shortLabel: "Ship",
    },
    {
      id: "care",
      num: "05",
      title: "Ongoing care",
      detail: "Message your care team anytime about treatment, side effects, or progress.",
      callsign: "CARE",
      shortLabel: "Care",
    },
  ],
  safetyPillars: SHARED_SAFETY_PILLARS,
  reviews: GLP1_TESTIMONIALS,
  reviewStats: SHARED_REVIEW_STATS,
  verticalTimeline: [
    {
      step: "01",
      label: "Start your intake",
      detail: "Answer a few health questions on your phone. It doubles as your medical intake.",
      duration: "~5 minutes",
    },
    {
      step: "02",
      label: "Provider review",
      detail: "A licensed doctor in your state reviews your history before anything is prescribed.",
      duration: "Same day",
    },
    {
      step: "03",
      label: "Pen prepared",
      detail: "Your GLP-1 dose is set in the pre-dosed TIDL Pen. No mixing, no guesswork.",
      duration: "Personalized",
    },
    {
      step: "04",
      label: "Discreet delivery",
      detail: "Shipped from a licensed US pharmacy in plain packaging, with cold-chain when needed.",
      duration: "2–5 days",
    },
    {
      step: "05",
      label: "Ongoing care",
      detail: "Message your care team, adjust your dose, and reorder with one tap when you're ready.",
      duration: "Always on",
    },
  ],
  faqItems: [
    ...SHARED_START_FAQ,
    {
      id: 2,
      cat: "start",
      q: "Do I need a prescription for GLP-1?",
      a: "Yes, and that's the point. Every TIDL treatment is prescription-only. Your intake doubles as your medical review, and if a licensed provider decides treatment is right for you, they write the prescription.",
    },
    {
      id: 4,
      cat: "start",
      q: "What if GLP-1 isn't right for me?",
      a: "Then it won't be prescribed. Providers only approve treatment when it's medically appropriate for you, and they'll tell you why if it isn't.",
    },
    {
      id: 5,
      cat: "treat",
      q: "How does the TIDL Pen work?",
      a: "Your dose is set to your prescription, with a clear graduated scale so there's never any guesswork. No vials, no syringes, nothing to mix or assemble.",
    },
    ...SHARED_DELIVERY_FAQ,
    ...SHARED_CARE_FAQ,
  ],
};
