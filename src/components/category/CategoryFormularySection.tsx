import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { formatCurrency } from "@/lib/pricing";
import { resolvePeptideOnlyImage } from "@/lib/peptide-images";
import { getCatalogProduct, getCatalogPrice } from "@/lib/product-catalog";
import { getPeptideDef } from "@/lib/peptides";
import type { CategoryDefinition } from "@/lib/categories";
import type { ProductSlug } from "@/types/quiz";
import {
  useHomeSandbox,
  type HomeFeaturedPeptide,
} from "@/lib/prescribe-rx/use-home-sandbox";
import { CATEGORY_GOAL_MAP } from "@/lib/category-recommendations";
import "./category-formulary.css";

type CategoryFormularySectionProps = {
  category: CategoryDefinition;
};

type ShelfItem = {
  slug: ProductSlug;
  name: string;
  compound: string;
  hook: string;
  description: string;
  outcomes: readonly string[];
  displayPrice: number;
  image: string;
  strength: string;
  formLabel: string;
  productClass: string;
  sku: string | null;
  variantCount: number;
  variantHints: string[];
  popular: boolean;
};

function buildShelf(
  productSlugs: readonly ProductSlug[],
  featured: HomeFeaturedPeptide[],
): ShelfItem[] {
  const liveBySlug = new Map(featured.map((item) => [item.slug, item]));

  return productSlugs.flatMap((slug) => {
    const live = liveBySlug.get(slug);
    const catalog = getCatalogProduct(slug);
    const peptide = getPeptideDef(slug);
    if (!live && !catalog && !peptide) return [];

    const marketingPrice = getCatalogPrice(slug);
    const compound =
      peptide?.compound ??
      (slug === "glp-1-weight-loss" ? "Tirzepatide" : catalog?.shortName ?? slug);
    const name =
      slug === "glp-1-weight-loss"
        ? "GLP-1 Weight Loss"
        : (peptide?.productName ?? peptide?.compound ?? live?.live.name ?? catalog?.shortName ?? slug);

    return [
      {
        slug,
        name,
        compound,
        hook:
          slug === "glp-1-weight-loss"
            ? "Steady, measurable weight loss — dose set in the TIDL Pen before it ships."
            : (peptide?.hook ??
              live?.hook ??
              catalog?.headline ??
              "Physician-guided treatment built for measurable results."),
        description:
          slug === "glp-1-weight-loss"
            ? (catalog?.summary ??
              "Tirzepatide mimics gut hormones that curb appetite and support significant, sustainable fat loss — prescribed only after a licensed provider review.")
            : (peptide?.summary ?? live?.live.shortDescription?.trim() ?? catalog?.summary ?? ""),
        outcomes: (peptide?.outcomes ?? live?.outcomes ?? catalog?.highlights ?? []).slice(0, 3),
        displayPrice: live?.displayPrice ?? marketingPrice,
        image: resolvePeptideOnlyImage(slug) || live?.live.image || catalog?.image || "",
        strength: live?.live.handBox.strength ?? peptide?.dosage ?? "Provider-set",
        formLabel:
          live?.live.handBox.formLabel ??
          (catalog?.form === "pen" ? "TIDL Pen" : "Peptide protocol"),
        productClass: live?.live.handBox.productClass ?? "Physician-guided",
        sku: live?.live.sku ?? null,
        variantCount: live?.live.variants.length ?? 0,
        variantHints: (live?.live.variants ?? [])
          .map((v) => v.formHint)
          .filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i)
          .slice(0, 3),
        popular: slug === "glp-1-weight-loss" || slug === "wolverine",
      },
    ];
  });
}

/**
 * Sales-first treatment shelf for a category — peptides lead with outcomes and CTAs.
 */
export function CategoryFormularySection({ category }: CategoryFormularySectionProps) {
  const { openModal } = useQuizModal();
  const { featured, catalogCount, loading } = useHomeSandbox();

  const products = useMemo(
    () => buildShelf(category.productSlugs, featured),
    [category.productSlugs, featured],
  );
  const liveCount = products.filter((p) => p.sku).length;
  const goal = CATEGORY_GOAL_MAP[category.slug];

  return (
    <section
      className="cform"
      id="category-formulary"
      data-site-header-theme="light"
      aria-label={`${category.title} treatments`}
    >
      <div className="cform-inner">
        <header className="cform-head">
          <p className="cform-kicker">
            <span className="cform-kicker-dot" aria-hidden="true" />
            Treatments
          </p>
          <h2 className="cform-title">
            {category.productSlugs.length > 1
              ? `Choose your ${category.navLabel.toLowerCase()} protocol`
              : category.productSlugs.length === 1
                ? `${category.navLabel} protocol`
                : `${category.navLabel} care pathway`}
            <span>
              Outcome-led. Physician-prescribed.
              {liveCount > 0
                ? ` ${liveCount} live sandbox SKU${liveCount === 1 ? "" : "s"} on this pathway${
                    catalogCount > 0 ? ` · ~${catalogCount} pharmacy SKUs total` : ""
                  }.`
                : loading
                  ? " Syncing PrescribeRx sandbox…"
                  : " Built to convert effort into results."}
            </span>
          </h2>
        </header>

        {products.length > 0 ? (
          <div className="cform-shelf">
            {products.map((item, index) => (
              <article
                key={item.slug}
                className={`cform-card${index === 0 ? " is-lead" : ""}${
                  item.popular ? " is-popular" : ""
                }`}
              >
                <div className="cform-card-media" aria-hidden="true">
                  <div className="cform-card-glow" />
                  {item.image ? (
                    <img src={item.image} alt="" className="cform-card-vial" loading="lazy" />
                  ) : null}
                  {item.popular ? <span className="cform-card-badge">Best seller</span> : null}
                </div>

                <div className="cform-card-copy">
                  <p className="cform-card-index">
                    <span>{item.compound}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.formLabel}</span>
                  </p>
                  <h3 className="cform-card-name">{item.name}</h3>
                  {item.displayPrice > 0 ? (
                    <p className="cform-card-price">
                      <em>From</em>
                      <b>{formatCurrency(item.displayPrice)}</b>
                      <i>/mo</i>
                    </p>
                  ) : (
                    <p className="cform-card-price">
                      <em>Pricing</em>
                      <b>After review</b>
                    </p>
                  )}
                  <p className="cform-card-hook">{item.hook}</p>
                  {item.description ? <p className="cform-card-desc">{item.description}</p> : null}

                  {item.outcomes.length > 0 ? (
                    <ul className="cform-card-outcomes">
                      {item.outcomes.map((o) => (
                        <li key={o}>
                          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <dl className="cform-card-facts">
                    <div>
                      <dt>Strength</dt>
                      <dd>{item.strength}</dd>
                    </div>
                    <div>
                      <dt>Form</dt>
                      <dd>{item.formLabel}</dd>
                    </div>
                    {item.sku ? (
                      <div>
                        <dt>SKU</dt>
                        <dd>{item.sku}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>Class</dt>
                      <dd>{item.productClass}</dd>
                    </div>
                    {item.variantCount > 1 ? (
                      <div>
                        <dt>Variants</dt>
                        <dd>{item.variantCount} SKUs</dd>
                      </div>
                    ) : null}
                  </dl>

                  {item.variantHints.length > 0 ? (
                    <p className="cform-card-variants">
                      Also in sandbox: {item.variantHints.join(" · ")}
                      {item.variantCount > item.variantHints.length ? " · …" : ""}
                    </p>
                  ) : null}

                  <div className="cform-card-actions">
                    <button
                      type="button"
                      className="cform-btn cform-btn--primary"
                      onClick={() => openModal({ product: item.slug, goal })}
                    >
                      Start intake
                      <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.slug }}
                      className="cform-btn cform-btn--ghost"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cform-empty">
            <h3>
              {category.slug === "testosterone"
                ? "Start with a provider-guided TRT pathway"
                : `${category.title} protocols coming online`}
            </h3>
            <p>
              {category.slug === "testosterone"
                ? "Licensed review of labs and symptoms before any prescription. Begin intake now."
                : `Start the assessment — we’ll match you to the right ${category.navLabel.toLowerCase()} protocol.`}
            </p>
            <button
              type="button"
              className="cform-btn cform-btn--primary"
              onClick={() => openModal({ goal })}
            >
              {category.ctaLabel}
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
