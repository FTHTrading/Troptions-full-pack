# Troptions NIL — Layer-1 Architecture Audit

**Date:** 2026-04-28  
**Scope:** Pre-implementation audit for native NIL protocol module in Troptions Rust L1  
**Safety:** No live execution. No athlete payments. No private data.

---

## 1. Existing Rust L1 Scaffold Status

The Troptions Rust Layer-1 (`troptions-rust-l1/`) is a live, compiling Cargo workspace with 26 crates:

| Crate | Purpose |
|---|---|
| `tsn-state` | Shared state types, audit events, compliance decisions |
| `tsn-compliance` | TCSA compliance engine (KYC/KYB/sanctions/travel-rule) |
| `tsn-governance` | BFT governance and proposal system |
| `tsn-control-hub` | Control Hub audit and approval integration |
| `tsn-crypto` | SHA-256 and Ed25519 primitives |
| `tsn-rwa` | Real-world asset registration with evidence hashing |
| `tsn-assets` | Asset registry |
| `tsn-trustlines` | Per-account trustline management |
| `tsn-stablecoin` | GENIUS Act-gated stablecoin issuance |
| `tsn-nft` | NFT credential simulation |
| `tsn-runtime` | Devnet orchestration and subsystem health |
| `tsn-rpc` | JSON-RPC 2.0 in-process dispatcher |
| `tsn-cli` | CLI with simulate-* commands |
| `tsn-telemetry` | Structured trace logging |
| ... | (plus bridges, AMM, consensus, SDK, node, brands, genesis, etc.) |

**No NIL crate exists yet** — this is a greenfield addition.

---

## 2. Existing Integration Points Relevant to NIL

### Cryptography (`tsn-crypto`)
- `sha256_hex(data: &[u8]) -> String` — ready for athlete identity hashing
- `hash_evidence(evidence: &str) -> String` — ready for deal document hashing

### Compliance (`tsn-compliance`)
- `ComplianceEngine::evaluate_transfer()` pattern — NIL compliance follows the same decision/audit event pattern
- `ComplianceDecision` / `ComplianceOutcome` types in `tsn-state` — reusable

### Governance (`tsn-governance`)
- `GovernanceDecision::simulation_blocked()` — exact pattern for NIL governance gates

### Audit (`tsn-state`)
- `AuditEvent`, `AuditEventType` — extend with NIL-specific event types
- All events: `simulation_only: true`

### RWA (`tsn-rwa`)
- Evidence hashing, proof vault concepts — directly applicable to NIL deal receipts and proof documents

### Runtime (`tsn-runtime`)
- Subsystem registration pattern — NIL subsystem can be added to `start_devnet_runtime()`

### CLI (`tsn-cli`)
- `simulate-*` command pattern — `simulate-nil-*` commands follow same pattern

---

## 3. NIL33 Concepts to Port to L1

| Concept | L1 Implementation |
|---|---|
| 33-signal deterministic valuation | `tsn-nil/src/signals.rs` + `valuation.rs` |
| Athlete identity verification | `tsn-nil/src/identity.rs` with SHA-256 |
| Ed25519 signed receipts | `tsn-nil/src/receipt.rs` (unsigned template only) |
| NIL deal receipt infrastructure | `tsn-nil/src/receipt.rs` |
| Compliance routing | `tsn-nil/src/compliance.rs` |
| 50-state NIL law database concept | `tsn-nil/src/compliance.rs` `StateRuleProfile` |
| Institution rule overlays | `tsn-nil/src/compliance.rs` `InstitutionRuleProfile` |
| Multi-agent AI architecture | `tsn-nil/src/agent.rs` |
| 14-sport expansion model | `tsn-nil/src/types.rs` `Sport` enum |
| Web3 receipt anchoring | `tsn-nil/src/proof.rs` (template only) |

---

## 4. UnyKorn NIL / XRPL Concepts to Port to L1

| Concept | L1 Implementation |
|---|---|
| XRPL proof-of-funds structure | `tsn-nil/src/proof.rs` `Web3AnchorTemplate` |
| Xaman/XUMM signing architecture | Unsigned template pattern in `receipt.rs` |
| IPFS/private data structures | `ProofVaultRecord` with optional CID metadata |
| Legal document templates | `NilDealReceipt` with redacted terms |
| Proof standards | `create_proof_vault_record()` + `hash_proof_document()` |
| Verifier module | `verify_identity_record()`, `verify_nil_deal_receipt()` |
| RWA/evidence packet concepts | `ProofVaultRecord` + evidence hash fields |
| Xaman review packet | `create_unsigned_web3_receipt_template()` |
| Proof-of-assets structure | `Web3AnchorTemplate` with chain reference fields |

---

## 5. Safety Risks

| Risk | Mitigation |
|---|---|
| Minor athlete private data on-chain | Pseudonymous `AthleteId` hash only; no DOB/name in public record |
| Pay-for-play compliance violation | `evaluate_pay_for_play_risk()` blocks language at engine level |
| Recruiting inducement violation | `evaluate_recruiting_inducement_risk()` blocks at engine level |
| Live NIL payment activation | `live_execution_enabled: false` literal constant — cannot be flipped without code change |
| Guaranteed valuation claims | Valuation outputs band + disclaimer, never guaranteed value |
| Real Web3 minting | All Web3 templates are unsigned JSON — no submission capability |
| Sensitive minor data in hashes | Public hash payload excludes minor-sensitive fields by field tagging |
| Guaranteed deal claims | Output is `estimate`, not `guaranteed_value` — disclaimer on all outputs |

---

## 6. Recommended Implementation Order

1. `tsn-nil/src/types.rs` — All protocol types (foundation for everything)
2. `tsn-nil/src/errors.rs` — Error types
3. `tsn-nil/src/signals.rs` — 33-signal model (core protocol)
4. `tsn-nil/src/identity.rs` — Athlete identity hashing
5. `tsn-nil/src/valuation.rs` — Valuation engine
6. `tsn-nil/src/compliance.rs` — Compliance routing
7. `tsn-nil/src/receipt.rs` — Deal receipt engine
8. `tsn-nil/src/proof.rs` — Proof vault / Web3 anchoring
9. `tsn-nil/src/governance.rs` — Control Hub governance
10. `tsn-nil/src/agent.rs` — Agent profile definitions
11. `tsn-nil/src/lib.rs` — Module wiring + re-exports
12. `tsn-nil/tests/nil_tests.rs` — Rust test suite
13. Runtime integration (`tsn-runtime`) — Add NIL subsystem
14. CLI integration (`tsn-cli`) — Add simulate-nil-* commands
15. RPC integration (`tsn-rpc`) — Add NIL RPC method handlers
