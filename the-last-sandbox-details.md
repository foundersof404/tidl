# The Last Sandbox Details

**Updated:** 14 July 2026  
**Purpose:** One place for *everything* we know and have built connecting the TIDL website to the PrescribeRx sandbox — from first connect through the current demo state.

Related docs (older / narrower): `sandbox-one.md`, `Last Edit Sandbox.md`, `sandbox-full-connection.md`, `message-to-thomas.md`, `login-flow.md`.

---

## 1. One-line status

**TIDL site ↔ PRX sandbox works end-to-end up to Patient + Encounter + $0 payment record.**  
Medication **Orders** stay empty until PRX assigns a **provider** to **TIDL Sandbox**.  
Landing, categories, and PDPs now surface curated sandbox catalog details; checkout charges **$0 for demo** while PDP list prices stay marketing prices.

---

## 2. Sandbox account

| Item | Value |
|------|-------|
| Org name | **TIDL Sandbox** |
| Org number | **ORG-7144184834** |
| Org type | Sales Group / Sales Organization |
| Login email | `tidl@prescribe-rx.com` |
| API base | `https://demo.prescribe-rx.com/api/v1` |
| Token type | Sales-org API token (`PRX_API_TOKEN`) |
| Token rotation | ~every **12 hours** → `401` means refresh token |
| Live health | `https://tidltest.netlify.app/api/prx/health` |

**Token locations (server only — never in the browser):**

| Place | Use |
|-------|-----|
| `.env.local` | Local Vite/dev |
| `.dev.vars` | Wrangler local |
| Netlify `PRX_API_TOKEN` | Deployed site |

---

## 3. What “connected” means (Thomas direction)

From the meeting / `message-to-thomas.md`:

1. Connect the **whole site** to sandbox — not only quiz + checkout.
2. **Peptides** are the product; each marketed peptide gets its own PDP.
3. The **pen is delivery / how-to-use**, not a separate product to sell alone.
4. Quiz questions should come from **PRX encounter schemas** (done via dynamic quiz).
5. Do **not** market all ~120 catalog SKUs — only the allowed marketed list.

---

## 4. Architecture (front → back)

```
Landing / Categories / PDPs  →  live catalog overlay (sandbox metadata)
        ↓
Dynamic quiz (encounter schema from PRX)
        ↓
Checkout ($0 demo) → POST /telehealth/intake/unified
        ↓
PrescribeRx: Patient + Encounter + payment record (is_sandbox)
        ↓
Provider reviews in PRX portal  →  Order (blocked until provider assigned)
        ↓
Webhooks / poll → TIDL confirmation + account status
```

**TIDL owns:** brand site, quiz UX, checkout capture, confirmation/account UI.  
**PRX owns:** clinical software, provider portal, pharmacy routing, medical PHI.  
**LocumTele:** doctor network (contracts separately; providers switch on inside PRX).

---

## 5. Our server API routes (`/api/prx/*`)

Token never leaves the server.

| Our route | PRX | Purpose |
|-----------|-----|---------|
| `GET /api/prx/health` | `/products`, `/catalog`, `/me` | Connection test |
| `GET /api/prx/catalog` | `/catalog` | Full catalog (~120 products + packages) |
| `GET /api/prx/products` | `/products` | Product list |
| `GET /api/prx/me` | `/me` | Token / org identity |
| `GET /api/prx/patients` | `/patients` | Patients |
| `GET /api/prx/orders` | `/orders` | Orders (empty until prescribe) |
| `GET /api/prx/encounters` | `/encounters` | Encounter list |
| `GET /api/prx/encounters/:id` | `/encounters/{id}` | Live status poll |
| `GET /api/prx/encounter-types` | encounter types | Quiz pathway list |
| `GET /api/prx/encounter-types/:id/schema` | schema | Dynamic quiz fields |
| `POST /api/prx/checkout` | `/telehealth/intake/unified` | **Main checkout** |
| `POST /api/prx/intake-dynamic` | unified / intake | Dynamic quiz submit |
| `POST /api/prx/webhooks` | — | Event receiver (+ optional HMAC) |
| `GET /api/prx/webhooks/event-types` | event catalog | Available webhook event types |

---

## 6. Main checkout call

`POST /telehealth/intake/unified` creates patient + encounter + payment in one shot.

**Typical payload fields we send:**

| Field | Demo / notes |
|-------|----------------|
| `is_sandbox` | `true` on demo host |
| `encounter_type_slug` | `glp-1-screening` or `peptide-assessment` (from product map) |
| `products[].product_type_slug` | e.g. `tirzepatide`, `bpc-157` (confirm with PRX) |
| `patient` | name, email, DOB, phone, gender, shipping |
| `vitals` | height, weight |
| `answers` | quiz / intake answers (+ `id_front` for peptides) |
| `payment` | see §7 |
| `consents` | telehealth consent when terms/notice accepted |

**Returns:** `encounter_id`, `encounter_number`, `patient_chart_id`, `patient_number`, status (often `unassigned`).  
Shown on TIDL confirmation so we can match Admin → Encounters / Patients.

---

## 7. Payment (sandbox)

| Topic | Detail |
|-------|--------|
| Sales-org API | **Cannot** use `mode: authorize` (PRX-as-merchant / Embed only) |
| What we use | `mode: reference_captured`, gateway `stripe` or `hsa_fsa` |
| Amount recorded | **Curated order total** (treatment + consult + shipping + tax) — verified accepted by the sandbox (`status: captured`, "External sale recorded") |
| Two flags | `CHECKOUT_DEMO_ZERO` (=`false`, charge curated price) and `CHECKOUT_SANDBOX` (=`true`, keep test-card prefill + "no real charge" copy) in `src/lib/pricing.ts` |
| PDP / category prices | Stay **marketing** list prices (`$199–$349` range) |
| Sandbox catalog prices | Often **~$10 placeholders** — shown as annotated “sandbox price”, not the offer |
| Test card UI | Prefill `4111 1111 1111 1111` / `12/30` / `123` while `CHECKOUT_SANDBOX` is true |
| Zero-out again | Set `CHECKOUT_DEMO_ZERO` to `true`; go fully live by setting `CHECKOUT_SANDBOX` to `false` |

---

## 8. Catalog reality

| Fact | Detail |
|------|--------|
| Size | ~**120** products in TIDL Sandbox catalog |
| Packages | Parsed from catalog envelope; may be empty; count surfaced on home |
| Marketed on site | **11** slugs: GLP-1 + 10 peptides |
| Match logic | Keyword map in `CATALOG_KEYWORDS` (`src/lib/peptides.ts`) |
| Signed images | Catalog `image_url` expires ~1h → we mirror local PNGs under `public/peptides/` |
| Variants | Many SKUs per molecule (pen / vial / strength); PDP + home show sibling variants |
| Unused on purpose | ~109 other compounds (AOD, Semax, etc.) — not on Thomas list |

### Marketed products & routes

| Product | Category | Route | Typical encounter |
|---------|----------|-------|-------------------|
| GLP-1 Weight Loss | Weight loss | `/products/glp-1-weight-loss` | `glp-1-screening` |
| Retatrutide | Weight loss | `/products/retatrutide` | `glp-1-screening` |
| BPC-157 | Recovery | `/products/bpc-157` | `peptide-assessment` |
| TB-500 | Recovery | `/products/tb-500` | `peptide-assessment` |
| Wolverine | Recovery | `/products/wolverine` | `peptide-assessment` |
| CJC-1295 / Ipamorelin | Performance | `/products/cjc-1295-ipamorelin` | `peptide-assessment` |
| Tesamorelin | Performance | `/products/tesamorelin` | `peptide-assessment` |
| MOTS-C | Metabolic | `/products/mots-c` | `peptide-assessment` |
| NAD+ | Longevity | `/products/nad-plus` | `peptide-assessment` |
| GHK-Cu | Longevity | `/products/ghk-cu` | `peptide-assessment` |
| Sermorelin | Longevity | `/products/sermorelin` | `peptide-assessment` |

**Source of truth for marketing defs:** `src/lib/peptides.ts`  
**Live overlay:** `src/lib/prescribe-rx/use-live-catalog.ts` + `merge-sandbox-pdp.ts`

---

## 9. Six categories (site pages)

| Slug | Nav | Products on category |
|------|-----|----------------------|
| `/category/weight-loss` | Weight loss | GLP-1, Retatrutide |
| `/category/metabolic-health` | Metabolic | MOTS-C |
| `/category/testosterone` | Testosterone | Hub live; products “soon” — sandbox has `male-trt-consult` + TRT SKUs |
| `/category/longevity` | Longevity | NAD+, GHK-Cu, Sermorelin |
| `/category/performance` | Performance | CJC / Ipamorelin, Tesamorelin |
| `/category/recovery` | Recovery | BPC-157, TB-500, Wolverine |

**Landing easy access (Jul 14):**

- Section `#browse` — **BrowseDirectorySection**  
  - Chip row for all 6 categories  
  - Cards with “Open category” + direct PDP links  
- Nav label: **Categories** → `#browse`  
- Also: Services (`#services`), sandbox peptides (`#sandbox-peptides`), footer treatment links

**Category extras:** recommended **bundles** wired (`CategoryBundleSection`), live name/SKU/strength/sandbox price on cards, marketing price preferred when sandbox price ≤ ~$25.

---

## 10. Homepage sandbox surfaces

| Surface | What it shows |
|---------|----------------|
| `#browse` | All 6 categories + PDPs |
| `#sandbox-peptides` | All 11 marketed products from live catalog + variants hint |
| Encounter pathways | GLP-1, peptide, male TRT, female HRT, men’s sexual health (filtered set) |
| Catalog count | Real product total (~120), not “11” |
| Hero price | Only overwrites with sandbox price if **not** a ~$10 placeholder |

---

## 11. PDP / marketing

- Route: `/products/$slug` (plus dedicated GLP-1 route kept for compat).
- Sandbox fields dumped in **PdpSandboxFactsSection** (name, SKU, ids, prices, RX flags, variants).
- Emotional / transformation copy: `PdpTransformationSection` + `src/lib/pdp-marketing.ts`.
- Before/after: peptide BA images under `public/peptides/ba/` (no lifestyle stock).
- Pen: education / delivery only (home + category pen spotlight + pen how-to video).

---

## 12. Quiz

| Item | Detail |
|------|--------|
| UI | Dynamic quiz modal from encounter-type **schema** |
| Schemas | Fetched per encounter type id |
| Storage | Quiz state in browser until checkout |
| Peptide ID | Checkout collects **government ID** (`id_front`) for `peptide-assessment` |
| Resume | Local only (no email/SMS abandoned-quiz yet) |

---

## 13. Confirmation & account

| Page | Status |
|------|--------|
| `/confirmation` | Order #, PRX encounter/patient #s, live status poll, “what happens next” |
| `/account` | Local orders + `PrxActivityCard` (live encounters) |
| `/auth` | Membership UI; full PRX patient login still optional for later |
| Accounts at checkout | Local `registerFromQuiz` + PRX creates its own `user_id` on intake |

PRX patient login (`POST /auth/login`) exists for a future patient portal — not required for the demo.

---

## 14. Webhooks & live status

- Receiver ready: `POST /api/prx/webhooks` (+ HMAC if `PRX_WEBHOOK_SECRET` set).
- Creating webhook **subscriptions** via API often **403** — subscribe in **PRX admin** to public Netlify URL.
- Confirmation / quiz poll encounter status every ~15s via `/api/prx/encounters/:id`.

---

## 15. Proven sandbox data (examples)

Patients / encounters were created from TIDL checkout (Source: **Api**, Sales Org: **TIDL Sandbox**), e.g.:

- Patients: `PAT-4445843178`, `PAT-2995669706`, …
- Encounters: `ENC-8980179717`, `ENC-8617840669`, … (often **Unassigned**)

**Lab Orders** seen in Admin are **not** the same as medication **Orders** (labs = separate panels/monitoring).

---

## 16. Blocker: Orders empty

```
✅ Checkout
✅ Patient
✅ Encounter
✅ Payment record ($0 demo)
❌ Provider assigned to TIDL Sandbox
❌ Review → Prescribe
❌ Medication Order
```

**Why:** “Assign Provider” on an encounter shows an **empty** list — no provider is attached to org **ORG-7144184834**. Providers under Demo Sales Org (e.g. Doctor Feelgood) cannot be moved by us. **PRX must attach a verified multi-state provider** (licensed for patient states like CA/GA).

**Ask Andrew (template):** see `sandbox-one.md` §10.

---

## 17. Open items / caveats

1. Confirm **`product_type_slug`** values for peptides with PRX (we use best-guess / env-overridable maps).
2. Provider assignment (Orders).
3. Ask TIDL is still **scripted** (not PRX clinical KB + add-to-cart).
4. Real SMS / welcome text / lifecycle messaging not automated yet (confirmation copy describes the intended journey).
5. Embed SDK `authorize` payment = not for sales-org API demo path.
6. When real catalog prices land, decide when to stop preferring marketing prices (`resolveDisplayMonthlyPrice`).

---

## 18. Key file map

| Area | Path |
|------|------|
| Pricing / demo $0 | `src/lib/pricing.ts` |
| Peptide defs + keywords | `src/lib/peptides.ts` |
| Live catalog / variants | `src/lib/prescribe-rx/use-live-catalog.ts` |
| Home sandbox | `src/lib/prescribe-rx/use-home-sandbox.ts` |
| Browse directory | `src/components/home/BrowseDirectorySection.tsx` |
| Sandbox home strip | `src/components/home/SandboxPeptidesSection.tsx` |
| Categories | `src/lib/categories.ts`, `src/components/category/*` |
| Bundles | `src/lib/category-bundles.ts` |
| Checkout → PRX | `src/server/prx/mappers.ts`, `src/routes/api/prx/checkout.ts` |
| Dynamic quiz | `src/components/quiz/dynamic/*` |
| Env | `src/lib/prescribe-rx/env.ts`, `.env.example` |
| Legal | `/privacy`, `/terms` |

---

## 19. Overview doc alignment (TIDL.com Overview)

| Overview asks | Site today |
|---------------|------------|
| Home, 6 categories, PDPs | ✅ |
| Quiz / intake | ✅ (dynamic from PRX) |
| Checkout (+ HSA/FSA) | ✅ (demo $0; no Apple/Google Pay yet) |
| Confirmation / light account | Partial ✅ |
| AI search grounded in PRX | ❌ scripted Ask TIDL |
| Patient portal full | Partial |
| B2B clinic portal | After launch — skipped |
| Age 18+ gate | ✅ |
| Privacy / Terms | ✅ |
| Pen hero storytelling | Present mid-page; first viewport still lifestyle-forward |

---

## 20. How to demo today

1. Open landing → **Categories** (or scroll `#browse`) → pick a category or PDP.  
2. Start intake / quiz → complete → checkout.  
3. Use prefilled test card; **Due today $0**.  
4. Confirm page shows Encounter # / Patient #.  
5. In PRX Admin (TIDL Sandbox) → Patients / Encounters → find the new row.  
6. Orders will stay empty until a provider is assigned and prescribes.

---

## 21. Summary

We moved from “checkout only creates an encounter” to a **sandbox-driven marketing + intake site**: live catalog overlays, 11 marketed PDPs, 6 category hubs, browse directory on the homepage, dynamic quiz schemas, peptide ID upload, and a **$0 reference_captured** payment for demos — while the **single production blocker** remains **provider assignment on TIDL Sandbox** so encounters can become Orders.
