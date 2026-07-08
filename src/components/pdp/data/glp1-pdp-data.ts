import { SITE_IMAGES } from "@/lib/site-assets";
import { TESTIMONIALS } from "@/lib/testimonials";

export const PEN_IMAGE = SITE_IMAGES.pen;

export const HERO_IMAGES = SITE_IMAGES.pdp;

export const HERO_STATS = [
  { value: "5 min", label: "Online intake" },
  { value: "100%", label: "Doctor-reviewed" },
  { value: "48hr", label: "Typical delivery" },
] as const;

export const OUTCOME_PHRASES = [
  "Doctor-guided weight loss",
  "Simple pre-dosed routine",
  "No mixing or measuring",
  "Discreet ongoing care",
] as const;

export const INCLUDED_PHRASES = [
  "Licensed provider review",
  "Personalized prescription",
  "Pre-dosed TIDL Pen",
  "Discreet delivery",
  "Ongoing care",
] as const;

export const SAFETY_PILLARS = [
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

export const REVIEWS = TESTIMONIALS;

export const REVIEW_STATS = [
  { value: "4.9", label: "Average rating" },
  { value: "12k+", label: "Patients served" },
  { value: "50", label: "States covered" },
] as const;

export const VERTICAL_TIMELINE = [
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
    detail: "Your GLP-1 dose is set in the pre-dosed TIDL Pen — no mixing, no guesswork.",
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
] as const;

export const PDP_FAQ_ITEMS = [
  {
    id: 1,
    cat: "start",
    q: "Is TIDL legitimate and safe?",
    a: "Yes. TIDL is a telehealth platform that connects you with licensed medical providers. Every treatment is prescribed by a doctor licensed in your state and filled by a licensed US pharmacy.",
  },
  {
    id: 2,
    cat: "start",
    q: "Do I need a prescription for GLP-1?",
    a: "Yes — and that's the point. Every TIDL treatment is prescription-only. Your intake doubles as your medical review, and if a licensed provider decides treatment is right for you, they write the prescription.",
  },
  {
    id: 3,
    cat: "start",
    q: "Who reviews and prescribes my treatment?",
    a: "A licensed medical provider in your state reads your full intake before anything is prescribed. If they have questions, they'll reach out before moving forward.",
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
