# XRPL Trustline Strategy — Troptions

## Status: Simulation-Only | Testnet-Only | No Live Mainnet

All trustline operations are simulation-first. No mainnet trustlines are established.

---

## What Is a Trustline on XRPL?

A trustline on XRPL is a bilateral relationship between an issuer account and a holder account
that allows the holder to receive and hold an IOU asset issued by the issuer. Establishing a
trustline requires both parties to have funded XRPL accounts and requires the holder to explicitly
opt in by creating the trustline.

## Troptions Trustline Assets

The following Troptions assets are candidates for XRPL trustlines (all simulation-only):

| Asset | Display Name | Primitive | Issuer Status |
|-------|-------------|-----------|--------------|
| TSU   | Troptions Standard Unit | issuer + trustline | pending_legal_review |
| GNGS  | Gangsta | trustline | pending_kyb |
| HOTRCW | Hot Raceway | trustline + amm | pending_legal_review |

## Compliance Requirements

Before any trustline can be established on mainnet:

1. **KYC (holder)** — The holder must complete identity verification.
2. **KYB (issuer)** — The issuing entity must complete business verification.
3. **Legal review** — The trustline relationship and IOU terms must be reviewed by counsel.
4. **Platform gate removal** — `isLiveMainnetExecutionEnabled` must be explicitly set to `true`
   by an authorised operator with appropriate audit trail.

## Simulation Flow

1. Submit `POST /api/troptions/xrpl-ecosystem/simulate/trustline` with:
   - `assetId` — XRPL registry ID (e.g., `"TSU"`)
   - `holderKycStatus` — `"approved"` | `"pending"` | `"rejected"` | `"not_started"`
   - `issuerKybStatus` — `"approved"` | `"pending"` | `"rejected"` | `"not_started"`
2. The XRPL Policy Engine evaluates the request.
3. A Control Hub record set is created (task, simulation, blocked actions, audit, recommendations).
4. The response includes a `CrossRailGovernanceDecision` with `simulationOnly: true`.

## Blocked Reasons (Current)

- `isLiveMainnetExecutionEnabled` is `false` — all trustlines blocked by platform policy
- `liveMainnetAllowedNow: false` on all asset profiles
- Pending KYC/KYB on all assets

## Next Steps

1. Complete KYB for issuing entity
2. Engage legal counsel to review trustline terms and IOU compliance
3. Conduct testnet trustline issuance
4. Submit for operator approval to remove deployment gate
