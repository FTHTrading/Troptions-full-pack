# End-to-End Campaign Test Guide

Full manual test flow for the TROPTIONS / DONK AI / UNYKORN campaign system.

---

## Prerequisites

- Dev server running: `npm run dev` in `C:\Users\Kevan\troptions`
- Local URL: `http://127.0.0.1:3000` (or `http://127.0.0.1:5173` if using Vite)
- For deployed test: `https://launch.unykorn.org`

---

## Test Flow — Devnet QR Campaign

### Step 1 — Open the launcher

Navigate to:
```
http://127.0.0.1:3000/sports/solana-launcher
```
(or `https://launch.unykorn.org/sports/solana-launcher` for deployed)

Verify:
- [ ] Page loads without errors
- [ ] No "prediction market" language visible anywhere
- [ ] Campaign type selector shows: QR Campaign, Fan Tribute, Event Ticket, Merchant Token

---

### Step 2 — Fill in campaign details

Select campaign type: **QR Campaign**

Fill in the form:
| Field | Value |
|---|---|
| Business Name | `test-shop` |
| Campaign Name | `Test QR Campaign` |
| City / Event | `Atlanta` |
| Offer | `10% off coffee` |
| Quantity | `100` (default) |

Click **Continue** / **Next**.

---

### Step 3 — Preview and verify namespace

Verify:
- [ ] Namespace = `test-shop` (auto-derived from business name)
- [ ] QR URL = `https://launch.unykorn.org/c/test-shop`
- [ ] Network label shows `DEVNET`
- [ ] Status label shows `STUB`

Click **Save Campaign** (calls `POST /api/solana/campaign/save`).

Expected response: `{ ok: true, campaign: { namespace: "test-shop", ... } }`

---

### Step 4 — Verify QR scan landing page

Open in browser (or scan QR code):
```
https://launch.unykorn.org/c/test-shop
```

Verify:
- [ ] Campaign name: "Test QR Campaign"
- [ ] Business: "test-shop"
- [ ] Offer: "10% off coffee"
- [ ] City: "Atlanta"
- [ ] No prediction-market or investment language

---

### Step 5 — Verify admin list

Open:
```
https://launch.unykorn.org/admin/campaigns/solana
```

Verify:
- [ ] "test-shop" campaign appears in the list
- [ ] Status = `STUB · DEVNET`
- [ ] Created date is today
- [ ] QR link `/c/test-shop` is clickable

---

### Step 6 — Wallet connect (stub flow)

Back on the launcher (Step 3 / Step 4 of wizard):

- [ ] Click "Connect Wallet" — Phantom / Solflare prompt appears (devnet)
- [ ] OR click "Skip to Mint Preview" if stub flow is enabled

Verify:
- [ ] Mint preview shows correct campaign details
- [ ] Network label = `DEVNET · STUB`
- [ ] No real transaction is sent in stub mode

---

### Step 7 — Compliance checks

Across all pages in the flow:
- [ ] Zero instances of "prediction market"
- [ ] Zero instances of "investment" (outside of explicit legal disclaimers)
- [ ] `not_investment: true` and `not_prediction_market: true` in API response JSON

---

## Mainnet Test (Requires Env Vars — DO NOT put values in this file)

The following environment variables must be set in **Vercel / Cloudflare dashboard only**
(never in source code or `.env` files committed to git):

| Variable | Where to set |
|---|---|
| `NEXT_PUBLIC_SOLANA_MAINNET_ENABLED` | Vercel env or CF Pages env (`true` to enable) |
| `LAUNCHER_INTERNAL_KEY` | Vercel env or CF Pages env (secret) |
| `TRUST_WALLET_SECRET_KEY` | Vercel env or CF Pages env (secret — never in code) |
| `TRUST_WALLET_DEVNET_KEY` | Vercel env or CF Pages env (for devnet real mints) |
| `NEXT_PUBLIC_HELIUS_RPC_URL` | Vercel env or CF Pages env |
| `PINATA_API_KEY` | Vercel env or CF Pages env |
| `PINATA_SECRET_API_KEY` | Vercel env or CF Pages env |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | Vercel env (public — wallet address only, not key) |

Once set, repeat the test flow above. The mint step will execute a real Solana transaction
on devnet (with `TRUST_WALLET_DEVNET_KEY`) or mainnet-beta (with `TRUST_WALLET_SECRET_KEY`
and `NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true`).

Verify:
- [ ] `mint_status` changes from `stub` → `pending` → `minted`
- [ ] `mintTxSignature` is populated in the API response
- [ ] Transaction visible on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

---

## API Test (curl)

```bash
# Save a campaign
curl -X POST https://launch.unykorn.org/api/solana/campaign/save \
  -H "Content-Type: application/json" \
  -d '{"input":{"campaignName":"Test QR Campaign","businessName":"test-shop","namespaceSlug":"test-shop","campaignType":"qr_campaign","description":"Coffee shop QR campaign","cityOrEvent":"Atlanta","offer":"10% off coffee","quantity":100}}'

# Get campaign by namespace
curl https://launch.unykorn.org/api/solana/campaign/test-shop
```
