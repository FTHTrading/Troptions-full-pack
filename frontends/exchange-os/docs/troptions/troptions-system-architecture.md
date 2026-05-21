# Troptions System Architecture
## Institutional Operating System — Full Stack Overview

**Version:** 1.0.0  
**Audience:** Engineers, Architects, Institutional Partners, Auditors

---

## 1. Public Layer (troptions.unykorn.org)

The public layer is the investor- and partner-facing surface of the Troptions OS. All pages are read-only, proof-referenced, and disclaim financial promises.

**Stack:** Next.js 16 App Router · React 19 · TypeScript 5.9 · Tailwind CSS v4  
**Deploy:** Vercel (iad1 region) · Cloudflare CDN (troptions.unykorn.org)

**Key public routes:**
- `/troptions` — Institutional landing
- `/troptions/ecosystem` — Ecosystem evolution
- `/troptions/history` — Origin and background
- `/troptions/legal` — Legal standing and disclaimers
- `/troptions/rwa` — Real-world asset overview
- `/troptions/stablecoins` — Stable unit summary
- `/troptions/chains` — Chain coverage
- `/troptions/custody` — Custody coordination overview
- `/troptions/funding` — Funding route summary
- `/troptions/institutional` — Institutional manual entry
- `/troptions/xchange` — Troptions Xchange sub-brand *(NEW)*
- `/troptions/unity-token` — Unity Token sub-brand *(NEW)*
- `/troptions/university` — Troptions University *(NEW)*
- `/troptions/media` — TV Network / Media *(NEW)*
- `/troptions/real-estate` — Real Estate Connections *(NEW)*
- `/troptions/solar` — Green-N-Go Solar *(NEW)*
- `/troptions/mobile-medical` — Mobile Medical Units *(NEW)*
- `/troptions/ledger` — Ledger overview *(NEW)*

---

## 2. Brand Layer

All Troptions brands and affiliated ecosystem projects are registered in the `troptionsEcosystemRegistry.ts` content file. The brand registry is the single source of truth for:

- Sub-brand identity (`displayName`, `domain`, `category`)
- Public description and system role
- Logo candidates and asset folder paths
- Compliance notes and regulatory flags
- Integration priority and operational status
- Linked system capabilities
- Next actions (manual + automated)

**Primary brands:** Troptions · Troptions Xchange · Unity Token · Troptions University · TV Network · The Real Estate Connections · Green-N-Go Solar · HOTRCW · Mobile Medical Units

Logo assets are placed in `public/assets/troptions/` with sub-brand subfolders (see `README.md` there).

---

## 3. Ledger Layer

The Troptions ledger is not a blockchain itself — it is a proof-gated coordination layer that sits above external settlement rails (XRPL, Stellar, EVM).

**Key files:**
- `src/lib/troptions/troptionsLedgerAdapter.ts` — Safe read/simulation adapter *(NEW)*
- `src/lib/troptions/walletLedgerEngine.ts` — Wallet-level ledger operations
- `src/lib/troptions/xrplLedgerEngine.ts` — XRPL ledger integration
- `src/lib/troptions/stablecoinRailEngine.ts` — Stable unit rails
- `src/lib/troptions/globalRailEngine.ts` — Multi-chain rail coordination

**Approval requirement:** All ledger write operations require passing through:
1. `approvalEngine.ts` — approval gate check
2. `auditLogEngine.ts` — immutable log write
3. `deploymentGates.ts` — feature flag / env var gate

---

## 4. Liquidity Layer

Liquidity routing in Troptions is modelled and simulation-only unless explicit approval gates are satisfied. Liquidity paths are documented but not executed without board authorization and legal clearance.

**Engines:**
- `xrplAmmEngine.ts` — XRPL AMM route simulation
- `xrplDexEngine.ts` — XRPL DEX order book modelling
- `algorithmicTradingEngine.ts` — Trade algorithm simulation
- `tradingRiskEngine.ts` — Risk model for trade routes

**Simulation safety:** Every liquidity call returns a `simulationOnly: true` flag in its response. Live execution requires `liveExecution: true` plus approval gate sign-off.

---

## 5. Partner Layer

Partners, issuers, and institutional members interact through the Troptions Portal (client portal pages) and the Admin Command panel.

**Portal routes:** `/portal/troptions/wallet`, `/portal/troptions/kyc`, `/portal/troptions/kyb`, `/portal/troptions/entities`, `/portal/troptions/xrpl`

**Admin routes:** `/admin/troptions/` — 55+ administrative pages covering wallets, chains, XRPL, compliance, RWA, settlement, approvals, audit logs

**Authentication:** Custom HMAC-SHA256 JWT (`apiAuth.ts`) — no external auth library. Token rotation via `operatorSecurity.ts`.

---

## 6. Documentation Layer

All system documentation lives in `docs/`:

```
docs/
├── README.md
├── architecture.md
├── brand-system.md
├── repository-map.md
├── xrpl-platform.md
├── runbooks/         ← 8 operational runbooks
└── troptions/        ← NEW: Troptions-specific docs
    ├── troptions-integration-audit.md
    ├── troptions-system-architecture.md   ← this file
    ├── troptions-overview.md
    ├── troptions-brand-map.md
    ├── troptions-domain-map.md
    ├── troptions-ledger-readiness.md
    ├── troptions-partner-meeting-brief.md
    └── troptions-next-actions.md
```

---

## 7. Compliance Layer

Every Troptions module is compliance-gated. The compliance architecture includes:

| Component | File | Purpose |
|---|---|---|
| KYC/KYB engine | `kycEngine.ts`, `kybEngine.ts` | Identity verification |
| AML screening | `antiIllicitFinanceEngine.ts` | Transaction risk scoring |
| Chain risk | `chainRiskScoringEngine.ts` | Chain-level risk scores |
| Approval gate | `approvalEngine.ts` | Multi-sig approval flow |
| Sanctions check | `sanctionsEngine.ts` | OFAC + lists |
| Audit log | `auditLogEngine.ts` | Immutable event log |
| Deployment gates | `deploymentGates.ts` | Feature flags |
| Operator security | `operatorSecurity.ts` | IP allowlist + rate limit |
| Request guards | `requestGuards.ts` | Idempotency + rate limit |

**Compliance model:** `compliance-by-jurisdiction` — each workflow validates against jurisdiction rules before proceeding.

---

## 8. AI Layer

The AI layer provides intelligent search, narration, and recommendations across the Troptions knowledge base.

**Endpoints:**
- `GET /api/troptions/ai/narrate` — Narration for page summaries
- `GET /api/troptions/ai/search` — Semantic search over Troptions knowledge
- `POST /api/troptions/ai/recommend` — Module recommendations

**Knowledge files:** `public/troptions-knowledge.json`, `public/troptions-capabilities.json`, `public/troptions-entity-map.json`

---

## 9. Tokenization Layer

Troptions token and asset issuance is entirely proof-gated. No token minting, distribution, or transfer occurs without:

1. Legal counsel sign-off
2. Board authorization
3. Custody provider approval
4. KYC/KYB completion
5. Jurisdiction compliance clearance

**Token references:** Unity Token (TUT), TROPTIONS barter unit, Stable units  
**Chain candidates:** XRPL, Stellar, EVM (Ethereum / Polygon), Solana  
**Current state:** All tokens are in draft/evaluation — zero live issuance

---

## 10. Safety Gates Summary

| Gate | Enforced By | Current State |
|---|---|---|
| Control plane writes | `TROPTIONS_CONTROL_PLANE_WRITES_ENABLED` env var | Active |
| Admin auth | `TROPTIONS_JWT_SECRET` HMAC | Active |
| IP allowlist | `operatorSecurity.ts` | Active |
| Rate limits | `requestGuards.ts` | Active |
| Idempotency keys | `requestGuards.ts` | Active |
| Approval flow | `approvalEngine.ts` | Active |
| Audit log | `auditLogEngine.ts` | Active |
| Feature flags | `deploymentGates.ts` | Active |
| Live execution block | All ledger/liquidity engines | Simulation-only enforced |

---

## Appendix: Technology Stack

| Component | Technology |
|---|---|
| Framework | Next.js 16.2.4 App Router |
| Language | TypeScript 5.9 |
| UI | React 19 + Tailwind CSS v4 |
| Database (local) | better-sqlite3 (ephemeral on Vercel) |
| Database (prod) | PostgreSQL via `pg` adapter |
| Authentication | Custom HMAC-SHA256 JWT |
| Deploy | Vercel + Cloudflare CDN |
| Testing | Jest 30 |
| Node | v24.13.0 |
