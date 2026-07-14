import { useEffect, useState } from "react";

export type SiteHeaderTheme = "light" | "dark";

type UseSiteHeaderStateOptions = {
  defaultTheme?: SiteHeaderTheme;
};

const THEME_SELECTOR = "[data-site-header-theme], [data-pdp-header-theme]";

function readSectionTheme(el: HTMLElement): SiteHeaderTheme | null {
  const value =
    el.getAttribute("data-site-header-theme") ?? el.getAttribute("data-pdp-header-theme");
  return value === "light" || value === "dark" ? value : null;
}

export function useSiteHeaderState(options: UseSiteHeaderStateOptions = {}) {
  const { defaultTheme = "light" } = options;
  const [pinned, setPinned] = useState(false);
  const [theme, setTheme] = useState<SiteHeaderTheme>(defaultTheme);

  useEffect(() => {
    let pinnedRaf = 0;
    let themeRaf = 0;
    let lastPinned = false;
    let lastTheme: SiteHeaderTheme = defaultTheme;
    let lastThemeY = -1;

    const measurePinned = () => {
      pinnedRaf = 0;
      const headerWrap = document.querySelector(".site-header-wrap");
      const next = headerWrap
        ? headerWrap.getBoundingClientRect().top <= 0
        : window.scrollY > 0;
      if (next !== lastPinned) {
        lastPinned = next;
        setPinned(next);
      }
    };

    const measureTheme = () => {
      themeRaf = 0;
      const y = window.scrollY;
      // Skip tiny Lenis sub-pixel updates that don't change section coverage.
      if (Math.abs(y - lastThemeY) < 8 && lastThemeY >= 0) return;
      lastThemeY = y;

      const sections = document.querySelectorAll<HTMLElement>(THEME_SELECTOR);
      if (!sections.length) {
        if (lastTheme !== defaultTheme) {
          lastTheme = defaultTheme;
          setTheme(defaultTheme);
        }
        return;
      }

      const headerLine = lastPinned ? 64 : 120;
      let best: { el: HTMLElement; score: number } | null = null;

      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= headerLine || rect.top >= window.innerHeight) return;

        const visibleTop = Math.max(rect.top, headerLine);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);
        const visible = Math.max(0, visibleBottom - visibleTop);
        const score = visible / Math.min(rect.height, window.innerHeight - headerLine);

        if (!best || score > best.score) {
          best = { el, score };
        }
      });

      if (!best) return;
      const next = readSectionTheme(best.el);
      if (next && next !== lastTheme) {
        lastTheme = next;
        setTheme(next);
      }
    };

    const onScroll = () => {
      if (!pinnedRaf) pinnedRaf = requestAnimationFrame(measurePinned);
      if (!themeRaf) themeRaf = requestAnimationFrame(measureTheme);
    };

    measurePinned();
    measureTheme();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (pinnedRaf) cancelAnimationFrame(pinnedRaf);
      if (themeRaf) cancelAnimationFrame(themeRaf);
    };
  }, [defaultTheme]);

  const transparent = !pinned;

  return { pinned, theme, transparent };
}
