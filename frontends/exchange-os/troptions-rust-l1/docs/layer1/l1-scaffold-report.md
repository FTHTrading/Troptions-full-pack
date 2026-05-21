# TSN Rust Layer-1 Scaffold — Sprint Report

**Sprint:** `feat(layer1): scaffold Rust compliance-native settlement network`  
**Status:** Phase 1–18 complete — 24 crates built, 22 tests passing, 0 compile errors  
**Date:** 2026-04-26  

---

## Overview

This sprint scaffolded a compliance-native Rust Layer-1 settlement network for the
Troptions Settlement Network (TSN). All modules are **simulation-only**. No live chain,
live settlement, live banking, or live token issuance is enabled or implied.

---

## Files Created

### Architecture Docs (`docs/layer1/`)

| File | Contents |
|------|----------|
| `troptions-settlement-network-overview.md` | TSN mission, architecture, positioning |
| `l1-competitive-analysis-avalanche-cardano-xrpl-stellar.md` | Competitive landscape |
| `genius-act-readiness-mapping.md` | GENIUS Act compliance readiness mapping |
| `rln-agora-mbridge-compatibility.md` | Central bank rail compatibility analysis |
| `quantum-resistant-roadmap.md` | NIST FIPS 203/204/205 migration roadmap |
| `control-hub-integration.md` | Control Hub governance bridge design |
| `validator-and-governance-model.md` | Validator set and on-chain governance |
| `compliance-runtime.md` | TCSA compliance runtime specification |
| `advertising-and-positioning-guide.md` | Market positioning and messaging guide |

### Rust Monorepo (`troptions-rust-l1/`)

| Crate | Path | Role |
|-------|------|------|
| `tsn-state` | `crates/state` | Core protocol types, all TSN structs |
| `tsn-crypto` | `crates/crypto` | SHA-256, evidence hashing |
| `tsn-pq-crypto` | `crates/pq-crypto` | Post-quantum key profile types (NIST FIPS 203/204/205) |
| `tsn-assets` | `crates/assets` | Asset creation (simulation gate) |
| `tsn-compliance` | `crates/compliance` | TCSA compliance engine, KYC/sanctions/travel rule |
| `tsn-stablecoin` | `crates/stablecoin` | Stablecoin issuance (GENIUS Act gated) |
| `tsn-trustlines` | `crates/trustlines` | Trustline simulation, freeze/unfreeze |
| `tsn-rwa` | `crates/rwa` | Real World Asset registration with evidence hashing |
| `tsn-nft` | `crates/nft` | NFT credential issuance simulation |
| `tsn-amm` | `crates/amm` | AMM/DEX constant-product pool simulation |
| `tsn-governance` | `crates/governance` | On-chain governance proposal stub |
| `tsn-control-hub` | `crates/control-hub` | Control Hub bridge (camelCase TS-compatible) |
| `tsn-bridge-xrpl` | `crates/bridge-xrpl` | XRPL cross-rail adapter (simulation) |
| `tsn-bridge-stellar` | `crates/bridge-stellar` | Stellar cross-rail adapter (simulation) |
| `tsn-rln` | `crates/rln` | Regulated Liability Network adapter |
| `tsn-agora` | `crates/agora` | Agorá-style wholesale settlement stub |
| `tsn-mbridge` | `crates/mbridge` | mBridge FX routing stub |
| `tsn-consensus` | `crates/consensus` | BFT consensus constants (MIN=4, MAX=21, FINALITY=67%) |
| `tsn-runtime` | `crates/runtime` | Devnet runtime orchestration stub |
| `tsn-rpc` | `crates/rpc` | RPC interface placeholder |
| `tsn-telemetry` | `crates/telemetry` | Telemetry/tracing placeholder |
| `tsn-sdk` | `crates/sdk` | TSN SDK placeholder |
| `tsn-node` | `crates/node` | Node binary (devnet startup banner) |
| `tsn-cli` | `crates/cli` | CLI binary (6 simulation commands) |

---

## Test Summary

| Crate | Tests | Status |
|-------|-------|--------|
| `tsn-amm` | 4 | ✅ passing |
| `tsn-bridge-xrpl` | 1 | ✅ passing |
| `tsn-compliance` | 4 | ✅ passing |
| `tsn-control-hub` | 2 | ✅ passing |
| `tsn-pq-crypto` | 2 | ✅ passing |
| `tsn-rwa` | 1 | ✅ passing |
| `tsn-stablecoin` | 3 | ✅ passing |
| `tsn-state` | 2 | ✅ passing |
| `tsn-trustlines` | 2 | ✅ passing |
| `tsn-governance` | 1 | ✅ passing |
| **Total** | **22** | **✅ 0 failures** |

---

## Compliance Modules Implemented

### TCSA (Troptions Compliance & Settlement Act)
- KYC tier gating: `Unknown` tier always blocked
- Sanctions screening: `OFAC_SDN_LIST` blocks any transfer
- Travel Rule: triggered at amounts > 3000 (simulation threshold)
- Platform simulation gate: all operations produce `SimulateOnly` outcome

### GENIUS Act (Guiding and Establishing National Innovation for US Stablecoins)
- All stablecoin issuance blocked unless `GeniusActStatus::PermittedIssuer`
- Even `PermittedIssuer` blocked by `platform_simulation_gate_active` in this scaffold
- Issuance requires: permitted issuer + approved AML program + approved sanctions program + reserve policy set

### Audit Trail
- All blocked/simulated operations emit `AuditEvent` via `tsn-state`
- `AuditEventType` variants cover all major protocol actions
- All events tagged `simulation_only: true`

### Control Hub
- All governance tasks require `control_hub_approval` in `required_approvals`
- JSON serialized in `camelCase` for TypeScript Control Hub frontend compatibility
- Blocked actions logged as `ControlHubBlockedAction` records

---

## Safety Gates (Enforced in All Crates)

| Gate | Default |
|------|---------|
| `simulation_only` | `true` on all structs |
| `live_execution_enabled` | `false` on all assets |
| `issuance_enabled` | `false` on all stablecoins |
| `required_approvals` | `["control_hub_approval"]` minimum on all ops |
| No private keys / seeds | ✅ enforced — none in any crate |
| No guaranteed yield claim | ✅ enforced |
| AMM risk disclosure | Required before any liquidity provision |

---

## What Remains Blocked (Next Phase Requirements)

The following are **intentionally not implemented** and require separate regulatory,
technical, and legal milestones before they can be enabled:

| Feature | Blocked Reason |
|---------|----------------|
| Live chain execution | No validator set deployed, no genesis block |
| Live settlement | Requires banking relationships, master accounts |
| Stablecoin issuance | Requires OCC/Fed permitting under GENIUS Act |
| XRPL/Stellar live transactions | Requires licensed bridge operator |
| RLN integration | Central bank participation required |
| Agorá/mBridge integration | BIS/central bank access required |
| Live AMM trading | Requires ATS/broker-dealer registration |
| Trustline live activation | Requires issuer compliance certification |
| Validator onboarding | Requires staking contract audit + legal review |
| Post-quantum migration | NIST FIPS 203/204/205 implementations not yet stable in Rust |

---

## Next Phase Checklist

- [ ] Deploy devnet genesis block with 4 test validators
- [ ] Implement Ed25519 signing in `tsn-crypto`
- [ ] Wire `tsn-node` to `tsn-runtime` with actual block production
- [ ] Implement RPC server in `tsn-rpc` (Axum or Tonic gRPC)
- [ ] Add Telemetry (OpenTelemetry) in `tsn-telemetry`
- [ ] Integrate Control Hub frontend with `tsn-control-hub` JSON output
- [ ] Security audit before any live network activation
- [ ] Legal review: GENIUS Act, ATS, FinCEN MSB registration

---

*All simulation modules are for design and validation purposes only.  
No financial, legal, or regulatory advice is expressed or implied.*
