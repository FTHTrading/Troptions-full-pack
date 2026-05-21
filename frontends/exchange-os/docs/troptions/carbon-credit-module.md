# Carbon Credit Module (Simulation Only)

> **HARD CONSTRAINTS:** This module never mints, retires, sells, custodies, or
> transfers a real carbon credit. It is a metadata, evidence, and readiness
> tracking layer that produces auditable preview records for compliance and
> due-diligence work. No public investment functionality, no offset guarantee,
> no money transmission.

## Purpose

Provide a registry-aware schema and audit trail for verified carbon credits
that TROPTIONS may reference, evaluate, or document — without operating as a
registry, broker, exchange, or offset issuer.

## Files

- Engine: [src/lib/troptions/carbonCreditEngine.ts](../../src/lib/troptions/carbonCreditEngine.ts)
- Audit log: [src/lib/troptions/carbonBitcoinAuditLog.ts](../../src/lib/troptions/carbonBitcoinAuditLog.ts)
- Cross-module flow: [src/lib/troptions/carbonBitcoinFlowEngine.ts](../../src/lib/troptions/carbonBitcoinFlowEngine.ts)
- UI overview: [src/app/troptions/carbon/page.tsx](../../src/app/troptions/carbon/page.tsx)
- UI detail: [src/app/troptions/carbon/[assetId]/page.tsx](../../src/app/troptions/carbon/[assetId]/page.tsx)
- API list/detail: [src/app/api/troptions/carbon/route.ts](../../src/app/api/troptions/carbon/route.ts)
- API simulate: [src/app/api/troptions/carbon/simulate/route.ts](../../src/app/api/troptions/carbon/simulate/route.ts)
- Tests: [src/__tests__/troptions/carbonCreditEngine.test.ts](../../src/__tests__/troptions/carbonCreditEngine.test.ts)

## Record schema

`CarbonCreditRecord` captures registry / project / vintage / serial / ownership
/ evidence / approval state. Source of truth lives in
[carbonCreditEngine.ts](../../src/lib/troptions/carbonCreditEngine.ts).

## Status state machine

```
DRAFT → PENDING_VERIFICATION → VERIFIED_ACTIVE → PLEDGED | SOLD | RETIRED
   ↓             ↓                   ↓
 BLOCKED       BLOCKED            BLOCKED
 REJECTED      REJECTED
```

`RETIRED → SOLD` is not a normal transition; it is only permitted when an
explicit `overrideApprovalId` is supplied. This guards against double-selling
of retired offsets.

## Readiness score

`calculateCarbonReadinessScore(record)` returns 0–100 based on registry data,
project ID, serials, ownership evidence, retirement status, evidence anchoring,
and approval status. Caps:

- No serial numbers → ≤ 60
- No ownership evidence → ≤ 70
- Retirement unknown → ≤ 80
- `BLOCKED` or `REJECTED` → 0

## Evidence anchoring

Optional evidence references: `evidenceHash`, `ipfsCid`, `xrplAttestationTx`,
`stellarMirrorTx`, `retirementCertificateUrl`. None of these are *issued* by
this module — they are records of external attestations.

## Disclosure

`CARBON_CREDIT_DISCLOSURE` is rendered everywhere this data is shown. Do not
modify the constant without a compliance review.

## API

- `GET  /api/troptions/carbon` — list (auto-seeds demo records)
- `GET  /api/troptions/carbon/:assetId` — detail + proof summary + audit
- `POST /api/troptions/carbon/simulate` — preview only; returns
  `{ ok, simulation: true, blocked, ... }` with an audit-event preview
