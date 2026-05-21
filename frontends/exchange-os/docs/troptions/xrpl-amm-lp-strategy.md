# XRPL AMM & Liquidity Pool Strategy — Troptions

## Status: Simulation-Only | AMM Blocked | No Guaranteed Yield or Return

AMM pool participation is blocked by platform policy. **No guaranteed yield, return, or
profit is offered or implied.** Liquidity provision on AMM pools carries impermanent loss risk.

---

## XRPL Native AMM

XRPL introduced native Automated Market Maker (AMM) pools in amendment 1205. AMM pools on XRPL
allow liquidity providers to deposit two assets into a pool and earn a share of trading fees.
Unlike traditional market making, AMM participants face:

- **Impermanent loss** — if the price ratio of the two assets changes, LP value diverges from
  simply holding the assets.
- **No guaranteed yield** — fee revenue depends on trading volume and is not predictable.
- **Smart contract risk** — pool parameters are set at creation and governed by XRPL protocol rules.

## Troptions AMM Assets

| Asset  | Display Name | Primitive | Issuer Status |
|--------|-------------|-----------|--------------|
| HOTRCW | Hot Raceway | trustline + amm | pending_legal_review |

## Compliance Requirements for AMM Participation

1. **LP KYC** — Liquidity providers must complete identity verification.
2. **Risk disclosure** — LP must acknowledge impermanent loss risk and market volatility.
3. **No-guaranteed-yield acknowledgment** — LP must explicitly confirm no yield is guaranteed.
4. **Legal review** — Pool terms and LP agreements must be reviewed by counsel.
5. **Platform gate removal** — `isLiveMainnetExecutionEnabled` must be enabled by authorised operator.

## Simulation Flow

1. Submit `POST /api/troptions/xrpl-ecosystem/simulate/amm` with:
   - `assetId` — e.g., `"HOTRCW"`
   - `lpKycStatus` — liquidity provider KYC status
   - `riskDisclosureAcknowledged` — `boolean`
   - `noGuaranteedYieldAcknowledged` — `boolean`
2. Policy Engine evaluates. AMM pool operations are always blocked by `isLiveMainnetExecutionEnabled: false`.
3. Control Hub record set created with all blocked reasons.
4. Response always includes "no guaranteed yield or return" in blocked reasons.

## Risk Disclosures

The following disclosures must be surfaced to any liquidity provider:

- AMM pool participation may result in loss of deposited assets
- Returns are not guaranteed and depend on trading volume
- Impermanent loss may exceed fee income
- XRPL protocol changes may affect pool operation
- Regulatory treatment of AMM LP tokens is uncertain in many jurisdictions

## Next Steps

1. Retain legal counsel to review LP agreement terms
2. Design risk disclosure acknowledgment flow
3. Testnet AMM pool creation trial with HOTRCW
4. Submit for operator approval to enable AMM participation
