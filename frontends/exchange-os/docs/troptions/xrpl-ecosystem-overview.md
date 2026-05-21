# XRPL Ecosystem Overview — Troptions

## Status: Simulation-Only | No Live Mainnet Execution

All XRPL ecosystem operations are simulation-first. No mainnet execution is enabled.
No NFT minting is permitted on mainnet. No guaranteed liquidity, yield, or profit.

---

## What the XRPL Ecosystem Layer Covers

The Troptions XRPL ecosystem layer governs how Troptions-branded assets participate in the
XRP Ledger. It covers four primary primitives:

1. **Trustlines** — Issuer-to-holder relationships that enable holding an XRPL IOU asset.
2. **NFT Minting** — Tokenising Troptions assets as XLS-20 NFTs on XRPL.
3. **DEX Routing** — Order-book based exchange routes for Troptions assets on the XRPL DEX.
4. **AMM Pools** — Automated market maker liquidity pools using XRPL's native AMM feature.

## Assets in Registry

The XRPL ecosystem registry (`src/content/troptions/xrplEcosystemRegistry.ts`) contains
11 entries covering TSU, TXC, TUNI, REC, GNGS, MMU, MEDIA, and HOTRCW. All are set to
`simulation_only` execution mode.

## Policy Gates

Every XRPL operation is evaluated by the XRPL Policy Engine before any on-chain action.
Current global gates:

- `isLiveMainnetExecutionEnabled: false` — no mainnet execution under any circumstances
- `nftMintingAllowedNow: false` — no NFT minting on mainnet
- KYC/KYB required for all trustline and DEX operations
- Legal review required before any deployment

## Persistence

All simulations persist to the Control Hub as a set of linked records:
- Task record (tracks the operation intent and status)
- Simulation record (JSON snapshot of inputs and outputs)
- Blocked action records (one per compliance blocker)
- Audit entry (immutable governance log)
- Recommendation records (next-step guidance)

## Compliance Model

The XRPL ecosystem layer follows the Troptions "simulation-first, governance-gated" model.
No operation can advance past simulation without:
1. Explicit operator approval
2. KYC completion for the holder
3. KYB completion for the issuer
4. Legal review sign-off
5. Removal of deployment gates

See also: `docs/troptions/xrpl-stellar-compliance-gates.md`
