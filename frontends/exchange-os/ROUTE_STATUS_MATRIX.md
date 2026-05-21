# ROUTE STATUS MATRIX — TROPTIONS Client-Facing Platform
**Date:** 2026-05-04  
**Total routes audited:** 78 public + 60 portal  

Legend:
- `LIVE` — real page + real backend writes or verified static output
- `UI` — page renders, no backend mutation
- `SIM` — page renders simulation/mock data only
- `404` — no page.tsx in directory
- `REDIRECT` — page immediately redirects to another URL
- `UNAUTH` — page accessible without login (should require auth)

---

## Public Marketing / Information Routes (`/troptions/...`)

| Route | Status | Notes |
|---|---|---|
| `/troptions` | `UI` | Homepage — pure presentation, no backend calls |
| `/troptions/anti-illicit-finance` | `UI` | Informational |
| `/troptions/asset-issuance` | `UI` | Informational |
| `/troptions/book` | `UI` | |
| `/troptions/capabilities` | `UI` | |
| `/troptions/capabilities-expanded` | `UI` | |
| `/troptions/carbon` | `UI` | |
| `/troptions/chain-risk` | `UI` | |
| `/troptions/chains` | `UI` | |
| `/troptions/cis` | `REDIRECT` | → `/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf` (file exists ✓) |
| `/troptions/client-onboarding` | `UI` | |
| `/troptions/compliance` | **`404`** | No page.tsx — linked from homepage "Compliance" vertical |
| `/troptions/contact` | `LIVE` | Form → `/api/troptions/inquiries` → SQLite `data/revenue.db` |
| `/troptions/cross-rail` | `UI` | |
| `/troptions/custody` | `UI` | |
| `/troptions/disclaimers` | `UI` | |
| `/troptions/ecosystem` | `UI` | Golf & Lifestyle |
| `/troptions/exchange-readiness` | `UI` | |
| `/troptions/funding` | `UI` | |
| `/troptions/funding-routes` | `UI` | |
| `/troptions/future` | `UI` | |
| `/troptions/genius-control-tower` | `UI` | |
| `/troptions/genius-yield-opportunity` | `UI` | |
| `/troptions/history` | `UI` | |
| `/troptions/insights` | `UI` | |
| `/troptions/institutional` | **`404`** | No root page.tsx — 14 sub-pages exist but index is missing |
| `/troptions/institutional/overview` | `UI` | Sub-page exists |
| `/troptions/institutional/claims` | `UI` | Sub-page exists |
| `/troptions/institutional/diligence-room` | `UI` | Sub-page exists |
| `/troptions/kyc` | `UI` | |
| `/troptions/layer1` | `UI` | Architecture documentation |
| `/troptions/ledger` | `UI` | |
| `/troptions/legacy` | `UI` | |
| `/troptions/legal` | `UI` | |
| `/troptions/live` | `UI` | |
| `/troptions/media` | `UI` | |
| `/troptions/migration` | `UI` | |
| `/troptions/mobile-medical` | `UI` | |
| `/troptions/momentum` | `UI` | |
| `/troptions/neobank` | `UI` | |
| `/troptions/nil` | `UI` | |
| `/troptions/onboarding` | `UI` | |
| `/troptions/payment-rails` | `UI` | |
| `/troptions/payments` | `UI` | |
| `/troptions/platform` | `UI` | |
| `/troptions/pof` | `UI` | POF downloads — links to files in `/public/proofs/` |
| `/troptions/pricing` | `UI` | |
| `/troptions/proof` | `UI` | Proof room documentation |
| `/troptions/public-benefit` | `UI` | |
| `/troptions/real-estate` | `UI` | |
| `/troptions/risk-analytics` | `UI` | |
| `/troptions/rwa` | **`404`** | No page.tsx — linked from homepage "RWA Platform" vertical |
| `/troptions/rwa-readiness` | `UI` | |
| `/troptions/services` | `UI` | |
| `/troptions/settlement` | **`404`** | No page.tsx — linked from homepage "Settlement" vertical |
| `/troptions/solar` | `UI` | |
| `/troptions/stablecoins` | `LIVE` | Real issuance records, TX hashes, explorer links |
| `/troptions/stellar` | `UI` | |
| `/troptions/then-now` | `UI` | |
| `/troptions/transactions` | `UI` | |
| `/troptions/treasury` | `UI` | |
| `/troptions/trust` | `UI` | |
| `/troptions/unity-token` | `UI` | |
| `/troptions/university` | `UI` | |
| `/troptions/verification` | `LIVE` | Full XRPL proof records, TX hashes verified format |
| `/troptions/verify` | `UI` | |
| `/troptions/wallet-forensics` | `UI` | |
| `/troptions/wallet-hub` | `UI` | |
| `/troptions/wallets` | `UI` | |
| `/troptions/what-changes` | `UI` | |
| `/troptions/workflows` | `UI` | |
| `/troptions/xchange` | `UI` | |
| `/troptions/xrpl` | `UI` | |
| `/troptions/xrpl-iou` | `UI` | |
| `/troptions/xrpl-platform` | `UI` | |
| `/troptions/xrpl-stellar-compliance` | `UI` | |

---

## Static Proof Files (served from `/public/...`)

| URL Path | File on Disk | Size | Status |
|---|---|---|---|
| `/proofs/bryan-stone-usdc-175m.html` | `public/proofs/bryan-stone-usdc-175m.html` | 29 KB | ✓ EXISTS |
| `/proofs/troptions-pof-usdc-175m-desk.html` | `public/proofs/troptions-pof-usdc-175m-desk.html` | 18 KB | ✓ EXISTS |
| `/proofs/troptions-pof-usdc-175m-desk.pdf` | `public/proofs/troptions-pof-usdc-175m-desk.pdf` | 466 KB | ✓ EXISTS |
| `/proofs/x402-mesh-pay-overview.pdf` | `public/proofs/x402-mesh-pay-overview.pdf` | 6 KB | ✓ EXISTS |
| `/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf` | `public/troptions/downloads/...` | — | ✓ EXISTS |
| `/downloads/troptions-pof-usdc-175m-desk.pdf` | `public/downloads/...` | 466 KB | ✓ EXISTS |

---

## Portal Routes (`/portal/troptions/...`)

**Auth status:** ALL UNAUTHENTICATED — middleware does not cover `/portal/...`

| Route | Has page | Notes |
|---|---|---|
| `/portal/troptions/dashboard` | ✓ | `UNAUTH` — publicly accessible |
| `/portal/troptions/kyc` | ✓ | `UNAUTH` |
| `/portal/troptions/kyb` | ✓ | `UNAUTH` |
| `/portal/troptions/onboarding` | ✓ | `UNAUTH` |
| `/portal/troptions/proof-of-funds` | ✓ | `UNAUTH` |
| `/portal/troptions/stablecoins` | ✓ | `UNAUTH` |
| `/portal/troptions/xrpl` | ✓ | `UNAUTH` |
| `/portal/troptions/wallet/*` | ✓ (6 sub-pages) | `UNAUTH` |
| `/portal/troptions/wallet-forensics/*` | ✓ (6 sub-pages) | `UNAUTH` |
| `/portal/troptions/xrpl-platform/*` | ✓ (7 sub-pages) | `UNAUTH` |
| `/portal/troptions/trading/*` | ✓ (3 sub-pages) | `UNAUTH` |
| *(50+ more portal routes)* | ✓ | `UNAUTH` |

---

## API Routes — Backend Reality

| Route | Method | Backend | Real? |
|---|---|---|---|
| `/api/auth/login` | POST | SQLite `data/auth.db`, bcrypt | ✓ REAL |
| `/api/auth/logout` | POST | Cookie clear + DB session delete | ✓ REAL |
| `/api/auth/register` | POST | SQLite write | ✓ REAL |
| `/api/troptions/inquiries` | POST/GET | SQLite `data/revenue.db` | ✓ REAL |
| `/api/troptions/booking-requests` | POST | SQLite `data/revenue.db` | ✓ REAL |
| `/api/health/live` | GET | Liveness check | ✓ REAL |
| `/api/health/ready` | GET | Readiness check | ✓ REAL |
| `/api/troptions/xrpl-ecosystem/status` | GET | `xrplStellarControlHubBridge` | NEEDS VERIFY |
| `/api/troptions/xrpl-platform/live-data` | GET | XRPL node call | NEEDS VERIFY |
| `/api/troptions/wallet-forensics/*` | various | Internal forensics engine | SIM/PARTIAL |
| Most `/simulate` routes | POST | Returns mock calculations | SIM ONLY |
| Most `/api/troptions/mint/*` | POST | Simulation — no live signing | SIM ONLY |

---

## Routes Linked from `/troptions` Homepage That 404

| Link Text | href | Issue |
|---|---|---|
| Institutional Inquiry (CTA) | `/troptions/institutional` | No root page.tsx |
| Institutional (ecosystem list) | `/troptions/institutional` | Same |
| Compliance | `/troptions/compliance` | No page.tsx |
| RWA Platform | `/troptions/rwa` | No page.tsx |
| Settlement | `/troptions/settlement` | No page.tsx |
