# GENIUS Act Readiness Mapping

**Document**: TSN Compliance Series
**Act**: Guiding and Establishing National Innovation for U.S. Stablecoins (GENIUS) Act
**Status**: Pre-devnet — architecture mapping only. Not legal advice. Not a claim of compliance.

---

## Disclaimer

This document maps the TSN architecture to GENIUS Act requirements as published in the Federal Register (April 10, 2026). TSN does **not** claim final GENIUS Act compliance. This mapping guides the engineering roadmap. Actual compliance requires legal review, regulatory examination, and permissioned issuer status granted by the appropriate regulator.

---

## GENIUS Act Overview

The GENIUS Act creates a framework for **permitted payment stablecoin issuers** and:
- Requires permitted issuers to be treated as financial institutions for Bank Secrecy Act (BSA) purposes
- Imposes sanctions, AML, customer identification, and due-diligence obligations
- Outlines reserve, capital, liquidity, and risk-management requirements
- Tasks federal and state regulators with licensing, regulation, examination, and supervision frameworks

---

## TSN Module Mapping

### `tsn-stablecoin` — Stablecoin Runtime

| GENIUS Act Requirement | TSN Implementation | Status |
|---|---|---|
| Permitted issuer authorization | `GeniusActStatus::PermittedIssuer` field on `StablecoinAsset` | Architecture ✅ |
| Issuance blocked for non-permitted issuers | `block_unapproved_issuance()` — hard gate | Architecture ✅ |
| Reserve requirements | `ReservePolicyType` + `ReserveAttestation` | Architecture ✅ |
| Attestation schedule | `attestation_schedule_days` field | Architecture ✅ |
| Redemption rights | `RedemptionPolicy` struct | Architecture ✅ |
| Capital/liquidity requirements | `evaluate_reserve_readiness()` | Architecture ✅ |
| Default: issuance disabled | `issuance_enabled: false` | Architecture ✅ |

### `tsn-compliance` — Compliance Runtime (TCSA)

| GENIUS Act / BSA Requirement | TSN Implementation | Status |
|---|---|---|
| AML program requirement | `aml_program_status` field; TCSA AML gate | Architecture ✅ |
| Sanctions compliance | `SanctionsStatus` enum; TCSA sanctions gate | Architecture ✅ |
| Customer identification (CIP) | `KycTier` enum; TCSA KYC gate | Architecture ✅ |
| Due diligence (CDD) | `KybTier` enum; TCSA KYB gate | Architecture ✅ |
| Transaction monitoring | TCSA velocity + risk score evaluation | Architecture ✅ |
| Travel Rule (FinCEN) | `travel_rule_required` + `travel_rule_metadata_provided` | Architecture ✅ |
| Suspicious activity reporting | `ComplianceOutcome::ReportRequired` | Architecture ✅ |

### `genius_act_runtime` module (in `tsn-compliance`)

Planned modules:
```
permitted_issuer_registry    — Registry of approved issuers
reserve_policy               — Reserve type validation
redemption_policy            — Redemption rights enforcement
aml_bsa_controls             — AML/BSA program checks
sanctions_controls           — OFAC / UN / EU screening
customer_identification      — KYC tier enforcement
due_diligence                — KYB tier enforcement
issuer_examination_status    — Regulator examination status
risk_management              — Risk score and velocity checks
liquidity_controls           — Liquidity buffer validation
disclosure_registry          — Required disclosure tracking
attestation_registry         — Reserve attestation validation
rule_update_adapter          — New rule integration interface
```

---

## `GeniusActStatus` Enum

```rust
pub enum GeniusActStatus {
    NotReviewed,      // Default — no review started
    InPreparation,    // Preparing for application
    PendingApproval,  // Filed — awaiting regulatory decision
    PermittedIssuer,  // Approved — full issuer status
    Blocked,          // Denied or revoked
}
```

**Default**: `NotReviewed` — stablecoin issuance is blocked by default.

---

## Reserve Policy Types

```rust
pub enum ReservePolicyType {
    CashAndEquivalents,     // GENIUS Act preferred
    UsTreasuries,           // GENIUS Act eligible
    InsuredBankDeposits,    // Bank deposit reserves
    Mixed,                  // Mixed reserve composition
    Unknown,                // Not yet defined — blocks issuance
}
```

---

## Compliance Decision Flow for Stablecoins

```
StablecoinIssueRequest
        │
        ▼
block_unapproved_issuance()
        │
    Not PermittedIssuer? → BLOCKED
        │
        ▼
evaluate_reserve_readiness()
        │
    No valid attestation? → BLOCKED
        │
        ▼
TCSA evaluate_transfer()
        │
    Sanctions / KYC fail? → BLOCKED
        │
    Travel Rule required? → NEEDS_APPROVAL
        │
        ▼
GovernanceDecision (Control Hub)
        │
    No approval? → BLOCKED
        │
        ▼
SIMULATION_ONLY (platform gate)
```

No stablecoin issuance reaches the live execution layer without passing all gates and obtaining explicit Control Hub approval.

---

## State Before Any Live Issuance

The following conditions must ALL be true before any stablecoin issuance gate can be opened:

1. `genius_act_status == PermittedIssuer`
2. `aml_program_status == "approved"`
3. `sanctions_program_status == "approved"`
4. `reserve_policy != Unknown`
5. Valid non-expired `ReserveAttestation` on record
6. `issuance_enabled == true` (manually set by authorized operator after all above)
7. Control Hub approval with human review
8. Legal sign-off

Until all 8 conditions are met, all stablecoin operations return `simulate_only`.

---

## What TSN Will NOT Claim

- "GENIUS Act approved" — only regulators grant this
- "Globally compliant" — jurisdiction-specific review required
- "Guaranteed reserve coverage" — attestation is historical, not predictive
- "Safe from all sanctions" — screening is best-effort, not exhaustive

## What TSN CAN Say

> Designed for GENIUS Act alignment, MiCA-aware operations, FATF/AML readiness, permissioned stablecoin issuance, regulated liabilities, and future quantum-resistant cryptography.

---

## Engineering Next Steps

1. Complete `genius_act_runtime` module in `tsn-compliance`
2. Build `permitted_issuer_registry` with mock entries for devnet
3. Implement `attestation_registry` with expiry validation
4. Wire all stablecoin API routes through `evaluate_permitted_issuer_status()`
5. Add GENIUS Act status to all stablecoin-related audit events
6. Legal review of disclosure language before any public statements
