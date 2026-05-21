# TROPTIONS IOU Issuer Manifest v3.0
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
