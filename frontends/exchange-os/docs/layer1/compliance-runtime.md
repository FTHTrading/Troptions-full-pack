# Compliance Runtime Specification

**Document**: TSN Compliance Series
**Module**: `tsn-compliance`
**Status**: Architecture + simulation implementation

---

## Overview

The TSN compliance runtime is the heart of what makes TSN different from other chains. Where most chains treat compliance as an application layer, TSN's compliance runtime evaluates every account, asset, trustline, settlement instruction, and validator action before state changes are finalized.

---

## Three Core Algorithms

### TCSA — Troptions Compliance Scoring Algorithm

Evaluates every transfer or state change.

**Inputs**:
```
sender_kyc_tier            — KYC tier of sending party
sender_kyb_tier            — KYB tier (for entities)
sender_sanctions_status    — Sanctions screening result
sender_jurisdiction        — ISO 3166-1 alpha-2
sender_wallet_risk_score   — 0–100 (higher = riskier)
receiver_kyc_tier          — KYC tier of receiving party
receiver_kyb_tier          — KYB tier (for entities)
receiver_sanctions_status  — Sanctions screening result
receiver_jurisdiction      — ISO 3166-1 alpha-2
receiver_wallet_risk_score — 0–100
asset_class                — AssetClass enum
genius_act_status          — GeniusActStatus enum
travel_rule_metadata_provided — bool
amount_usd_cents           — Optional<u64>
```

**Outputs**:
```rust
pub enum ComplianceOutcome {
    Allow,           // Transfer is permitted
    SimulateOnly,    // Permitted in simulation only
    NeedsApproval,   // Human or governance approval required
    Blocked,         // Transfer is blocked
    ReportRequired,  // Triggers regulatory report generation
}
```

**Full Output**:
```rust
pub struct ComplianceDecision {
    pub outcome: ComplianceOutcome,
    pub blocked_reasons: Vec<String>,
    pub required_approvals: Vec<String>,
    pub compliance_checks: Vec<String>,
    pub travel_rule_required: bool,
    pub audit_hint: String,
    pub evaluated_at: DateTime<Utc>,
}
```

**Evaluation Order**:
1. Platform simulation gate (always blocks live execution in scaffold)
2. Sender KYC/KYB check
3. Receiver KYC/KYB check
4. Sender sanctions screening
5. Receiver sanctions screening
6. Sender wallet risk score
7. Receiver wallet risk score
8. Travel Rule threshold check (>= $1,000 USD equivalent)
9. GENIUS Act stablecoin issuer status check
10. Outcome determination

**Platform Simulation Gate**: In the scaffold implementation, ALL transfers return at minimum `simulate_only`. This gate must be explicitly removed by an authorized operator after testnet validation and legal review.

### TRRA — Troptions Reserve Readiness Algorithm

Validates stablecoin reserve adequacy before any issuance gate can open.

**Checks**:
```
reserve_asset_type         — CashAndEquivalents / UsTreasuries / etc.
reserve_custodian          — Named regulated custodian
attestation_date           — Must be within attestation_schedule_days
attestation_expiry         — Must not be expired
total_issued vs total_reserved — Ratio check
issuer_authorization       — GeniusActStatus::PermittedIssuer
regulatory_status          — AML program + sanctions program approved
```

**Output**: `(ready: bool, issues: Vec<String>)`

### TCRP — Troptions Cross-Rail Routing Protocol

Routes cross-rail settlement instructions to the correct adapter.

**Inputs**:
```
source_network    — CrossRailTarget enum
dest_network      — CrossRailTarget enum
asset_id          — Asset identifier
amount_string     — Transfer amount
compliance_state  — ComplianceDecision from TCSA
```

**Routing Logic**:
```
TSN Internal   → tsn-runtime direct settlement
XRPL           → tsn-bridge-xrpl adapter
Stellar        → tsn-bridge-stellar adapter
RLN            → tsn-rln adapter
Agorá          → tsn-agora adapter
mBridge        → tsn-mbridge adapter
BankRail       → tsn-bridge-bank adapter (future)
```

**All routes produce**:
- `CrossRailRoute` record
- `AuditEvent` with routing decision
- `ComplianceRequirements` list
- `BlockedActions` list (always blocked in simulation)
- `RequiredApprovals` list

---

## Compliance Modules

### KYC Module
```rust
fn evaluate_kyc(tier: &KycTier) -> bool {
    matches!(tier, KycTier::Basic | KycTier::Enhanced | KycTier::Institutional)
}
```

KYC tiers: Unknown → Pending → Basic → Enhanced → Institutional

### KYB Module
```rust
fn evaluate_kyb(tier: &KybTier) -> bool {
    matches!(tier, KybTier::Registered | KybTier::Enhanced | KybTier::Institutional)
}
```

KYB tiers: Unknown → Pending → Registered → Enhanced → Institutional

### Sanctions Module
Screens against OFAC SDN, UN Consolidated List, EU Asset Freeze List (simulation only):
- `Unscreened` → triggers mandatory screening before transfer
- `PotentialMatch` → requires human review approval
- `Blocked` → hard block, no appeal path in simulation
- `Clear` → passes

### Travel Rule Module
FATF Recommendation 16 — for transfers >= threshold (commonly $1,000 or $3,000):
- Originator name + account
- Originator address
- Beneficiary name + account
- Transaction reference

If `travel_rule_metadata_provided: false` and amount exceeds threshold → `needs_approval` + blocked pending metadata.

### GENIUS Act Module
For `AssetClass::PaymentStablecoin`:
- `NotReviewed` or `Blocked` → hard block
- `InPreparation` or `PendingApproval` → needs_approval
- `PermittedIssuer` → passes (still blocked by platform gate in simulation)

### Wallet Risk Module
Risk score 0–100 (higher = riskier):
- 0–50: Low risk — passes
- 51–70: Medium risk — passes with monitoring flag
- 71–85: High risk — needs_approval
- 86–100: Critical risk — blocked

### Jurisdiction Module
Each asset can define `permitted_jurisdictions` and `blocked_jurisdictions`. Cross-jurisdiction transfers require compliance documentation. Certain high-risk jurisdictions are blocked by default (FATF grey/black list mapping — simulation only).

---

## Audit Integration

Every TCSA evaluation emits an `AuditEvent`:

```rust
AuditEvent {
    event_type: AuditEventType::ComplianceBlock | ComplianceAllow | ...,
    actor: "tcsa_compliance_engine",
    summary: "Transfer evaluation: <outcome>",
    metadata: { sender, receiver, outcome, blocked_reasons, ... },
    simulation_only: true,
}
```

All audit events are:
- Immutable (append-only in the audit store)
- Timestamped with `Utc::now()`
- Forwarded to the TypeScript Control Hub via `tsn-control-hub`

---

## Default State

In the scaffold implementation, all compliance evaluations default to:
- `outcome: SimulateOnly`
- `required_approvals: ["control_hub_approval"]`
- `simulation_only: true`
- `audit_hint: "TCSA evaluation — simulation mode"`

No live transfers are permitted. This is the correct and safe default for a compliance-first network.
