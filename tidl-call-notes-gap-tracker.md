# TIDL — Full Gap Tracker (Call Notes + Mobile Skill + Current Build)

> **Purpose:** Single source of truth for everything stakeholders asked for vs what exists in the repo today.  
> **How to use:** Work top to bottom. When a fix ships, change `[ ]` → `[x]` and add the PR/commit link in **Done ref**.  
> **Last audited:** 2026-07-08  
> **Repo:** `tidl-main`  
> **Live routes checked:** `/`, `/products/glp-1-weight-loss`, `/quiz`, `/checkout`, `/confirmation`, `/account`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[x]` | Met / implemented in current build |
| `[ ]` | Not met / missing / incomplete |
| `[~]` | Partially met — needs follow-up |
| **Call** | From Thomas call notes (pasted 2026-07-08) |
| **Skill** | From `tidl-mobile-responsive.skill.md` |
| **Build** | Observed in current codebase (not from notes alone) |

---

## Summary scorecard

| Area | Met | Partial | Open |
|------|-----|---------|------|
| Call — brand & typography | 2 | 2 | 3 |
| Call — homepage structure | 9 | 1 | 0 |
| Call — pen video | 3 | 0 | 3 |
| Call — AI / LLM | 1 | 1 | 3 |
| Call — missing pages & flows | 2 | 3 | 2 |
| Call — process / backend | 0 | 0 | 3 |
| Skill — P0 mobile | 4 | 0 | 0 |
| Skill — P1 mobile | 0 | 1 | 2 |
| Skill — P2 mobile | 1 | 1 | 5 |
| Skill — hard constraints | 7 | 0 | 1 |
| Build — homepage sections | 10 | 3 | 2 |
| Build — PDP sections | 11 | 2 | 4 |

---

# Part A — Thomas call notes (verbatim → status)

## A1. Overall direction

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A1.1 | **Overall direction approved:** medical meets athletic tone, bold wordmark | Bold text wordmark (`TidlWordmark`) in nav + footer; Helvetica 800, 0.02em tracking | `[x]` | A1 session |
| A1.2 | Medical meets athletic should read across the full page, not just hero/pen | Journey, Families, HIW, testimonials, Ask TIDL, and footer copy updated for performance + clinical tone | `[x]` | A1 session |

---

## A2. Typography & wordmark

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A2.1 | **Font confirmed as Helvetica**; consistent across page | Body uses `--font-body` (Helvetica Neue stack) sitewide via `typography.css` | `[x]` | A2 session |
| A2.2 | **Bolder for headings, regular for body** | Display headings 700–800; body/paragraph classes locked to 400 | `[x]` | A2 session |
| A2.3 | **Increase kerning slightly (~2%) on the title wordmark** — letters blending together | Text wordmark live with `letter-spacing: 0.02em` + `scaleX(1.02)` on desktop | `[x]` | A1 session |
| A2.4 | **Explore a more aggressive/pronounced header font** alongside Helvetica for body | **Barlow Condensed** loaded for all display headings + wordmark | `[x]` | A2 session |
| A2.5 | **Spin up 5 font variants in Figma** to compare quickly | `tidl-typography-variants.md` documents 5 pairings + Figma checklist | `[~]` | Doc ready for Figma |
| A2.6 | Implement winning font direction from Figma into production | Variant 1 (Barlow) live as interim; swap `--font-display` after sign-off | `[~]` | A2 session |

---

## A3. Color & imagery

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A3.1 | **Orange needs to change to gold** (as previously discussed) | Gold tokens in `home.css`, `styles.css`, `webflow.css`; reinforced Webflow `--secondary` overrides | `[x]` | A3 session |
| A3.2 | **Imagery to be updated to match** (gold / new direction) | All ChatGPT assets removed; hf_20260705/06 shoot via `site-assets.ts`; initials avatars for testimonials | `[x]` | A3 session |
| A3.3 | Sitewide imagery pass — cohesive medical-athletic look | Central `SITE_IMAGES` registry + `imagery.css` gold warmth treatment on key photos | `[x]` | A3 session |

---

## A4. Section order & homepage narrative

> **Note (2026-07-08):** Early tracker rows described the *pre-restructure* Webflow layout (testimonials buried below Journey/Journal). The **current `HomePage.tsx` layout already ships** the call’s narrative fixes. Rows below reflect the live build.

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A4.1 | **Section order needs restructuring:** first three sections work, rest feel unintentional | **Shipped:** Hero → Services (+ closing) → Pen → Testimonials form the upper funnel; Journey/Families/HIW are supporting depth below proof | `[x]` | Pre-A4 audit |
| A4.2 | **Remove the TIDL Journal section** for now | Not on live `HomePage.tsx` (only in `clone/index.html` archive) | `[x]` | |
| A4.3 | **Pull patient social proof higher** on the page | **Shipped:** `#stories` is the **4th content block** — immediately after Pen, before Journey/Families/HIW (was much lower in original Webflow) | `[x]` | Pre-A4 audit |
| A4.4 | Show **stacked cards** so multiple testimonials visible **without clicking arrows** | 3-card static grid, no carousel | `[x]` | |
| A4.5 | **FAQ accordion at the bottom stays** | FAQ near page end; Final CTA + Footer follow (conversion band after FAQ, not editorial noise) | `[x]` | Locked order |
| A4.6 | Clarify intended order after testimonials move (what gets cut, merged, or shortened) | **Locked order** documented below; Journal removed; ServicesClosing + premium HIW added post-call | `[x]` | See table |

### Current homepage section order (live — `HomePage.tsx`)

| # | Section | ID / component | Call alignment |
|---|---------|----------------|----------------|
| 1 | Announcement bar | `#tdlBar` | Neutral |
| 2 | Navbar | `#navbar` | Neutral |
| 3 | Hero | `.hero-01` | Upper funnel ✓ |
| 4 | Services | `#services` | Upper funnel ✓ |
| 5 | Services closing | `ServicesClosing.tsx` | Added post-call (premium bridge) |
| 6 | TIDL Pen | `#tdlp5` | Upper funnel ✓ |
| 7 | Testimonials | `#stories` | **Social proof pulled up** ✓ |
| 8 | Journey | `#journey` | Depth / credibility |
| 9 | Families | `#families` | Depth / product story |
| 10 | How TIDL Works | `#howItWorks` | Depth / process (premium rebuild) |
| 11 | Ask TIDL (AI) | `#askTidl` | Discovery (prominence = A6, not A4) |
| 12 | FAQ | `#faq` | Bottom accordion ✓ |
| 13 | Final CTA | `CtaSection.tsx` | Conversion close |
| 14 | Footer | `SiteFooter.tsx` | Standard |

### A4 — optional polish (not blockers)

| Item | Status | Notes |
|------|--------|-------|
| Move testimonials between Services and Pen (instead of after Pen) | `[ ]` | Optional A/B — current order already meets call intent |
| Shorten Journey / Families / HIW scroll length | `[~]` | FIX-09 — polish only, order is set |

---

## A5. Pen video treatment

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A5.1 | **Don't dedicate a full content section** to pen video | No standalone video section; modal on pen image | `[x]` | |
| A5.2 | Option: **Play button overlaid on existing pen image** | `.tdlp5-play` on homepage + PDP `PenShowcaseSection` | `[x]` | |
| A5.3 | Option: Small thumbnail + play icon + hyperlink text (**"See how to use the pen"**) | Label exists on homepage play button | `[x]` | |
| A5.4 | Option: **GIF** (muted, 3–5 sec auto-play) as lighter alternative | Not implemented | `[ ]` | |
| A5.5 | Motion idea: branding text appears horizontally, peels off, reorients onto pen label | Not implemented; call said assess feasibility first | `[ ]` | Feasibility |
| A5.6 | Team to assess motion feasibility before committing | No documented assessment in repo | `[ ]` | |

---

## A6. LLM / AI search placement

> **Note (2026-07-08):** Prior agent already shipped premium Ask TIDL block (`.ask-tidl-wrap`), nav **Learn → #askTidl**, mobile menu priority link, footer **AI Discovery**, and FAQ cross-link. This audit only added the missing header search behavior.

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A6.1 | **LLM search/AI feature needs more prominent UX placement** | Header search opens Ask TIDL; nav Learn + mobile Ask TIDL links; premium featured block with chips + typewriter answers | `[x]` | Prior agent + A6 session |
| A6.2 | **Single CTA on header stays as "Get Started"** | Navbar CTA = "Get Started" → quiz modal (unchanged) | `[x]` | |
| A6.3 | **AI search to be repositioned elsewhere** (not competing with header CTA) | Search icon in header → scrolls to Ask TIDL (separate from Get Started) | `[x]` | A6 session |
| A6.4 | Header search icon should do something useful OR be removed | Button scrolls to `#askTidl` + focuses input; 44px tap target | `[x]` | A6 session |

### A6 — still open (not A6 scope)

| Item | Status | Notes |
|------|--------|-------|
| Live LLM / knowledge-base API | `[ ]` | **A8.8** — still `ANSWERS` mock map in `HomePage.tsx` |
| Move full Ask TIDL section higher (e.g. after testimonials) | `[ ]` | Optional — header access may be enough |

---

## A7. Mobile optimization (process note from call)

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A7.1 | **Mobile optimization: hold until desktop layout is finalized** | P0 mobile fixes already shipped (services, stories, hero, navbar) + HIW mobile layout | `[~]` | Ahead of call timing |
| A7.2 | Resume full mobile pass after desktop order/typography/AI placement locked | P1/P2 skill items still open | `[ ]` | |

---

## A8. Missing pages & flows

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A8.1 | **Product Detail Page (PDP):** per-product detail when user clicks in | `/products/glp-1-weight-loss` exists (`Glp1PdpPage.tsx`) | `[~]` | 1 of 4 products |
| A8.2 | PDP for **Testosterone** | Product in `products.ts` (`trt-hormonal`); homepage card links to `#` | `[ ]` | |
| A8.3 | PDP for **Longevity / Peptides** | Product in `products.ts` (`longevity-peptides`); homepage card links to `#` | `[ ]` | |
| A8.4 | PDP for **Performance & Recovery** | Product in `products.ts` (`performance-recovery`); no homepage link | `[ ]` | |
| A8.5 | **Category Page:** weight loss, testosterone, recovery, etc. | No `/category/*` route exists | `[ ]` | |
| A8.6 | **Checkout flow:** full end-to-end | `/checkout` + `CheckoutForm` + `OrderSummary`; gated on quiz completion | `[~]` | Frontend only |
| A8.7 | **Clinical survey/questionnaire flow** | 8-step quiz: `/quiz` + global `QuizModal` + `QuizFlow` | `[~]` | Design polish TBD |
| A8.8 | **LLM/peptide knowledge base API:** endpoint exists, ready; **not yet live on this build** | `ANSWERS` hardcoded map in `HomePage.tsx`; no API fetch | `[ ]` | |
| A8.9 | Integration connected once design confirmed | Blocked on A6.1 prominence + design sign-off | `[ ]` | |

### Product catalog vs routes (reference)

| Product slug | In `products.ts` | PDP route | Homepage service link |
|--------------|-------------------|-----------|----------------------|
| `glp-1-weight-loss` | ✓ | `/products/glp-1-weight-loss` | Links to PDP |
| `trt-hormonal` | ✓ | — | `href="#"` |
| `longevity-peptides` | ✓ | — | `href="#"` |
| `performance-recovery` | ✓ | — | Not linked from services grid |

---

## A9. Process & next steps (from call — tracking only)

| ID | They said | Current build | Status | Done ref |
|----|-----------|---------------|--------|----------|
| A9.1 | **Thomas to send Loom feedback video** with design edits | External — not in repo | `[ ]` | External |
| A9.2 | Loom to cover: font variants, section reorder, gold, pen video, LLM placement | Use this doc as checklist when Loom arrives | `[ ]` | |
| A9.3 | **Figma designs not provided upfront** caused delays; work from live site + Figma variants for font/layout | Ongoing process | `[~]` | |
| A9.4 | **First round of edits expected within 1–2 days** (from call date) | Multiple rounds since — track against this doc | `[~]` | |
| A9.5 | **Dev sync needed** to connect front end to back end and **stage the site** | No evidence of production API wiring in frontend | `[ ]` | |
| A9.6 | Connect checkout to payment/backend | Checkout form exists; backend integration unverified | `[ ]` | |
| A9.7 | Connect quiz submission to clinical backend | Quiz stores locally (`quiz-storage.ts`); backend unverified | `[ ]` | |

---

# Part B — `tidl-mobile-responsive.skill.md` (verbatim → status)

## B1. Hard constraints (§7 — do not change)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B1.1 | **Section order locked** (§4 list) | Order matches skill §4 (with `ServicesClosing` + custom HIW added) | `[x]` | |
| B1.2 | **Gold palette — no orange** | Gold tokens throughout; orange migrated | `[x]` | |
| B1.3 | **How TIDL Works — Webflow original, no custom overrides** | **Fully replaced** with custom `HowItWorksSection` + `how-it-works.css` (per later redesign request) | `[~]` | Superseded by redesign |
| B1.4 | **Footer — text wordmark "TIDL", not image** | `SiteFooter.tsx` uses `TidlWordmark` text | `[x]` | A1 session |
| B1.5 | **No em dashes** in any copy | No em dashes found in audited user-facing strings | `[x]` | |
| B1.6 | **Testimonials — 3-card grid; no carousel** | Static 3-card grid in `#stories` | `[x]` | |
| B1.7 | **Pen video — modal on image, not standalone section** | Play button on pen image → YouTube modal | `[x]` | |
| B1.8 | **Header CTA copy stays "Get Started"** | Navbar button = "Get Started" | `[x]` | |
| B1.9 | **`npm run build` must pass** after every change | Build passes | `[x]` | |
| B1.10 | **Lenis `smoothTouch: false`** — don't change | `use-lenis-scroll.ts` sets `smoothTouch: false` | `[x]` | |

---

## B2. P0 mobile (§8 — do first)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B2.1 | **Services grid** — mobile-first 1→2→3 col, no 640px min-height on phones | `home.css`: 1 col base, 2 col @768px, 3 col @992px, `min-height: auto` until 992px | `[x]` | |
| B2.2 | **Stories/Testimonials grid** — 1→2→3 col | `home.css`: 1 col base, 2 col @768px, 3 col @992px | `[x]` | |
| B2.3 | **Hero** — explicit mobile sizing, CTA 44px, bg crop | Mobile-first rules in `home.css` | `[x]` | |
| B2.4 | **Navbar** — z-index, safe-area, scroll lock on mobile menu | 44px tap targets, safe-area, `lockPageScroll` when menu open | `[x]` | |

---

## B3. P1 mobile (§8 — do second)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B3.1 | **Journey redesign** — ticker hidden <767px with no replacement; needs real mobile design | Ticker `display: none` below 767px; no mobile fallback | `[ ]` | |
| B3.2 | Journey: simplify to vertical stack or lightweight mobile ticker | Not built | `[ ]` | Design decision |
| B3.3 | **Families** — audit card stacking, bg crop, CTA spacing | Only spacing fixes in `home.css` | `[ ]` | |
| B3.4 | **How TIDL Works** — audit Webflow only, no rebuild | Custom scroll-pinned module built instead | `[~]` | Intentional redesign |
| B3.5 | HIW: verify image overlays don't overflow on narrow screens | Dedicated mobile chapters in `how-it-works.css` | `[x]` | |

---

## B4. P2 mobile polish (§8)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B4.1 | **TIDL Pen** — reduce `128px` section padding on phones | Padding still `128px 5%` everywhere | `[ ]` | |
| B4.2 | **Pen video modal** — smaller padding + safe-area on phones | Modal `padding: 36px`; no `safe-area-inset` | `[ ]` | |
| B4.3 | **Ask TIDL** — keyboard overlap + chip wrapping on real devices | Basic `@max-width: 600px` rules only | `[ ]` | |
| B4.4 | **FAQ tabs** — horizontal scroll with fade OR consistent wrap | Tabs use `flex-wrap` | `[~]` | |
| B4.5 | **Final CTA timeline** — cramped below ~400px (iPhone SE) | Tailwind mobile-first; may still cramp at 375px | `[ ]` | |
| B4.6 | **Footer** — stack columns on mobile, 44px tap targets | Relies on Webflow CSS; no custom stack rules in `home.css` | `[ ]` | |
| B4.7 | **Funnel pages** safe-area (quiz sheet, checkout, confirmation, account) | Quiz modal has some mobile rules; not fully audited | `[ ]` | |
| B4.8 | **Services closing** — kicker letter-spacing wrap on ~360px | `@max-width: 479px` tightening exists | `[x]` | |
| B4.9 | **Services closing** — full `prefers-reduced-motion` (disable shimmer/stagger) | Partial — loop beams disabled; framer stagger may still run once | `[~]` | |

---

## B5. Per-section mobile spec (§5 — detailed)

### B5.A Announcement bar
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.A.1 | `@max-width: 600px` rules exist; mostly fine | `[x]` | |

### B5.B Navbar
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.B.1 | z-index above fixed elements | `[x]` | |
| B5.B.2 | safe-area on notch devices | `[x]` | |
| B5.B.3 | scroll lock while mobile menu open | `[x]` | |
| B5.B.4 | Remove dev links from mobile menu (`/checkout`, `/account`, etc.) | `[ ]` | |

### B5.C Hero
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.C.1 | Mobile heading size / vertical layout | `[x]` | |
| B5.C.2 | CTA min 44px tap target | `[x]` | |
| B5.C.3 | Background crop on tall narrow screens | `[~]` | `object-position: center 22%` — verify on devices |

### B5.D Services
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.D.1 | Mobile-first grid (not 3-col on phones) | `[x]` | |
| B5.D.2 | Hover effects gated `@media (hover: hover)` | `[x]` | |
| B5.D.3 | Testosterone + Longevity cards need real destinations | `[ ]` | |

### B5.E Services closing
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.E.1 | Kicker tracking may wrap awkwardly on 360px | `[~]` | 479px rules added |
| B5.E.2 | Headline clamp may still run large on small phones | `[~]` | |

### B5.F TIDL Pen
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.F.1 | Responsive grid at 960px / 560px | `[x]` | |
| B5.F.2 | Play button tap target 44px+ | `[x]` | |
| B5.F.3 | Modal safe-area | `[ ]` | |
| B5.F.4 | Section padding excessive on mobile | `[ ]` | |

### B5.G Testimonials
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.G.1 | 1→2→3 column responsive grid | `[x]` | |
| B5.G.2 | No carousel | `[x]` | |

### B5.H Journey
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.H.1 | Desktop sticky 180vh + spinning circle | `[x]` | desktop only |
| B5.H.2 | Ticker hidden <767px | `[x]` | hidden |
| B5.H.3 | Mobile replacement for ticker | `[ ]` | |
| B5.H.4 | No broken/empty mobile layout | `[ ]` | |

### B5.I Families
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.I.1 | Card stacking on mobile | `[ ]` | |
| B5.I.2 | Background image crop on narrow viewports | `[ ]` | |
| B5.I.3 | CTA button spacing/wrap | `[ ]` | |

### B5.J How TIDL Works
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.J.1 | Keep Webflow `.works` (skill original) | `[~]` | Replaced by custom module |
| B5.J.2 | Desktop: sticky scroll storytelling | `[x]` | |
| B5.J.3 | Mobile: stacked chapters | `[x]` | |
| B5.J.4 | Scroll segmentation (chapters don't skip on fast scroll) | `[x]` | hysteresis in `resolveStep` |
| B5.J.5 | Right panel: layered composition (headline / image / info / scroll indicator) | `[x]` | latest redesign |
| B5.J.6 | No floating overlay cards on image (latest direction) | `[x]` | replaced with info strip |
| B5.J.7 | `ContourMap` imported but unused in TSX | `[ ]` | cleanup |
| B5.J.8 | Dead code: `FloatingCard`, `StripItem` unused components | `[ ]` | cleanup |

### B5.K Ask TIDL
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.K.1 | `@max-width: 600px` padding rules | `[x]` | |
| B5.K.2 | Keyboard overlap on mobile browsers | `[ ]` | |
| B5.K.3 | Chip wrapping for long labels | `[ ]` | |

### B5.L FAQ
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.L.1 | `@max-width: 600px` padding | `[x]` | |
| B5.L.2 | Tab row scroll-with-fade OR wrap pattern | `[~]` | wrap only |

### B5.M Final CTA
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.M.1 | Mobile-first Tailwind grid | `[x]` | |
| B5.M.2 | Image first on mobile (`order-1`) | `[x]` | |
| B5.M.3 | Timeline cramped <400px | `[ ]` | |
| B5.M.4 | `prefers-reduced-motion` on infinite shimmer/connectors | `[ ]` | |

### B5.N Footer
| ID | Skill says | Status | Done ref |
|----|------------|--------|----------|
| B5.N.1 | Text wordmark "TIDL" | `[x]` | A1 session |
| B5.N.2 | Stack columns on mobile | `[ ]` | |
| B5.N.3 | 44px link tap targets | `[ ]` | |
| B5.N.4 | Footer CTA label consistency ("Get Started" vs "Take Quiz") | `[ ]` | |

---

## B6. JS / interaction constraints (§6)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B6.1 | Lenis on desktop wheel; `smoothTouch: false` | Global `LenisScroll` in `__root.tsx` | `[x]` | |
| B6.2 | Webflow IX2 reinit ~1.2s post-load | Still in `HomePage.tsx` | `[x]` | |
| B6.3 | Quiz modal bottom sheet `max-height: 92dvh` | `QuizModal.tsx` | `[x]` | |
| B6.4 | Pen video modal — fixed overlay 16:9 | Homepage + PDP | `[x]` | |
| B6.5 | Ask TIDL — mock only, no real API | Hardcoded `ANSWERS` map | `[x]` | by design until API |
| B6.6 | FAQ React accordion | `[x]` | |
| B6.7 | Journey ticker RAF loop hidden on mobile | `[x]` | hidden, not replaced |
| B6.8 | `useIsMobile` hook exists but unused on homepage | `src/hooks/use-mobile.tsx` unused | `[ ]` | consider for Journey |

---

## B7. Test matrix (§11)

| ID | Skill says | Current build | Status | Done ref |
|----|------------|---------------|--------|----------|
| B7.1 | Test 375px (iPhone SE) | Not documented as run | `[ ]` | QA |
| B7.2 | Test 390px (iPhone 14) | Not documented | `[ ]` | QA |
| B7.3 | Test 360px (Android) | Not documented | `[ ]` | QA |
| B7.4 | Test 768px (iPad portrait) | Not documented | `[ ]` | QA |
| B7.5 | Test 1024px (iPad landscape) | Not documented | `[ ]` | QA |
| B7.6 | `prefers-reduced-motion` pass | Partial coverage | `[~]` | |
| B7.7 | Safe-area on all fixed/modal elements | Partial | `[~]` | |
| B7.8 | No horizontal overflow anywhere | Not verified | `[ ]` | QA |

---

# Part C — Current build inventory (what exists today)

## C1. Global / infrastructure

| ID | Feature | Status | Notes | Done ref |
|----|---------|--------|-------|----------|
| C1.1 | TanStack Start / React 19 / Vite 8 | `[x]` | | |
| C1.2 | Age gate | `[x]` | `AgeGate.tsx` | |
| C1.3 | Quiz modal (global) | `[x]` | `QuizModal.tsx` | |
| C1.4 | Auth provider | `[x]` | scaffold | |
| C1.5 | Lenis smooth scroll (global) | `[x]` | `LenisScroll` in `__root.tsx` | |
| C1.6 | Webflow CSS + IX2 scripts | `[x]` | `__root.tsx` | |
| C1.7 | Design tokens in `styles.css` | `[x]` | gold, ink, cream | |
| C1.8 | `how-tidl-works-section.md` export doc | `[x]` | reference only | |
| C1.9 | `tidl-mobile-responsive.skill.md` | `[x]` | reference only | |
| C1.10 | `tidl-typography-variants.md` | `[x]` | 5 font pairings for Figma | |
| C1.11 | `src/lib/site-assets.ts` imagery registry | `[x]` | hf_20260705/06 gold-direction set | |
| C1.12 | Backend / staging deployment | `[ ]` | not verified in frontend | |

---

## C2. Homepage — section-by-section build status

| # | Section | Implemented | Premium quality | Mobile ready | Call aligned | Done ref |
|---|---------|-------------|-----------------|--------------|--------------|----------|
| 1 | Announcement bar | `[x]` | `[x]` | `[x]` | `[x]` | |
| 2 | Navbar | `[x]` | `[~]` | `[x]` | `[x]` | search → Ask TIDL |
| 3 | Hero | `[x]` | `[x]` | `[x]` | `[x]` | |
| 4 | Services | `[x]` | `[x]` | `[x]` | `[~]` | 2 dead links |
| 5 | Services closing | `[x]` | `[x]` | `[~]` | n/a | not in call |
| 6 | TIDL Pen | `[x]` | `[x]` | `[~]` | `[x]` | padding P2 |
| 7 | Testimonials | `[x]` | `[x]` | `[x]` | `[x]` | After Pen, before Journey |
| 8 | Journey | `[x]` | `[ ]` | `[ ]` | `[ ]` | mobile broken |
| 9 | Families | `[x]` | `[~]` | `[ ]` | `[ ]` | |
| 10 | How TIDL Works | `[x]` | `[x]` | `[x]` | n/a | post-call redesign |
| 11 | Ask TIDL | `[x]` | `[x]` | `[~]` | `[x]` | Header search + featured block |
| 12 | FAQ | `[x]` | `[x]` | `[x]` | `[x]` | |
| 13 | Final CTA | `[x]` | `[x]` | `[~]` | n/a | |
| 14 | Footer | `[x]` | `[~]` | `[ ]` | `[x]` | text wordmark |

---

## C3. Product Detail Page (`/products/glp-1-weight-loss`)

| # | Section | Implemented | Premium quality | Mobile ready | Done ref |
|---|---------|-------------|-----------------|--------------|----------|
| 1 | Announcement bar | `[x]` | `[x]` | `[~]` | shared home CSS |
| 2 | Navbar + hero | `[x]` | `[x]` | `[~]` | |
| 3 | Who it's for (`#outcome`) | `[x]` | `[x]` | `[x]` | |
| 4 | Care path timeline (`#journey`) | `[x]` | `[x]` | `[x]` | |
| 5 | Pen showcase (`#how-pen-works`) | `[x]` | `[x]` | `[~]` | dark home styles |
| 6 | What's included (`#included`) | `[x]` | `[x]` | `[x]` | |
| 7 | Pricing (`#pricing`) | `[x]` | `[x]` | `[x]` | partial product data |
| 8 | Safety (`#safety`) | `[x]` | `[x]` | `[x]` | not in nav |
| 9 | Reviews (`#reviews`) | `[x]` | `[x]` | `[x]` | initials + lifestyle context |
| 10 | CTA band (`#get-started`) | `[x]` | `[x]` | `[x]` | |
| 11 | FAQ (`#faq`) | `[x]` | `[x]` | `[x]` | |
| 12 | Footer | `[x]` | `[~]` | `[ ]` | shared issues |
| 13 | Sticky mobile CTA | `[x]` | `[x]` | `[x]` | a11y gap |

### PDP-specific gaps

| ID | Gap | Status | Done ref |
|----|-----|--------|----------|
| C3.G1 | `product.description` not rendered | `[ ]` | |
| C3.G2 | `product.dosage` not rendered | `[ ]` | |
| C3.G3 | `HERO_IMAGES.care` / `.cta` unused in data | `[ ]` | |
| C3.G4 | `PDP_FAQ_ITEMS[].cat` unused (no category filter) | `[ ]` | |
| C3.G5 | Anchor scroll offset under sticky header (`scroll-margin-top`) | `[ ]` | |
| C3.G6 | Hero headline lacks `prefers-reduced-motion` | `[ ]` | |
| C3.G7 | Video modal: no focus trap / `data-lenis-prevent` | `[ ]` | |
| C3.G8 | Sticky CTA: `aria-hidden` but button still focusable | `[ ]` | |
| C3.G9 | FAQ: missing `aria-controls` on accordion | `[ ]` | |
| C3.G10 | Legacy unused CSS (`.pdp-included-grid`, `.pdp-outcome-grid`) | `[ ]` | cleanup |
| C3.G11 | `#safety` not in desktop/mobile nav | `[ ]` | |

---

## C4. Funnel pages

| Route | Exists | Mobile | Backend connected | Done ref |
|-------|--------|--------|-------------------|----------|
| `/quiz` (8 steps) | `[x]` | `[~]` | `[ ]` | local storage |
| Quiz modal (global) | `[x]` | `[x]` | `[ ]` | |
| `/checkout` | `[x]` | `[~]` | `[ ]` | |
| `/confirmation` | `[x]` | `[~]` | `[ ]` | |
| `/account` | `[x]` | `[~]` | `[ ]` | |

### Quiz steps (reference)

| Step | Label | Component | Status |
|------|-------|-----------|--------|
| 1 | Goal | `StepGoal.tsx` | `[x]` |
| 2 | About you | `StepAboutYou.tsx` | `[x]` |
| 3 | Health history | `StepHealthHistory.tsx` | `[x]` |
| 4 | Lifestyle | `StepLifestyle.tsx` | `[x]` |
| 5 | Treatment history | `StepTreatmentHistory.tsx` | `[x]` |
| 6 | Physician notice | `StepPhysicianNotice.tsx` | `[x]` |
| 7 | Account | `StepAccount.tsx` | `[x]` |
| 8 | Recommendation | `StepRecommendation.tsx` | `[x]` |

---

# Part D — Consolidated fix backlog (prioritized)

Work through this list after Part A–C. Mark done here and in the source row above.

## D1. Critical — call blockers

| Priority | ID | Fix | Source | Status | Done ref |
|----------|-----|-----|--------|--------|----------|
| P0 | FIX-01 | Move testimonials (`#stories`) higher — after Services or after Hero | A4.3 | `[x]` | Pre-A4 audit |
| P0 | FIX-02 | Elevate Ask TIDL / AI — dedicated placement, not section 11 | A6.1 | `[x]` | Prior agent + A6 session |
| P0 | FIX-03 | Connect LLM/peptide knowledge base API (replace `ANSWERS` mock) | A8.8 | `[ ]` | |
| P0 | FIX-04 | Build category pages (weight loss, testosterone, recovery, etc.) | A8.5 | `[ ]` | |
| P0 | FIX-05 | PDPs for remaining products (TRT, longevity, performance) | A8.2–A8.4 | `[ ]` | |
| P0 | FIX-06 | Footer text wordmark "TIDL" (remove image logo) | A2.3, B1.4 | `[x]` | A1 session |
| P0 | FIX-07 | Wire service cards to real routes (no `href="#"`) | B5.D.3 | `[ ]` | |
| P0 | FIX-08 | Dev sync: frontend ↔ backend staging (quiz, checkout, AI) | A9.5–A9.7 | `[ ]` | |

## D2. High — narrative & brand

| Priority | ID | Fix | Source | Status | Done ref |
|----------|-----|-----|--------|--------|----------|
| P1 | FIX-09 | Simplify homepage middle (Journey, Families, HIW length) | A4.1 | `[~]` | Order done; length polish optional |
| P1 | FIX-10 | Journey mobile redesign (replace hidden ticker) | B3.1, B5.H.3 | `[ ]` | |
| P1 | FIX-11 | Wordmark kerning ~2% + bold text treatment in nav | A2.3 | `[x]` | A1+A2 |
| P1 | FIX-12 | Display font exploration → implement Figma winner | A2.4–A2.6 | `[~]` | Barlow interim live |
| P1 | FIX-13 | Imagery refresh sitewide (remove AI testimonial assets) | A3.2–A3.3 | `[x]` | A3 session |
| P1 | FIX-14 | Header search: wire to Ask TIDL or remove icon | A6.3–A6.4 | `[x]` | A6 session |
| P1 | FIX-15 | Families mobile layout audit | B3.3, B5.I | `[ ]` | |

## D3. Medium — polish & a11y

| Priority | ID | Fix | Source | Status | Done ref |
|----------|-----|-----|--------|--------|----------|
| P2 | FIX-16 | Pen section mobile padding reduction | B4.1, B5.F.4 | `[ ]` | |
| P2 | FIX-17 | Pen video modal safe-area + focus trap | B4.2, C3.G7 | `[ ]` | |
| P2 | FIX-18 | PDP anchor scroll offset under sticky chrome | C3.G5 | `[ ]` | |
| P2 | FIX-19 | PDP sticky CTA accessibility fix | C3.G8 | `[ ]` | |
| P2 | FIX-20 | FAQ accordion ARIA (`aria-controls`) on homepage + PDP | C3.G9 | `[ ]` | |
| P2 | FIX-21 | Footer mobile column stack + 44px tap targets | B4.6, B5.N | `[ ]` | |
| P2 | FIX-22 | Final CTA timeline at 375px | B4.5, B5.M.3 | `[ ]` | |
| P2 | FIX-23 | `prefers-reduced-motion` pass (hero spring, CTA shimmer, HIW) | B7.6 | `[ ]` | |
| P2 | FIX-24 | Remove dev links from mobile nav menu | B5.B.4 | `[ ]` | |
| P2 | FIX-25 | Surface `product.description` + `product.dosage` on PDP | C3.G1–G2 | `[ ]` | |
| P2 | FIX-26 | Add `#safety` to PDP nav | C3.G11 | `[ ]` | |

## D4. Low — optional / exploratory

| Priority | ID | Fix | Source | Status | Done ref |
|----------|-----|-----|--------|--------|----------|
| P3 | FIX-27 | Pen video GIF alternative (3–5s muted loop) | A5.4 | `[ ]` | |
| P3 | FIX-28 | Pen branding peel motion concept | A5.5 | `[ ]` | Feasibility |
| P3 | FIX-29 | FAQ category filter on PDP (use `cat` field) | C3.G4 | `[ ]` | |
| P3 | FIX-30 | Dead code cleanup (HIW FloatingCard, ContourMap, legacy PDP CSS) | B5.J.7–8, C3.G10 | `[ ]` | |
| P3 | FIX-31 | Full test matrix QA (375–1024px devices) | B7 | `[ ]` | |
| P3 | FIX-32 | Decide FAQ vs Final CTA order at page bottom | A4.5 | `[x]` | FAQ → Final CTA → Footer |

---

# Part E — Items explicitly met (quick reference)

Use this as a "don't regress" checklist:

- [x] Gold palette (orange removed)
- [x] No em dashes in copy
- [x] TIDL Journal removed from live homepage
- [x] Testimonials: 3-card static grid, no carousel
- [x] Pen video: play on image + "See how to use the pen" + modal (not standalone section)
- [x] Header CTA: "Get Started"
- [x] Lenis smooth scroll global, `smoothTouch: false`
- [x] Helvetica typography baseline
- [x] P0 mobile: Services grid, Stories grid, Hero, Navbar
- [x] GLP-1 PDP exists and is linked from Services
- [x] Quiz flow (8 steps) + modal exists
- [x] Checkout page exists (frontend)
- [x] Testimonials pulled up (after Pen, before Journey)
- [x] Homepage section order locked (see A4 table)
- [x] FAQ near bottom; Final CTA closes before footer
- [x] How TIDL Works premium redesign (post-call): scroll chapters, layered right panel, info strip
- [x] `npm run build` passes

---

# Part F — Changelog (mark fixes here)

| Date | ID | What changed | PR / commit |
|------|-----|--------------|-------------|
| 2026-07-08 | A6 | Wired header search → Ask TIDL; tracker updated for prior-agent Ask TIDL work | A6 session |
| 2026-07-08 | A4 audit | Marked section-order + testimonials placement as shipped in current `HomePage.tsx` | tracker |
| 2026-07-08 | A3.1–A3.3 | Central imagery registry, removed ChatGPT assets, gold warmth treatment, shared testimonials | local |
| 2026-07-08 | A2.1–A2.4 | Typography system: Barlow Condensed display + Helvetica body; `typography.css` + variants doc | local |
| 2026-07-08 | A1.1, A1.2 | Bold text wordmark + medical-athletic copy pass (Journey, Families, HIW, testimonials, Ask TIDL, footer) | local |

---

*End of tracker. Update `[ ]` → `[x]` and log in Part F as fixes ship.*
