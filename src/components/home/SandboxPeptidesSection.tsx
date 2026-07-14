import { Link } from "@tanstack/react-router";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { formatCurrency } from "@/lib/pricing";
import { useHomeSandbox } from "@/lib/prescribe-rx/use-home-sandbox";
import "./sandbox-home.css";

function money(n: number | null | undefined) {
  if (n == null) return null;
  return formatCurrency(n);
}

/**
 * Landing section driven by the PrescribeRx sandbox — same fetch pattern as the quiz:
 * live catalog for featured peptides + encounter-type pathways for “how care works”.
 * Does NOT list all ~120 catalog SKUs.
 */
export function SandboxPeptidesSection() {
  const { openModal } = useQuizModal();
  const { loading, featured, encounters, catalogCount, packageCount } = useHomeSandbox();

  return (
    <section className="hsb" id="sandbox-peptides" data-site-header-theme="light">
      <div className="hsb-inner">
        <header className="hsb-head">
          <p className="hsb-kicker">Live from PrescribeRx sandbox</p>
          <h2 className="hsb-title">Featured peptides &amp; care pathways</h2>
          <p className="hsb-lead">
            Name, SKU, label strength, and sandbox metadata for every marketed TIDL treatment —
            pulled live from the TIDL Sandbox. The pharmacy catalog has about{" "}
            {catalogCount > 0 ? catalogCount : "120"} SKUs
            {packageCount > 0 ? ` and ${packageCount} packages` : ""}; we show the curated set
            below, not the full formulary.
          </p>
          {loading ? <p className="hsb-status">Refreshing sandbox data…</p> : null}
        </header>

        {/* Encounter pathways (fetched like the quiz) */}
        {encounters.length > 0 ? (
          <div className="hsb-pathways">
            <h3 className="hsb-subhead">How care starts in the sandbox</h3>
            <ul className="hsb-pathway-list">
              {encounters.map((enc) => (
                <li key={enc.id} className="hsb-pathway">
                  <div className="hsb-pathway-top">
                    <strong>{enc.name.trim()}</strong>
                    <span className="hsb-pathway-meta">
                      {enc.interaction_type ?? "Async"}
                      {enc.requires_labs ? " · Labs required" : ""}
                    </span>
                  </div>
                  <p className="hsb-pathway-body">
                    {enc.description?.trim() ||
                      (enc.product_class
                        ? `Provider pathway for ${enc.product_class}.`
                        : "Provider review pathway in PrescribeRx.")}
                  </p>
                  {enc.product_class ? (
                    <span className="hsb-pathway-class">{enc.product_class}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Featured peptides */}
        <div className="hsb-grid">
          {featured.map(({ slug, live, hook, outcomes, goalLabel, displayPrice }) => {
            const price = money(live.price);
            return (
              <article key={slug} className="hsb-card">
                <div className="hsb-card-media">
                  <img
                    src={live.image}
                    alt={live.name}
                    loading="lazy"
                    className="hsb-card-vial"
                  />
                </div>

                <div className="hsb-card-copy">
                  <span className="hsb-card-goal">{goalLabel}</span>
                  <h3 className="hsb-card-name">{live.name}</h3>
                  <p className="hsb-card-price">
                    From {formatCurrency(displayPrice)}
                    <span>/mo</span>
                  </p>
                  <p className="hsb-card-hook">{hook}</p>
                  <p className="hsb-card-desc">
                    {live.shortDescription?.trim() || live.handBox.clinicalLabel}
                  </p>

                  <ul className="hsb-card-facts">
                    <li>
                      <span>SKU</span>
                      <strong>{live.sku ?? "—"}</strong>
                    </li>
                    <li>
                      <span>Strength</span>
                      <strong>{live.handBox.strength}</strong>
                    </li>
                    <li>
                      <span>Form</span>
                      <strong>{live.handBox.formLabel}</strong>
                    </li>
                    {price ? (
                      <li>
                        <span>Sandbox price</span>
                        <strong>{price}</strong>
                      </li>
                    ) : null}
                    {live.variants.length > 1 ? (
                      <li>
                        <span>Catalog variants</span>
                        <strong>{live.variants.length} SKUs</strong>
                      </li>
                    ) : null}
                  </ul>

                  {live.variants.length > 1 ? (
                    <p className="hsb-card-variants">
                      Also in sandbox:{" "}
                      {live.variants
                        .slice(0, 3)
                        .map((v) => v.formHint)
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .join(" · ")}
                      {live.variants.length > 3 ? " · …" : ""}
                    </p>
                  ) : null}

                  <ul className="hsb-card-outcomes">
                    {outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>

                  <div className="hsb-card-actions">
                    <Link
                      to="/products/$slug"
                      params={{ slug }}
                      className="hsb-btn hsb-btn--primary"
                    >
                      View program
                    </Link>
                    <button
                      type="button"
                      className="hsb-btn hsb-btn--ghost"
                      onClick={() => openModal({ product: slug })}
                    >
                      Start intake
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {featured.length === 0 && !loading ? (
          <p className="hsb-empty">
            Connect the sandbox token to load featured peptide catalogs on this page.
          </p>
        ) : null}
      </div>
    </section>
  );
}
