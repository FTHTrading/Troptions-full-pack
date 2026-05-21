# Cross-Rail XRPL & Stellar Architecture — Troptions

## Status: Simulation-Only | No Live Execution on Either Rail

All cross-rail operations are simulation-first. No mainnet or public network execution is enabled.

---

## Architecture Overview

The Troptions cross-rail layer provides a unified governance framework across two blockchain
networks — the XRP Ledger (XRPL) and the Stellar network — under a single simulation-first
policy model.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cross-Rail API Layer                      │
│   /api/troptions/xrpl-ecosystem/                             │
│   /api/troptions/stellar-ecosystem/                          │
│   /api/troptions/cross-rail/readiness                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  XRPL Policy    │             │ Stellar Policy  │
│  Engine         │             │ Engine          │
│                 │             │                 │
│ - Trustline     │             │ - Trustline     │
│ - NFT Mint      │             │ - Liquidity Pool│
│ - DEX Route     │             │ - Path Payment  │
│ - AMM Pool      │             │                 │
└────────┬────────┘             └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
           ┌─────────────────────────┐
           │  Control Hub Bridge     │
           │  (Persistence Layer)    │
           │                         │
           │  - Task records         │
           │  - Simulation records   │
           │  - Blocked actions      │
           │  - Audit entries        │
           │  - Recommendations      │
           └─────────────────────────┘
```

## Component Inventory

| Component | File | Purpose |
|-----------|------|---------|
| XRPL Registry | `src/content/troptions/xrplEcosystemRegistry.ts` | 11 XRPL asset profiles |
| Stellar Registry | `src/content/troptions/stellarEcosystemRegistry.ts` | 12 Stellar asset profiles |
| XRPL/Stellar Types | `src/lib/troptions/xrpl-stellar/xrplStellarTypes.ts` | Shared type definitions |
| XRPL Policy Engine | `src/lib/troptions/xrpl-stellar/xrplPolicyEngine.ts` | XRPL compliance evaluation |
| Stellar Policy Engine | `src/lib/troptions/xrpl-stellar/stellarPolicyEngine.ts` | Stellar compliance evaluation |
| Control Hub Bridge | `src/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge.ts` | Persistence + orchestration |

## Data Flow — Simulation Request

1. Client submits simulation request to API route
2. API route authenticates via `guardControlPlaneRequest`
3. XRPL routes also call `assertNoSensitiveXrplInputs` (key sanitisation)
4. Bridge calls the appropriate Policy Engine
5. Policy Engine evaluates against compliance rules and returns `XrplPolicyResult` / `StellarPolicyResult`
6. Bridge calls `persistCrossRailSimulation` to write to Control Hub
7. `CrossRailGovernanceDecision` is returned with `simulationOnly: true`

## Safety Invariants

The following invariants are enforced at every layer:

- `simulationOnly: true` — every governance decision
- `isLiveMainnetExecutionEnabled: false` — every XRPL response
- `isLivePublicNetworkEnabled: false` — every Stellar response
- `liveMainnetAllowedNow: false` — every XRPL asset profile
- `nftMintingAllowedNow: false` — every XRPL asset profile
- `publicNetworkAllowedNow: false` — every Stellar asset profile
- No private keys, seeds, or mnemonics accepted in any POST body
- All AMM/LP simulations always include "no guaranteed yield or return" blocked reason

## Cross-Rail Readiness Report

The `generateCrossRailReadinessReport()` function produces a deterministic snapshot combining:
- XRPL asset counts from the XRPL registry
- Stellar asset counts from the Stellar registry
- Compliance gap count (sum of all compliance check failures)
- Blocked action count
- Recommended next actions (aggregated from both policy engines)
- A master `CrossRailGovernanceDecision` representing the overall platform posture

The report is available publicly at `GET /api/troptions/cross-rail/readiness` (no auth required)
because it contains only policy posture information, no sensitive data.

## Scalability Notes

- Adding a new XRPL asset: add an entry to `xrplEcosystemRegistry.ts`
- Adding a new Stellar asset: add an entry to `stellarEcosystemRegistry.ts`
- Adding a new primitive type: extend the policy engine and bridge
- Adding a new blockchain rail: create a new policy engine and register in the bridge
