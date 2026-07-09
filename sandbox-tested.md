# PrescribeRx Sandbox — Tested & Integrated

> **Status:** Sandbox connection verified ✅  
> **Date:** 2026-07-09  
> **Related docs:** `prescribe-rx-sandbox-tokens.md`, `.env.example`

---

## Summary

The TIDL website now has a **server-side bridge** to the PrescribeRx sandbox. The API token never goes to the browser. All PRX calls go through local routes under `/api/prx/*`.

**Health check result (confirmed working):**

```json
{
  "ok": true,
  "data": {
    "configured": true,
    "baseUrl": "https://demo.prescribe-rx.com/api/v1",
    "checks": {
      "/products": { "status": 200, "ok": true },
      "/catalog": { "status": 200, "ok": true },
      "/me": { "status": 200, "ok": true }
    },
    "healthy": true
  }
}
```

---

## What was set up

### 1. Environment & secrets

| File | Purpose |
|------|---------|
| `.env.local` | Real `PRX_API_TOKEN` for local dev (gitignored) |
| `.dev.vars` | Same token for Cloudflare Wrangler local |
| `.env.example` | Template — names only, no secrets |

| Variable | Value |
|----------|-------|
| `PRX_API_BASE_URL` | `https://demo.prescribe-rx.com/api/v1` |
| `PRX_API_TOKEN` | Single sandbox token (`{id}\|{secret}`) |
| `PRX_WEBHOOK_SECRET` | Optional — for webhook HMAC (not set yet) |

> Sandbox tokens **rotate every ~12 hours**. Regenerate in the PRX dashboard and update `.env.local` when API calls return `401`.

---

### 2. Server-side PRX client

| Path | Purpose |
|------|---------|
| `src/lib/prescribe-rx/env.ts` | Reads `PRX_API_TOKEN` from env |
| `src/lib/prescribe-rx/client.ts` | Bearer-authenticated fetch to PRX |
| `src/lib/prescribe-rx/browse-api.ts` | Browser-safe fetch to `/api/prx/*` (no token) |
| `src/lib/prescribe-rx/types.ts` | Types + `PrxApiError` |
| `src/server/prx/respond.ts` | JSON response helpers |
| `src/server/prx/mappers.ts` | Quiz/checkout → PRX payload mappers |

---

### 3. API routes built (TanStack Start server routes)

| Local route | Method | PRX endpoint | Purpose |
|-------------|--------|--------------|---------|
| `/api/prx/health` | GET | `/products`, `/catalog`, `/me` | Connection smoke test ✅ |
| `/api/prx/products` | GET | `/products` | Product catalog |
| `/api/prx/catalog` | GET | `/catalog` | Full catalog |
| `/api/prx/me` | GET | `/me` | Sandbox account info |
| `/api/prx/patients` | GET, POST | `/patients` | List / create patients |
| `/api/prx/orders` | GET, POST | `/orders` | List / create orders |
| `/api/prx/orders/:orderId` | GET | `/orders/:id` | Single order |
| `/api/prx/checkout` | POST | `/patients` + `/orders` | One-step checkout submit |
| `/api/prx/intake` | POST | intake candidates → `/patients` fallback | Quiz progress sync |
| `/api/webhooks/prescribe-rx` | POST | — | Inbound PRX status webhooks |

**Route files:** `src/routes/api/prx/*.ts`, `src/routes/api/webhooks/prescribe-rx.ts`

---

### 4. Wired into the app

| Feature | What happens |
|---------|----------------|
| **Quiz** | Each step autosaves to `POST /api/prx/intake` (debounced). LocalStorage still works if PRX fails. |
| **Checkout** | On submit → `POST /api/prx/checkout` (patient + order). If PRX fails, checkout shows an error and does not complete. |
| **Local order** | Still created in localStorage after successful PRX submit (confirmation page works). |

**Files changed:**
- `src/hooks/use-quiz.ts` — intake sync
- `src/components/checkout/CheckoutForm.tsx` — PRX checkout submit
- `vite.config.ts` — loads `PRX_*` env vars for server

---

### 5. PRX endpoints probed

| Path | Status |
|------|--------|
| `/products` | ✅ 200 |
| `/catalog` | ✅ 200 |
| `/me` | ✅ 200 |
| `/auth/me` | ✅ 200 |
| `/orders` | ✅ 200 |
| `/patients` | ✅ 200 |
| `/intake` | ❌ 404 (intake route tries other paths, falls back to `/patients`) |

---

## How to run & test locally

### 1. Start dev server

```bash
npm run dev
```

Server runs at **http://localhost:8081**

### 2. Quick browser checks

| URL | Expected |
|-----|----------|
| http://localhost:8081/api/prx/health | `"healthy": true` |
| http://localhost:8081/api/prx/products | JSON product list |
| http://localhost:8081/api/prx/catalog | JSON catalog |
| http://localhost:8081/api/prx/me | Your sandbox account |

### 3. Full flow test

1. Open http://localhost:8081
2. Take the quiz (all 8 steps)
3. Go to checkout and complete the form
4. Submit — should hit PRX then show confirmation

If checkout errors, check the browser Network tab for `/api/prx/checkout` response body.

### 4. Token expired?

1. Log into https://demo.prescribe-rx.com
2. Generate a new API token
3. Update `PRX_API_TOKEN` in `.env.local` and `.dev.vars`
4. Restart `npm run dev`

---

## What to do next

### Immediate (you / dev)

- [ ] **Test checkout end-to-end** — complete quiz → checkout → confirm PRX accepts patient + order payloads
- [ ] **Open `/api/prx/products`** — compare PRX product data with `src/lib/products.ts` and map real prices/slugs to the PDP
- [ ] **Deploy to preview** — set `PRX_API_TOKEN` in Netlify/Cloudflare env secrets (not in git)

### Ask PrescribeRx

- [ ] Exact **JSON schema** for `POST /patients` and `POST /orders` (field names may differ from our mappers)
- [ ] Correct **intake endpoint** (we tried `/intake` → 404; need official path for unified intake)
- [ ] **Webhook** setup: URL, event names, HMAC header format → then set `PRX_WEBHOOK_SECRET`
- [ ] **Payment flow** at launch — PRX collects payment first per overview doc; confirm API for that
- [ ] **Production** base URL + token when moving off sandbox

### Build next (when PRX sends docs)

1. **Map live products** — PDP + quiz recommendation use `/api/prx/products` instead of hardcoded `$299`
2. **Fix checkout payloads** — align mappers in `src/server/prx/mappers.ts` with PRX schema
3. **Order status sync** — webhooks update `/account` instead of localStorage-only status
4. **Patient portal link** — SSO or deep-link to PRX-branded TIDL portal
5. **Deploy webhooks** — expose `https://your-domain.com/api/webhooks/prescribe-rx` (ngrok for local testing)

---

## What to tell PrescribeRx

> Sandbox is set up and tested on our side. Health check passes for `/products`, `/catalog`, and `/me`. We built server routes for catalog, intake, checkout, and webhooks. We need the official API docs for patient/order JSON schemas and the correct intake endpoint so we can finish checkout and order status sync.

---

## Security reminders

- Never commit `.env.local` or `.dev.vars`
- Never put `PRX_API_TOKEN` in `VITE_*` or `NEXT_PUBLIC_*` vars
- All PRX calls go through `/api/prx/*` — token stays on the server
- Use `Idempotency-Key` on checkout order POST (already implemented)

---

## File index

```
.env.example
.env.local                    (gitignored — your token)
.dev.vars                     (gitignored)
prescribe-rx-sandbox-tokens.md
sandbox-tested.md             (this file)

src/lib/prescribe-rx/
  env.ts
  client.ts
  browse-api.ts
  types.ts
  index.ts

src/server/prx/
  respond.ts
  mappers.ts

src/routes/api/prx/
  health.ts
  products.ts
  catalog.ts
  me.ts
  patients.ts
  orders.ts
  orders.$orderId.ts
  checkout.ts
  intake.ts

src/routes/api/webhooks/
  prescribe-rx.ts
```
