import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { usePdpData } from "./PdpDataProvider";

gsap.registerPlugin(ScrollTrigger);

export function PdpIncludedSection() {
  const { includedItems, penImage, slug, goal } = usePdpData();
  const { openModal } = useQuizModal();

  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const callsignRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressCurrentRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  const openQuiz = (e: MouseEvent) => {
    e.preventDefault();
    openModal({ product: slug, goal });
  };

  useEffect(() => {
    const root = rootRef.current;
    const intro = introRef.current;
    const pin = pinRef.current;
    const callsignEl = callsignRef.current;
    const detailEl = detailRef.current;
    const penEl = penRef.current;
    const arcEl = arcRef.current;
    const progressFill = progressFillRef.current;
    const progressCurrent = progressCurrentRef.current;
    if (!root || !pin || !callsignEl || !detailEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(callsignEl.querySelectorAll<HTMLElement>("[data-callsign]"));
    const panels = Array.from(detailEl.querySelectorAll<HTMLElement>("[data-panel]"));
    const steps = stepRefs.current.filter(Boolean) as HTMLButtonElement[];
    const total = includedItems.length;
    const circumference = 2 * Math.PI * 46;

    if (arcEl) {
      arcEl.style.strokeDasharray = `${circumference}`;
      arcEl.style.strokeDashoffset = `${circumference}`;
    }

    const setActive = (index: number) => {
      words.forEach((word, i) => word.classList.toggle("is-on", i === index));
      panels.forEach((panel, i) => panel.classList.toggle("is-on", i === index));
      steps.forEach((step, i) => {
        step.classList.toggle("is-on", i === index);
        step.classList.toggle("is-done", i < index);
        step.setAttribute("aria-current", i === index ? "true" : "false");
      });
      penEl?.classList.toggle("is-on", Boolean(includedItems[index]?.accent));
      if (progressFill) {
        progressFill.style.width = `${((index + 1) / total) * 100}%`;
      }
      if (progressCurrent) {
        progressCurrent.textContent = String(index + 1).padStart(2, "0");
      }
      if (arcEl) {
        const offset = circumference - ((index + 1) / total) * circumference;
        arcEl.style.strokeDashoffset = `${offset}`;
      }
    };

    setActive(0);

    if (reduce) {
      setActive(total - 1);
      penEl?.classList.add("is-on");
      if (intro) {
        intro.querySelectorAll<HTMLElement>("[data-intro]").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (intro) {
        const kicker = intro.querySelector<HTMLElement>("[data-intro='kicker']");
        const lines = Array.from(intro.querySelectorAll<HTMLElement>("[data-intro-line]"));
        const rule = intro.querySelector<HTMLElement>("[data-intro='rule']");

        gsap.set([kicker, ...lines, rule].filter(Boolean), {
          autoAlpha: 0,
          y: 36,
        });
        gsap.set(lines, { filter: "blur(12px)", rotateX: 18, transformOrigin: "50% 100%" });
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center", y: 0 });

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: intro,
            start: "top 78%",
            once: true,
          },
        });

        if (kicker) {
          introTl.to(kicker, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        }

        introTl.to(
          lines,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 0.95,
            stagger: 0.14,
            ease: "power4.out",
          },
          kicker ? "-=0.35" : 0,
        );

        if (rule) {
          introTl.to(
            rule,
            {
              autoAlpha: 1,
              scaleX: 1,
              duration: 0.85,
              ease: "power3.inOut",
            },
            "-=0.45",
          );
        }
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${window.innerHeight * (total * 0.72)}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(total - 1, Math.floor(self.progress * total));
              setActive(idx);
            },
          },
        });

        words.forEach((word, i) => {
          if (i === 0) {
            gsap.set(word, { autoAlpha: 1, yPercent: 0, rotate: 0 });
          } else {
            gsap.set(word, { autoAlpha: 0, yPercent: 55, rotate: -4 });
          }
        });

        panels.forEach((panel, i) => {
          gsap.set(panel, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 28 });
        });

        if (penEl) {
          gsap.set(penEl, { autoAlpha: 0, scale: 0.82, rotate: -12, xPercent: 18 });
        }

        for (let i = 0; i < total; i += 1) {
          const slot = i;

          if (slot > 0) {
            tl.to(
              words[slot - 1],
              { autoAlpha: 0, yPercent: -48, rotate: 5, duration: 0.55, ease: "power3.inOut" },
              slot,
            );
            tl.fromTo(
              words[slot],
              { autoAlpha: 0, yPercent: 55, rotate: -4 },
              { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.55, ease: "power3.inOut" },
              slot,
            );
            tl.to(panels[slot - 1], { autoAlpha: 0, y: -18, duration: 0.4, ease: "power2.inOut" }, slot);
            tl.fromTo(
              panels[slot],
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
              slot + 0.08,
            );
          }

          if (includedItems[slot]?.accent && penEl) {
            tl.to(
              penEl,
              { autoAlpha: 1, scale: 1, rotate: -6, xPercent: 0, duration: 0.7, ease: "power3.out" },
              slot + 0.05,
            );
          } else if (penEl && slot > 0 && includedItems[slot - 1]?.accent) {
            tl.to(
              penEl,
              { autoAlpha: 0, scale: 0.88, rotate: 8, xPercent: -10, duration: 0.45, ease: "power2.in" },
              slot,
            );
          }

          tl.to({}, { duration: 0.35 }, slot + 0.55);
        }

        const onRailClick = (index: number) => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const progress = (index + 0.35) / total;
          const y = st.start + (st.end - st.start) * progress;
          window.scrollTo({ top: y, behavior: "smooth" });
        };

        steps.forEach((step, index) => {
          step.style.cursor = "pointer";
          const handler = () => onRailClick(index);
          step.addEventListener("click", handler);
          step.dataset.bound = "1";
          (step as HTMLButtonElement & { __incHandler?: () => void }).__incHandler = handler;
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          steps.forEach((step) => {
            const handler = (step as HTMLButtonElement & { __incHandler?: () => void }).__incHandler;
            if (handler) step.removeEventListener("click", handler);
          });
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 899px)", () => {
        const track = mobileTrackRef.current;
        if (!track) return;

        const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-mobile-card]"));
        gsap.set(cards, { autoAlpha: 0.35, y: 24, scale: 0.96 });

        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 78%",
            end: "top 35%",
            onEnter: () => gsap.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }),
            onEnterBack: () => gsap.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }),
            onLeave: () => gsap.to(card, { autoAlpha: 0.45, scale: 0.97, duration: 0.35 }),
            onLeaveBack: () => gsap.to(card, { autoAlpha: 0.35, y: 18, scale: 0.96, duration: 0.35 }),
          });
        });
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [includedItems]);

  return (
    <section className="pdp-inc" id="included" ref={rootRef} data-pdp-header-theme="light">
      <div className="pdp-inc-speed" aria-hidden="true" />

      <div className="pdp-inc-intro" ref={introRef}>
        <div className="pdp-inc-intro-copy">
          <span className="pdp-inc-kicker" data-intro="kicker">
            Full care package
          </span>
          <h2 className="pdp-inc-title">
            <span className="pdp-inc-title-line" data-intro-line>
              What&apos;s
            </span>
            <span className="pdp-inc-title-line pdp-inc-title-line--stroke" data-intro-line>
              included
            </span>
          </h2>
          <span className="pdp-inc-intro-rule" data-intro="rule" aria-hidden="true" />
        </div>
      </div>

      {/* Desktop pinned protocol */}
      <div className="pdp-inc-pin" ref={pinRef}>
        <div className="pdp-inc-stage">
          <div className="pdp-inc-orbit" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="pdp-inc-orbit-svg">
              <circle className="pdp-inc-orbit-track" cx="60" cy="60" r="46" fill="none" />
              <circle ref={arcRef} className="pdp-inc-orbit-arc" cx="60" cy="60" r="46" fill="none" />
            </svg>
            <span className="pdp-inc-orbit-label">LOCK</span>
          </div>

          <div className="pdp-inc-callsign" ref={callsignRef} aria-hidden="true">
            <span className="pdp-inc-slash" />
            {includedItems.map((item) => (
              <span
                key={item.id}
                className={`pdp-inc-callsign-word${item.callsign.length <= 4 ? " is-short" : ""}`}
                data-callsign={item.id}
              >
                {item.callsign}
              </span>
            ))}
          </div>

          <div className="pdp-inc-pen" ref={penRef} aria-hidden="true">
            <div className="pdp-inc-pen-glow" />
            <img src={penImage} alt="" />
          </div>

          <nav className="pdp-inc-rail" aria-label="Included package steps">
            {includedItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="pdp-inc-rail-step"
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                aria-current={index === 0 ? "true" : "false"}
              >
                <span className="pdp-inc-rail-num">{item.num}</span>
                <span className="pdp-inc-rail-name">{item.shortLabel}</span>
                <span className="pdp-inc-rail-mark" aria-hidden="true" />
              </button>
            ))}
          </nav>

          <div className="pdp-inc-detail" ref={detailRef}>
            {includedItems.map((item, index) => (
              <div
                key={item.id}
                className={`pdp-inc-panel${index === 0 ? " is-on" : ""}`}
                data-panel={item.id}
              >
                <span className="pdp-inc-panel-num">{item.num}</span>
                <h3 className="pdp-inc-panel-title">{item.title}</h3>
                <p className="pdp-inc-panel-detail">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="pdp-inc-progress" aria-hidden="true">
            <span className="pdp-inc-progress-track">
              <span className="pdp-inc-progress-fill" ref={progressFillRef} />
            </span>
            <span className="pdp-inc-progress-meta">
              <em ref={progressCurrentRef}>01</em>
              <span>/</span>
              <em>{String(includedItems.length).padStart(2, "0")}</em>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile stacked unlock cards */}
      <div className="pdp-inc-mobile" ref={mobileTrackRef}>
        {includedItems.map((item) => (
          <article
            key={item.id}
            className={`pdp-inc-mcard${item.accent ? " is-accent" : ""}`}
            data-mobile-card={item.id}
          >
            <div className="pdp-inc-mcard-top">
              <span className="pdp-inc-mcard-num">{item.num}</span>
              <span className="pdp-inc-mcard-call">{item.callsign}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            {item.accent ? (
              <div className="pdp-inc-mcard-pen">
                <img src={penImage} alt="" />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="pdp-inc-foot">
        <p>Every piece ships as one program — not a piecemeal refill chase.</p>
        <a href="#get-started" className="pdp-inc-cta" onClick={openQuiz}>
          Start your intake
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
