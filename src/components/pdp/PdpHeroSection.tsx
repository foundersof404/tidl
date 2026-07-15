import { useState, type MouseEvent } from "react";
import { getCatalogProduct } from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/pricing";
import { usePdpData } from "./PdpDataProvider";

type PdpHeroSectionProps = {
  heroRef: React.RefObject<HTMLElement | null>;
  onStart: (e: MouseEvent) => void;
};

/** Minimal Hims-style buy box — media left, short copy + CTAs right. */
export function PdpHeroSection({ heroRef, onStart }: PdpHeroSectionProps) {
  const { slug, heroProduct, heroImage, penImage } = usePdpData();
  const catalog = getCatalogProduct(slug);
  const name = catalog?.shortName ?? heroProduct.name;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const whatItDoes =
    heroProduct.specs.find((s) => /what it does/i.test(s.label))?.detail ??
    heroProduct.summary;
  const howTo =
    heroProduct.specs.find((s) => /how to use|weekly protocol/i.test(s.label))?.detail ??
    "Follow your provider’s protocol. Your shipment includes clear how-to instructions.";

  const bullets =
    heroProduct.perks.length >= 3
      ? heroProduct.perks.slice(0, 3).map((p) => p.label)
      : [
          heroProduct.descriptor,
          "Licensed provider review before anything ships",
          "Pay once for this treatment — no monthly plan",
        ];

  const gallery = [
    { src: heroImage, alt: `${name} product` },
    { src: penImage || heroImage, alt: `${name} with TIDL Pen` },
    { src: "/pdp/patient-aspire.png", alt: "Care that fits real life" },
  ];

  const accordions = [
    { id: "meet", title: `Meet ${name}`, body: heroProduct.summary },
    { id: "ingredients", title: "About the ingredients", body: whatItDoes },
    { id: "how", title: "How to take", body: howTo },
  ];

  return (
    <section className="hm-hero" id="hero" ref={heroRef} data-pdp-header-theme="light">
      <div className="hm-hero-shell">
        <div className="hm-hero-media">
          <div className="hm-hero-stage">
            <img
              className="hm-hero-img"
              src={gallery[galleryIndex]?.src}
              alt={gallery[galleryIndex]?.alt}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="hm-hero-thumbs" role="tablist" aria-label="Product images">
            {gallery.map((item, i) => (
              <button
                key={item.src + i}
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
          <span className="hm-badge">HSA &amp; FSA eligible</span>
          <h1 className="hm-hero-title">{name}</h1>

          <ul className="hm-hero-bullets">
            {bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <p className="hm-hero-price">
            {formatCurrency(heroProduct.startingPrice)}
            <span>one package</span>
          </p>
          <p className="hm-hero-price-note">{heroProduct.priceNote}</p>

          <div className="hm-hero-actions">
            <button type="button" className="hm-btn hm-btn-primary" onClick={onStart}>
              Get started
            </button>
            <button type="button" className="hm-btn hm-btn-secondary" onClick={onStart}>
              See if I&apos;m eligible
            </button>
          </div>

          <a className="hm-safety-link" href="#safety">
            Important safety information
          </a>

          <div className="hm-accordions">
            {accordions.map((item) => {
              const open = openAccordion === item.id;
              return (
                <div key={item.id} className={`hm-acc${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="hm-acc-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenAccordion(open ? null : item.id)}
                  >
                    <span>{item.title}</span>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path
                        d="M4.5 6.75L9 11.25L13.5 6.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {open ? <div className="hm-acc-panel">{item.body}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
