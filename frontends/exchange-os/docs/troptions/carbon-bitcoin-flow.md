# Carbon → Bitcoin Cross-Module Flow (Simulation Only)

> **HARD CONSTRAINTS:** This flow does not sell a carbon credit, does not move
> Bitcoin, does not custody assets, does not act as a broker, dealer, or
> money transmitter. It produces a single auditable preview record showing
> *what would have to be true* for an external-provider settlement to
> proceed.

## Purpose

Combine a `CarbonCreditRecord` and a prospective `BitcoinSettlementRecord`
into a single simulation. The output enumerates every blocking condition and
every approval gate that must be cleared before any external-provider
settlement could be authorised.

## Files

- Engine: [src/lib/troptions/carbonBitcoinFlowEngine.ts](../../src/lib/troptions/carbonBitcoinFlowEngine.ts)
- Demo UI: [src/app/troptions/rwa/carbon-bitcoin-demo/page.tsx](../../src/app/troptions/rwa/carbon-bitcoin-demo/page.tsx)
- API: [src/app/api/troptions/rwa/carbon-bitcoin/simulate/route.ts](../../src/app/api/troptions/rwa/carbon-bitcoin/simulate/route.ts)
- Tests: [src/__tests__/troptions/carbonBitcoinFlow.test.ts](../../src/__tests__/troptions/carbonBitcoinFlow.test.ts)

## Function

```ts
createCarbonCreditBitcoinSettlementFlow(input): CarbonBitcoinFlowResult
```

Returns:

- `simulated: true` (always)
- `blocked: boolean` — true if any guard fails
- `blockingReasons: string[]`
- `approvalGatesRequired: string[]`
- `nextRequiredEvidence: string[]`
- `carbonAsset` — minimal projection
- `bitcoinSettlement` — full record (created in registry)
- `auditEventPreview` — what would be appended to the audit log
- `disclosures: { carbon, bitcoin }` — both required disclosures

## Guards

- Carbon asset must exist
- `verificationStatus === "verified"`
- `retirementStatus` ∈ {`active`, `pending-retirement`}
- Carbon `status !== RETIRED | BLOCKED | REJECTED`
- `ownerName` populated
- `approvalStatus === "approved"` (else `carbon-asset-approval` gate added)
- `providerName` populated (else BTC settlement is pinned to
  `PROVIDER_REQUIRED` and `external-btc-provider-selection` gate is added)
- `kyc-approval`, `aml-approval`, `settlement-approval` always required

## Audit

Every invocation appends a `CARBON_BTC_FLOW_SIMULATED` event via
`appendCarbonBitcoinAuditEvent`, regardless of whether the simulation was
blocked.

## API

`POST /api/troptions/rwa/carbon-bitcoin/simulate` — body must contain
`carbonAssetId`, `settlementId`, `payerName`, `payeeName`,
`usdReferenceValue`. Response includes the entire flow preview plus a notice
restating the simulation-only constraint.
