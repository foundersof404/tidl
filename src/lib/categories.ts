import type { ProductSlug } from "@/types/quiz";
import { SITE_IMAGES } from "@/lib/site-assets";
import { TRUST_PILLARS, TRUST_STATS } from "@/lib/trust-content";

export const CATEGORY_SLUGS = [
  "weight-loss",
  "metabolic-health",
  "testosterone",
  "longevity",
  "performance",
  "recovery",
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type CategoryEducationBlock = {
  title: string;
  body: string;
};

export type CategoryTimelineStep = {
  step: string;
  label: string;
  detail: string;
  duration: string;
};

export type CategoryFaqItem = {
  id: number;
  q: string;
  a: string;
};

export type CategoryPenSpotlight = {
  kicker: string;
  title: string;
  /** Emphasized second line under the title (e.g. "Just click.") */
  titleEmphasis?: string;
  lead: string;
  image: string;
  features: readonly { num: string; title: string; body: string }[];
  trustNote: string;
};

export type CategoryDefinition = {
  slug: CategorySlug;
  navLabel: string;
  title: string;
  kicker: string;
  headline: string;
  lead: string;
  extendedLead: string;
  heroImage: string;
  productSlugs: ProductSlug[];
  pillars: readonly { title: string; body: string }[];
  educationTitle: string;
  educationBlocks: readonly CategoryEducationBlock[];
  howItWorks: readonly CategoryTimelineStep[];
  penSpotlight?: CategoryPenSpotlight;
  faqItems: readonly CategoryFaqItem[];
  ctaLabel: string;
  metaTitle: string;
  metaDescription: string;
  trustStats: typeof TRUST_STATS;
  trustPillars: typeof TRUST_PILLARS;
};

export const CATEGORIES: Record<CategorySlug, CategoryDefinition> = {
  "weight-loss": {
    slug: "weight-loss",
    navLabel: "Weight loss",
    title: "Weight Loss",
    kicker: "Clinical weight care",
    headline: "How to lose weight and keep it off.",
    lead:
      "Doctor-prescribed GLP-1 treatment built for steady, measurable progress. No crash diets, no waiting rooms, no guesswork.",
    extendedLead:
      "GLP-1 medications work with your body's natural signals to reduce appetite and support sustainable weight loss. At TIDL, every plan is physician-guided: a licensed provider reviews your full health history, prescribes only when appropriate, and ships your dose pre-set in the TIDL Pen so you never mix or measure at home.",
    heroImage: SITE_IMAGES.services.weightLoss,
    productSlugs: ["glp-1-weight-loss", "retatrutide"],
    pillars: [
      {
        title: "Physician-guided GLP-1",
        body: "Licensed providers review your intake, medical history, and goals before anything is prescribed.",
      },
      {
        title: "Pre-dosed TIDL Pen",
        body: "Your dose is set in the pen at the pharmacy. Click and go. No vials, syringes, or kitchen-table chemistry.",
      },
      {
        title: "Progress you can track",
        body: "Consistent care and support week after week. Message your team and adjust as your body responds.",
      },
      {
        title: "Steady, not extreme",
        body: "Built for real life, not crash cycles. The goal is weight you keep off, not a number you rebound from.",
      },
      {
        title: "Transparent pricing",
        body: "One monthly plan covers provider review, prescription, and delivery. No hidden clinic fees.",
      },
      {
        title: "Discreet from day one",
        body: "Plain outer packaging, secure messaging, and care that respects your privacy.",
      },
    ],
    educationTitle: "What GLP-1 care looks like with TIDL",
    educationBlocks: [
      {
        title: "What is GLP-1?",
        body: "GLP-1 receptor agonists are FDA-approved medications that help regulate appetite and blood sugar. They are prescribed when a licensed provider determines they are medically appropriate for you. TIDL connects you with that provider review entirely online.",
      },
      {
        title: "Why the TIDL Pen matters",
        body: "Weight-loss GLP-1 ships in our pre-dosed pen. Your prescription dose is set before delivery, with a graduated scale and precision slider so there is never guesswork. One weekly injection, no mixing, no measuring.",
      },
      {
        title: "What to expect over time",
        body: "Most members start with a gradual dose schedule as their body adjusts. Your provider monitors progress, answers questions, and updates your plan. You are never alone between check-ins: message your care team anytime.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Take the intake",
        detail: "Five-minute health quiz on your phone. It doubles as your medical intake for provider review.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Doctor review",
        detail: "A licensed provider in your state reads your full history before prescribing GLP-1.",
        duration: "Same day",
      },
      {
        step: "03",
        label: "Pen prepared",
        detail: "Your GLP-1 dose is set in the pre-dosed TIDL Pen. No mixing, no assembly.",
        duration: "Personalized",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy in plain packaging with cold-chain when required.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Ongoing support",
        detail: "Track progress, message your care team, and reorder with one tap when you are ready.",
        duration: "Always on",
      },
    ],
    penSpotlight: {
      kicker: "The TIDL Pen",
      title: "GLP-1, pre-dosed.",
      titleEmphasis: "Just click.",
      lead:
        "Your weekly dose is set to your prescription before the pen leaves the pharmacy. A precision slider, graduated scale, and pre-filled cartridge mean you never handle vials or syringes at home.",
      image: SITE_IMAGES.pen,
      features: [
        {
          num: "01",
          title: "Precision dose slider",
          body: "Your dose, set to your prescription. Nothing to calculate.",
        },
        {
          num: "02",
          title: "Graduated dose scale",
          body: "Clear markings from 0.1 to 1.0 ml. Zero guesswork.",
        },
        {
          num: "03",
          title: "Sealed and dispensed to you",
          body: "Labeled with your name by a licensed US pharmacy.",
        },
        {
          num: "04",
          title: "Cold-chain shipped",
          body: "Temperature-safe, discreet packaging to your door.",
        },
      ],
      trustNote: "Prescription required. Individual results vary.",
    },
    faqItems: [
      {
        id: 1,
        q: "Is TIDL legitimate and safe?",
        a: "Yes. TIDL is a telehealth platform connecting you with licensed medical providers. Every treatment is prescribed by a doctor in your state and filled by a licensed US pharmacy.",
      },
      {
        id: 2,
        q: "How does the TIDL Pen work?",
        a: "Your dose is set to your prescription with a clear graduated scale. No vials, no syringes, nothing to mix. One weekly injection, then you are done.",
      },
      {
        id: 3,
        q: "Do I need a prescription for GLP-1?",
        a: "Yes. Every TIDL treatment is prescription-only. Your intake doubles as your medical review, and a licensed provider writes the prescription only when medically appropriate.",
      },
      {
        id: 4,
        q: "Is shipping discreet?",
        a: "Completely. Treatment arrives in plain, unbranded outer packaging with nothing on the box that reveals what is inside.",
      },
      {
        id: 5,
        q: "Can I talk to my care team after I start?",
        a: "Anytime. Message your care team about treatment, side effects, or progress. A real person answers.",
      },
    ],
    ctaLabel: "Explore GLP-1 program",
    metaTitle: "Weight Loss | Tidl Health",
    metaDescription:
      "Learn how TIDL helps you lose weight with doctor-prescribed GLP-1, the pre-dosed pen, and ongoing telehealth care.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
  testosterone: {
    slug: "testosterone",
    navLabel: "Testosterone",
    title: "Testosterone",
    kicker: "Hormonal performance",
    headline: "Restore energy, strength, and focus.",
    lead:
      "TRT built around your labs and your life. Licensed providers, personalized protocols, and discreet delivery from US pharmacies.",
    extendedLead:
      "Low testosterone can affect energy, mood, strength, and focus. TIDL testosterone therapy starts with your symptoms and lab work, reviewed by a licensed provider who builds a protocol around how you actually feel, not a one-size-fits-all chart.",
    heroImage: SITE_IMAGES.services.testosterone,
    productSlugs: [],
    pillars: [
      {
        title: "Lab-guided protocols",
        body: "Treatment matched to your levels and how you feel day to day, not generic templates.",
      },
      {
        title: "Licensed medical review",
        body: "Every intake read by a doctor licensed in your state before prescribing.",
      },
      {
        title: "Ongoing telehealth care",
        body: "Adjust your plan with your care team as your body responds and labs evolve.",
      },
      {
        title: "Symptom-first approach",
        body: "Energy, drive, sleep, and recovery matter as much as the number on a lab report.",
      },
      {
        title: "US pharmacy fulfillment",
        body: "Medication dispensed by licensed pharmacies and shipped discreetly to your door.",
      },
      {
        title: "Clear, consistent care",
        body: "Message your provider, schedule follow-ups, and reorder without clinic waiting rooms.",
      },
    ],
    educationTitle: "Understanding testosterone therapy with TIDL",
    educationBlocks: [
      {
        title: "Who TRT is for",
        body: "Testosterone replacement therapy is for men with clinically low testosterone confirmed through labs and symptoms. A licensed provider evaluates both before recommending treatment. TIDL is not a shortcut around medical review.",
      },
      {
        title: "How your protocol is built",
        body: "Your provider reviews your intake, health history, and lab results to determine whether TRT is appropriate and at what dose. Plans evolve with follow-up labs and how you report feeling over time.",
      },
      {
        title: "What ongoing care looks like",
        body: "TRT is not set-and-forget. Your care team monitors progress, answers questions about injections or side effects, and adjusts dosing when needed. Everything happens through secure telehealth.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Share your symptoms",
        detail: "Complete the intake covering energy, mood, strength, sleep, and health history.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Lab review",
        detail: "Your provider reviews labs and symptoms together before prescribing TRT.",
        duration: "Provider-led",
      },
      {
        step: "03",
        label: "Personalized Rx",
        detail: "Dose and delivery format matched to your levels, lifestyle, and goals.",
        duration: "Tailored",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy in plain, unbranded packaging.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Monitor and adjust",
        detail: "Follow-up labs and messaging with your care team keep your plan on track.",
        duration: "Ongoing",
      },
    ],
    faqItems: [
      {
        id: 1,
        q: "Is TIDL testosterone therapy legitimate?",
        a: "Yes. Every TRT plan is prescribed by a licensed provider in your state and filled by a licensed US pharmacy after medical review.",
      },
      {
        id: 2,
        q: "Do I need blood work?",
        a: "Labs are central to safe TRT. Your provider will guide you on what is needed based on your intake and whether you have recent results.",
      },
      {
        id: 3,
        q: "Who reviews and prescribes my treatment?",
        a: "A licensed medical provider in your state reads your full intake before anything is prescribed. They reach out if they have questions.",
      },
      {
        id: 4,
        q: "Is shipping discreet?",
        a: "Yes. Plain outer packaging with no branding that reveals what is inside.",
      },
      {
        id: 5,
        q: "Can I pause or change my plan?",
        a: "You are in control. Talk to your provider before stopping treatment, since some protocols should not end abruptly.",
      },
    ],
    ctaLabel: "Explore TRT program",
    metaTitle: "Testosterone Therapy | Tidl Health",
    metaDescription:
      "Learn how TIDL testosterone therapy supports energy, strength, and hormonal health with licensed provider care.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
  longevity: {
    slug: "longevity",
    navLabel: "Longevity",
    title: "Longevity",
    kicker: "Recovery and longevity",
    headline: "Stay sharp, recover faster, age on your terms.",
    lead:
      "Peptide and metabolic protocols under physician supervision. Built for sleep, recovery, and long-term performance.",
    extendedLead:
      "Longevity care at TIDL is physician-supervised, not supplement-store guesswork. Whether you need recovery support after training or metabolic protocols for long-term health, a licensed provider reviews your goals and prescribes only when appropriate.",
    heroImage: SITE_IMAGES.services.longevity,
    productSlugs: ["nad-plus", "ghk-cu", "sermorelin"],
    pillars: [
      {
        title: "Peptide protocols",
        body: "Physician-supervised plans for recovery, sleep, and metabolic health tailored to your goals.",
      },
      {
        title: "Performance support",
        body: "Programs for athletes and high performers who want measurable recovery between sessions.",
      },
      {
        title: "Discreet ongoing care",
        body: "Message your care team, reorder, and adjust without clinic visits or long hold times.",
      },
      {
        title: "Pen or prescription format",
        body: "Select peptide treatments use the pre-dosed TIDL Pen. Others ship as physician-directed protocols.",
      },
      {
        title: "Evidence-guided plans",
        body: "Protocols built on clinical guidance, not trending ingredients with no medical oversight.",
      },
      {
        title: "Private, end to end",
        body: "Secure intake, discreet shipping, and confidential messaging with your care team.",
      },
    ],
    educationTitle: "Longevity and recovery care, done right",
    educationBlocks: [
      {
        title: "What are peptides?",
        body: "Peptides are short chains of amino acids your body already uses as signals. Peptide therapy uses specific compounds, prescribed by a provider, to support goals like recovery, sleep quality, and metabolic health.",
      },
      {
        title: "Pen vs. prescription protocol",
        body: "Some longevity treatments ship in the pre-dosed TIDL Pen for a simple weekly routine. Others arrive as physician-directed prescription protocols. Your provider recommends the format that fits your plan.",
      },
      {
        title: "Built for the long run",
        body: "Recovery and longevity are not one-time purchases. Your care team monitors how you respond, answers questions, and adjusts your protocol as your training load or health goals change.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Define your goals",
        detail: "Recovery, sleep, metabolic health, or performance. Your intake captures what you want to improve.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Provider review",
        detail: "A licensed doctor evaluates whether peptide or metabolic therapy is right for you.",
        duration: "Same day",
      },
      {
        step: "03",
        label: "Protocol set",
        detail: "Pen or prescription format chosen for your treatment. Dose set to your plan.",
        duration: "Personalized",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy with cold-chain packaging when required.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Iterate with your team",
        detail: "Message your care team, track recovery, and refine your protocol over time.",
        duration: "Ongoing",
      },
    ],
    penSpotlight: {
      kicker: "The TIDL Pen",
      title: "Your dose leaves the pharmacy ready.",
      titleEmphasis: "Just click.",
      lead:
        "Select longevity peptide protocols ship in the TIDL Pen — prescription strength set before delivery. No vials. No reconstitution. One consistent weekly click.",
      image: SITE_IMAGES.pen,
      features: [
        {
          num: "01",
          title: "Dose locked at the pharmacy",
          body: "Your provider writes the Rx. A licensed US pharmacy prepares the pen to match — you never dial at home.",
        },
        {
          num: "02",
          title: "Precision slider + scale",
          body: "Clear markings from 0.1 to 1.0 ml. The mechanism matches your prescription, not a DIY kit.",
        },
        {
          num: "03",
          title: "No mixing. No measuring.",
          body: "Pre-filled cartridge. Tiny needle. One click per dose — back to training and travel.",
        },
        {
          num: "04",
          title: "Cold-chain, discreet delivery",
          body: "Temperature-safe packaging in a plain outer box. Nothing on the label about what’s inside.",
        },
      ],
      trustNote: "Prescription required. Not every longevity protocol uses the pen — your provider chooses the right format.",
    },
    faqItems: [
      {
        id: 1,
        q: "Are TIDL peptide programs legitimate?",
        a: "Yes. Peptide and metabolic protocols are prescribed only after a licensed provider reviews your intake and determines treatment is medically appropriate.",
      },
      {
        id: 2,
        q: "Do all longevity treatments use the TIDL Pen?",
        a: "No. Some protocols use the pre-dosed pen; others ship as prescription treatments. Your provider recommends the right format for your plan.",
      },
      {
        id: 3,
        q: "Who supervises my protocol?",
        a: "A licensed medical provider in your state reviews your intake, prescribes when appropriate, and remains available for follow-up through telehealth.",
      },
      {
        id: 4,
        q: "Is shipping discreet?",
        a: "Yes. Plain outer packaging with no indication of contents on the box.",
      },
      {
        id: 5,
        q: "Can I adjust my protocol over time?",
        a: "Absolutely. Message your care team as your training, sleep, or recovery needs change.",
      },
    ],
    ctaLabel: "Explore longevity programs",
    metaTitle: "Longevity & Recovery | Tidl Health",
    metaDescription:
      "Learn how TIDL longevity and performance programs support recovery, sleep, and metabolic health.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
  "metabolic-health": {
    slug: "metabolic-health",
    navLabel: "Metabolic",
    title: "Metabolic Health",
    kicker: "Metabolic care",
    headline: "Steady energy. Better metabolic balance.",
    lead:
      "Physician-guided metabolic support for glucose balance, energy, and sustainable body composition — without gray-market guesswork.",
    extendedLead:
      "Metabolic health sits at the center of weight, energy, and long-term wellness. TIDL connects you with a licensed provider who reviews your intake and recommends treatment only when medically appropriate.",
    heroImage: SITE_IMAGES.services.metabolic,
    productSlugs: ["mots-c"],
    pillars: [
      {
        title: "Provider-first protocols",
        body: "Every plan starts with a licensed review of your history and goals.",
      },
      {
        title: "Legitimate pharmacy fulfillment",
        body: "Medication ships from licensed US pharmacies in discreet packaging.",
      },
      {
        title: "Progress you can track",
        body: "Check in with your care team and adjust as your body responds.",
      },
    ],
    educationTitle: "What metabolic care looks like with TIDL",
    educationBlocks: [
      {
        title: "Why metabolic health matters",
        body: "Energy, appetite, and body composition are tightly linked. A provider-led plan looks at the whole picture, not a single number.",
      },
      {
        title: "How TIDL approaches it",
        body: "Your intake doubles as medical history. A licensed provider decides whether treatment is appropriate and what format fits.",
      },
      {
        title: "What happens next",
        body: "If prescribed, medication ships discreetly and your care team stays available for questions and follow-up.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Take the intake",
        detail: "Share goals, history, and lifestyle in about five minutes.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Doctor review",
        detail: "A licensed provider reviews your full intake before prescribing.",
        duration: "Same day",
      },
      {
        step: "03",
        label: "Personalized plan",
        detail: "Treatment matched to your metabolic goals when appropriate.",
        duration: "Personalized",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy in plain packaging.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Ongoing support",
        detail: "Message your care team and reorder when you are ready.",
        duration: "Always on",
      },
    ],
    faqItems: [
      {
        id: 1,
        q: "Is metabolic care available now?",
        a: "This hub is launching soon. Start the intake today and we will match you when protocols go live. Weight-loss GLP-1 care is available now.",
      },
      {
        id: 2,
        q: "Will a real doctor review my case?",
        a: "Yes. Every TIDL treatment is prescribed by a licensed provider in your state after medical review.",
      },
      {
        id: 3,
        q: "Can I start with weight-loss care instead?",
        a: "Yes. GLP-1 weight-loss care is live now if that better matches your goals.",
      },
    ],
    ctaLabel: "Start metabolic intake",
    metaTitle: "Metabolic Health | Tidl Health",
    metaDescription:
      "Physician-guided metabolic health care from TIDL. Intake, provider review, and discreet pharmacy delivery.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
  performance: {
    slug: "performance",
    navLabel: "Performance",
    title: "Performance",
    kicker: "Performance care",
    headline: "Train harder. Recover smarter.",
    lead:
      "Clinically supervised performance protocols for strength, drive, and recovery — real prescriptions, not gray-market shortcuts.",
    extendedLead:
      "Performance care at TIDL is physician-supervised. A licensed provider reviews your goals and history, then recommends treatment only when it is medically appropriate for you.",
    heroImage: SITE_IMAGES.services.performance,
    productSlugs: ["cjc-1295-ipamorelin", "tesamorelin"],
    pillars: [
      {
        title: "Legitimate medical path",
        body: "Licensed providers and US pharmacies — never gray-market product.",
      },
      {
        title: "Goal-matched protocols",
        body: "Plans built around training, recovery, and how you actually perform.",
      },
      {
        title: "Discreet delivery",
        body: "Plain packaging from licensed pharmacies with ongoing telehealth support.",
      },
    ],
    educationTitle: "Performance care with medical oversight",
    educationBlocks: [
      {
        title: "What this hub covers",
        body: "Strength, drive, and recovery protocols under physician supervision — designed for people who want results without compromising safety.",
      },
      {
        title: "Why medical review matters",
        body: "Performance treatments are prescription-only. A licensed provider decides what is appropriate based on your intake and health history.",
      },
      {
        title: "How fulfillment works",
        body: "When prescribed, medication ships from a licensed US pharmacy. Your care team stays available for follow-up.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Share your goals",
        detail: "Complete a short intake covering training, recovery, and health history.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Provider review",
        detail: "A licensed doctor reviews your case before any prescription.",
        duration: "Same day",
      },
      {
        step: "03",
        label: "Personalized Rx",
        detail: "Protocol matched to your goals when medically appropriate.",
        duration: "Tailored",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy in plain packaging.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Ongoing support",
        detail: "Message your care team and adjust as your training evolves.",
        duration: "Ongoing",
      },
    ],
    faqItems: [
      {
        id: 1,
        q: "Is performance care live yet?",
        a: "This hub is coming soon. Start the intake now to be matched at launch. Weight-loss GLP-1 care is available today.",
      },
      {
        id: 2,
        q: "Is this the same as gray-market peptides?",
        a: "No. TIDL only uses licensed providers and licensed US pharmacies. That legitimacy is the core of the offer.",
      },
      {
        id: 3,
        q: "Who reviews my intake?",
        a: "A licensed telemedicine provider in your state reviews every intake before prescribing.",
      },
    ],
    ctaLabel: "Start performance intake",
    metaTitle: "Performance Care | Tidl Health",
    metaDescription:
      "Physician-supervised performance protocols from TIDL with licensed providers and discreet US pharmacy delivery.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
  recovery: {
    slug: "recovery",
    navLabel: "Recovery",
    title: "Recovery",
    kicker: "Recovery care",
    headline: "Sleep better. Repair faster.",
    lead:
      "Physician-guided recovery protocols for sleep, repair, and bounce-back — with the same medical standards as every TIDL treatment.",
    extendedLead:
      "Recovery is where progress sticks. TIDL recovery care starts with your intake, continues with licensed provider review, and ships only when a prescription is medically appropriate.",
    heroImage: SITE_IMAGES.services.recovery,
    productSlugs: ["bpc-157", "tb-500", "wolverine"],
    pillars: [
      {
        title: "Sleep and repair focus",
        body: "Protocols aimed at recovery quality, not stimulant shortcuts.",
      },
      {
        title: "Licensed oversight",
        body: "Every plan reviewed by a doctor licensed in your state.",
      },
      {
        title: "Care that continues",
        body: "Message your team, reorder simply, and adjust as needs change.",
      },
    ],
    educationTitle: "Recovery care with TIDL",
    educationBlocks: [
      {
        title: "What recovery care supports",
        body: "Sleep quality, post-training repair, and bounce-back under physician supervision.",
      },
      {
        title: "How prescribing works",
        body: "Your intake is reviewed by a licensed provider. Treatment is prescribed only when appropriate.",
      },
      {
        title: "Delivery and follow-up",
        body: "Medication ships discreetly from a licensed US pharmacy, with care messaging available after.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        label: "Take the intake",
        detail: "Share sleep, stress, training, and health history in minutes.",
        duration: "~5 min",
      },
      {
        step: "02",
        label: "Doctor review",
        detail: "A licensed provider reviews your case before prescribing.",
        duration: "Same day",
      },
      {
        step: "03",
        label: "Recovery protocol",
        detail: "Plan matched to your repair and sleep goals when appropriate.",
        duration: "Personalized",
      },
      {
        step: "04",
        label: "Discreet delivery",
        detail: "Shipped from a licensed US pharmacy in plain packaging.",
        duration: "2–5 days",
      },
      {
        step: "05",
        label: "Ongoing support",
        detail: "Check in with your care team as recovery needs evolve.",
        duration: "Always on",
      },
    ],
    faqItems: [
      {
        id: 1,
        q: "Is recovery care available now?",
        a: "This hub is launching soon. Complete the intake to be matched at launch. GLP-1 weight-loss care is live today.",
      },
      {
        id: 2,
        q: "Do I still see a real doctor?",
        a: "Yes. Any medical treatment at TIDL requires licensed provider review and a real prescription.",
      },
      {
        id: 3,
        q: "Is shipping discreet?",
        a: "Yes. Orders ship in plain packaging with no indication of contents on the outer box.",
      },
    ],
    ctaLabel: "Start recovery intake",
    metaTitle: "Recovery Care | Tidl Health",
    metaDescription:
      "Physician-guided recovery protocols from TIDL for sleep, repair, and bounce-back with discreet pharmacy delivery.",
    trustStats: TRUST_STATS,
    trustPillars: TRUST_PILLARS,
  },
};

export function getCategory(slug: CategorySlug): CategoryDefinition {
  return CATEGORIES[slug];
}

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}
