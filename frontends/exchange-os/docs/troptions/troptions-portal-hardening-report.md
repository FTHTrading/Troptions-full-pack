# Troptions Portal — Hardening Report

**Date:** 2026-04-27  
**Session:** Portal hardening pass  
**TypeScript:** ✅ `npx tsc --noEmit` EXIT:0 (pre and post hardening)

---

## Files Changed

| File | Change |
|---|---|
| `src/app/api/troptions/wallet/generate/route.ts` | Seed stripped from production response; `TROPTIONS_WALLET_DEMO_MODE` flag added |
| `src/app/troptions-portal/page.tsx` | All hardening (see below) |
| `docs/troptions/troptions-portal-security-audit.md` | Created (this pass) |
| `docs/troptions/troptions-portal-hardening-report.md` | Created (this file) |

---

## Risks Fixed

### 1. Seed Handling — FIXED ✅
**Before:** `wallet/generate` returned `wallet.seed` to browser; portal displayed it in plaintext.  
**After:**
- Production: seed is generated server-side, used to derive address/publicKey, then **discarded immediately** — `seed: null` in response
- `TROPTIONS_WALLET_DEMO_MODE=true` env flag enables seed return for explicit demo environments only
- Demo seed hidden behind "Reveal (Demo)" toggle, shown in red with ⛔ warning
- `WalletGenerator` component now shows "Address + public key only · No seed returned" label
- Section badge updated to "Address Only · No Seed"
- Safety banner added explaining users must use Xaman/local tools for mainnet wallets

### 2. Treasury Funding — DISABLED ✅
**Before:** `FundWalletForm` submitted to `POST /api/troptions/fund/wallet` which executed live XRP transfers from the 10.99 XRP XRPL treasury.  
**After:**
- `FundSection` top-of-section red warning banner: "⛔ Treasury Funding Disabled — Public Portal"
- Fund form submit buttons renamed: "GENERATE FUNDING RECORD (SIMULATION ONLY)"
- Button variant changed from `gold` to `outline` (visual de-emphasis)
- Section badge updated: "Simulation Only · Treasury Disabled" (amber)
- Section title changed: "Fund & Seed Treasury Ops" → "Funding Simulation"
- Tab labels: "Fund Wallet (Simulation)" / "AMM Deposit (Simulation)"
- Note: The underlying API routes still gate on `TROPTIONS_XRPL_MINT_MODE=simulation` — this portal labeling adds a UI-layer safety net on top

### 3. Mint/NFT/MPT/LP Panels — LABELED ✅
**Before:** Buttons read "MINT NFT", "CREATE LP POOL", etc. No simulation labels.  
**After:** Each form has an amber banner: "Simulation Only — Unsigned payload example. No transaction broadcast."  
Button labels updated:
- "CREATE TRADELINE" → "GENERATE TRADELINE PAYLOAD (SIMULATION)"
- "MINT NFT" → "BUILD NFT PAYLOAD (SIMULATION)"
- "CREATE MPT ISSUANCE" → "BUILD MPT PAYLOAD (SIMULATION)"
- "CREATE LP POOL" → "BUILD LP POOL PAYLOAD (SIMULATION)"

### 4. Trust Lines — LABELED ✅
**Before:** TrustSet JSON copy panel had no "unsigned/template" label.  
**After:** Amber banner: "Template Only — Unsigned. No transaction is submitted from this portal."  
Section badge updated: "Template Only · Unsigned"

### 5. Control Hub Safety Status Block — ADDED ✅
Hardcoded status bar between sticky header and hero:
- `Public Portal Mode: Simulation-Only` (amber)
- `Mainnet Execution: Blocked` (red)
- `Treasury Funding: Disabled` (red)
- `Minting: Unsigned Payloads Only` (amber)
- `Control Hub Approval Required for Live Ops` (red)

---

## API Safety Status

| Route | Secrets Exposed? | Live Chain Risk? | Status |
|---|---|---|---|
| `GET /api/troptions/price` | None | None (read-only CoinGecko) | ✅ Safe |
| `POST /api/troptions/wallet/generate` | None in production | None (key generation only) | ✅ Fixed |
| `POST /api/troptions/wallet/verify` | None | None (read-only XRPL) | ✅ Safe |
| `POST /api/troptions/mint/tradeline` | None | Blocked by `MINT_MODE=simulation` | ✅ Safe |
| `POST /api/troptions/mint/nft` | None | Blocked by `MINT_MODE=simulation` | ✅ Safe |
| `POST /api/troptions/mint/mpt` | None | Blocked by `MINT_MODE=simulation` | ✅ Safe |
| `POST /api/troptions/mint/lp-token` | None | Blocked by `MINT_MODE=simulation` | ✅ Safe |
| `POST /api/troptions/fund/wallet` | None | UI-disabled + `MINT_MODE=simulation` | ✅ Mitigated |
| `POST /api/troptions/fund/amm` | None | UI-disabled + `MINT_MODE=simulation` | ✅ Mitigated |

---

## Validation

```
npx tsc --noEmit   → EXIT:0 ✅ (clean, no type errors)
```

---

## Remaining Risks / Notes

1. **`fund/wallet` and `fund/amm` API routes** — rely on `TROPTIONS_XRPL_MINT_MODE=simulation` env var being set. If this env var is ever changed to `live`, and the API routes are called (e.g. from admin), treasury operations resume. The public portal buttons are now labelled simulation-only but the API itself has no auth gate. **Recommended future work:** Add admin JWT auth to fund routes before enabling live mode.

2. **`TROPTIONS_WALLET_DEMO_MODE` default** — defaults to off (seed not returned). Never set `=true` in production `.env` or Vercel env variables.

3. **Treasury seeds in `.env.local`** — `XRPL_TREASURY_SEED` and `STELLAR_TREASURY_SECRET` must never be committed or exposed. Confirm `.env.local` is in `.gitignore`.

4. **Price ticker CoinGecko** — uses public unauthenticated API. Rate limits may cause `null` prices (UI shows `—`). Consider adding CoinGecko API key in future.
