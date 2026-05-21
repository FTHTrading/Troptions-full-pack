# Validator and Governance Model

**Document**: TSN Governance Series
**Status**: Architecture design — permissioned devnet model

---

## Philosophy

TSN uses a **permissioned-first, hybrid-second** governance model. The validator set starts as an approved institutional set and may evolve toward a hybrid model with public observers and staking as the network matures.

The key insight: most institutional financial infrastructure (CHIPS, Fedwire, TARGET2, SWIFT) is operated by trusted, regulated entities — not anonymous validators. TSN models financial infrastructure first, public blockchain second.

---

## Validator Roles

TSN validators are not all equal. Each node in the network has a defined institutional role:

| Role | Function | Authority |
|---|---|---|
| `Validator` | Block production, consensus voting | Full consensus authority |
| `Observer` | Full node, no voting | Read-only — monitoring and audit |
| `Auditor` | Compliance witness, audit logging | Issues compliance attestations |
| `ComplianceWitness` | Regulatory reporting | Generates regulatory reports |
| `IssuerNode` | Stablecoin issuer operations | Manages issued assets and reserves |
| `ReserveAttestor` | Reserve auditor | Signs reserve attestations |
| `BridgeWatcher` | Cross-rail monitoring | Monitors and reports bridge operations |
| `GovernanceNode` | Proposal + vote counting | Manages governance proposals |

This role model enables institutional use cases that pure validator sets cannot serve. A bank can run a `ReserveAttestor` node without participating in consensus. A regulator can run an `Auditor` node for oversight without influencing block production.

---

## Permissioned Validator Set (Stage 1)

In the first phase, all validators are approved institutional entities:

```rust
pub struct Validator {
    pub id: Uuid,
    pub name: String,
    pub role: ValidatorRole,
    pub jurisdiction: JurisdictionCode,
    pub public_key: String,
    pub stake_bond_amount_string: String,
    pub compliance_certifications: Vec<String>,
    pub active: bool,
    pub registered_at: DateTime<Utc>,
}
```

Validator admission requires:
1. Identity verification (KYB tier: Institutional)
2. Jurisdiction declaration
3. Compliance certifications (AML program, sanctions screening)
4. Bond/stake deposit to smart contract
5. Control Hub approval
6. Governance vote by existing validators

---

## BFT Consensus Model

Stage 1 uses a **HotStuff-style BFT** protocol:

- 3f+1 validator threshold for safety (tolerate f Byzantine failures)
- Two-phase commit: prepare → commit
- Leader rotation on a predetermined schedule or on timeout
- Fast finality: ~1-3 seconds for permissioned validator set
- No empty block production — blocks produced only on transaction arrival

### Why HotStuff-style?
- Linear communication complexity (vs quadratic in classical PBFT)
- Proven used in production (Facebook Diem / Libra used HotStuff)
- Well-suited to permissioned sets of 7–100 validators
- Easy to audit and formally verify

### Consensus Parameters (Devnet)
```
min_validators: 4
max_validators: 21
block_time_target_ms: 2000
finality_threshold_pct: 67
leader_timeout_ms: 5000
```

---

## Governance Model

### On-Chain Governance (Governance Proposals)

Governance proposals can change:
- Validator set membership
- Protocol parameters
- Asset issuer registry
- Compliance rule thresholds
- Cross-rail adapter configuration

Proposal lifecycle:
```
Draft → Submitted → Voting → Passed/Rejected → Executed/Cancelled
```

Voting power is based on validator role and stake. `GovernanceNode` validators count votes.

### Clawd/OpenClaw/Jefe AI Governance Layer

Above on-chain governance, all operations flow through the Control Hub:
- Clawd reviews compliance decisions
- OpenClaw provides secondary review
- Jefe handles escalation and final authority
- All Control Hub decisions are recorded as `GovernanceDecision` records
- No live execution without Control Hub approval

The AI governance layer is a human-in-the-loop system augmented by AI. Final authority remains with the human operators (Kevan and authorized administrators).

---

## Hybrid Model (Stage 2+)

After the permissioned institutional network is validated:

```
Institutional validator set (consensus authority)
  +
Public observer nodes (no voting, full transparency)
  +
Permissioned asset zones (regulated asset issuance)
  +
Public dApp zone (optional — later phase)
```

This preserves compliance for the settlement layer while allowing public transparency and eventual broader participation.

---

## Slashing and Bonding

### Validator Bond
All validators post a bond that is:
- Held in a simulated smart contract (devnet)
- Subject to slashing for provable misbehavior
- Returned on orderly exit after a cooldown period

### Slashing Conditions
- Double-signing (equivocation) — 100% slash
- Extended downtime — graduated slash based on duration
- Compliance certification lapse — suspension + partial slash
- Failure to produce blocks as leader — minor slash

---

## Engineering Next Steps

1. Implement `ValidatorRegistry` in `tsn-consensus` crate
2. Build BFT round type definitions in `tsn-consensus`
3. Implement governance proposal lifecycle in `tsn-governance` crate
4. Wire validator admission through TCSA KYB + Control Hub approval
5. Build slashing simulation in `tsn-state` + `tsn-consensus`
6. Design validator key ceremony protocol (pre-mainnet)
