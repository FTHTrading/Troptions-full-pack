---
title: System manifest
layout: default
permalink: /technical/SYSTEM_MANIFEST.html
---

# TROPTIONS system manifest — post-MSB hybrid fiat-crypto blueprint

**Last updated:** 2026-05-21  
**Overall status:** **DESIGN** / **PIPELINE** until FinCEN MSB program and correspondent omnibus are live and verified.  
**Labels:** **PROVEN** (repo + live HTTP/explorer), **PIPELINE** (designed, stub, awaiting credentials), **PROJECTION** (scenario math — not forecasts or audited financials).

**Related:** [MSB fiat rails](MSB_FIAT_RAILS.html) · [On-chain proof](ON_CHAIN_PROOF.html) · [XRPL & Stellar](XRPL_STELLAR_VERIFICATION.html) · [Architecture](ARCHITECTURE.html)

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
| `payment-orchestrator` | **4022** | `fiat-rails/payment-orchestrator/` | Clients, Exchange OS; calls compliance + adapters | **PIPELINE** |
| `fedwire-adapter` | **4023** | `fiat-rails/fedwire-adapter/` | Orchestrator ↔ bank FedWire | **PIPELINE** |
| `swift-bridge` | **4024** | `fiat-rails/swift-bridge/` | Orchestrator ↔ MT103/202 bureau | **PIPELINE** |
| `compliance-engine` | **4025** | `fiat-rails/compliance-engine/` | All fiat ingress/egress screening | **PIPELINE** |
| `neobank-api` | **4026** | `fiat-rails/neobank-api/` | Mobile/card partner (design) | **PROJECTION** |
| `iou-reserve-monitor` | **4027** | `fiat-rails/iou-reserve-monitor/` | Omnibus statements vs ledger supply | **PIPELINE** |

**Setup:** `.\scripts\setup-fiat-rails.ps1` · **PM2:** `pm2 start ecosystem.config.js --only payment-orchestrator,fedwire-adapter,swift-bridge,compliance-engine,neobank-api,iou-reserve-monitor`

**OpenAPI (stub):** `fiat-rails/payment-orchestrator/openapi.yaml`

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
| `troptions-l1-node` | **9944** (RPC), **9945** (`/metrics`) | **PROVEN** | `l1/` | Rust L1; local/operator host |
| `donk-ai-tutor` | **8090** | **PROVEN** | `ai/donk-tutor/` | RAG + Ollama |
| `fth-backend` | **8091** | **PROVEN** | `backend/fth-academy/` | Academy API + Stripe patterns |
| `ttn-launcher` | **8092** | **PROVEN** | `backend/ttn-launcher/` | TTN / sports backend |
| `dao-service` | **8093** | **PROVEN** | `backend/dao-service/` | Governance API |
| `x402-gateway` | **4020** | **PROVEN** | `backend/x402-gateway/` | Metered ATP sidecar |
| `popeye-relay` | **4021** | **PROVEN** | `backend/popeye-relay/` | Stale agent relay |
| `payment-orchestrator` | **4022** | **PIPELINE** | `fiat-rails/payment-orchestrator/` | Hybrid fiat/crypto routing stub |
| `fedwire-adapter` | **4023** | **PIPELINE** | `fiat-rails/fedwire-adapter/` | FedWire RTGS adapter stub |
| `swift-bridge` | **4024** | **PIPELINE** | `fiat-rails/swift-bridge/` | MT103/202 messaging stub |
| `compliance-engine` | **4025** | **PIPELINE** | `fiat-rails/compliance-engine/` | AML/KYC/OFAC stub |
| `neobank-api` | **4026** | **PROJECTION** | `fiat-rails/neobank-api/` | Neobank API design stub |
| `iou-reserve-monitor` | **4027** | **PIPELINE** | `fiat-rails/iou-reserve-monitor/` | Omnibus vs ledger reconciliation stub |
<!-- AUTO:PM2_PORTS_END -->

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
POST /payments/request          # orchestrator :4022
GET  /payments/status           # orchestrator :4022
POST /api/banking/deposit       # orchestrator
POST /api/banking/withdraw      # orchestrator
POST /api/compliance/screen     # compliance-engine :4025
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
| [`TROPTIONS_IOU_ISSUER_MANIFEST.md`](../../TROPTIONS_IOU_ISSUER_MANIFEST.md) | Scenario tables |

*PM2 rows sync from `ecosystem.config.js`. Prose labels edited here.*
