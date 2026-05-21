# Stellar Trustline & Liquidity Strategy — Troptions

## Status: Simulation-Only | No Public Network Execution

All Stellar trustline and liquidity pool operations are simulation-first.
**No guaranteed yield, return, or profit.** Liquidity pools carry impermanent loss risk.

---

## Stellar Trustlines

On Stellar, a trustline is created when an account explicitly opts in to holding a specific
custom asset. The account sets a limit on how much of the asset it will accept. Trustlines
require a small XLM reserve (~0.5 XLM per trustline) as network spam prevention.

### Troptions Trustline Assets on Stellar

| Asset  | Display Name | Primitive | Issuer Status |
|--------|-------------|-----------|--------------|
| TSU    | Troptions Standard Unit | issuer + trustline | pending_legal_review |
| GNGS   | Gangsta | asset | pending_kyb |
| TUNI   | Troptions Uni | asset | pending_legal_review |
| REC    | Record Token | asset | pending_legal_review |
| MMU    | Music Media Unit | asset | pending_kyb |
| MEDIA  | Media Token | asset | pending_legal_review |
| HOTRCW | Hot Raceway | asset + liquidity_pool | pending_legal_review |

## Stellar Liquidity Pools

Stellar AMM liquidity pools operate similarly to XRPL AMM pools but using the Stellar protocol.
LP participants deposit two assets and receive LP tokens representing their share of the pool.

### Risk Disclosures (Required)

- **Impermanent loss** — pool value may diverge from holding assets directly
- **No guaranteed yield** — fee income depends on trading volume and is not predictable
- **No guaranteed return** — the platform makes no representations about LP returns
- **Protocol risk** — Stellar network changes may affect pool operation
- **Regulatory uncertainty** — LP token treatment varies by jurisdiction

## Simulation Flow — Trustline

1. `POST /api/troptions/stellar-ecosystem/simulate/trustline`
2. Provide: `assetId`, `holderKycStatus`, `issuerKybStatus`
3. Stellar Policy Engine evaluates — always blocked by `publicNetworkAllowedNow: false`
4. Control Hub record set created

## Simulation Flow — Liquidity Pool

1. `POST /api/troptions/stellar-ecosystem/simulate/liquidity-pool`
2. Provide: `assetId`, `lpKycStatus`, `riskDisclosureAcknowledged`, `noGuaranteedYieldAcknowledged`
3. Always blocked with "no guaranteed yield or return" message in addition to public network gate
4. Control Hub record set created

## Stellar Path Payments

Path payments on Stellar allow sending one asset while the recipient receives a different asset,
with automatic conversion along a path of liquidity providers. This enables cross-asset payments
without both parties needing to hold the same asset.

### Anchor/SEP Compliance

If a path payment involves a Stellar anchor (an entity providing on/off-ramp services via SEP-24
or SEP-31 protocols), additional compliance requirements apply:

- The anchor's jurisdiction, licensing, and KYC requirements must be reviewed
- SEP legal review must be completed before the anchor route is used
- This requirement is enforced by `anchorInvolved: true` in the simulation input

## Simulation Flow — Path Payment

1. `POST /api/troptions/stellar-ecosystem/simulate/path-payment`
2. Provide: `sourceAssetId`, `destinationAssetId`, `senderKycStatus`, `receiverKycStatus`, `anchorInvolved`
3. If `anchorInvolved: true` → additional "anchor/SEP legal review required" block is added
4. Control Hub record set created

## Next Steps

1. Complete KYB for all Stellar issuing entities
2. Engage legal counsel on Stellar asset terms
3. Testnet trustline and LP trials
4. Design risk disclosure flow for LP participants
5. Review anchor partners for path payment routes
