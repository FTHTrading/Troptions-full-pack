# Carbon Credit + Bitcoin Settlement — Implementation Report

**Date:** 2026-04-28  
**Branch:** main  
**Repo:** FTHTrading/Troptions

---

## Overview

A compliance-gated Carbon Credit registry module and Bitcoin settlement-rail
module were added to the TROPTIONS system. All routes are simulation-only.
No live Bitcoin custody, exchange, signing, money transmission, carbon offset
guarantee, or public investment functionality was enabled.

---

## Files Created

### Engine / Library

| File | Description |
|------|-------------|
| `src/lib/troptions/carbonCreditEngine.ts` | Carbon asset registry, state machine, readiness scoring, proof summary |
| `src/lib/troptions/bitcoinSettlementEngine.ts` | BTC settlement record engine, approval gates, KYC/AML compliance checks |
| `src/lib/troptions/carbonBitcoinFlowEngine.ts` | Combined carbon + BTC flow with full guard chain and audit emit |
| `src/lib/troptions/carbonBitcoinAuditLog.ts` | Append-only in-memory audit log with typed event schema |

### UI Pages

| Route | File |
|-------|------|
| `/troptions/carbon` | `src/app/troptions/carbon/page.tsx` |
| `/troptions/carbon/[assetId]` | `src/app/troptions/carbon/[assetId]/page.tsx` |
| `/troptions/settlement/bitcoin` | `src/app/troptions/settlement/bitcoin/page.tsx` |
| `/troptions/settlement/bitcoin/[settlementId]` | `src/app/troptions/settlement/bitcoin/[settlementId]/page.tsx` |
| `/troptions/rwa/carbon-bitcoin-demo` | `src/app/troptions/rwa/carbon-bitcoin-demo/page.tsx` |

### API Routes

| Method | Route | File |
|--------|-------|------|
| GET | `/api/troptions/carbon` | `src/app/api/troptions/carbon/route.ts` |
| GET | `/api/troptions/carbon/[assetId]` | `src/app/api/troptions/carbon/[assetId]/route.ts` |
| POST | `/api/troptions/carbon/simulate` | `src/app/api/troptions/carbon/simulate/route.ts` |
| GET | `/api/troptions/settlement/bitcoin` | `src/app/api/troptions/settlement/bitcoin/route.ts` |
| GET | `/api/troptions/settlement/bitcoin/[settlementId]` | `src/app/api/troptions/settlement/bitcoin/[settlementId]/route.ts` |
| POST | `/api/troptions/settlement/bitcoin/simulate` | `src/app/api/troptions/settlement/bitcoin/simulate/route.ts` |
| POST | `/api/troptions/rwa/carbon-bitcoin/simulate` | `src/app/api/troptions/rwa/carbon-bitcoin/simulate/route.ts` |

### Tests

| File | Tests |
|------|-------|
| `src/__tests__/troptions/carbonCreditEngine.test.ts` | 9 |
| `src/__tests__/troptions/bitcoinSettlementEngine.test.ts` | 11 |
| `src/__tests__/troptions/carbonBitcoinFlow.test.ts` | 5 |

### Documentation

| File | Description |
|------|-------------|
| `docs/troptions/carbon-credit-module.md` | Schema, state machine, readiness caps, API |
| `docs/troptions/bitcoin-settlement-rail.md` | ASCII state machine, approval gates, settle requirements, API |
| `docs/troptions/carbon-bitcoin-flow.md` | Combined flow function signature, all guards, audit emit |
| `docs/troptions/disclosures-carbon-btc.md` | Exact disclosure constants, render locations, what is/isn't offered |

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/troptions/page.tsx` | Added carbon/BTC nav cards; restored `"XRPL Market Data, AMM, and DEX Readiness"` desc to XRPL Platform card |
| `src/app/api/troptions/carbon/[assetId]/route.ts` | Fixed: pass `record.carbonAssetId` (string) to `generateCarbonProofSummary` |
| `src/app/api/troptions/carbon/simulate/route.ts` | Fixed: pass `preview.carbonAssetId` (string) |
| `src/app/api/troptions/settlement/bitcoin/[settlementId]/route.ts` | Fixed: pass `record.settlementId` (string) |
| `src/app/api/troptions/settlement/bitcoin/simulate/route.ts` | Fixed: pass `record.settlementId` (string) |
| `src/__tests__/troptions/bitcoinSettlementEngine.test.ts` | Fixed: `"pending"` → `"in-review"` (invalid `ComplianceCheckStatus` literal) |
| `src/app/troptions/rwa/carbon-bitcoin-demo/page.tsx` | Fixed: removed `Date.now()` call during render (React purity lint error) |
| `scripts/provision-troptions-assets.mjs` | Added approval-gate check (exits code 2 when `TROPTIONS_CONTROL_HUB_APPROVAL_ID`, `TROPTIONS_LEGAL_REVIEW_ID`, `TROPTIONS_CUSTODY_REVIEW_ID` are absent) |

---

## Validation Results

All commands run from `C:\Users\Kevan\troptions` on 2026-04-28.

| Step | Command | Result |
|------|---------|--------|
| Typecheck | `npm run typecheck` | ✅ Zero errors |
| Tests | `npm test -- --forceExit` | ✅ 786/786 passed, 44 suites |
| Lint (new files) | `npx eslint src/lib/troptions/carbon*.ts ...` | ✅ Zero errors |
| Build | `npm run build --webpack` | ✅ Compiled successfully |

> **Note on full `npm run lint`:** The project-wide ESLint invocation hits a
> Node.js heap-OOM on this machine (4 GB+ allocation across the full source
> tree). All new files were linted individually with `npx eslint <file>` and
> returned zero errors. This is a pre-existing infrastructure limitation, not
> a new failure.

---

## Pre-existing failures resolved

Two tests that were failing in the committed `HEAD` before this session were
fixed:

1. **`xrplLivePlatform.test.ts`** — Expected `"XRPL Market Data, AMM, and DEX
   Readiness"` in `page.tsx`; the string had been removed by a prior commit.
   Restored as the `desc` of the XRPL Platform nav card.

2. **`assetProvisioning.test.ts`** — Expected `provision-troptions-assets.mjs
   --execute` to exit with code 2 when approval env vars are absent. The gate
   was never implemented. Added a check that validates
   `TROPTIONS_CONTROL_HUB_APPROVAL_ID`, `TROPTIONS_LEGAL_REVIEW_ID`, and
   `TROPTIONS_CUSTODY_REVIEW_ID` before allowing `--execute` to proceed.

---

## Compliance gates still blocked

All of the following require external action before any live behaviour:

| Gate | Blocks |
|------|--------|
| `verificationStatus = "verified"` | Carbon asset readiness >70% |
| `retirementStatus ≠ "unknown"` | Carbon asset readiness >80% |
| `approvalStatus = "approved"` | Bitcoin settlement finalization |
| `TROPTIONS_CONTROL_HUB_APPROVAL_ID` env var | Provision script `--execute` |
| `TROPTIONS_LEGAL_REVIEW_ID` env var | Provision script `--execute` |
| `TROPTIONS_CUSTODY_REVIEW_ID` env var | Provision script `--execute` |
| External regulated BTC provider name | Settlement record creation |
| `btcTxHash` ≥ 16 chars + confirmations | Settlement `markSettled` |

---

## Safety statement

> **No live Bitcoin custody, exchange, signing, money transmission, carbon
> offset guarantee, or public investment functionality was enabled.**

All POST endpoints are simulation-only. Every state-change emits an audit
event via `appendCarbonBitcoinAuditEvent`. Disclosures are rendered on every
UI surface and included in every API response using the exact constants
`CARBON_CREDIT_DISCLOSURE` and `BITCOIN_SETTLEMENT_DISCLOSURE`.

---

## Suggested commit

```
feat(troptions): add gated carbon credit and bitcoin settlement modules
```
