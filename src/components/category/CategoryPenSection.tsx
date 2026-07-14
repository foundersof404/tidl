import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CategoryDefinition, CategorySlug } from "@/lib/categories";
import { GLP1_PEN_SHOWCASE } from "@/components/pdp/data/pen-showcase-content";

gsap.registerPlugin(ScrollTrigger);

type CategoryPenSectionProps = {
  category: CategoryDefinition;
  slug: CategorySlug;
  onStartIntake: () => void;
};

export function CategoryPenSection({ category, slug, onStartIntake }: CategoryPenSectionProps) {
  const spotlight = category.penSpotlight;
  const [penVisible, setPenVisible] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const penGridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!spotlight) return;
    const gridEl = penGridRef.current;
    if (!gridEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPenVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === gridEl) setPenVisible(true);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.25 },
    );

    io.observe(gridEl);
    return () => io.disconnect();
  }, [spotlight]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!spotlight || !root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const pick = (sel: string) =>
      gsap.utils.toArray<HTMLElement>(root.querySelectorAll(sel)).filter(Boolean);

    const ctx = gsap.context(() => {
      const head = pick(".tdlp5-head > *");
      const feats = pick(".tdlp5-feat");
      const stats = pick(".tdlp5-stat");
      const actions = pick(".cat-penx-actions, .cat-penx-note");

      gsap.set([...head, ...feats, ...stats, ...actions], { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 })
        .to(feats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, "-=0.25")
        .to(stats, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, "-=0.15")
        .to(actions, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, "-=0.2");
    }, root);

    return () => ctx.revert();
  }, [spotlight]);

  useEffect(() => {
    if (!isVideoOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsVideoOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVideoOpen]);

  if (!spotlight) return null;

  const features = spotlight.features;
  const leftFeatures = features.slice(0, 2);
  const rightFeatures = features.slice(2, 4);
  const isWeightLoss = slug === "weight-loss";
  const showVideo = isWeightLoss && Boolean(GLP1_PEN_SHOWCASE.videoEmbedUrl);
  const titleEmphasis = spotlight.titleEmphasis ?? "Just click.";

  return (
    <>
      <section
        ref={sectionRef}
        className="tdlp5-sec cat-penx"
        id="cat-pen"
        data-site-header-theme="dark"
        aria-label="The TIDL Pen"
      >
        <div className="tdlp5-head">
          <div className="tdlp5-kick">{spotlight.kicker}</div>
          <h2 className="tdlp5-h2">
            {spotlight.title}
            <br />
            <em>{titleEmphasis}</em>
          </h2>
        </div>

        <div className={`tdlp5-grid${penVisible ? " tdlp5-on" : ""}`} ref={penGridRef}>
          <div className="tdlp5-col left">
            {leftFeatures.map((feature) => (
              <div className="tdlp5-feat" key={feature.num}>
                <div className="tdlp5-fnum">{feature.num}</div>
                <div className="tdlp5-flab">{feature.title}</div>
                <div className="tdlp5-fsub">{feature.body}</div>
              </div>
            ))}
          </div>

          <div className="tdlp5-center">
            <div className="tdlp5-more tdlp5-more--stage">
              {isWeightLoss ? (
                <Link to="/products/glp-1-weight-loss" className="tdlp5-more-wrap tdlp5-more-wrap--btn">
                  <span className="tdlp5-more-link">See GLP-1 program</span>
                  <span className="tdlp5-more-line" aria-hidden="true" />
                </Link>
              ) : (
                <a href="#category-formulary" className="tdlp5-more-wrap tdlp5-more-wrap--btn">
                  <span className="tdlp5-more-link">See protocols</span>
                  <span className="tdlp5-more-line" aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="tdlp5-blade" />
            <div className="tdlp5-blade core" />
            <div className="tdlp5-aura" />
            <div className="tdlp5-shadow" />
            <div className="tdlp5-imgwrap">
              <div className="tdlp5-levit">
                <img className="tdlp5-img" src={spotlight.image} alt="The TIDL Pen" />
                {showVideo ? (
                  <button
                    type="button"
                    className="tdlp5-play"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label="Play video: how to use the TIDL Pen"
                  >
                    <span className="tdlp5-play-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="tdlp5-play-label">See how to use the pen</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="tdlp5-col right">
            {rightFeatures.map((feature) => (
              <div className="tdlp5-feat" key={feature.num}>
                <div className="tdlp5-fnum">{feature.num}</div>
                <div className="tdlp5-flab">{feature.title}</div>
                <div className="tdlp5-fsub">{feature.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`tdlp5-stats${penVisible ? " tdlp5-on" : ""}`}>
          {GLP1_PEN_SHOWCASE.stats.map((stat) => (
            <div className="tdlp5-stat" key={stat.tag}>
              <div className="tdlp5-snum">
                {stat.target}
                {stat.suffix ? <em>{stat.suffix}</em> : null}
              </div>
              <div className="tdlp5-stag">{stat.tag}</div>
              <div className="tdlp5-ssub">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="cat-penx-actions">
          <button type="button" className="cat-penx-btn cat-penx-btn--primary" onClick={onStartIntake}>
            Start with the pen
          </button>
          {isWeightLoss ? (
            <Link to="/products/glp-1-weight-loss" className="cat-penx-btn cat-penx-btn--ghost">
              See GLP-1 program
            </Link>
          ) : (
            <a href="#category-formulary" className="cat-penx-btn cat-penx-btn--ghost">
              Browse peptide protocols
            </a>
          )}
        </div>
        {spotlight.trustNote ? <p className="cat-penx-note">{spotlight.trustNote}</p> : null}

        <div className="tdlp5-grain" />
      </section>

      {showVideo && isVideoOpen ? (
        <div
          className="tdlp5-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="How to use the TIDL Pen"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="tdlp5-video-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="tdlp5-video-close"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video"
            >
              ×
            </button>
            <iframe
              src={GLP1_PEN_SHOWCASE.videoEmbedUrl}
              title={GLP1_PEN_SHOWCASE.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
