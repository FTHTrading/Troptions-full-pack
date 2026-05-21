# TROPTIONS Build Reality Audit

**Date:** 2025-01-27  
**Auditor:** GitHub Copilot (automated session audit)  
**Build:** Next.js 16.2.4 (webpack) — `pnpm next build --webpack`  
**Result:** ✅ EXIT 0 — 870 pages prerendered cleanly  
**Tests:** 57 suites / 1031 tests — all passing  

---

## Audit Methodology

This audit was conducted by reading source files, running builds, running tests, and inspecting every engine, adapter, and API route in the codebase. Nothing was assumed — only what the code provably does is marked BUILT. Claims are cross-referenced against implementation files. No external systems were contacted.

**Legend:**
- ✅ BUILT — Code runs, data flows, real outputs produced
- ⚠️ PARTIAL — Architecture present, some gaps or simulation fallbacks
- 🟡 MOCK — State machine or static data only, no live I/O
- ❌ MISSING — Claimed in UI or docs, no implementation found
- 🔴 SECURITY — Security concern requiring attention

---

## 1. Core Infrastructure

### 1.1 Next.js Web Application
**Status: ✅ BUILT**

- 870 static pages prerendered across `/troptions/*`, `/troptions-cloud/*`, `/portal/*`, `/ttn/*`, `/troptions-ai/*`
- App Router (`src/app/`), React Server Components, TypeScript 5
- Edge runtime warnings on select routes (benign, static gen disabled per page as expected)
- Build command: `pnpm next build --webpack`; `cpus: 1, workerThreads: false` required on Windows to avoid IPC pipe crash (errno -4094)

### 1.2 Authentication
**Status: ⚠️ PARTIAL — functional but insecure password hashing**

File: `src/lib/auth/db.ts`

- SQLite database at `data/auth.db` (auto-created on first run)
- Session table: 30-day expiry, stored server-side, cookie-based
- User table: email + password hash
- **🔴 SECURITY: Passwords hashed with `crypto.createHash('sha256')`** — SHA-256 is NOT a password KDF. Should be bcrypt or argon2. Susceptible to rainbow table attacks if database is exfiltrated.
- Sessions work correctly for protected routes
- `src/proxy.ts` guards `/api/troptions/:path*` via Bearer token or `troptions_session` cookie

### 1.3 API Auth Proxy
**Status: ✅ BUILT**

File: `src/proxy.ts` (renamed from `middleware.ts` during this session to resolve naming conflict)

- Checks `Authorization: Bearer <token>` or `troptions_session` cookie
- Returns 401 for unauthenticated requests to `/api/troptions/*`
- No `runtime = "edge"` (removed during this session — edge runtime is incompatible with the proxy role here)

### 1.4 SQLite Control Plane
**Status: ✅ BUILT**

File: `src/lib/troptions/controlPlaneDb.ts`  
Database: `data/troptions-control-plane/control-plane.db`

- Stores namespace registry, system state, audit log
- better-sqlite3 loaded server-side via `serverExternalPackages`
- All reads/writes are local — no remote database dependency for core operation

### 1.5 PostgreSQL Adapter
**Status: ⚠️ PARTIAL — optional, not required**

File: `src/lib/troptions/postgresAdapter.ts`

- Functional adapter for `DATABASE_URL` env var
- Falls back gracefully if `DATABASE_URL` is not set
- Not currently used by any live feature — reads and writes go to SQLite

---

## 2. Blockchain Integrations

### 2.1 XRPL (XRP Ledger)
**Status: ⚠️ PARTIAL — real SDK, real keys, gated behind env var**

Files: `src/lib/troptions/xrplGenesisEngine.ts`, `src/app/api/troptions/xrpl/*`

**What is real:**
- `xrpl` npm package (official Ripple SDK) is installed and used
- `getAccountInfo()` makes real XRPL Testnet/Mainnet RPC calls when called
- NFT minting, DEX offer creation, AMM pool creation are implemented using real SDK types
- Mainnet issuer address and TROPTIONS IOU currency code are hardcoded

**What is gated:**
- All mutation operations (configure account, issue IOU, mint NFT, create AMM) check `process.env.GENESIS_ADMIN_KEY` before executing
- Without `GENESIS_ADMIN_KEY` set in env, all write operations return `{ ok: false, reason: "genesis admin key not set" }`
- No key is set in `.env.local` by default — nothing touches mainnet unless explicitly configured

**What does not exist:**
- No automated re-issuance, no recurring settlement, no live price feeds from XRPL DEX

### 2.2 Stellar
**Status: ⚠️ PARTIAL — real SDK, real keys, gated behind env var**

Files: `src/lib/troptions/stellarGenesisEngine.ts`, `src/app/api/troptions/stellar/*`

**What is real:**
- `@stellar/stellar-sdk` installed and used
- `getStellarGenesisStatus()` returns live account data when called with valid keys
- LP pool creation (XLM/TROPTIONS, USDC/TROPTIONS), trustline management, supply issuance all use real Stellar SDK operations

**What is gated:**
- Same `GENESIS_ADMIN_KEY` guard as XRPL — no writes without it
- `STELLAR_ISSUER_SECRET` and `STELLAR_DISTRIBUTOR_SECRET` must also be set for live operations

**What does not exist:**
- No automated Stellar settlement loop, no live anchor integration

### 2.3 Minting Engine
**Status: 🟡 MOCK (simulation mode by default)**

File: `src/lib/troptions/mintingEngine.ts`

- `TROPTIONS_XRPL_MINT_MODE` defaults to `"simulation"` — no live minting without explicit env flag
- `TROPTIONS_STELLAR_MINT_MODE` same
- Simulation mode returns realistic-looking responses without touching any chain

### 2.4 Rust Layer-1 (troptions-rust-l1)
**Status: ❌ SCAFFOLD ONLY — no consensus, no live execution**

Directory: `troptions-rust-l1/`

- 26+ Cargo crates defined (node, consensus, runtime, assets, amm, compliance, etc.)
- `crates/consensus/src/lib.rs`: all consensus functions return `"Not implemented in scaffold phase"`
- `crates/runtime/src/lib.rs`: boots all subsystems as stubs, every subsystem has `simulation_only: true, live_execution_enabled: false`
- The node binary prints a simulation banner and exits — it does not process transactions
- No P2P networking, no block production, no actual token ledger state
- This is a well-structured scaffold for future development, not a running chain

### 2.5 Smart Contracts (Solidity)
**Status: ❌ NOT DEPLOYED**

Files: `contracts/TroptionsGatewayVault.sol`, `contracts/TroptionsUSDCVault.sol`

- Solidity contracts exist in the repository
- No deployment scripts, no ABI artifacts, no deployed addresses
- No web3 provider connection in the Next.js app to interact with these contracts
- Contracts are reference/planning documents only

---

## 3. Financial Operations

### 3.1 Ledger Adapter
**Status: 🟡 MOCK**

File: `src/lib/troptions/troptionsLedgerAdapter.ts`

- All methods return `simulationOnly: true, liveExecutionEnabled: false`
- No reads or writes to any external ledger
- Balances, transfers, and account states are computed in-memory with static data

### 3.2 Wallet / Balance Views
**Status: 🟡 MOCK (static registry)**

File: `src/lib/troptions/walletLedgerEngine.ts`

- Reads from `walletBalanceRegistry` (static content in code)
- Balance statuses: `"demo" | "testnet" | "pending" | "verified"`
- No live chain queries; no private key management
- The portal wallet UI displays these static values

### 3.3 Escrow Engine
**Status: 🟡 MOCK**

File: `src/lib/troptions/escrowStateEngine.ts`

- Comment in file: "SIMULATION-ONLY — no live token custody, no live smart contract execution"
- State machine tracks escrow workflow steps in-memory
- No funds ever move

### 3.4 Treasury
**Status: 🟡 MOCK**

File: `data/treasury-funding-log.json`

- Static JSON file with funding log entries
- `/api/troptions/treasury` route reads this file
- No live bank integration, no live blockchain treasury reads

---

## 4. Compliance & Identity

### 4.1 KYC/Onboarding Engine
**Status: ⚠️ PARTIAL — architecture present, no live provider**

File: `src/lib/troptions/kycOnboardingEngine.ts`

- Comment: "SIMULATION-ONLY — no live KYC, no PII stored, no live oracle writes"
- Stores SHA-256 hashes of document content only (not raw PII)
- KYC workflow state machine is fully implemented
- Plug-in point for live KYC provider exists but no provider API key is wired up

### 4.2 Compliance Screening (AML/OFAC)
**Status: ⚠️ PARTIAL — shadow mode, no live provider**

File: `src/lib/troptions/complianceScreenEngine.ts`

- Default mode: `"shadow"` — all screenings pass but results are logged
- Live Chainalysis/Elliptic integration stub is present; needs API key to activate
- OFAC sanctions list is not loaded — screening against live sanctions lists does not occur

### 4.3 Exchange Readiness
**Status: ✅ BUILT (dashboard/tracker)**

File: `src/app/troptions/exchange-readiness/page.tsx`

- COMPLIANCE_CHECKLIST items tracked with `"pending" | "in-progress"` statuses
- Real UI dashboard showing readiness progress
- The checklist items are accurate labels for actual exchange listing requirements
- No automated completion — items must be manually updated as work completes

---

## 5. Content & Namespace System

### 5.1 Namespace Registry
**Status: ✅ BUILT (content registry, not on-chain)**

Files: `src/content/troptions-cloud/namespaceRegistry.ts`

- 10 namespaces registered (troptions, troptions-tv, troptions-media, troptions-business, etc.)
- Each namespace has slug, displayName, description, tier, features
- Used to generate 870 static pages via `generateStaticParams`
- **Not on-chain** — namespace ownership is not cryptographically enforced; it's a content registry

---

## 6. Client-Facing Revenue Layer

*Added: 2026-05-04 — GitHub Copilot automated session*
*Build after addition: ✅ EXIT 0 — 60 test suites / 1071 tests passing*

### 6.1 Client Inquiry System
**Status: ✅ BUILT**

- `POST /api/troptions/inquiries` — public endpoint, validates required fields, writes to `data/revenue.db`
- `GET /api/troptions/inquiries` — admin-only (auth cookie required), returns inquiry list + summary
- Lead scoring: `qualifyLead()` returns 0–100 score based on budget, company, phone, message length, etc.
- SQLite table: `inquiries` (id, name, email, company, budget_range, service_interest, message, status, lead_score, etc.)

### 6.2 Booking Request System
**Status: ✅ BUILT**

- `POST /api/troptions/booking-requests` — public endpoint, writes to `data/revenue.db`
- `GET /api/troptions/booking-requests` — admin-only, returns bookings + summary
- Calendar integration: ❌ NOT BUILT — booking form shows manual confirmation warning
- SQLite table: `booking_requests` (id, name, email, company, call_type, preferred_date, etc.)

### 6.3 Client-Facing Pages
**Status: ✅ BUILT**

| Page | Status |
|---|---|
| `/troptions/services` | ✅ 8 service cards, prices, SystemStatusBadge |
| `/troptions/pricing` | ✅ 4 packages from SERVICE_PACKAGES data |
| `/troptions/contact` | ✅ Full inquiry form, API-wired, consent checkbox |
| `/troptions/book` | ✅ Booking form, API-wired |
| `/troptions/client-onboarding` | ✅ 6-step onboarding overview |
| `/troptions/trust` | ✅ Operational checklist + compliance notices |
| `/troptions/disclaimers` | ✅ 9-section plain-language legal page |
| `/troptions/payments` | ✅ Payment readiness status, invoice-only mode |
| `/troptions/insights` | ✅ 6 article stubs with SystemStatus badges |

### 6.4 Admin Revenue Dashboard
**Status: ✅ BUILT**

- `/admin/revenue` — auth-gated server component
- Shows: summary cards, breakdowns by service/budget, priority leads table (score ≥ 50), all inquiries, all bookings
- Calls `listInquiries()`, `listBookingRequests()`, `getInquirySummary()`, `getBookingSummary()` from revenue-db
- Calculates `totalEstimatedValue` from `calculateEstimatedOpportunityValue()` per inquiry

### 6.5 Payment Processing
**Status: ⚠️ PARTIAL — Invoice-Only Mode**

- Stripe: ❌ NOT CONFIGURED — no `STRIPE_SECRET_KEY` in env
- `getPaymentReadiness()` returns `status: "not_configured"`, `invoiceOnly: true`
- `createInvoiceRequest()` and `createDepositIntentPlaceholder()` return structured objects; no Stripe API calls made
- Manual invoice workflow is documented in `docs/revenue/PAYMENT_READINESS.md`
- Activation: add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` env vars — no code changes required

### 6.6 Compliance Components
**Status: ✅ BUILT**

- `SystemStatusBadge` — 7 statuses: Live, Client Ready, Intake Open, In Development, Planning, Demo Only, Compliance Review Required
- `ComplianceNotice` — orange warning block rendered on all RWA/token/escrow/trade desk pages
- All financial/investment claims are disclaimed on `/troptions/disclaimers`

### 6.7 Revenue Library
**Status: ✅ BUILT**

- `src/lib/troptions/revenue.ts` — types, SERVICE_PACKAGES (4), qualifyLead(), calculateEstimatedOpportunityValue(), getNextRecommendedAction()
- `src/lib/troptions/revenue-db.ts` — SQLite CRUD for inquiries + bookings, WAL mode
- `src/lib/troptions/payments.ts` — payment readiness layer, Stripe config detection

### 6.8 Tests
**Status: ✅ BUILT — 19 new tests across 3 files**

- `src/__tests__/troptions/revenue.test.ts` — package data, scoring, labels
- `src/__tests__/troptions/payments.test.ts` — Stripe config detection, invoice/deposit objects
- `src/__tests__/troptions/revenue-db.test.ts` — SQLite CRUD (isolated temp DB)

### What Can Make Money Immediately
- Qualified client inquiries → manual admin follow-up → invoice → wire/ACH
- Discovery call bookings → manual calendar confirmation → proposal → deposit

### What Still Needs Manual/Future Setup
- Stripe keys → activate online checkout
- Email notifications for new leads
- Calendar API integration for auto-confirmed bookings
- CRM integration (admin dashboard is the CRM for now)
- Proposal PDF generation

### 5.2 Sovereign AI Registry
**Status: ✅ BUILT (content registry)**

Files: `src/content/troptions-ai/sovereignAiRegistry.ts`

- 12 AI system templates defined with vertical, riskLevel, deploymentMode
- System instances are static content — not live AI deployments
- All systems marked `status: "simulation"` or `status: "draft"`

### 5.3 TTN (Troptions TV Network) Content
**Status: ✅ BUILT (static content)**

- Channels, creators, films, podcasts, news articles all defined as static content
- IPFS CIDs referenced in proof pages are real-looking hashes (not verified against live IPFS)
- No live video streaming, no upload pipeline

---

## 6. API Surface

### 6.1 Route Count
- **~120+ API routes** under `/api/troptions/*`
- All respond with structured JSON
- All are server-rendered on demand (`ƒ Dynamic`)

### 6.2 Route Quality by Category

| Category | Routes | Status |
|---|---|---|
| XRPL operations | `/api/troptions/xrpl/*` | ⚠️ PARTIAL (real SDK, env-gated) |
| Stellar operations | `/api/troptions/stellar/*` | ⚠️ PARTIAL (real SDK, env-gated) |
| Wallet operations | `/api/troptions/wallet/*` | 🟡 MOCK (static registry) |
| RWA (real-world assets) | `/api/troptions/rwa/*` | 🟡 MOCK (simulate endpoints) |
| Settlement | `/api/troptions/settlement/*` | 🟡 MOCK (simulate endpoints) |
| Treasury | `/api/troptions/treasury/*` | 🟡 MOCK (reads static JSON) |
| KYC/Compliance | `/api/troptions/kyc`, `/api/troptions/compliance` | ⚠️ PARTIAL (shadow mode) |
| Auth | `/api/troptions/auth/*` | ✅ BUILT (SQLite sessions) |
| Readiness/Status | `/api/troptions/readiness/*` | ✅ BUILT (live checks) |
| RAG/AI | `/api/troptions/rag/*` | 🟡 MOCK (no vector store wired) |

### 6.3 "Simulate" Endpoints
Many routes follow the pattern `/api/troptions/X/simulate` — these are intentional simulation endpoints. They return realistic response shapes with `"mode": "simulation"` in the payload. This is correct design for pre-production staging.

---

## 7. Security Findings

| # | Severity | File | Issue |
|---|---|---|---|
| 1 | 🔴 HIGH | `src/lib/auth/db.ts` | SHA-256 used for password hashing — not a password KDF. Replace with bcrypt or argon2. |
| 2 | 🟡 MEDIUM | `src/proxy.ts` | Static bearer token comparison — no token rotation, no expiry on API tokens. |
| 3 | 🟡 MEDIUM | `data/auth.db` | SQLite auth database is local only — no backup, no replication. User accounts are lost on server wipe. |
| 4 | 🟡 MEDIUM | `src/lib/troptions/kycOnboardingEngine.ts` | SHA-256 used for document hashing — acceptable for deduplication but not for integrity proof. Use SHA-512 or a merkle approach for audit trails. |
| 5 | 🟢 LOW | Various | `GENESIS_ADMIN_KEY` env var is the single gate for all blockchain operations. No key rotation mechanism exists. |
| 6 | 🟢 LOW | `contracts/*.sol` | Solidity contracts not audited. Not deployed, but should be audited before any deployment. |

---

## 8. Build Health Summary

| Metric | Value |
|---|---|
| Build exit code | 0 ✅ |
| Pages prerendered | 870 |
| TypeScript errors | 0 |
| Test suites | 57 |
| Tests passing | 1031 / 1031 |
| Tests failing | 0 |
| Edge runtime warnings | Present (benign — disables static gen per page as expected) |
| Windows build stability | cpus:1 + workerThreads:false required |

---

## 9. Honest Summary

| System | Reality |
|---|---|
| **Website / UI** | ✅ REAL — 870 pages, fully built React/Next.js app |
| **Tests** | ✅ REAL — 1031 passing tests |
| **XRPL integration** | ⚠️ PARTIAL — real SDK + real address, env-gated, no live mainnet ops |
| **Stellar integration** | ⚠️ PARTIAL — real SDK + real address, env-gated, no live mainnet ops |
| **Authentication** | ⚠️ PARTIAL — works but SHA-256 passwords are insecure |
| **Namespace registry** | ✅ REAL content registry (NOT on-chain ownership) |
| **KYC/Compliance** | ⚠️ PARTIAL — architecture present, shadow mode, no live provider |
| **Wallet / Balances** | 🟡 MOCK — static registry, no live chain queries |
| **Escrow / Settlement** | 🟡 MOCK — state machine only, no funds move |
| **Treasury** | 🟡 MOCK — static JSON |
| **Rust L1** | ❌ SCAFFOLD — no consensus, all simulation_only |
| **Smart Contracts** | ❌ NOT DEPLOYED — Solidity files exist, no deployment |
| **Minting** | 🟡 MOCK by default — env flag required for live mode |
| **IPFS proofs** | ⚠️ PARTIAL — CIDs referenced, not all verified against live IPFS gateway |

**Bottom line:** This is a well-built, production-quality frontend and API scaffold with real blockchain SDK integrations that are correctly gated behind environment variables. The core infrastructure (auth, SQLite, namespace registry, 870-page static site) is real and working. The financial operation engines (wallet, escrow, settlement, minting) are simulation-mode placeholders awaiting live backend wiring. The Rust L1 is a scaffold with no live execution. No funds are at risk. No mainnet operations occur without explicit env configuration.
