import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Shared Apple-style smooth scroll used across marketing pages. Synced with GSAP ScrollTrigger. */
export function useLenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let stRaf = 0;
    lenis.on("scroll", () => {
      if (stRaf) return;
      stRaf = requestAnimationFrame(() => {
        ScrollTrigger.update();
        stRaf = 0;
      });
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    // Allow GSAP to skip frames under load instead of fighting the main thread.
    gsap.ticker.lagSmoothing(500);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
