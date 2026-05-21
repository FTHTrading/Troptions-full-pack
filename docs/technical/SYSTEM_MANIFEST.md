---
title: System manifest
layout: default
permalink: /technical/SYSTEM_MANIFEST.html
---

# TROPTIONS system manifest — post-MSB hybrid fiat-crypto blueprint

**Last updated:** 2026-05-21  
**Overall status:** **DESIGN** / **PIPELINE** until FinCEN MSB program and correspondent omnibus are live and verified.  
**Labels:** **PROVEN** (repo + live HTTP/explorer), **PIPELINE** (designed, stub, awaiting credentials), **PROJECTION** (scenario math — not forecasts or audited financials).

**Related:** [MSB fiat rails](MSB_FIAT_RAILS.html) · [Partner bank mesh](PARTNER_BANK_MESH.html) · [On-chain proof](ON_CHAIN_PROOF.html) · [XRPL & Stellar](XRPL_STELLAR_VERIFICATION.html) · [Architecture](ARCHITECTURE.html)

**PDF export (optional):** `scripts/generate-manifest-pdf.ps1` — requires `pandoc` (and optionally `wkhtmltopdf`); HTML fallback always written to `docs/downloads/SYSTEM_MANIFEST.html`.

---

## Honesty banner (read first)

| Claim | Allowed today | Label |
|-------|---------------|-------|
| ~874M IOUs on XRPL + Stellar | Issued supply / **proven demand** | **PROVEN** (ledger) |
| ~874M = bank reserves or AUM | **Do not claim** | Misleading |
| Fully-backed 1:1 USD redemption | **Not operational** | **PIPELINE** |
| Fiat rails (FedWire / SWIFT / MSB) | Stubs in `fiat-rails/` | **DESIGN** / **PIPELINE** |
| Neobank / BaaS revenue tables | Product design only | **PROJECTION** |
| Funding **$2M–$3.5M** | Internal capitalization plan | **PROJECTION** |

**Shift when live:** unfunded promise-to-pay IOUs → **redeemable claims** backed by **audited** omnibus reporting (not marketing copy).

---

## Hybrid fiat-crypto model

1. **PROVEN today:** Crypto IOUs on XRPL/Stellar/Polygon; Academy Stripe; launcher; x402 health; L1 node.  
2. **PIPELINE:** USD/EUR enters via FedWire/ACH/SWIFT → `compliance-engine` screens → `payment-orchestrator` routes → omnibus credit → mint IOU 1:1 on ledger.  
3. **Redemption (PIPELINE):** Burn IOU → orchestrator → compliance → wire out.  
4. **PROJECTION:** Neobank app and BaaS APIs sit on the same orchestrator — no live interchange until card program ships.

Legacy Python stubs under `backend/payment-orchestrator` and `backend/msb-compliance` (:4098) are **superseded** by `fiat-rails/` (:4022–:4027). **No duplicate PM2 apps.**

---

## ASCII architecture (post-MSB target)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CLIENTS: Exchange OS │ Academy │ TTN │ Neobank (PROJECTION) │ x402    │
└────────────┬───────────────────────┬──────────────────┬───────────────┘
             │ fiat intent           │ Stripe (PROVEN)  │ ATP :4020
             v                       v                  v
┌──────────────────────┐    ┌──────────────┐    ┌──────────────┐
│ payment-orchestrator │    │ fth :8091    │    │ popeye :4021 │
│        :4022         │    │ ttn  :8092   │    └──────────────┘
└──────┬───────┬───────┘    └──────────────┘
       │       │
       │       ├──► compliance-engine :4025 (KYC/OFAC/SAR)
       │       ├──► fedwire-adapter  :4023
       │       └──► swift-bridge     :4024
       │
       v
┌──────────────────┐     mint/burn 1:1      ┌─────────────────────────┐
│ Bank omnibus     │ ◄──────────────────────►│ XRPL/Stellar issuer     │
│ (PIPELINE)       │                           │ ~874M IOU PROVEN demand │
└──────────────────┘                           └─────────────────────────┘
       ▲
       └── iou-reserve-monitor :4027 (ledger vs bank — NOT claiming backed today)
```

**Port discipline:** `popeye-relay` **:4021**; fiat rails **:4022–:4027** — no collision.

---

## Fiat-rails service integration table

| Service | Port | Path | Upstream / downstream | Label |
|---------|------|------|------------------------|-------|
| `payment-orchestrator` | **4022** | `fiat-rails/orchestrator/` | Wire webhook → IOU; compliance + FedWire stubs | **PIPELINE** |
| `fedwire-adapter` | **4023** | `fiat-rails/fedwire-adapter/` | Orchestrator ↔ bank FedWire | **PIPELINE** |
| `swift-bridge` | **4024** | `fiat-rails/swift-bridge/` | Orchestrator ↔ MT103/202 bureau | **PIPELINE** |
| `compliance-engine` | **4025** | `fiat-rails/compliance-engine/` | All fiat ingress/egress screening | **PIPELINE** |
| `neobank-api` | **4026** | `fiat-rails/neobank-api/` | Mobile/card partner (design) | **PROJECTION** |
| `iou-reserve-monitor` | **4027** | `fiat-rails/iou-reserve-monitor/` | Omnibus statements vs ledger supply | **PIPELINE** |

**Setup:** `.\scripts\setup-fiat-rails.ps1` · **PM2:** `pm2 start ecosystem.config.js --only payment-orchestrator,fedwire-adapter,swift-bridge,compliance-engine,neobank-api,iou-reserve-monitor`

**OpenAPI:** `fiat-rails/orchestrator/openapi.yaml`

---

## IOU issuer model (**PROVEN** supply, **PIPELINE** backing)

| Fact | Label | Investor language |
|------|-------|-------------------|
| **~874M** issued on XRPL + Stellar (TROPTIONS, USDC, USDT, EURC, DAI **codes**) | **PROVEN** | **Issued demand** — not bank reserves |
| Issuer `rJLMST…` / `GB4FHG…` | **PROVEN** | Gateway-issued IOUs |
| USDC/USDT on XRPL | **PROVEN** (IOU) | **Not** Circle/Tether **native** mainnet tokens |
| Regulated 1:1 fiat redemption today | **Not claimed** | Promise-to-pay until omnibus live |
| Operator desk ~$175M narrative | **PIPELINE** | Attestation only — not verified without bank statements |

---

## Sequence diagrams (target state — **PIPELINE**)

### 1. Fiat deposit → IOU mint

```mermaid
sequenceDiagram
  participant C as Client
  participant PO as payment-orchestrator :4022
  participant CE as compliance-engine :4025
  participant FW as fedwire-adapter :4023
  participant B as Omnibus bank PIPELINE
  participant XR as XRPL issuer PROVEN

  C->>FW: FedWire/ACH USD in PIPELINE
  FW->>B: Credit omnibus PIPELINE
  B->>CE: Funds received event
  CE->>PO: KYC/OFAC pass PIPELINE
  PO->>XR: Mint IOU 1:1 PIPELINE
  XR-->>C: IOU credit
  Note over C,XR: Today IOUs exist without guaranteed fiat redemption
```

### 2. IOU redeem → fiat out

```mermaid
sequenceDiagram
  participant C as Client
  participant XR as XRPL issuer PROVEN
  participant PO as payment-orchestrator :4022
  participant CE as compliance-engine :4025
  participant FW as fedwire-adapter :4023
  participant B as Omnibus bank PIPELINE

  C->>XR: Burn/redeem IOU PIPELINE
  XR->>PO: Redemption request
  PO->>CE: Screen egress
  CE->>FW: Approve wire PIPELINE
  FW->>B: Debit omnibus
  B-->>C: USD settled PIPELINE
```

### 3. Cross-border USD → IOU → EUR (SWIFT)

```mermaid
sequenceDiagram
  participant C as B2B client
  participant PO as payment-orchestrator :4022
  participant SW as swift-bridge :4024
  participant CE as compliance-engine :4025
  participant XR as IOU ledger PROVEN

  C->>PO: USD funding intent PIPELINE
  PO->>CE: Sanctions + KYC
  PO->>XR: Mint USD IOU PIPELINE
  PO->>SW: MT103 EUR leg PIPELINE
  SW-->>C: Beneficiary credited PIPELINE
```

---

## Implementation phases 1–5

| Phase | Scope | Exit criteria | Label |
|-------|--------|---------------|-------|
| **1** | MSB artifact vault; `fiat-rails` stubs; IOU copy fix on investor surfaces | Six `/health` return `pipeline`; PM2 ports 4022–4027 | **PIPELINE** |
| **2** | Orchestrator contracts; Exchange OS fiat behind feature flag | `POST /payments/request` wired to compliance mock | **PIPELINE** |
| **3** | FedWire sandbox + SWIFT skeleton with bank partner | First sandbox wire trace (non-prod) | **PIPELINE** |
| **4** | Omnibus live; `iou-reserve-monitor` daily reconcile | Attestation memo separate from on-chain supply | **PIPELINE** → **PROVEN** |
| **5** | Neobank/BaaS pilots | GL + legal sign-off before marketing interchange | **PROJECTION** |

---

## Revenue streams A–E

| Stream | Description | Label |
|--------|-------------|-------|
| **A** | Issuance/redemption fees (0.1–0.25% illustrative) | **PIPELINE** |
| **B** | Float margin (omnibus yield − holder yield) | **PIPELINE** |
| **C** | Exchange/desk spread | **PIPELINE** (desk attestation gated) |
| **D** | Cross-border B2B (USD→IOU→EUR) | **PIPELINE** |
| **E** | WC26 / TTN sponsor settlement | **PIPELINE** |

**PROVEN cash today:** Academy, launcher, x402 — **not** MSB wire volume or neobank interchange.

### Economic scenarios (**PROJECTION** only)

| Scenario | Illustrative monthly | Annualized | Label |
|----------|---------------------|------------|-------|
| Conservative rails throughput | ~$305K/mo | ~$3.6M/yr | **PROJECTION** |
| Scale rails throughput | ~$2.6M/mo | ~$31M/yr | **PROJECTION** |
| $50M/mo IOU flow (A–E bundle) | ~$578K/mo | — | **PROJECTION** |
| $500M/mo IOU flow | ~$4.9M/mo | — | **PROJECTION** |

---

## Funding ask (**PROJECTION**)

| Item | Range | Label | Use (planning) |
|------|-------|-------|----------------|
| MSB + bank + compliance + engineering + reserve seed | **$2M – $3.5M** | **PROJECTION** | Omnibus, legal, integration — **not** an offering term sheet |

*(Prior $5–10M range superseded for investor pack alignment; adjust only with counsel.)*

---

## Neobank & BaaS (**PROJECTION**)

| Neobank line (illustrative) | 10K users | 100K users | Label |
|----------------------------|-----------|------------|-------|
| Interchange ~1.5% | $75K/mo | $750K/mo | **PROJECTION** |
| Premium subs | $10K/mo | $100K/mo | **PROJECTION** |
| Float margin | $80K/mo | $400K/mo | **PROJECTION** |
| **Subtotal** | **~$170K/mo** | **~$1.3M/mo** | **PROJECTION** |

| BaaS | Illustrative $/mo | Label |
|------|-------------------|-------|
| 5 × ~$10K platform | $50K | **PROJECTION** |
| 50 × ~$10K | $500K | **PROJECTION** |

---

## PM2 service map

Source of truth: `ecosystem.config.js`. Regenerate: `npm run docs:update`.

<!-- AUTO:PM2_PORTS_START -->
| PM2 name | Port | Label | Path | Notes |
|----------|------|-------|------|-------|
| `troptions-l1-node` | **9944** (RPC), **9945** (`/metrics`) | **PROVEN** | `l1/` | Rust L1; metrics :9945 |
| `donk-ai-tutor` | **8090** | **PROVEN** | `ai/donk-tutor/` | RAG + Ollama |
| `fth-backend` | **8091** | **PROVEN** | `backend/fth-academy/` | Academy API + Stripe patterns |
| `ttn-launcher` | **8092** | **PROVEN** | `backend/ttn-launcher/` | TTN / sports backend |
| `dao-service` | **8093** | **PROVEN** | `backend/dao-service/` | Governance API |
| `x402-gateway` | **4020** | **PROVEN** | `backend/x402-gateway/` | Metered ATP sidecar |
| `popeye-relay` | **4021** | **PROVEN** | `backend/popeye-relay/` | Stale agent relay |
| `payment-orchestrator` | **4022** | **PIPELINE** | `fiat-rails/orchestrator/` | Wire → IOU (`POST /api/v1/payments/wire`) |
| `fedwire-adapter` | **4023** | **PIPELINE** | `fiat-rails/fedwire-adapter/` | FedWire RTGS adapter stub |
| `swift-bridge` | **4024** | **PIPELINE** | `fiat-rails/swift-bridge/` | MT103/202 messaging stub |
| `compliance-engine` | **4025** | **PIPELINE** | `fiat-rails/compliance-engine/` | AML/KYC/OFAC stub |
| `neobank-api` | **4026** | **PROJECTION** | `fiat-rails/neobank-api/` | Neobank API design stub |
| `iou-reserve-monitor` | **4027** | **PIPELINE** | `fiat-rails/iou-reserve-monitor/` | Omnibus vs ledger reconciliation stub |
<!-- AUTO:PM2_PORTS_END -->

---

<!-- AUTO:IOU_REVENUE_START -->
## 5. MSB / SWIFT / FedWire & IOU Revenue Model

*Auto-synced from `docs/TROPTIONS_IOU_ISSUER_MANIFEST.md` — do not edit between markers.*

## Corrected Model: $874M in Unbacked IOUs → Fully-Backed Digital Dollar Ecosystem
## Revenue Potential: $3M–$30M+ Annually (scenario tables — **PROJECTION**)
## Status: INFRASTRUCTURE BUILT — FIAT RAILS **PIPELINE** (not claimed live)

**Truth labels:** **PROVEN** = ledger/explorer or live product · **PIPELINE** = MSB/bank/orchestrator stubs · **PROJECTION** = scenario math / neobank / BaaS / partner-bank mesh / Alexandrite playbook — **not** audited financials.

Canonical system map: [`docs/technical/SYSTEM_MANIFEST.md`](technical/SYSTEM_MANIFEST.md) · Partner mesh: [`docs/technical/PARTNER_BANK_MESH.md`](technical/PARTNER_BANK_MESH.md)

---

## THE CORRECTION (Truth Labels)

**What we actually have:**
- **~$874M in issued IOUs** across XRPL and Stellar (**PROVEN** ledger supply — **not** bank reserves)
- These are **TROPTIONS-issued promises**, not Circle/Tether native tokens
- **Currently unfunded** — no guaranteed redemption rail (**PIPELINE** until omnibus live)
- **Market demand proven** — not yet monetized as fully-backed stable value

**What MSB + SWIFT + FedWire unlock (**PIPELINE**):**
- **Fiat omnibus account** at partner bank
- **1:1 backing** of IOUs with real USD/EUR reserves
- **Fully redeemable** digital dollars (when rails + attestations live)
- **Verifiable cash equivalents** on balance sheet (bank statements + reserve monitor)

**The shift:** From "operator attestation" → "regulated financial institution" (**PIPELINE**)

---

## REVENUE MODEL: IOU ISSUER EDITION

### A. Issuance & Redemption Fees (Core Business) — **PIPELINE**

**Mechanics:**
- Client wires USD via FedWire → Orchestrator issues TROPTIONS-USD IOU 1:1
- Fee: 0.1%–0.25% per issuance (illustrative)
- Redemption: Client sends IOU → Wire USD back; same fee

**Revenue Calculation (**PROJECTION** — illustrative math only):**

| Monthly Volume | Fee Rate | Monthly Revenue |
|---------------|----------|-----------------|
| $10M | 0.25% | $25,000 |
| $50M | 0.25% | $125,000 |
| $100M | 0.25% | $250,000 |
| **$500M** | **0.25%** | **$1,250,000** |

---

### B. Float Income (The Bank Model) — **PIPELINE**

| Float Size | Gross Yield | Paid to Holders | Net Margin | Annual Revenue |
|-----------|-------------|-----------------|------------|----------------|
| $50M | 4% | 2% | 2% | **$1,000,000** |
| $100M | 4% | 2% | 2% | **$2,000,000** |
| $500M | 4% | 2% | 2% | **$10,000,000** |

*All figures **PROJECTION** until omnibus balances and yield programs are live.*

---

### C. Exchange Spread (Round-Trip) — **PIPELINE**

| Monthly Volume | Spread | Monthly Revenue |
|---------------|--------|-----------------|
| $10M | 0.1% | $10,000 |
| $100M | 0.1% | $100,000 |
| **$500M** | **0.1%** | **$500,000** |

---

### D. Cross-Border B2B Payments — **PIPELINE**

| # Clients | Avg Volume/Client | Fee | Monthly Revenue |
|-----------|-------------------|-----|-----------------|
| 10 | $1M | 0.5% | $50,000 |
| 50 | $1M | 0.5% | $250,000 |
| **100** | **$1M** | **0.5%** | **$500,000** |

---

### E. WC26/TTN Commerce — **PIPELINE**

| Monthly Commerce | Discount | Monthly Revenue |
|-----------------|----------|-----------------|
| $1M | 1.5% | $15,000 |
| $5M | 1.5% | $75,000 |
| **$20M** | **1.5%** | **$300,000** |

---

## MULTI-BANK PARTNER MESH — **PROJECTION**

Cross-bank settlement routes fiat between correspondent banks while IOUs settle instantly on XRPL. See [`PARTNER_BANK_MESH.md`](technical/PARTNER_BANK_MESH.md).

| Leg | Role | Label |
|-----|------|-------|
| Bank A (US omnibus) | FedWire in / ACH | **PIPELINE** |
| Bank B (EU correspondent) | SWIFT EUR out | **PIPELINE** |
| Bank C (treasury / MM) | Float yield | **PIPELINE** |
| `payment-orchestrator` :4022 | Wire webhook → mint | **PIPELINE** (code **PROVEN** in repo) |
| `iou-reserve-monitor` :4027 | Omnibus vs ledger | **PIPELINE** |

---

## THE NEOBANK: IOU-NATIVE ARCHITECTURE — **PROJECTION**

| Stream | Conservative (10K users) | Growth (100K users) |
|--------|------------------------|---------------------|
| **Interchange** (1.5%) | $75K/month | $750K/month |
| **Premium subs** ($9.99) | $10K/month | $100K/month |
| **Float income** (2%) | $80K/month | $400K/month |
| **Card fees** | $5K/month | $50K/month |
| **TOTAL** | **$170K/month** | **$1.3M/month** |

---

## BANKING-AS-A-SERVICE (BaaS) — **PROJECTION**

| # Clients | Avg Fee | Monthly Revenue |
|-----------|---------|-----------------|
| 5 | $10K | $50,000 |
| 10 | $10K | $100,000 |
| **50** | **$10K** | **$500,000** |

---

## ALEXANDRITE RWA FAST-MONEY PLAYBOOK — **PROJECTION**

Collateral-backed gem liquidity (AXL001 receipt) — **not** live bank lending. Illustrative operator scenario only.

| Step | Action | Label |
|------|--------|-------|
| 1 | Custody + appraisal of 2kg Alexandrite collateral | **PROJECTION** |
| 2 | Issue AXL001 IOU receipt on XRPL (gated mint) | **PIPELINE** |
| 3 | Lender wires USD → omnibus → orchestrator mints USD IOU | **PIPELINE** |
| 4 | Borrower repays → burn IOU → wire out | **PIPELINE** |
| 5 | Default → collateral liquidation (off-chain legal) | **PROJECTION** |

| Scenario | Collateral mark (**PROJECTION**) | LTV | Illustrative advance | Label |
|----------|-------------------------------|-----|---------------------|-------|
| Conservative | $12.5M | 40% | $5.0M | **PROJECTION** |
| Desk ask | $12.5M | 60% | $7.5M | **PROJECTION** |

*Do not cite gem marks as audited NAV without third-party appraisal on file.*

---

## TOTAL REVENUE SUMMARY (**PROJECTION**)

### Conservative ($50M/month IOU volume)

| Stream | Monthly | Annual |
|--------|---------|--------|
| Issuance/Redemption | $125K | $1.5M |
| Float Income | $83K | $1M |
| Exchange Spread | $50K | $600K |
| B2B Payments | $50K | $600K |
| Neobank | $170K | $2M |
| BaaS | $100K | $1.2M |
| **TOTAL** | **$578K** | **$6.9M** |

### Scale ($500M/month IOU volume)

| Stream | Monthly | Annual |
|--------|---------|--------|
| Issuance/Redemption | $1.25M | $15M |
| Float Income | $833K | $10M |
| Exchange Spread | $500K | $6M |
| B2B Payments | $500K | $6M |
| Neobank | $1.3M | $15.6M |
| BaaS | $500K | $6M |
| **TOTAL** | **$4.9M** | **$58.6M** |

---

## INVESTOR PITCH (Corrected)

**Weak:** "We have $874M in issued tokens on XRPL."

**Strong:** "We have **~$874M proven IOU demand** on ledger. With MSB + FedWire/SWIFT (**PIPELINE**), we convert unfunded promises into **redeemable claims** backed by omnibus reserves — capturing fees A–E. Stack is in repo; rails await bank credentials."

---

## WIRE → IOU ORCHESTRATION (**PIPELINE** code path)

```
POST /api/v1/payments/wire   # bank webhook
  → compliance-engine POST /screen
  → fedwire-adapter POST /verify
  → issueIou (XRPL if ISSUER_SEED set; else PIPELINE mock hash)
GET  /api/v1/payments/:id    # status
```

`ISSUER_SEED` only in operator `.env` — **never commit**. See `fiat-rails/orchestrator/README.md`.

---

## ACCEPTANCE CRITERIA (**PIPELINE** until live)

- [ ] IOUs 1:1 backed by fiat reserves (attested)
- [ ] Issuance/redemption fees collected
- [ ] Float income tracked daily
- [ ] Compliance reports auto-generated
- [ ] Revenue dashboard shows labeled PROVEN/PIPELINE/PROJECTION flows

---

**STATUS:** Manifest v3.0 locked — MSB/SWIFT/FedWire **PIPELINE** · Revenue tables **PROJECTION** unless labeled otherwise.
<!-- AUTO:IOU_REVENUE_END -->

---

## Banking rails status

| Rail | Label | Monorepo hook |
|------|-------|---------------|
| MSB (FinCEN program) | **PIPELINE** | Operator vault + `compliance-engine` |
| FedWire RTGS | **PIPELINE** | `fedwire-adapter` :4023 |
| SWIFT MT103/202 | **PIPELINE** | `swift-bridge` :4024 |
| ACH (correspondent) | **PIPELINE** | Via bank partner |
| Stripe (Academy) | **PROVEN** | `fth-backend` :8091 |
| x402 / Apostle | **PROVEN** (health) | :4020 / :7332 when up |

---

## Fiat ↔ crypto flow (overview)

```mermaid
flowchart TD
  subgraph clients [Clients]
    A[User / investor]
    C[Exchange OS]
    D[Academy :8091]
  end

  subgraph proven [PROVEN]
    D -->|Stripe| J[Stripe]
    C -->|Crypto IOUs| I[XRPL / Stellar / Polygon]
    A -->|ATP| X[x402 :4020]
  end

  subgraph pipeline [PIPELINE fiat-rails]
    A --> PO[payment-orchestrator :4022]
    PO --> CE[compliance-engine :4025]
    PO --> FW[fedwire-adapter :4023]
    PO --> SW[swift-bridge :4024]
    FW --> BANK[Omnibus TBD]
    PO --> MON[iou-reserve-monitor :4027]
  end

  PO -->|mint/burn 1:1| I
```

---

## Next actions (operator)

1. Run `.\scripts\setup-fiat-rails.ps1` and start six fiat PM2 apps; verify `/health` on 4022–4027.  
2. Store MSB/bank/API keys in operator vault — copy `fiat-rails/.env.template` → `.env` locally (**never commit**).  
3. Legal review of BSA/AML pack before any live wire.  
4. Re-run `npm run docs:update` and `.\scripts\generate-manifest-pdf.ps1` before investor meetings.  
5. Fix Exchange OS / investor copy: IOU ≠ Circle native USDC; ~874M ≠ reserves.

---

## API surface (**PIPELINE**)

```
POST /api/v1/payments/wire      # orchestrator :4022 — wire webhook → IOU mint
GET  /api/v1/payments/:id       # orchestrator :4022 — payment status
POST /screen                    # compliance-engine :4025 — dev approve (strict mode optional)
POST /verify                    # fedwire-adapter :4023 — wire verify stub
POST /api/compliance/screen     # compliance-engine :4025 (alias)
POST /api/compliance/kyc        # compliance-engine
POST /api/fedwire/send          # fedwire-adapter :4023
POST /api/swift/send            # swift-bridge :4024
GET  /api/swift/status/:id      # swift-bridge
GET  /api/reserve/attestation   # iou-reserve-monitor :4027
GET  /api/neobank/balance       # neobank-api :4026 (PROJECTION)
```

---

## Document index

| Doc | Purpose |
|-----|---------|
| [SYSTEM_MANIFEST](SYSTEM_MANIFEST.html) | This file |
| [MSB_FIAT_RAILS](MSB_FIAT_RAILS.html) | Capitalization tree |
| [ON_CHAIN_PROOF](ON_CHAIN_PROOF.html) | Explorer tables |
| [`fiat-rails/README`](../../fiat-rails/README.md) | Stub ops |
| [`TROPTIONS_IOU_ISSUER_MANIFEST.md`](../TROPTIONS_IOU_ISSUER_MANIFEST.md) | IOU issuer v3.0 (section 5 source) |
| [PARTNER_BANK_MESH](PARTNER_BANK_MESH.html) | Multi-bank mesh + Alexandrite (**PROJECTION**) |
| [`fiat-rails/orchestrator/README`](../../fiat-rails/orchestrator/README.md) | Wire → IOU ops |

*PM2 rows sync from `ecosystem.config.js`. Prose labels edited here.*
