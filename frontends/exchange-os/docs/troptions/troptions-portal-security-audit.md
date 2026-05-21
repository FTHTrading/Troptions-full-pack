# Troptions Portal — Security Audit

**Date:** 2026-04-27  
**Auditor:** Automated hardening pass (GitHub Copilot)  
**Scope:** `src/app/troptions-portal/page.tsx` + all 8 API routes it calls  
**Status:** Pre-hardening findings (fixed in same session)

---

## Public Features Audited

| Feature | API Called | Notes |
|---|---|---|
| Price ticker (XRP/XLM) | `GET /api/troptions/price` | Read-only, CoinGecko |
| Wallet address generation | `POST /api/troptions/wallet/generate` | ⚠ Returned real seed |
| Trust line guide | None | Static JSON template + copy buttons |
| Tradeline mint | `POST /api/troptions/mint/tradeline` | Simulation-gated via env |
| NFT mint | `POST /api/troptions/mint/nft` | Simulation-gated via env |
| MPT mint | `POST /api/troptions/mint/mpt` | Simulation-gated via env |
| LP token | `POST /api/troptions/mint/lp-token` | Simulation-gated via env |
| Fund wallet | `POST /api/troptions/fund/wallet` | ⛔ Treasury-sourced, live XRP risk |
| AMM deposit | `POST /api/troptions/fund/amm` | ⛔ Treasury-sourced, live XLM risk |
| Asset verifier | `POST /api/troptions/wallet/verify` | Read-only, safe |

---

## Risk Register (Pre-Hardening)

### CRITICAL — Seed Exposure
- **Location:** `WalletGenerator` component + `POST /api/troptions/wallet/generate`
- **Risk:** Server called `Wallet.generate()` and returned the real secp256k1 seed (`sEd...`) in the JSON response. The portal displayed it in plaintext in the browser with a copy button.
- **Impact:** Any public user visiting the portal would be shown real XRPL seeds. If they followed the "Fund with 2+ XRP" instruction and funded the wallet, their funds would be at risk if the page was MitM'd, logged, or screenshot.
- **CVSS equivalent:** HIGH

### CRITICAL — Treasury Funding via Public Portal
- **Location:** `FundWalletForm` → `POST /api/troptions/fund/wallet`
- **Risk:** Form submitted with any XRPL address and amount → `mintingEngine.fundWallet()` → signed with `process.env.XRPL_TREASURY_SEED` → broadcast to XRPL Mainnet.
- **Impact:** Any member of the public could drain the 10.99 XRP treasury by submitting the fund form with their own address.
- **CVSS equivalent:** CRITICAL

### HIGH — AMM Deposit from Treasury
- **Location:** `AmmDepositForm` → `POST /api/troptions/fund/amm`
- **Risk:** Same as above — calls `mintingEngine.ammDeposit()` which uses treasury seed.
- **Impact:** Treasury liquidity deployable by any public user.

### MEDIUM — No Simulation Labels on Mint Forms
- **Location:** `TradelineForm`, `NftForm`, `MptForm`, `LpForm`
- **Risk:** Mint forms showed no "simulation only" / "unsigned" labels. Buttons read "MINT NFT", "CREATE LP POOL", etc. Users could misinterpret these as live on-chain operations.
- **Note:** API routes were simulation-gated via `TROPTIONS_XRPL_MINT_MODE=simulation` env var — actual transactions were not broadcast. Risk was primarily UX confusion + liability.

### MEDIUM — Trust Line Templates Unlabeled
- **Location:** `TrustLineGuide`
- **Risk:** XRPL TrustSet JSON had no "template only / unsigned" label. Users might interpret the copy button as auto-submitting to chain.

### LOW — Price Ticker Graceful Failure
- **Location:** `PriceTicker` → `GET /api/troptions/price`
- **Risk:** API route already had `AbortSignal.timeout(8000)` and returned `null` values on failure. UI showed `—` for null prices. Acceptable.
- **No action required.**

### LOW — Missing Control Hub Status Indicator
- **Location:** Main portal page
- **Risk:** No visible indicator that the portal was in simulation-only mode. Could lead to legal or compliance concerns.

---

## APIs Returning Secrets (Pre-Hardening)

| Route | Secret Returned? | Fix Applied |
|---|---|---|
| `wallet/generate` | ✅ YES — real `wallet.seed` | Removed from production response; demo-mode flag added |
| `wallet/verify` | No (read-only) | No change needed |
| `price` | No | No change needed |
| `mint/*` | No (simulation only) | No change needed |
| `fund/*` | Uses treasury seed server-side; not returned but executes live | Simulation labels added |

---

## Recommendations (All Applied in Hardening Pass)

1. ✅ Strip seed from `wallet/generate` production response — address+publicKey only
2. ✅ Add `TROPTIONS_WALLET_DEMO_MODE` env flag — seed only returned when explicitly enabled
3. ✅ Disable live treasury funding in public portal — simulation records only
4. ✅ Add "Treasury Funding Disabled" banner to FundSection
5. ✅ Rename fund form buttons to "SIMULATION ONLY"
6. ✅ Add simulation/unsigned labels to all 4 mint forms
7. ✅ Label trust line templates as "Template Only — Unsigned"
8. ✅ Add Control Hub safety status bar (5-gate banner)
9. ✅ Update section badges to reflect simulation status
