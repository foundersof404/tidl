import { GLP1_TESTIMONIALS } from "@/lib/testimonials";
import { buildGlp1Marketing } from "@/lib/pdp-marketing";
import type { PdpPageContent } from "./types";

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
    a: "Yes. You're in control. Talk to your provider first if you're mid-treatment, since some medications shouldn't stop abruptly.",
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
  productForm: "vial",
  marketing: buildGlp1Marketing(),
  heroImage: "/peptides/glp-1-weight-loss.png",
  penImage: "/peptides/glp-1-weight-loss.png",
  showPenShowcase: false,
  heroProduct: {
    name: "TIDL GLP-1 Weight Loss",
    descriptor: "Tirzepatide GLP-1/GIP · Prescription only",
    summary:
      "Doctor-prescribed tirzepatide (GLP-1/GIP) for steady, measurable weight loss. It helps quiet food noise, slow emptying, and support lasting appetite control — reviewed by a licensed provider and filled by a US pharmacy. Your shipment includes medication plus a TIDL Pen with clear how-to instructions.",
    rating: 4.9,
    reviewCount: "280+",
    startingPrice: 299,
    priceNote: "Pay once for this treatment package. Includes provider review when approved.",
    perks: [
      { label: "Doctor-prescribed GLP-1 for weight loss", detail: "Licensed provider in your state" },
      { label: "Quieter food noise, lasting appetite control", detail: "GLP-1/GIP pathway support" },
      { label: "Weekly protocol · TIDL Pen included", detail: "Clear how-to with every shipment" },
    ],
    specs: [
      { label: "What it does", detail: "Mimics GIP + GLP-1 hormones to reduce appetite, improve fullness, and support significant weight loss." },
      { label: "Who it's for", detail: "Adults seeking physician-guided medical weight loss when lifestyle changes alone haven't stuck." },
      { label: "Weekly protocol", detail: "Provider sets your dose and ramp schedule from your intake." },
      { label: "Strength shown", detail: "Matched pharmacy vial from the clinical catalog (dose personalized)." },
      { label: "How to use the pen", detail: "Follow the included TIDL Pen guide — dial, click, inject. No mixing or measuring." },
      { label: "Storage", detail: "Store as labeled; cold-chain when your medication requires it." },
      { label: "US pharmacy fill", detail: "Licensed compounding & fulfillment after provider approval." },
    ],
    trustNote: "Individual results vary. Prescription required. Your provider decides if treatment is right for you.",
    ctaLabel: "See if you qualify",
  },
  outcomePhrases: [
    "Quieter food noise",
    "Clothes that fit again",
    "A protocol you can keep",
    "Real pharmacy medicine",
  ],
  includedPhrases: [
    "Licensed provider review",
    "Personalized GLP-1 prescription",
    "Pharmacy-grade medication",
    "TIDL Pen + how-to guide",
    "Discreet delivery",
    "Ongoing care messaging",
  ],
  includedItems: [
    {
      id: "provider",
      num: "01",
      title: "Licensed provider review",
      detail: "A doctor in your state reads your full intake before anything is prescribed.",
      callsign: "REVIEW",
      shortLabel: "Provider",
    },
    {
      id: "rx",
      num: "02",
      title: "Personalized GLP-1 plan",
      detail: "Your tirzepatide dose and titration are set to your assessment — not a one-size protocol.",
      callsign: "SCRIPT",
      shortLabel: "Rx",
      accent: true,
    },
    {
      id: "pen",
      num: "03",
      title: "TIDL Pen + how to use",
      detail: "Every peptide plan ships with a pen and a clear how-to so you know exactly what to do each week.",
      callsign: "PEN",
      shortLabel: "Pen",
    },
    {
      id: "med",
      num: "04",
      title: "Pharmacy-grade medication",
      detail: "Dispensed by a licensed US pharmacy. No gray-market bottles.",
      callsign: "MED",
      shortLabel: "Meds",
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
      label: "Protocol + pen guide",
      detail: "Your GLP-1 plan is personalized. Your TIDL Pen arrives with clear how-to instructions.",
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
      detail: "Message your care team, adjust your plan, and reorder with one tap when you're ready.",
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
      q: "How do I use the TIDL Pen?",
      a: "Your shipment includes a pen and a step-by-step how-to. Your provider sets the dose — you follow the guide: prepare, dial, inject. No mixing or measuring.",
    },
    {
      id: 11,
      cat: "treat",
      q: "What does tirzepatide actually do?",
      a: "It acts on GLP-1 and GIP pathways linked to appetite and fullness, which can help reduce food noise and support meaningful weight loss under medical supervision.",
    },
    ...SHARED_DELIVERY_FAQ,
    ...SHARED_CARE_FAQ,
  ],
};
