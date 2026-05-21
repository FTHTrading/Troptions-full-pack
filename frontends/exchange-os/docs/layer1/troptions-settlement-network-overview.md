# Troptions Settlement Network — Architecture Overview

**Version**: 0.1 (Scaffold)
**Status**: Architecture & Simulation Design — No live chain, token movement, banking, or settlement execution enabled
**Internal Engineering Name**: TSN / Troptions Settlement Network
**Public Name**: Troptions Settlement Network — a compliance-native Layer-1 for regulated digital asset settlement

---

## Mission Statement

Troptions Settlement Network is a Rust-based, compliance-native Layer-1 architecture designed for regulated digital assets, stablecoin-ready settlement, tokenized real-world assets, institutional exchange rails, and future quantum-resistant financial infrastructure.

Built to support programmable compliance, issuer controls, reserve attestations, trustline-style asset permissions, NFT credentialing, liquidity simulation, and cross-rail interoperability with XRPL, Stellar, bank-deposit-token models, and future regulated liability networks.

---

## Core Principle

> Most chains treat compliance as an application layer bolted on after launch.
> Troptions treats compliance as **chain state** — baked into every account, asset, trustline, settlement instruction, and validator action.

---

## Architecture Layers

```
Troptions Rust Layer-1
├─ Consensus Layer             — BFT permissioned validator set; sovereign network model
├─ Execution Layer             — Deterministic state transitions; eUTXO-inspired settlement
├─ Asset / Token Layer         — Issued assets, supply management, issuer controls
├─ Trustline / Permission Layer — Holder-issuer permission structs; compliance-gated
├─ Stablecoin / Reserve Layer  — GENIUS Act-aligned issuer controls; reserve attestations
├─ RWA / Document Layer        — Real-world asset registry; evidence hash proofs
├─ NFT / Credential Layer      — Soulbound NFTs for compliance proofs and certificates
├─ Liquidity / AMM / DEX Layer — Simulation-only pools; no guaranteed yield
├─ Compliance Runtime          — TCSA: Troptions Compliance Scoring Algorithm
├─ Identity / KYB / KYC Layer  — Tiered identity; sanctions screening; Travel Rule
├─ Control Hub / Clawd Layer   — AI-governed approval gates; Clawd/OpenClaw/Jefe
├─ Cross-Rail Bridge Layer     — XRPL, Stellar, RLN, Agorá, mBridge adapters
├─ Quantum-Resistant Crypto    — ML-DSA / ML-KEM / SLH-DSA migration roadmap
├─ Validator / Sequencer Layer — Institutional validator roles; bonded permissioned set
├─ Institutional API Layer     — RPC, REST, gRPC interfaces for institutional integrators
├─ Observability / Audit Layer — Immutable audit trail; telemetry; compliance witnesses
└─ Developer SDK / Smart Contract Layer — WASM runtime; Rust SDK contracts
```

---

## Safety Guarantees

All of the following are enforced at chain design level and in all simulation code:

| Guarantee | Status |
|---|---|
| Live chain execution disabled | ✅ `simulation_only: true` on all operations |
| Real stablecoin issuance disabled | ✅ `issuance_enabled: false` by default |
| Real token movement disabled | ✅ All transfers return `simulate_only` outcome |
| No private keys stored or logged | ✅ Enforced in all crates |
| No guaranteed yield or return claims | ✅ AMM/LP operations require risk disclosure |
| No claim of final GENIUS Act compliance | ✅ Status field: `not_reviewed` by default |
| No claim of global regulatory approval | ✅ All docs use careful qualifying language |
| Audit trail for all blocked actions | ✅ `AuditEvent` emitted for every block |
| Control Hub approval required for all state changes | ✅ `required_approvals: ["control_hub_approval"]` |

---

## MVP Engineering Phases

### Phase 0 — Whitepaper and Specification ← current
Architecture documents, competitive analysis, compliance mapping, quantum roadmap.

### Phase 1 — Rust Ledger Simulator
Accounts, assets, trustlines, stablecoin issuance (blocked by default), RWA registry, NFT credentials, compliance checks, audit log, Control Hub bridge.

### Phase 2 — Single-Node Devnet
Block production, transaction execution, state root, RPC, CLI, explorer.

### Phase 3 — Multi-Node Permissioned Testnet
Validator set, BFT consensus, staking/bonding simulation, slashing simulation, governance votes.

### Phase 4 — Institutional Modules
GENIUS Act runtime, reserve attestations, redemption workflows, KYB/KYC gates, sanctions, Travel Rule metadata.

### Phase 5 — Cross-Rail Adapters
XRPL observer, Stellar observer, stablecoin rail observer, bank/RLN simulation, Agorá-style settlement, mBridge-style settlement.

### Phase 6 — Public Demo
Rust L1 devnet, compliance-native asset transfers, stablecoin-ready issuer controls, RWA-ready settlement, quantum-resistant roadmap, Control Hub governance.

---

## Native TSN Primitives

### Account
```rust
Account {
  address,           // TSN address
  identity_status,   // KycTier enum
  entity_status,     // KybTier enum
  jurisdiction,      // ISO 3166-1 alpha-2
  sanctions_status,  // SanctionsStatus enum
  wallet_risk_score, // 0–100
  allowed_asset_classes,
  transfer_limit_daily_usd_cents,
  compliance_flags,
}
```

### Trustline
Compliance-native, inspired by XRPL/Stellar:
```rust
Trustline {
  holder, issuer, asset_id, limit,
  jurisdiction_allowed,
  kyc_required, freeze_status, clawback_allowed,
  simulation_only: true
}
```

### StablecoinAsset
```rust
StablecoinAsset {
  issuer, currency,
  reserve_policy, redemption_policy,
  attestation_schedule, genius_act_status,
  aml_program_status, sanctions_program_status,
  issuance_enabled: false  // default
}
```

### RwaAsset
```rust
RwaAsset {
  asset_type, legal_entity,
  evidence_packet_hash, valuation_hash,
  ownership_registry, transfer_restrictions,
  jurisdiction_rules, simulation_only: true
}
```

### LiquidityPool
```rust
LiquidityPool {
  asset_a, asset_b, pool_type,
  permission_mode, lp_token,
  risk_disclosure_id,
  no_guaranteed_yield_ack: required,
  simulation_only: true
}
```

---

## Troptions Algorithms

### TCSA — Troptions Compliance Scoring Algorithm
Evaluates every transfer before finality. Inputs: wallet risk, jurisdiction, asset class, issuer status, sanctions, KYB/KYC tier, amount, velocity, counterparty risk, Travel Rule. Outputs: `allow | simulate_only | needs_approval | blocked | report_required`.

### TRRA — Troptions Reserve Readiness Algorithm
For stablecoin reserve validation. Checks: reserve asset type, custodian, attestation date, redemption policy, liquidity buffer, issuer authorization.

### TCRP — Troptions Cross-Rail Routing Protocol
Routes across: TSN internal, XRPL, Stellar, stablecoin rails, bank rails, RLN, Agorá, mBridge. All routes are compliance-checked.

### TQSP — Troptions Quantum-Safe Path
Migration path: Ed25519/secp256k1 → hybrid → ML-DSA. ML-KEM for session encryption. SLH-DSA for archival signatures.

---

## Validator Architecture

Validators are permissioned institutional nodes with explicit roles:

| Role | Function |
|---|---|
| Validator | Block production and consensus |
| Observer | Non-voting full node |
| Auditor | Compliance witness and audit logging |
| ComplianceWitness | Regulatory observation and report generation |
| IssuerNode | Stablecoin issuer operational node |
| ReserveAttestor | Reserve auditor and attestation node |
| BridgeWatcher | Cross-rail route monitoring |
| GovernanceNode | Governance proposal and vote counting |

---

## Governance Integration

The Troptions Control Hub (Clawd/OpenClaw/Jefe) governs all state changes:
- Every simulation produces a `GovernanceDecision` with `task_id` and `audit_record_id`
- All blocked actions are persisted
- All required approvals are tracked
- No live execution without explicit Control Hub authorization
- The Rust `tsn-control-hub` crate serializes records compatible with the TypeScript Control Hub persistence model

---

*See also*: `l1-competitive-analysis-avalanche-cardano-xrpl-stellar.md`, `genius-act-readiness-mapping.md`, `compliance-runtime.md`
