# Troptions NIL Native Module — Architecture & Design

## Overview

The Troptions NIL (Name, Image, and Likeness) protocol is a **native Layer-1 module** built directly into the Troptions Settlement Network Rust codebase (`troptions-rust-l1/crates/nil/`). It is registered as a first-class subsystem (`tsn_nil`) in the runtime alongside assets, compliance, AMM, governance, and bridge modules.

All NIL operations are:
- **Simulation-only** — `SIMULATION_ONLY = true`, `LIVE_EXECUTION_ENABLED = false`
- **Devnet-only** — `DEVNET_ONLY = true`
- **Unsigned-template-only** — no Ed25519 signing, no live XRPL/Stellar/Polygon anchoring
- **Approval-gated** — every operation requires Control Hub governance review

---

## Safety Constants

All safety constants are declared in `crates/nil/src/lib.rs`:

```rust
pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const LIVE_PAYMENT_ENABLED: bool = false;
pub const LIVE_NFT_MINT_ENABLED: bool = false;
pub const LIVE_WEB3_ANCHOR_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;
pub const DEVNET_ONLY: bool = true;
```

These constants propagate through every module, every result struct, and every output template. No path through the NIL codebase bypasses them.

---

## Module Structure

```
troptions-rust-l1/crates/nil/
├── Cargo.toml           # tsn-nil crate manifest
└── src/
    ├── lib.rs           # Module declarations, safety constants, re-exports
    ├── types.rs         # All shared NIL types
    ├── errors.rs        # NilError enum
    ├── signals.rs       # 33-signal definitions and validation
    ├── valuation.rs     # Composite scoring and estimate computation
    ├── identity.rs      # Pseudonymous athlete identity hashing
    ├── receipt.rs       # Unsigned NIL deal receipt creation
    ├── compliance.rs    # 50-state + institution + minor consent evaluation
    ├── proof.rs         # Proof vault, Merkle root, Web3 anchor templates
    ├── governance.rs    # Control Hub decision routing
    └── agent.rs         # 9 NIL agent profile definitions
```

---

## Protocol Data Flow

```
Athlete Profile
    │
    ▼
identity.rs ─── SHA-256 canonical payload ──► AthleteIdentityRecord
                                               (no PII, hash only)
    │
    ▼
signals.rs ──── 33 signals scored ──────────► NilSignalScore[]
    │
    ▼
valuation.rs ── composite 0-100 ──────────► NilValuationResult (ESTIMATE ONLY)
    │
    ▼
compliance.rs ── 50-state + institution ──► NilComplianceCheck
                pay-for-play / recruiting
    │
    ▼
receipt.rs ───── unsigned template ──────► NilDealReceipt
    │
    ▼
proof.rs ──────── Merkle root ──────────► ProofVaultRecord + Web3ReceiptTemplate
    │
    ▼
governance.rs ─── Control Hub gate ─────► NilGovernanceDecision
    │
    ▼
NilL1StateTransition (devnet, simulation_only: true)
```

---

## Runtime Registration

`tsn_nil` is registered in `crates/runtime/src/lib.rs` as a SUBSYSTEMS entry:

```rust
("tsn_nil", "NIL protocol: athlete identity hashing, 33-signal valuation, deal receipt, compliance, proof vault"),
```

The crate is imported via `use tsn_nil as _;` to confirm linkage during `start_devnet_runtime()`.

---

## CLI Commands

Five simulate commands are available via `tsn <command>`:

| Command | Description |
|---|---|
| `simulate-nil-identity-hash` | Athlete identity hash simulation |
| `simulate-nil-valuation` | 33-signal composite estimate |
| `simulate-nil-compliance` | Deal compliance check |
| `simulate-nil-deal-receipt` | Unsigned deal receipt |
| `simulate-nil-proof-vault` | Proof vault record |

All print `[SIMULATION]` prefix and block live execution.

---

## TypeScript Bridge

`src/lib/troptions-nil/l1NilBridge.ts` provides a pure TypeScript representation of the Rust NIL protocol for the Next.js 15 frontend. It does **not** call Rust FFI — it implements equivalent deterministic logic in TypeScript.

`src/lib/troptions-nil/nilControlHubBridge.ts` connects simulation outputs to the Control Hub governance store using the synchronous `getControlPlaneDb()` API.

---

## UI Integration

| Path | Description |
|---|---|
| `/troptions-nil/layer1` | Public NIL protocol overview |
| `/admin/troptions-nil/layer1` | Admin simulation panel |

---

## Design Principles

1. **Pseudonymity over privacy breach** — athlete identity is a SHA-256 hash of a canonical payload containing only graduation band, institution code, sport, sport vertical, and minor flag. No name, DOB, SSN, or address is ever stored or transmitted.

2. **Estimate over guarantee** — all valuation outputs include the explicit disclaimer: *"not a guaranteed NIL value, deal, income, or endorsement amount."*

3. **Block before simulate** — pay-for-play, recruiting inducement, and minor consent violations are checked and blocked before any simulation proceeds.

4. **Unsigned over live** — all Web3 anchor and receipt outputs are explicitly `unsigned: true`, `live_submission_enabled: false`.

5. **Audit everything** — every NIL operation creates a `NilAuditEvent` record. Governance decisions are immutable transition records.
