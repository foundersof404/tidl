import type { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import handHeldPeptideHero from "@/assets/tidl-hand-held-bpc157-hero.png";
import carePortrait from "@/assets/tidl-care-confident-man-cutout.png";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
import type { CategorySlug } from "@/lib/categories";
import "./care-mosaic.css";

type CareMosaicSectionProps = {
  onStartAssessment?: (event?: MouseEvent) => void;
};

const PATHWAYS: readonly {
  slug: CategorySlug;
  title: string;
  copy: string;
  image: string;
}[] = [
  {
    slug: "weight-loss",
    title: "Weight loss",
    copy: "Quieter food noise. Steadier progress.",
    image: resolvePeptideOnlyImage("glp-1-weight-loss"),
  },
  {
    slug: "testosterone",
    title: "Testosterone",
    copy: "Support energy, strength, and vitality.",
    image: resolvePeptideOnlyImage("sermorelin"),
  },
  {
    slug: "recovery",
    title: "Recovery",
    copy: "Move, recover, and come back stronger.",
    image: resolvePeptideOnlyImage("wolverine"),
  },
] as const;

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function CareMosaicSection({ onStartAssessment }: CareMosaicSectionProps) {
  return (
    <section className="care-mosaic" aria-labelledby="care-mosaic-title" data-site-header-theme="light">
      <div className="care-mosaic__intro">
        <p className="care-mosaic__eyebrow">A clearer way into care</p>
        <h2 id="care-mosaic-title">Care that starts with where you are.</h2>
      </div>

      <div className="care-mosaic__grid">
        <button
          type="button"
          className="care-mosaic__feature care-mosaic__feature--assessment"
          onClick={onStartAssessment}
        >
          <img
            className="care-mosaic__assessment-image"
            src={handHeldPeptideHero}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="care-mosaic__assessment-shade" aria-hidden="true" />
          <span className="care-mosaic__feature-copy">
            <span className="care-mosaic__tag">About five minutes</span>
            <span className="care-mosaic__feature-kicker">Your clearest first step</span>
            <strong>Start with your health, not a product.</strong>
            <span className="care-mosaic__feature-link">
              Start your assessment <Arrow />
            </span>
          </span>
          <span className="care-mosaic__peptide-callout" aria-hidden="true">
            <span>Provider-guided peptide care</span>
          </span>
        </button>

        <a className="care-mosaic__feature care-mosaic__feature--care" href="#journey">
          <svg
            className="care-mosaic__trajectory"
            viewBox="0 0 600 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="care-mosaic__trajectory-line care-mosaic__trajectory-line--rest"
              d="M-20 356 C120 300 210 410 330 345 S500 250 640 288"
            />
            <path
              className="care-mosaic__trajectory-line care-mosaic__trajectory-line--hover"
              d="M-20 420 C130 455 230 268 350 318 S510 170 640 210"
            />
            <g className="care-mosaic__trajectory-points care-mosaic__trajectory-points--rest">
              <circle cx="118" cy="330" r="5" />
              <circle cx="330" cy="345" r="5" />
              <circle cx="530" cy="266" r="5" />
            </g>
            <g className="care-mosaic__trajectory-points care-mosaic__trajectory-points--hover">
              <circle cx="128" cy="412" r="5" />
              <circle cx="350" cy="318" r="5" />
              <circle cx="540" cy="192" r="5" />
            </g>
          </svg>
          <img
            className="care-mosaic__care-image"
            src={carePortrait}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="care-mosaic__care-shade" aria-hidden="true" />
          <span className="care-mosaic__feature-copy">
            <span className="care-mosaic__tag">Clinician-led</span>
            <span className="care-mosaic__feature-kicker">Human review, digital ease</span>
            <strong>Care that stays personal.</strong>
            <span className="care-mosaic__feature-link">
              See the care model <Arrow />
            </span>
          </span>
        </a>

        <div className="care-mosaic__pathways" aria-label="Explore care goals">
          {PATHWAYS.map((pathway, index) => (
            <Link
              key={pathway.slug}
              to="/category/$slug"
              params={{ slug: pathway.slug }}
              className="care-mosaic__pathway"
            >
              <span className="care-mosaic__pathway-number">0{index + 1}</span>
              <span className="care-mosaic__pathway-copy">
                <strong>{pathway.title}</strong>
                <span>{pathway.copy}</span>
              </span>
              <img src={pathway.image} alt="" loading="lazy" decoding="async" />
              <span className="care-mosaic__pathway-arrow" aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <p className="care-mosaic__note">
        Prescription treatment requires provider approval and may not be appropriate for everyone.
      </p>
    </section>
  );
}
