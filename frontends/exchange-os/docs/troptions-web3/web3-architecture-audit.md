# Troptions Web3 Architecture Audit

**Generated:** 2026-04-28
**Scope:** Inventory existing Web3-adjacent surfaces in the repository, identify gaps,
and recommend a coherent build order for the simulation-first Troptions Web3 Portal layer.

## 1. Existing Troptions Web3 pieces found

| Capability | Location | Status |
| --- | --- | --- |
| Public portal shell | `src/app/troptions-portal/` | Live (read-only) |
| Troptions Cloud namespace registry | `src/content/troptions-cloud/namespaceRegistry.ts` | Simulation-only |
| Membership registry | `src/content/troptions-cloud/membershipRegistry.ts` | Simulation-only |
| AI system registry (Sovereign AI builder) | `src/content/troptions-cloud/aiSystemRegistry.ts` | Simulation-only |
| Knowledge vault registry | `src/content/troptions-cloud/knowledgeVaultRegistry.ts` (assumed) | Simulation-only |
| XRPL ecosystem registry | `src/content/troptions/xrplEcosystemRegistry.ts` | Simulation-only |
| Stellar ecosystem registry | `src/content/troptions/stellarEcosystemRegistry.ts` | Simulation-only |
| Treasury topology + funding plan | `src/content/troptions/treasuryTopologyRegistry.ts`, `treasuryFundingPlanRegistry.ts` | Live read, manual fund |
| XRPL/Stellar policy engines | `src/lib/troptions/xrpl-stellar/{xrplPolicyEngine,stellarPolicyEngine}.ts` | Simulation-only |
| Cross-rail Control Hub bridge | `src/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge.ts` | Simulation-only |
| Persistent Control Hub state store | `src/lib/troptions/controlHubStateStore.ts` (SQLite + optional Postgres) | Live persistence |
| Control Hub state types | `src/lib/troptions/controlHubStateTypes.ts` | Authoritative |
| Control Hub registry (capabilities) | `src/content/troptions/controlHubRegistry.ts` | Simulation-only |
| Control Hub dashboard panel | `src/components/troptions/ControlHubPanel.tsx` | Live read |
| Genesis Hash + IPFS lock | `docs/PHASE20-GENESIS-HASH-IPFS-LOCK.md`, `scripts/phase20-genesis-lock.mjs` | Snapshot-only |
| Live ledger probes | `src/lib/troptions/{xrplLedgerEngine,stellarLedgerEngine}.ts` | Read-only |

## 2. Missing Web3 pieces

The following are **not** present as a coherent layer and need to be created:

- A unified **Web3 system registry** that names every architectural module (frontend, wallet, contracts, blockchain, storage, indexer, backend, AI, admin) with a single source of truth for execution mode and risk.
- **Wallet-connection planning** types and policy (currently no wallet-connect surface exists; the only "wallets" are infra wallets, not user-facing connect flows).
- A **document hashing / attestation** policy surface that clearly states: hash on-chain, document off-chain.
- A **smart-contract template specification layer** (no on-chain contract templates exist; the existing system is XRPL/Stellar primitives only).
- An **IPFS / Arweave / Filecoin** storage policy surface (the genesis lock script writes IPFS pointers but there is no public-facing storage architecture document or registry).
- An **indexer plan** (The Graph / custom RPC indexer) — currently no indexer surface.
- A **public Web3 portal** route at `/troptions-web3` separate from `/troptions-portal` and `/troptions-cloud`.
- An **admin Web3 control tower** that aggregates all of the above into a single governance view.
- **API routes** scoped to `/api/troptions-web3/*` that are GET-read or POST-simulate only.

## 3. Best route structure

```
/troptions-web3                          → portal landing + module overview
/troptions-web3/wallet                   → wallet-connect plan (read-only, no live connect)
/troptions-web3/namespace                → namespace claim simulation
/troptions-web3/membership               → membership pass simulation
/troptions-web3/ai                       → AI workspace access plan
/troptions-web3/proofs                   → asset/document proof layer
/troptions-web3/contracts                → smart-contract template specs (no deploy)
/troptions-web3/storage                  → IPFS/Arweave/Filecoin architecture
/troptions-web3/indexing                 → indexer plan
/troptions-web3/governance               → DAO/governance proposal templates

/admin/troptions-web3                    → admin control tower (governance aggregate)

/api/troptions-web3/modules              → GET registry
/api/troptions-web3/readiness            → GET aggregated readiness report
/api/troptions-web3/simulate/wallet-connect   → POST simulate
/api/troptions-web3/simulate/namespace        → POST simulate
/api/troptions-web3/simulate/membership       → POST simulate
/api/troptions-web3/simulate/proof            → POST simulate
/api/troptions-web3/simulate/ai-access        → POST simulate
```

## 4. Best registry structure

A single `Web3Module` interface per module with these mandatory fields:

- `id`, `displayName`, `category`, `purpose`, `publicDescription`, `systemRole`, `currentStatus`
- `executionMode: "read_only" | "simulation_only" | "testnet_only" | "approval_required" | "disabled"`
- `liveExecutionAllowed: false` (literal type — enforces invariant at compile time)
- `requiresControlHubApproval: boolean`
- `complianceNotes: string[]`
- `riskLevel: "low" | "medium" | "high" | "critical"`
- `recommendedNextAction: string`

Modules in scope: `public_website`, `wallet_login`, `namespace_registration`, `membership_pass`,
`smart_contract_readiness`, `asset_proof_layer`, `document_hashing`, `ipfs_storage`,
`indexer_layer`, `backend_api_layer`, `ai_system_builder`, `rwa_asset_registry`,
`nft_membership`, `dao_governance`, `admin_control_tower`.

## 5. Best Control Hub integration points

Every Web3 simulation routes through the existing persistence pipeline:

1. `createTaskRecord` — task with intent `web3_<action>_simulation`, status `simulated` or `blocked`.
2. `createSimulationRecord` — full inputs/outputs JSON.
3. `createBlockedActionRecord` — one per blocked reason.
4. `createAuditRecord` — immutable governance log entry.
5. `createRecommendationRecord` — guidance for next steps.

The existing `xrplStellarControlHubBridge.ts` provides the proven template — Web3 bridge mirrors it.

## 6. Safety risks

| Risk | Mitigation |
| --- | --- |
| User pastes seed/private key into a "wallet connect" form | Policy engine rejects any field named `seed`, `secret`, `mnemonic`, `privateKey`. API route schema enforces it. |
| Simulated minting interpreted as real | All minting paths set `executionMode: "simulation_only"` and `liveExecutionAllowed: false`. UI shows persistent banner. |
| Contract deployment from UI | No deploy code path exists. Templates are documentation-only. |
| RWA/asset claim becomes unregistered security | All asset/proof actions require legal review. Policy returns `requiresControlHubApproval: true` and blocks any "value" or "yield" claim. |
| PHI / private documents posted on-chain | `evaluateDocumentHash` blocks if `containsPhi`, `containsPii`, or document body is supplied. Only hashes are accepted. |
| Healthcare AI gives diagnosis | Reuses `evaluateHealthcareAiSafety` from cloud namespace policy. |
| Investment / yield language | Compliance compliance checks block phrases like "guaranteed return", "yield", "investment opportunity". |

## 7. Recommended build order

1. **Phase 2** — `web3SystemRegistry.ts` (single source of truth; everything depends on it).
2. **Phase 3** — `web3Types.ts` (decision/event/report shapes).
3. **Phase 4** — `web3PolicyEngine.ts` (pure functions; no I/O; testable in isolation).
4. **Phase 5** — `web3ControlHubBridge.ts` (wires policy engine to persistent store).
5. **Phase 6** — public routes (depend on registry + policy).
6. **Phase 7** — components (consumed by routes + admin).
7. **Phase 8** — admin control tower.
8. **Phase 9** — API routes (depend on bridge).
9. **Phase 10** — smart-contract template specs (docs only).
10. **Phase 11** — storage/indexing docs.
11. **Phase 12** — main doc packet.
12. **Phase 13** — navigation links.
13. **Phase 14** — tests.
14. **Phase 15** — validation (`tsc`, `jest`, `next build`).
15. **Phase 16** — integration report.

This audit completes Phase 1.
