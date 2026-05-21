# XRPL IOU & Funding Route Model

**Module version:** 1.0.0
**Date:** 2026-04-28
**Status:** Simulation-only — no live issuance enabled

---

## Overview

This document covers the TROPTIONS Gateway XRPL IOU issuance model and the 7 funding routes
available to TROPTIONS asset classes. All logic is implemented as server-side TypeScript
engines in `src/lib/troptions/`. No live signing, custody, exchange, stablecoin issuance,
AMM execution, or DeFi lending is enabled by any component described here.

---

## What Is an XRPL IOU?

An IOU ("I Owe You") on the XRP Ledger is a trust-based credit entry issued by one
XRPL account and held in the trustline of another. The issuing account sets the currency
code (3-character ASCII or 20-byte hex) and the conditions under which the trustline
is authorized. XRPL IOUs are:

- **Not deposits.** They represent an obligation from the issuer.
- **Not money transmission.** They are ledger entries, not transferred funds.
- **Not stablecoins** (unless the issuer provides backed redemption and complies with
  applicable law).
- **Readable by counterparties.** A lender can inspect an IOU on-chain and match it
  to off-chain documentation (appraisal, custody proof, legal opinion) to assess value.

### Trustline Types

| Type | Description |
|------|-------------|
| **Standard** | Any XRPL account can extend a trustline to any issuer — no permission required. |
| **Authorized** | Issuer sets `RequireAuth = true`. Holder must have issuer's authorization before the trustline is usable. Used for regulated or restricted issuances. |
| **MPT (Multi-Purpose Token)** | Newer XRPL primitive for fungible tokens with on-ledger policy controls. Not yet used in TROPTIONS Gateway. |

TROPTIONS Gateway uses **authorized trustlines** (`RequireAuth = true`) for all IOUs.
This means the issuer controls who may hold each IOU type.

---

## XRPL Gateway Addresses

| Role | Address |
|------|---------|
| Issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` |
| Distributor | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` |

The issuer account has `DefaultRipple = false` and `RequireAuth = true` configured.
No asset issuance should occur without board approval and all readiness gates cleared.

---

## Asset Types & Requirements

### AXL001 — Alexandrite RWA Receipt

| Requirement | Hard-block if missing? |
|-------------|----------------------|
| Independent gemological appraisal | Yes |
| Vault / custody agreement | Yes |
| Insurance certificate | Yes |
| Legal opinion on structure | Yes |
| Liquidation strategy | Yes |
| KYC / KYB | Yes |
| Redemption terms | Yes |

The AXL001 IOU represents beneficial interest in the physical alexandrite asset held in a
licensed vault. Issuance without appraisal, custody, and legal wrapper is **hard-blocked**.

### BTCREC — Bitcoin Collateral Receipt

| Requirement | Hard-block if missing? |
|-------------|----------------------|
| BTC wallet proof-of-control | Yes |
| Custody statement | Yes |
| AML / source-of-funds statement | Yes |
| Redemption & liquidation terms | Yes |
| KYC / KYB | Yes |
| Legal opinion | Yes |

BTCREC is a TROPTIONS Gateway receipt, not native BTC. For Aave v3 use, it must be
wrapped to WBTC or cbBTC on Ethereum (not an XRPL IOU). See Aave section below.

### GOLD — Precious Metals Receipt

| Requirement | Hard-block if missing? |
|-------------|----------------------|
| Vault and assay certificate | Yes |
| Insurance certificate | Yes |
| Legal opinion | Yes |
| KYC / KYB | Yes |
| Redemption terms | Yes |

### CARBON — Carbon Credit Receipt

| Requirement | Hard-block if missing? |
|-------------|----------------------|
| Verified registry record | Yes |
| Serial numbers documented | Yes |
| Retirement status confirmed | Yes |
| KYC / KYB | Yes |
| Legal opinion | Yes |

Carbon credit IOUs represent verified registry units. Retirement serials must be
on file before any IOU can be issued.

### RWA — Generic Real-World Asset Package

General-purpose real-world asset package. Requires property/asset title, appraisal,
custody, legal opinion, and KYC.

### USD — USD-Stable IOU

The most legally sensitive asset type. Requires:
- Full reserve proof
- Redemption terms (1:1 USD for 1 USD IOU)
- Legal opinion on money transmission, stablecoin, and securities law
- KYC / KYB

**Hard-blocked** without reserve and legal opinion. Not a stablecoin — will not be
marketed as one without SEC/FinCEN/state guidance obtained.

### TROPTIONS — Native TROPTIONS Receipt

| Requirement | Hard-block if missing? |
|-------------|----------------------|
| Redemption terms | Yes |
| KYC / KYB | Yes |
| Legal opinion | Soft-block |

TROPTIONS native token receipts have the lightest requirement set but still require
redemption terms and KYC before issuance.

---

## IOU Readiness Scores

The `generateIouIssuanceChecklist()` function returns a `score` (0–100) derived from
completed required documents:

| Score Range | Label |
|-------------|-------|
| 0 – 24 | Draft |
| 25 – 49 | Incomplete |
| 50 – 79 | Reviewable |
| 80 – 100 | Issuance-Ready |

A packet must reach **80+** before any board approval for live issuance can begin.

---

## 7 Funding Routes

### 1. PRIVATE_LENDER — Private Lender / Family Office

Asset-backed loan or credit facility. Lender reviews the full TROPTIONS Gateway asset
package: appraisal, custody proof, insurance, SPV/pledge wrapper, and legal opinion.

**Eligible asset types:** AXL001, BTCREC, GOLD, RWA, USD
**Minimum readiness:** 30% to begin preliminary lender dialogue; full package for term sheet
**Timeline:** 45–120 days

---

### 2. ASSET_BUYER — Asset Buyer / Strategic Partner

Direct purchase or off-take agreement. Most effective for liquid assets (carbon credits,
precious metals, BTC receipts) where a commodity-network buyer can be sourced quickly.

**Eligible asset types:** CARBON, GOLD, BTCREC
**Timeline:** 30–90 days

---

### 3. MERCHANT_CREDIT — Merchant Credit / Trade Settlement

TROPTIONS-native trade credit. Closed-network merchant-to-merchant settlement using the
TROPTIONS token as unit of account.

**Eligible asset types:** TROPTIONS (primary); others via structured barter only
**Timeline:** 5–15 days once merchant onboarding is complete

---

### 4. AAVE_ACCEPTED_COLLATERAL — Aave v3 DeFi Lending

Deposit accepted collateral into the Aave v3 pool (`0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`)
to borrow against.

**Why raw alexandrite is rejected by Aave:**
Aave v3 only accepts assets that appear in its on-chain collateral registry — specifically:
WBTC, cbBTC, ETH, USDC, USDT, DAI, and a small number of other approved tokens. Raw
gemstones, gemological receipts (AXL001), carbon credits, RWA packages, and XRPL IOUs
are **not in the registry** and cannot be deposited.

**BTCREC path to Aave:**
An XRPL BTCREC receipt is a TROPTIONS Gateway document, not native Ethereum WBTC. To use
BTC as Aave collateral, the BTC must be wrapped to WBTC or cbBTC on Ethereum via a licensed
wrapping/bridging strategy. The XRPL IOU is not directly depositable.

**Current status:** HARD-BLOCKED for all TROPTIONS IOU types. Wrapping and bridge
strategy required for any BTC or USD path.

---

### 5. XRPL_IOU_RECEIPT — Lender-Readable XRPL IOU

Issue authorized trustline IOUs to qualified counterparties as a lender-readable proof of
asset position. The IOU itself is not funds — it becomes meaningful when paired with
off-chain custody documentation, legal wrapper, and documented redemption terms.

**Eligible asset types:** All (AXL001, BTCREC, GOLD, CARBON, RWA, USD, TROPTIONS)
**Minimum readiness:** 50% for preliminary counterparty review; 80% for issuance gate
**Timeline:** 30–60 days from complete IOU package

---

### 6. AMM_AFTER_CLEARANCE — XRPL AMM Liquidity Pool

Add asset-backed IOUs to an XRPL AMM pool to create secondary market liquidity.

**Current status:** HARD-BLOCKED for all asset types. Legal opinion specifically approving
public AMM participation, verified reserve proof, public disclosure document, and
board/admin approval are all required before any AMM operation.

**Timeline:** 90–180+ days minimum after all legal clearance gates are cleared.

---

### 7. SERVICE_FEE_REVENUE — Verification-as-a-Service

Earn origination, package preparation, and monthly administration fees for managing the
asset verification and IOU issuance process. Service fee revenue does **not** depend on
any IOU being live or any route being fully cleared.

**Eligible asset types:** All
**Status:** AVAILABLE NOW
**Timeline:** Per engagement — typically 15–30 days per client

---

## API Endpoints (Simulation-Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/troptions/xrpl-iou/checklist` | POST | Returns document checklist for an asset type |
| `/api/troptions/xrpl-iou/simulate` | POST | Simulates full IOU packet with readiness score |
| `/api/troptions/funding-routes/recommend` | POST | Recommends funding routes for an asset type |

All endpoints return `simulationOnly: true` in the response body and include a disclaimer
that no live execution was performed.

---

## Safety Statement

No live IOU issuance, stablecoin issuance, custody, exchange, AMM execution, Aave execution,
token buyback, liquidity pool execution, or public investment functionality was enabled by
the `xrplIouIssuanceEngine.ts` or `fundingRouteEngine.ts` modules or any associated API routes,
pages, or test files added in this feature.

TROPTIONS does not provide custody, exchange services, money transmission, investment advice,
guaranteed financing, guaranteed liquidity, carbon offset guarantees, public token buybacks,
or public LP execution. All execution requires legal, compliance, provider, custody, signer,
and board approvals.
