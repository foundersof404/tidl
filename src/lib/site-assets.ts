/** TIDL site imagery — gold-direction hf_20260705/06 shoot + shared assets */

import categoryMetabolicHealth from "@/assets/category-metabolic-health.png";
import categoryPerformance from "@/assets/category-performance.png";
import categoryRecovery from "@/assets/category-recovery.png";
import familiesMeasureProgress from "@/assets/families-measure-progress.png";
import testimonialPortraitMan from "@/assets/testimonial-portrait-man.png";
import testimonialPortraitWoman from "@/assets/testimonial-portrait-woman.png";
import tidlPenWithLabel from "@/assets/TIDL_Pen-Rendering_WITH-LABEL.png";

export const CDN = "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9";

const img = (path: string) => `${CDN}/${path}`;

export const SITE_IMAGES = {
  hero: {
    main: img("6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a.png"),
    srcSet: [
      "6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-500.png 500w",
      "6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-800.png 800w",
      "6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-1080.png 1080w",
      "6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-1600.png 1600w",
      "6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a.png 3024w",
    ]
      .map((entry) => `${CDN}/${entry}`)
      .join(", "),
    overlay: img("6a484775bf274d9b9ec3f7ba_overlay%20(2).png"),
    overlaySrcSet: [
      "6a484775bf274d9b9ec3f7ba_overlay%2520(2)-p-500.png 500w",
      "6a484775bf274d9b9ec3f7ba_overlay%2520(2)-p-1080.png 1080w",
      "6a484775bf274d9b9ec3f7ba_overlay%20(2).png 1440w",
    ]
      .map((entry) => `${CDN}/${entry}`)
      .join(", "),
  },
  services: {
    weightLoss: img("6a4a948975e49a6ca9c6b6e5_hf_20260705_172618_ea8e3be2-4637-4096-83cc-5ec995f07e09.png"),
    testosterone: img("6a4a95a92a6dee9e17ed919e_hf_20260705_173015_06ec6b8c-b985-4bab-80b1-41afe144db92.png"),
    longevity: img("6a4bd7ba829cdf371074ee74_hf_20260706_160923_8f107d2e-39e5-41c3-8290-18fd580d714a.png"),
    metabolic: categoryMetabolicHealth,
    performance: categoryPerformance,
    recovery: categoryRecovery,
  },
  /**
   * Labeled TIDL Pen product cutout.
   * Used with the Webflow pen-stage treatment (levitate / blade / aura / shadow) —
   * not as a framed lifestyle photo.
   */
  pen: tidlPenWithLabel,
  products: {
    penPrimary: tidlPenWithLabel,
    penSecondary: tidlPenWithLabel,
    pillPink: "/product 3 3d pink.png",
    pillProtocol: "/WhatsApp_Image_2026-06-17_at_1.36.29_AM__1_-removebg-preview.png",
  },
  families: {
    bg: img("6a4bdcc786041c1c67e4f84a_hf_20260706_164258_2d8f8b0b-75a0-491a-bc5b-ce98730f9f41.png"),
    cardShadow: img("6a484775bf274d9b9ec3f7bb_shadow%20(17).png"),
    progress: familiesMeasureProgress,
  },
  auth: {
    brand: familiesMeasureProgress,
  },
  journey: {
    circle: img("6a484775bf274d9b9ec3f79b_Circle.svg"),
    center: img("6a4aec42b6e5359eece02ec0_hf_20260705_222419_e9eea2f4-16e9-4829-bc36-184ebd9190fc%20(1).png"),
  },
  howItWorks: [
    img("6a4aa74cb673463b10d3ae0a_hf_20260705_182659_b144a633-d893-4de0-b45e-39e6df164b2f.png"),
    img("6a4aa74d68be0cc0c1e6ff78_hf_20260705_183156_8357ac89-69ac-4055-a74d-07ea368560c8.png"),
    img("6a4aa92efc42f4d1ca52f73b_hf_20260705_185141_41c69960-1413-4b75-8318-f0800323717b.png"),
  ],
  pdp: {
    lifestyle: img("6a4a948975e49a6ca9c6b6e5_hf_20260705_172618_ea8e3be2-4637-4096-83cc-5ec995f07e09.png"),
    packaging: img("6a4bbd9950fd69347716fcab_hf_20260706_142630_ecfd4adf-10ef-4ea0-804d-21e9849d1aa8.png"),
    care: img("6a4aec42b6e5359eece02ec0_hf_20260705_222419_e9eea2f4-16e9-4829-bc36-184ebd9190fc%20(1).png"),
    cta: img("6a4aadd9bef554b822fc1e2e_hf_20260705_190921_9cf62bf3-9feb-43b9-a0c0-ff9a0694d429.png"),
  },
  footer: {
    decorative: img("6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM.png"),
    decorativeSrcSet: [
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-500.png 500w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-800.png 800w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-1080.png 1080w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-1600.png 1600w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-2000.png 2000w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM-p-2600.png 2600w",
      "6a48596ac890892ac42d3e95_ChatGPTImageJul4202603_52_14AM.png 3149w",
    ]
      .map((entry) => `${CDN}/${entry}`)
      .join(", "),
  },
  testimonialContext: [
    img("6a4a948975e49a6ca9c6b6e5_hf_20260705_172618_ea8e3be2-4637-4096-83cc-5ec995f07e09.png"),
    img("6a4bbd9950fd69347716fcab_hf_20260706_142630_ecfd4adf-10ef-4ea0-804d-21e9849d1aa8.png"),
    img("6a4aa74d68be0cc0c1e6ff78_hf_20260705_183156_8357ac89-69ac-4055-a74d-07ea368560c8.png"),
  ],
  testimonialPortraits: {
    man: testimonialPortraitMan,
    woman: testimonialPortraitWoman,
  },
} as const;

export const SOCIAL_ICONS = {
  facebook: img("6a484775bf274d9b9ec3f798_social%20icon%20(19).svg"),
  x: img("6a484775bf274d9b9ec3f799_social%20icon%20(20).svg"),
  linkedin: img("6a484775bf274d9b9ec3f79a_social%20icon%20(21).svg"),
  instagram: img("6a484775bf274d9b9ec3f797_social%20icon%20(18).svg"),
} as const;
