import { useEffect, useRef, type ReactNode } from "react";
import lottie from "lottie-web";
import { SITE_IMAGES } from "@/lib/site-assets";

const JOURNEY_LOTTIE_URL =
  "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7b7_R.json";

const POINTER_LEFT =
  "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7b9_Polygon%201.svg";
const POINTER_RIGHT =
  "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7b8_Polygon%203.svg";

export const JOURNEY_TICKER_ITEMS = [
  { t: "Weight loss" },
  { t: "Testosterone" },
  { t: "Longevity" },
  { t: "Peptide therapy" },
  { t: "Recovery" },
] as const;

export const JOURNEY_TICKER_ICONS: Record<string, ReactNode> = {
  "Weight loss": (
    <svg viewBox="0 0 24 24">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
    </svg>
  ),
  Testosterone: (
    <svg viewBox="0 0 24 24">
      <path d="M13 3l-6 8h5l-2 10 8-11h-5l2-7z" />
    </svg>
  ),
  Longevity: (
    <svg viewBox="0 0 24 24">
      <path d="M12 21c5-3 8-7 8-11a4 4 0 0 0-8-1 4 4 0 0 0-8 1c0 4 3 8 8 11z" />
    </svg>
  ),
  "Peptide therapy": (
    <svg viewBox="0 0 24 24">
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="8" r="2.5" />
      <circle cx="12" cy="16" r="2.5" />
      <path d="M9 9l2 5M15 9l-2 5" />
    </svg>
  ),
  Recovery: (
    <svg viewBox="0 0 24 24">
      <path d="M4 12a8 8 0 1 1 8 8" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),
};

type JourneySectionProps = {
  onGetStarted: (e?: React.MouseEvent) => void;
};

function JourneyLottieDial() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: JOURNEY_LOTTIE_URL,
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animation.play();
        else animation.pause();
      },
      { threshold: 0.12, rootMargin: "80px 0px" },
    );

    io.observe(container);
    return () => {
      io.disconnect();
      animation.destroy();
    };
  }, []);

  return <div className="lottie-animation-2" ref={containerRef} aria-hidden="true" />;
}

export function JourneySection({ onGetStarted }: JourneySectionProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const tickerTrackRef = useRef<HTMLDivElement>(null);
  const tickerLoop = [...JOURNEY_TICKER_ITEMS, ...JOURNEY_TICKER_ITEMS, ...JOURNEY_TICKER_ITEMS];

  useEffect(() => {
    const el = tickerRef.current;
    const track = tickerTrackRef.current;
    if (!el || !track) return;

    const cardH = 64 + 14;
    const unit = JOURNEY_TICKER_ITEMS.length * cardH;
    let y = -unit;
    const speed = 0.35;
    let center: HTMLElement | null = null;
    let rafId = 0;
    let running = false;

    function frame() {
      if (!running) return;
      y -= speed;
      if (y <= -unit * 2) y += unit;
      track.style.transform = `translate3d(0, ${y}px, 0)`;

      const mid = el.clientHeight / 2;
      let best = Infinity;
      let bi: HTMLElement | null = null;

      const items = Array.from(track.children) as HTMLElement[];
      for (const item of items) {
        const r = item.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const c = r.top - er.top + r.height / 2;
        const dist = Math.abs(c - mid);
        if (dist < best) {
          best = dist;
          bi = item;
        }
      }

      if (bi !== center) {
        center?.classList.remove("active");
        center = bi;
        center?.classList.add("active");
      }

      rafId = requestAnimationFrame(frame);
    }

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.08, rootMargin: "120px 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section className="journey container-full" id="journey" data-site-header-theme="light">
      <div className="container-fluid">
        <div className="journey-content-fixed">
          <div className="journey-content">
            <div className="circle-img-outer">
              <div className="circle-img-wrap">
                <img src={SITE_IMAGES.journey.circle} loading="lazy" alt="" className="circle-img" />
              </div>
            </div>

            <div className="journey-content-inside">
              <h2 className="journey-title heading-01">
                Medicine built
                <br />
                for performance
              </h2>
              <div className="journey-text p2-regular">
                Board-certified providers across weight, hormones, and recovery. Clinical rigor with an athletic
                standard of results.
              </div>
              <div className="journey-bnts">
                <a href="#" onClick={onGetStarted} className="button-01 button-03 w-inline-block">
                  <div className="button-outside-01">
                    <div className="button-inside">
                      <div className="button-text-01">Get Started</div>
                      <div className="button-text-01">Get Started</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="journey-info-wrap">
              <div className="tidl-ticker" id="tidlTicker" ref={tickerRef}>
                <div className="track" ref={tickerTrackRef}>
                  {tickerLoop.map((item, idx) => (
                    <div className="item" key={`${item.t}-${idx}`}>
                      <span className="ico">{JOURNEY_TICKER_ICONS[item.t]}</span>
                      <span className="label">{item.t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="journey-mobile-chips" aria-label="TIDL treatment areas">
                {JOURNEY_TICKER_ITEMS.map((item) => (
                  <div className="journey-mobile-chip" key={item.t}>
                    <span className="journey-mobile-chip-ico">{JOURNEY_TICKER_ICONS[item.t]}</span>
                    <span className="journey-mobile-chip-label">{item.t}</span>
                  </div>
                ))}
              </div>

              <JourneyLottieDial />

              <div className="center-pointers">
                <img src={POINTER_LEFT} loading="lazy" alt="" className="center-point" />
                <img src={POINTER_RIGHT} loading="lazy" alt="" className="center-point" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
