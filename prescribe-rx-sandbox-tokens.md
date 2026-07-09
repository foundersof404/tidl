# PrescribeRx Sandbox — API Token & Environment Setup

> **Source:** `public/TIDL.com Overview_08JUN26.docx`, live sandbox behavior, and TIDL integration plan.  
> **Audience:** Developers wiring the TIDL website to PrescribeRx (`demo.prescribe-rx.com`).  
> **Last updated:** 2026-07-09

---

## Important: sandbox issues **one** API token

The PrescribeRx **sandbox does not let you name or create multiple role tokens**. The dashboard generates **a single API key** per account/session.

**Format:**

```text
{numeric_id}|{secret}
```

**Example:**

```text
1450|bYjFoVzZrhAtqLjYWbXhh46hLmRatuo7OqWzJWXue2c0e6da
```

- The number before `|` (e.g. `1450`) is your **sandbox account / org id** — not something you choose.
- You **cannot** label it `TIDL Client` or create separate patient/provider keys in sandbox.
- Store the full string in **`PRX_API_TOKEN`** in `.env.local`.

> Tokens **rotate every ~12 hours** in sandbox. Regenerate in the PRX dashboard when calls return `401`.

---

## What the overview doc says about PrescribeRx

From **TIDL.com Overview (08 Jun 2026)**:

| System | Role in TIDL |
|--------|----------------|
| **PrescribeRx** | Medical platform: intake, order routing, patient portal, clinical knowledge base for AI search |
| **LocumTele** | Doctors who review intakes and prescribe (inside PRX) |
| **Pharmacy network** | Fulfillment, cold-chain, auto-reroute |
| **TIDL data layer** (future) | Marketing/behavioral data; PHI stays in PRX |

**Launch flow:**

```
TIDL site → PrescribeRx (intake + order) → LocumTele (Rx) → Pharmacy (ship)
                 ↓ webhooks
      confirmation / account / SMS / email
```

---

## Environment variables

### Required (sandbox)

| Variable | Example | Browser-safe? | Purpose |
|----------|---------|---------------|---------|
| `PRX_API_BASE_URL` | `https://demo.prescribe-rx.com/api/v1` | No | API host |
| `PRX_API_TOKEN` | `1450\|bYjFoVzZrhAtqLjY...` | **Never** | Single bearer token for all server calls |

### Optional

| Variable | Purpose |
|----------|---------|
| `VITE_PRX_API_BASE_URL` | Public API host only (no token) if client needs the URL |
| `PRX_WEBHOOK_SECRET` | HMAC verification for inbound webhooks (when PRX provides it) |
| `PRX_WEBHOOK_TOLERANCE_SECONDS` | Clock skew for webhook validation (default `300`) |

### Legacy / production only (not used in sandbox)

If PrescribeRx ever issues **separate** tokens per role in production, you can set these **instead of** sharing one token. Sandbox does **not** require them.

| Variable | Intended role |
|----------|----------------|
| `PRX_TOKEN_CLIENT` | Brand / storefront integration |
| `PRX_TOKEN_PATIENT` | Patient-scoped API |
| `PRX_TOKEN_PROVIDER` | Clinician (not used by TIDL website) |
| `PRX_TOKEN_SALES_ORG` | B2B wholesale (post-launch) |

**Code behavior:** `src/lib/prescribe-rx/env.ts` uses `PRX_API_TOKEN` first, then falls back to `PRX_TOKEN_CLIENT` if set.

---

## What the one token is used for

All TIDL → PRX server routes use the **same** `PRX_API_TOKEN`:

| TIDL feature | PRX capability |
|--------------|----------------|
| PDP / product pricing | Products catalog |
| Quiz + medical intake | Unified intake / telehealth |
| Checkout | Orders + payment (PRX-collect at launch) |
| Confirmation / account status | Order status API |
| AI search (future) | Clinical knowledge base |
| Webhook receiver | Separate `PRX_WEBHOOK_SECRET` (not the API token) |

**Rule:** React never sees `PRX_API_TOKEN`. Only Nitro/server routes call PRX.

---

## How to get / refresh the token in sandbox

### Steps

1. Open **[https://demo.prescribe-rx.com](https://demo.prescribe-rx.com)** and sign in.
2. Go to **API** / **Integrations** / **API Keys** (exact menu name may vary).
3. Click **Generate API token** (or equivalent — there is only one action, no naming).
4. Copy the full value including the `1450|` prefix.
5. Paste into `.env.local`:

```env
PRX_API_TOKEN=1450|paste-your-secret-here
```

6. Restart dev server: `npm run dev`

### When it expires (~12h)

1. Return to the same API screen in the sandbox.
2. Generate a **new** token (old one stops working).
3. Replace `PRX_API_TOKEN` in `.env.local` and `.dev.vars`.
4. Redeploy or restart local server.

There is **no** separate step to create patient/client/provider tokens in sandbox.

---

## Local files

| File | Git? | What to put |
|------|------|-------------|
| `.env.example` | Yes | Variable names only |
| `.env.local` | No | Real `PRX_API_TOKEN` |
| `.dev.vars` | No | Same token for Cloudflare Wrangler |
| Netlify env | Dashboard | Preview + production secrets |
| Cloudflare | `wrangler secret put PRX_API_TOKEN` | Production |

### Example `.env.local`

```env
PRX_API_BASE_URL=https://demo.prescribe-rx.com/api/v1
VITE_PRX_API_BASE_URL=https://demo.prescribe-rx.com/api/v1

PRX_API_TOKEN=1450|your-generated-secret-here

# When PRX enables webhooks for your sandbox account:
PRX_WEBHOOK_SECRET=
```

### Smoke test (terminal)

```bash
curl -sS \
  -H "Authorization: Bearer $PRX_API_TOKEN" \
  -H "Accept: application/json" \
  "$PRX_API_BASE_URL/products"
```

Adjust `/products` to the path your PRX contact confirms.

---

## Webhooks (separate from API token)

Webhooks use a **signing secret**, not the bearer API token.

| Step | Action |
|------|--------|
| 1 | PRX admin → **Webhooks** → add endpoint |
| 2 | URL: `https://<your-host>/api/webhooks/prescribe-rx` |
| 3 | Copy signing secret → `PRX_WEBHOOK_SECRET` |
| 4 | Local dev: expose via ngrok or Cloudflare tunnel |

If webhook UI is not available in your sandbox yet, ask your PRX contact.

---

## Security checklist

- [ ] One env var: `PRX_API_TOKEN` — full `id|secret` string
- [ ] Never commit `.env.local` or `.dev.vars`
- [ ] Never use `NEXT_PUBLIC_` or `VITE_` for the token
- [ ] Refresh token when sandbox returns `401`
- [ ] Verify webhook HMAC before updating order status
- [ ] Use `Idempotency-Key` on checkout order POST

---

## Code references

| Path | Purpose |
|------|---------|
| `.env.example` | Template |
| `src/lib/prescribe-rx/env.ts` | `getPrxApiToken()`, `getPrxConfig()` |
| `src/lib/prescribe-rx/client.ts` | `createPrxClient()` / `prxClient()` |
| `prescribe-rx-sandbox-tokens.md` | This doc |

---

## Open questions for PrescribeRx

1. Exact REST paths for products, intake, orders
2. Will **production** issue one token or multiple role tokens?
3. Webhook event names and HMAC header format
4. Patient portal URL for TIDL-branded login
5. When payment moves from PRX-collect to TIDL merchant account

---

## Quick refresh (every ~12h)

1. Log into [demo.prescribe-rx.com](https://demo.prescribe-rx.com)
2. Generate **one** new API token
3. Update `PRX_API_TOKEN` in `.env.local` + `.dev.vars`
4. Restart `npm run dev`
