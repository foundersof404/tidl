import { SITE_IMAGES } from "@/lib/site-assets";

export type Testimonial = {
  name: string;
  quote: string;
  condition: string;
  result: string;
  role: string;
  featured?: boolean;
  portraitImage: string;
  contextImage?: string;
  /** When “man”, review media is rendered smaller on PDP. */
  figure?: "man" | "woman";
};

const P = SITE_IMAGES.testimonialPortraits;
const C = SITE_IMAGES.testimonialContext;

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Elena V.",
    quote:
      "Five-minute quiz, doctor review, treatment at my door. Down 18 pounds in 14 weeks — finally feeling like myself again.",
    condition: "Weight Loss",
    result: "−18 lbs in 14 weeks*",
    role: "Verified Patient",
    featured: true,
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "James R.",
    quote:
      "No waiting rooms, no awkward visits. The care team responds, reordering takes one tap. Genuinely the easiest health decision I've made.",
    condition: "GLP-1 Care",
    result: "−14 lbs in 10 weeks*",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
  {
    name: "Priya N.",
    quote:
      "Felt legitimate from day one — real doctors, real pharmacy, clear instructions. Three months in and the results speak for themselves.",
    condition: "Metabolic Health",
    result: "−11 lbs in 12 weeks*",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
];

export const GLP1_TESTIMONIALS: Testimonial[] = [
  {
    name: "Elena V.",
    quote:
      "Five-minute quiz, doctor review, treatment at my door. Down 18 pounds in 14 weeks — finally feeling like myself again.",
    condition: "Weight Loss",
    result: "−18 lbs in 14 weeks*",
    role: "Verified Patient",
    featured: true,
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Priya N.",
    quote:
      "What I appreciated most was how medical it felt without being clinical. A real provider reviewed my intake, the pharmacy shipped discreetly, and messaging the care team actually gets a response.",
    condition: "GLP-1 Care",
    result: "4 months in",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "James R.",
    quote:
      "The protocol felt clear from day one. No confusion — just my prescribed dose, ready when I needed it. I've lost weight steadily without turning my kitchen into a lab.",
    condition: "GLP-1 Weight Loss",
    result: "−12 lbs",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
];

/** Peptide PDP reviews — women featured first; media from sandbox peptide assets only. */
export const PEPTIDE_TESTIMONIALS: Testimonial[] = [
  {
    name: "Elena V.",
    quote:
      "I finally felt like the plan was built for me — not a generic peptide from who-knows-where. Provider reviewed everything, pharmacy shipped discreetly, and the vial arrived labeled clearly.",
    condition: "Peptide Care",
    result: "12 weeks in",
    role: "Verified Patient",
    featured: true,
    portraitImage: P.woman,
    contextImage: "/peptides/ba/bpc-157-after.png",
    figure: "woman",
  },
  {
    name: "Priya N.",
    quote:
      "Recovery stopped feeling like a guessing game. Clear dosing from my provider, US pharmacy vial, and someone to message when I had questions.",
    condition: "Recovery",
    result: "Protocol month 2",
    role: "Verified Patient",
    portraitImage: P.woman,
    contextImage: "/peptides/ba/tb-500-after.png",
    figure: "woman",
  },
  {
    name: "James R.",
    quote:
      "No gray-market bottles. Real prescription, real pharmacy label, real follow-up. That alone made me trust the process.",
    condition: "Performance",
    result: "Verified order",
    role: "Verified Patient",
    portraitImage: P.man,
    contextImage: "/peptides/ba/wolverine-after.png",
    figure: "man",
  },
];

/**
 * Full homepage Stories set — patient portraits only on the landing marquee.
 * PrescribeRx sandbox has no `/reviews` API; quotes are marketing copy paired
 * with portrait photos (not product / pen imagery).
 */
export const HOME_STORIES: Testimonial[] = [
  {
    name: "Elena V.",
    quote:
      "Five-minute quiz, doctor review, treatment at my door. Down 18 pounds in 14 weeks — finally feeling like myself again.",
    condition: "Weight Loss · GLP-1",
    result: "−18 lbs in 14 weeks*",
    role: "Verified Patient",
    featured: true,
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Priya N.",
    quote:
      "Felt legitimate from day one — real doctors, real pharmacy, clear instructions. Three months in and the results speak for themselves.",
    condition: "Metabolic Health",
    result: "−11 lbs in 12 weeks*",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "James R.",
    quote:
      "No waiting rooms, no awkward visits. The care team responds, reordering takes one tap. Genuinely the easiest health decision I've made.",
    condition: "GLP-1 Care",
    result: "−14 lbs in 10 weeks*",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
  {
    name: "Maya L.",
    quote:
      "The Retatrutide plan was explained clearly before I paid anything. Provider reviewed my intake the same day. I finally feel like appetite isn't running my whole week.",
    condition: "Weight Loss · Retatrutide",
    result: "Steady week 8",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Sofia K.",
    quote:
      "BPC-157 arrived labeled from a US pharmacy — no mystery vial. Recovery stopped feeling like guesswork, and messaging care gets a real reply.",
    condition: "Recovery · BPC-157",
    result: "Protocol month 2",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Daniel M.",
    quote:
      "TB-500 was prescribed only after a full peptide assessment. Clear dose, clear shipping, no gray-market stress.",
    condition: "Recovery · TB-500",
    result: "Verified order",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
  {
    name: "Ava R.",
    quote:
      "Wolverine stack felt serious from the start — ID check, provider review, pharmacy label. That alone made me trust TIDL over random sites.",
    condition: "Recovery · Wolverine",
    result: "12 weeks in",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Noah P.",
    quote:
      "CJC / Ipamorelin nights are simple now. Provider set the protocol, vial was crystal-clear labeled, and follow-up didn't feel like an afterthought.",
    condition: "Performance · CJC / Ipamorelin",
    result: "Month 1",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
  {
    name: "Isla T.",
    quote:
      "Tesamorelin was always something I'd only do with a real doctor watching. Intake was thorough, shipping discreet — exactly what I needed.",
    condition: "Performance · Tesamorelin",
    result: "Week 6",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Omar H.",
    quote:
      "MOTS-C for metabolic focus. Felt clinical without feeling cold — quiz, labs questions, prescription only when it made sense.",
    condition: "Metabolic · MOTS-C",
    result: "Ongoing",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
  {
    name: "Chloe S.",
    quote:
      "NAD+ nights with a licensed provider behind it. Packaging was plain, vial was clear, and I never felt upsold into something I didn't need.",
    condition: "Longevity · NAD+",
    result: "8 weeks",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Hannah W.",
    quote:
      "GHK-Cu was part of a skin + recovery conversation with my provider — not a beauty influencer link. That difference matters.",
    condition: "Longevity · GHK-Cu",
    result: "Verified Patient",
    role: "Verified Patient",
    portraitImage: P.woman,
    figure: "woman",
  },
  {
    name: "Leo C.",
    quote:
      "Sermorelin with physician oversight. Sleep and recovery feel different — and having a care team to ask is what keeps me on the protocol.",
    condition: "Longevity · Sermorelin",
    result: "Month 3",
    role: "Verified Patient",
    portraitImage: P.man,
    figure: "man",
  },
];
