# Stellar Ecosystem Overview — Troptions

## Status: Simulation-Only | No Public Network Execution

All Stellar ecosystem operations are simulation-first. No public network execution is enabled.
No guaranteed liquidity, yield, or profit.

---

## What the Stellar Ecosystem Layer Covers

The Troptions Stellar ecosystem layer governs how Troptions-branded assets participate in the
Stellar network. It covers four primary primitives:

1. **Trustlines** — Asset relationships that allow accounts to hold Stellar custom assets.
2. **Stellar DEX** — Order-book based exchange on the Stellar decentralised exchange.
3. **Liquidity Pools (AMM)** — Automated market maker pools on the Stellar network.
4. **Path Payments** — Multi-hop payments that convert assets along a path.

## Assets in Registry

The Stellar ecosystem registry (`src/content/troptions/stellarEcosystemRegistry.ts`) contains
12 entries covering TSU, TXC, TUNI, REC, GNGS, MMU, MEDIA, and HOTRCW. All are set to
`simulation_only` execution mode.

## Policy Gates

Every Stellar operation is evaluated by the Stellar Policy Engine:

- `isLivePublicNetworkEnabled: false` — no public network execution
- `publicNetworkAllowedNow: false` on all asset profiles
- KYC/KYB required for all operations
- Anchor/SEP services require additional legal review
- Liquidity pool operations always surface "no guaranteed yield" warning
- Legal review required before any deployment

## Persistence

All simulations persist to the Control Hub as a set of linked records (same pattern as XRPL):
task → simulation → blocked actions → audit entry → recommendations.

## Stellar vs XRPL

| Feature | XRPL | Stellar |
|---------|------|---------|
| Native token | XRP | XLM |
| Asset standard | IOUs / XLS-20 NFTs | Stellar assets |
| DEX type | Order book | Order book + AMM |
| LP pools | Native AMM | AMM |
| Path payments | Pathfinding | Path payment |
| Anchor/SEP | — | SEP-24, SEP-31 |
| Smart contracts | Hooks (experimental) | Soroban |

## Compliance Model

Same "simulation-first, governance-gated" model as XRPL. No operation advances past simulation
without operator approval, KYC/KYB completion, legal sign-off, and gate removal.

See also: `docs/troptions/stellar-trustline-liquidity-strategy.md`
See also: `docs/troptions/xrpl-stellar-compliance-gates.md`
