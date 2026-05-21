# Bitcoin Settlement Rail (Simulation Only)

> **HARD CONSTRAINTS:** This module never generates a Bitcoin key, signs a
> transaction, custodies funds, broadcasts to the Bitcoin network, or operates
> as a money transmitter. It records *external-provider-led* settlements as
> metadata for compliance and audit purposes only.

## Purpose

Track settlements that may eventually be cleared in BTC by an external
regulated provider. The TROPTIONS system records the intent, the compliance
gates, the provider reference, the observed tx hash (if any), and the
confirmation count — purely as evidence. It does not move BTC.

## Files

- Engine: [src/lib/troptions/bitcoinSettlementEngine.ts](../../src/lib/troptions/bitcoinSettlementEngine.ts)
- UI overview: [src/app/troptions/settlement/bitcoin/page.tsx](../../src/app/troptions/settlement/bitcoin/page.tsx)
- UI detail: [src/app/troptions/settlement/bitcoin/[settlementId]/page.tsx](../../src/app/troptions/settlement/bitcoin/[settlementId]/page.tsx)
- API list/detail: [src/app/api/troptions/settlement/bitcoin/route.ts](../../src/app/api/troptions/settlement/bitcoin/route.ts)
- API simulate: [src/app/api/troptions/settlement/bitcoin/simulate/route.ts](../../src/app/api/troptions/settlement/bitcoin/simulate/route.ts)
- Tests: [src/__tests__/troptions/bitcoinSettlementEngine.test.ts](../../src/__tests__/troptions/bitcoinSettlementEngine.test.ts)

## State machine

```
DRAFT
  └─ QUOTE_REQUESTED ──► COMPLIANCE_REVIEW ──► APPROVED_FOR_EXTERNAL_PROVIDER
                                                   │
                                                   ▼
                                          PAYMENT_PENDING
                                                   │
                                                   ▼
                                            TX_OBSERVED
                                                   │
                                                   ▼
                                       CONFIRMATIONS_PENDING ──► SETTLED
PROVIDER_REQUIRED   (auto-pinned when no provider)
FAILED · BLOCKED    (terminal)
```

## Approval gates

`requestBitcoinSettlementApproval` requires:

1. `providerName` populated (else status pins to `PROVIDER_REQUIRED`)
2. `kycStatus === "approved"`
3. `amlStatus === "approved"`

Failing any of those moves the record to `COMPLIANCE_REVIEW`. Only when all
three pass does the status advance to `APPROVED_FOR_EXTERNAL_PROVIDER`.

## Tx hash + confirmations

`recordBitcoinTxHash` only accepts hashes ≥ 16 chars and only from
`APPROVED_FOR_EXTERNAL_PROVIDER` or `PAYMENT_PENDING`. The hash is an
**observation**, not a broadcast.

`updateBitcoinConfirmations` advances the record to `CONFIRMATIONS_PENDING`
until the observed count reaches `confirmationsRequired` (default `3`).

## Settle

`markBitcoinSettlementSettled` requires:

- `btcTxHash` recorded
- `confirmationsObserved >= confirmationsRequired`
- `approvalStatus === "approved"`

## Disclosure

`BITCOIN_SETTLEMENT_DISCLOSURE` must be rendered on every UI surface and
included in every API response.

## API

- `GET  /api/troptions/settlement/bitcoin` — list (auto-seeds demos)
- `GET  /api/troptions/settlement/bitcoin/:settlementId` — detail + summary + audit
- `POST /api/troptions/settlement/bitcoin/simulate` — preview only
