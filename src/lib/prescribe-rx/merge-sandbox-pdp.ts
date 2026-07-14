import type { PdpPageContent } from "@/components/pdp/data/types";
import type { LiveProduct } from "@/lib/prescribe-rx/use-live-catalog";

/**
 * Light overlay of the live sandbox product onto the static PDP shell.
 *
 * Only safe, customer-facing fields are overlaid — the product name, catalog
 * descriptor, summary, and vial image. Pricing stays curated (the sandbox is
 * full of $10 placeholders), and the raw sandbox facts (SKU, ids, wholesale
 * price, etc.) live only in the clearly-labeled `PdpSandboxFactsSection`, never
 * in the hero, "Protocol" specs, or "What's included" copy.
 */
export function mergeSandboxIntoPdp(
  base: PdpPageContent,
  live: LiveProduct | undefined,
): PdpPageContent {
  if (!live) return base;

  const box = live.handBox;
  const summary =
    live.description?.trim() ||
    live.shortDescription?.trim() ||
    base.heroProduct.summary;

  const usePeptideImage = base.productForm !== "pen";
  const image = usePeptideImage ? live.image : base.heroImage;

  return {
    ...base,
    heroImage: image,
    penImage: usePeptideImage ? live.image : base.penImage,
    heroProduct: {
      ...base.heroProduct,
      name: live.name,
      descriptor: `${box.productClass} · ${box.formLabel}`,
      summary,
      // Keep curated startingPrice, priceNote, specs, perks, and trustNote —
      // the sandbox price is a $10 placeholder and must not surface here.
    },
  };
}
