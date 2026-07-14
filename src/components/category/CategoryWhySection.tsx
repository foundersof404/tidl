import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CategoryDefinition } from "@/lib/categories";
import type { HomeFeaturedPeptide } from "@/lib/prescribe-rx/use-home-sandbox";
import type { PrxEncounterTypeSummary } from "@/lib/prescribe-rx/encounter-schema";

gsap.registerPlugin(ScrollTrigger);

type CategoryWhySectionProps = {
  category: CategoryDefinition;
  liveProducts: HomeFeaturedPeptide[];
  pathways: PrxEncounterTypeSummary[];
  catalogCount: number;
  sandboxLoading: boolean;
  onStartIntake: () => void;
};

type ProofMetric = {
  id: string;
  target: number;
  prefix?: string;
  suffix?: string;
  pad?: number;
  label: string;
};

function protocolLabel(product: HomeFeaturedPeptide): string {
  return (product.live.handBox.productType || product.live.name || "").trim();
}

function formatMetric(metric: ProofMetric, value: number) {
  const n = Math.round(value);
  const padded = metric.pad ? String(n).padStart(metric.pad, "0") : String(n);
  return `${metric.prefix ?? ""}${padded}${metric.suffix ?? ""}`;
}

export function CategoryWhySection({
  category,
  liveProducts,
  pathways,
  catalogCount,
  sandboxLoading,
  onStartIntake,
}: CategoryWhySectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const protocolNames = useMemo(
    () => liveProducts.map(protocolLabel).filter(Boolean).slice(0, 6),
    [liveProducts],
  );

  const skuTotal = useMemo(
    () => liveProducts.reduce((sum, p) => sum + Math.max(1, p.live.variants.length), 0),
    [liveProducts],
  );

  const metrics = useMemo(() => {
    const items: ProofMetric[] = [];
    if (liveProducts.length > 0) {
      items.push({
        id: "protocols",
        target: liveProducts.length,
        pad: 2,
        label: "Live protocols",
      });
    }
    if (skuTotal > 0) {
      items.push({
        id: "skus",
        target: skuTotal,
        label: "Matched SKUs",
      });
    }
    if (catalogCount > 0) {
      items.push({
        id: "catalog",
        target: catalogCount,
        prefix: "~",
        label: "Pharmacy catalog",
      });
    }
    if (pathways.length > 0) {
      items.push({
        id: "routes",
        target: pathways.length,
        pad: 2,
        label: "Intake routes",
      });
    }
    return items.slice(0, 4);
  }, [liveProducts.length, skuTotal, catalogCount, pathways.length]);

  const metricKey = metrics.map((m) => `${m.id}:${m.target}`).join("|");
  const seals = category.trustPillars.slice(0, 3);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealFinalNumbers = () => {
      metrics.forEach((metric, index) => {
        const el = metricRefs.current[index];
        if (el) el.textContent = formatMetric(metric, metric.target);
      });
    };

    const pick = (sel: string) =>
      gsap.utils.toArray<HTMLElement>(root.querySelectorAll(sel)).filter(Boolean);

    if (reduce) {
      const all = pick("[data-whyx]");
      if (all.length) {
        gsap.set(all, { clearProps: "all", opacity: 1, y: 0, x: 0, scaleX: 1 });
      }
      revealFinalNumbers();
      return;
    }

    let cancelled = false;
    const ctx = gsap.context(() => {
      const kicker = pick("[data-whyx='kicker']");
      const titleLines = pick("[data-whyx='title'] span");
      const lead = pick("[data-whyx='lead']");
      const line = pick("[data-whyx='line']");
      const metricEls = pick("[data-whyx='metric']");
      const protocols = pick("[data-whyx='protocol']");
      const sealsEls = pick("[data-whyx='seal']");
      const steps = pick("[data-whyx='step']");
      const cta = pick("[data-whyx='cta']");

      // Flattened element lists only — nested NodeLists crash gsap.set (opacity of undefined).
      const fadeUp = [...kicker, ...titleLines, ...lead, ...metricEls, ...protocols, ...sealsEls, ...cta];
      if (fadeUp.length) gsap.set(fadeUp, { opacity: 0, y: 28 });
      if (steps.length) gsap.set(steps, { opacity: 0, x: -18, y: 0 });
      if (line.length) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          const done = pick("[data-whyx]");
          if (done.length) gsap.set(done, { clearProps: "will-change" });
        },
      });

      const add = (targets: HTMLElement[], vars: gsap.TweenVars, position?: gsap.Position) => {
        if (!targets.length) return;
        tl.to(targets, vars, position);
      };

      add(kicker, { opacity: 1, y: 0, duration: 0.45 });
      add(titleLines, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, "-=0.2");
      add(lead, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
      add(line, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, "-=0.35");
      add(metricEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.4");
      add(protocols, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, "-=0.25");
      add(sealsEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, "-=0.2");
      add(steps, { opacity: 1, x: 0, duration: 0.45, stagger: 0.08 }, "-=0.25");
      add(cta, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

      metrics.forEach((metric, index) => {
        const el = metricRefs.current[index];
        if (!el) return;
        const state = { value: 0 };
        tl.to(
          state,
          {
            value: metric.target,
            duration: 1.1,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatMetric(metric, state.value);
            },
          },
          0.7 + index * 0.07,
        );
      });
    }, root);

    requestAnimationFrame(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [metricKey, metrics]);

  return (
    <section
      ref={rootRef}
      className="cat-whyx"
      id="cat-safety"
      data-site-header-theme="dark"
      aria-label="Why TIDL"
    >
      <div className="cat-whyx-ambient" aria-hidden="true">
        <span className="cat-whyx-orb" />
      </div>

      <div className="cat-whyx-inner">
        <header className="cat-whyx-head">
          <p className="cat-whyx-kicker" data-whyx="kicker">
            <span className="cat-whyx-pulse" aria-hidden="true" />
            Why TIDL
            <em>{sandboxLoading ? "Syncing" : "Live clinical stack"}</em>
          </p>
          <h2 className="cat-whyx-title" data-whyx="title">
            <span>Real prescriptions.</span>
            <span>Real oversight.</span>
          </h2>
          <p className="cat-whyx-lead" data-whyx="lead">
            Licensed providers. US pharmacies. Live catalog on the wire — for every{" "}
            {category.navLabel.toLowerCase()} protocol on this page.
          </p>
        </header>

        <div className="cat-whyx-line" data-whyx="line" aria-hidden="true" />

        {metrics.length > 0 ? (
          <div className="cat-whyx-metrics" aria-label="Live proof">
            {metrics.map((metric, index) => (
              <div className="cat-whyx-metric" data-whyx="metric" key={metric.id}>
                <span
                  className="cat-whyx-metric-value"
                  ref={(node) => {
                    metricRefs.current[index] = node;
                  }}
                >
                  {metric.prefix ?? ""}0{metric.suffix ?? ""}
                </span>
                <span className="cat-whyx-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {protocolNames.length > 0 ? (
          <ul className="cat-whyx-protocols" aria-label="Protocols on this pathway">
            {protocolNames.map((name) => (
              <li key={name} data-whyx="protocol">
                {name}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="cat-whyx-seals" aria-label="Non-negotiables">
          {seals.map((pillar, index) => (
            <article className="cat-whyx-seal" data-whyx="seal" key={pillar.id}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{pillar.label}</h3>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </div>

        {pathways.length > 0 ? (
          <div className="cat-whyx-routes">
            <p className="cat-whyx-routes-label">How a prescription starts</p>
            <ol className="cat-whyx-route-list">
              {pathways.map((enc, index) => (
                <li key={enc.id} data-whyx="step">
                  <em aria-hidden="true">{String(index + 1).padStart(2, "0")}</em>
                  <div>
                    <strong>{enc.name.trim()}</strong>
                    <span>
                      {enc.interaction_type ?? "Async"}
                      {enc.requires_labs ? " · Labs" : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="cat-whyx-actions" data-whyx="cta">
          <button type="button" className="cat-whyx-cta" onClick={onStartIntake}>
            Start clinical intake
          </button>
        </div>
      </div>
    </section>
  );
}
