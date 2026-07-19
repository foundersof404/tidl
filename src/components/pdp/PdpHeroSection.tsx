import { useState, type MouseEvent } from "react";
import { getCatalogProduct } from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
import { usePdpData } from "./PdpDataProvider";

type PdpHeroSectionProps = {
  heroRef: React.RefObject<HTMLElement | null>;
  onStart: (e: MouseEvent) => void;
};

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="hm-hero-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "is-on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

function buildGallery(slug: string, heroImage: string, name: string) {
  const peptideShot = resolvePeptideOnlyImage(slug);
  const altShot = `/peptides/${slug}.png`;
  const sources = [heroImage, peptideShot, altShot].filter(Boolean);
  const unique = [...new Set(sources)].slice(0, 2);
  if (unique.length < 2) {
    unique.push(unique[0] ?? heroImage);
  }
  return unique.map((src, i) => ({
    src,
    alt: i === 0 ? `${name} product` : `${name} peptide vial`,
  }));
}

/** Product buy-box — peptide gallery + smoked beige stage. */
export function PdpHeroSection({ heroRef, onStart }: PdpHeroSectionProps) {
  const { slug, heroProduct, heroImage, marketing, goal } = usePdpData();
  const catalog = getCatalogProduct(slug);
  const name = catalog?.shortName ?? heroProduct.name;
  const gallery = buildGallery(slug, heroImage, name);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const active = gallery[galleryIndex] ?? gallery[0];

  const headline =
    goal === "weight-loss"
      ? "Feel like you again."
      : (marketing?.emotionalHeadline ?? "Care designed around your goals.");

  const support =
    goal === "weight-loss"
      ? "Doctor-prescribed peptide care. Licensed review. Delivered to your door."
      : (marketing?.emotionalSub ?? "Licensed provider review · US pharmacy · Peptide protocol.");

  return (
    <section className="hm-hero" id="hero" ref={heroRef} data-pdp-header-theme="light">
      <div className="hm-hero-shell">
        <div className="hm-hero-media">
          <div className="hm-hero-stage is-product">
            <img
              className="hm-hero-img"
              src={active.src}
              alt={active.alt}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="hm-hero-thumbs" role="tablist" aria-label="Product images">
            {gallery.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                type="button"
                role="tab"
                aria-selected={galleryIndex === i}
                className={`hm-hero-thumb${galleryIndex === i ? " is-active" : ""}`}
                onClick={() => setGalleryIndex(i)}
              >
                <img src={item.src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="hm-hero-buy">
          <p className="hm-hero-product-name">{name}</p>
          <h1 className="hm-hero-title">{headline}</h1>
          <p className="hm-hero-lead">{support}</p>

          <div className="hm-hero-rating">
            <strong>{heroProduct.rating}</strong>
            <StarRow rating={heroProduct.rating} />
            <span>{heroProduct.reviewCount} reviews</span>
          </div>

          <p className="hm-hero-price">{formatCurrency(heroProduct.startingPrice)}</p>
          <p className="hm-hero-price-note">
            {heroProduct.priceNote?.replace(/\s*·\s*TIDL Pen/gi, "") ||
              "Package price · Provider review · Prescription · Discreet delivery"}
          </p>

          <div className="hm-hero-actions">
            <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
              Take the 5-minute quiz
            </button>
            <a className="hm-btn hm-btn-secondary" href="#how">
              See how it works
            </a>
          </div>

          <p className="hm-hero-trust">HSA &amp; FSA eligible · Prescription required</p>
        </div>
      </div>
    </section>
  );
}
