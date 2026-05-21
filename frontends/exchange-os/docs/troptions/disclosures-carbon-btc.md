# Disclosures — Carbon + Bitcoin Modules

These constants are the *exact* legal-tone disclosures rendered by the
TROPTIONS carbon and Bitcoin-settlement modules. Do **not** edit them without
a compliance review; they are referenced by both UI surfaces and API
responses.

## Carbon credit disclosure

Source: [`CARBON_CREDIT_DISCLOSURE` in `carbonCreditEngine.ts`](../../src/lib/troptions/carbonCreditEngine.ts)

> Carbon credit records are environmental asset records only. TROPTIONS does
> not guarantee carbon neutrality, offset validity, registry acceptance,
> price, liquidity, resale value, or environmental claims unless
> independently verified and properly retired.

## Bitcoin settlement disclosure

Source: [`BITCOIN_SETTLEMENT_DISCLOSURE` in `bitcoinSettlementEngine.ts`](../../src/lib/troptions/bitcoinSettlementEngine.ts)

> Bitcoin is supported only as an external settlement preference or
> transaction-record rail. TROPTIONS does not provide custody, exchange,
> brokerage, money transmission, investment advice, or guaranteed Bitcoin
> conversion.

## Where they appear

- Carbon overview + detail pages (`/troptions/carbon`, `/troptions/carbon/[assetId]`)
- Bitcoin overview + detail pages (`/troptions/settlement/bitcoin`, `/troptions/settlement/bitcoin/[settlementId]`)
- Cross-flow demo (`/troptions/rwa/carbon-bitcoin-demo`)
- All `GET` and `POST` API responses under `/api/troptions/carbon/**`,
  `/api/troptions/settlement/bitcoin/**`, and
  `/api/troptions/rwa/carbon-bitcoin/**`

## What is **not** offered

- No live Bitcoin custody
- No Bitcoin signing
- No Bitcoin exchange or brokerage
- No money transmission
- No carbon offset issuance, retirement, or guarantee
- No public investment offering
- No yield, profit, or return promise
- No guarantee of price, liquidity, registry acceptance, or environmental
  claim validity

## What **is** offered

- Compliance-gated, simulation-only metadata records
- A readiness score and an audit trail
- Status state machines that explicitly block disallowed transitions
- Machine-readable disclosures on every surface
