# TIDL — Typography Variants (A2.5)

> **Purpose:** Five display + body pairings for Figma comparison.  
> **Interim production choice:** Variant 1 (Barlow Condensed + Helvetica Neue).  
> **Body standard (all variants):** Helvetica Neue / Helvetica, regular for body, medium for UI labels.

---

## Variant 1 — Barlow Condensed + Helvetica Neue (live interim)

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Barlow Condensed | 800 | Condensed, athletic, still clinical |
| H2–H3 | Barlow Condensed | 700 | |
| Wordmark | Barlow Condensed | 800, `letter-spacing: 0.02em` | |
| Body | Helvetica Neue | 400 | |

**Best for:** Medical meets athletic. Strong without feeling like a gym brand.

---

## Variant 2 — Oswald + Helvetica Neue

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Oswald | 700 | Tall, sporty, high impact |
| H2–H3 | Oswald | 600 | |
| Wordmark | Oswald | 700, `letter-spacing: 0.04em` | |
| Body | Helvetica Neue | 400 | |

**Best for:** Maximum athletic energy. Risk: can skew too sports-first.

---

## Variant 3 — Roboto Condensed + Helvetica Neue

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Roboto Condensed | 700 | Clean, modern, tech-clinical |
| H2–H3 | Roboto Condensed | 600 | |
| Wordmark | Roboto Condensed | 700 | |
| Body | Helvetica Neue | 400 | |

**Best for:** Telehealth / product UI feel. Less editorial than Barlow.

---

## Variant 4 — Archivo + Helvetica Neue

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Archivo | 800 | Wide, confident, premium editorial |
| H2–H3 | Archivo | 700 | |
| Wordmark | Archivo | 800, `letter-spacing: 0.01em` | |
| Body | Helvetica Neue | 400 | |

**Best for:** Premium magazine tone. Less condensed / athletic.

---

## Variant 5 — Helvetica Now Display (in-family max) + Helvetica Neue

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Helvetica Now Display | 900 / Black | Stays on-brand, boldest in family |
| H2–H3 | Helvetica Now Display | 700 | |
| Wordmark | Helvetica Now Display | 900, `letter-spacing: 0.02em` | |
| Body | Helvetica Neue | 400 | |

**Best for:** Safest evolution. Less “new voice” than Variants 1–3.

---

## Figma setup checklist

- [ ] Create 5 frames, one per variant above
- [ ] Use live homepage copy: hero headline, “Pick your goal.”, “HOW TIDL WORKS”, wordmark
- [ ] Show body paragraph under each headline (16px regular)
- [ ] Export side-by-side PNG for Thomas Loom review
- [ ] Mark winning variant → swap `--font-display` in `src/styles/typography.css`

---

## Production tokens (current)

```css
--font-body: "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-display: "Barlow Condensed", "Helvetica Now Display", ...;
--font-weight-body: 400;
--font-weight-heading: 700;
--font-weight-display: 800;
--letter-spacing-wordmark: 0.02em;
```
