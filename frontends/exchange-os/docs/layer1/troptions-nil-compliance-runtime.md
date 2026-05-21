# Troptions NIL Compliance Runtime

## Overview

The NIL compliance runtime (`crates/nil/src/compliance.rs`) evaluates proposed NIL deals against a multi-layer compliance model before any deal receipt or proof vault operation proceeds. All evaluation is **simulation-only** — the compliance runtime does not provide legal advice or compliance certification.

---

## Compliance Layers

### Layer 1 — Pay-For-Play Block

Any deal description or compensation band containing pay-for-play indicators is **blocked unconditionally** at the protocol level, regardless of state law permissiveness.

**Blocked keywords:**
- `pay_for_play`
- `academic_performance_bonus`
- `playing_time_incentive`
- `roster_spot_guarantee`
- `scholarship_contingent`

**Compliance check result:**
```rust
NilPayForPlayRisk::Blocked  // deal is rejected, no receipt created
```

This is a hard block. No override is available. Any NIL deal structure that conditions compensation on athletic performance, academic outcomes, playing time allocation, or scholarship status is blocked.

### Layer 2 — Recruiting Inducement Block

Any deal description or compensation band that indicates recruiting inducement is **blocked unconditionally**.

**Blocked keywords:**
- `recruiting_inducement`
- `enrollment_bonus`
- `transfer_inducement`
- `commitment_payment`
- `signing_bonus_pre_enrollment`

**Compliance check result:**
```rust
NilRecruitingRisk::Blocked  // deal is rejected
```

NIL deals must not be structured as inducements for an athlete to enroll at or transfer to a specific institution.

### Layer 3 — Minor Athlete Consent Gate

If `is_minor: true` is set on the athlete profile, and no guardian consent record is present (`guardian_consent_hash.is_none()`), the deal is:

```rust
NilMinorConsentStatus::RequiresGuardianReview
```

No simulation, receipt, or identity hash proceeds until guardian consent is recorded. This gate cannot be bypassed.

### Layer 4 — State Law Overlay

Known state law models (simulation data only):

| State | Rule Status | Annual Cap (indicative) |
|---|---|---|
| TX | Active | $250,000 (model only) |
| CA | Active | No cap (model only) |
| FL | Active | $100,000 (model only) |
| OH | Active | $150,000 (model only) |
| GA | Active | $200,000 (model only) |

All other states return `Unknown` — indicating that no model data is available and legal review is required.

**State law evaluation is simulation-only.** The model does not represent actual state law. State NIL laws change frequently. Always consult qualified legal counsel before relying on state-level compliance data.

### Layer 5 — Institution Policy Overlay

Institutions register compliance policy codes. The NIL runtime checks the institution code against known policy records (simulation data) and evaluates:

- Institution-specific exclusion zones (brand category restrictions)
- Deal type restrictions (social media, appearance, endorsement, collectible)
- Disclosure requirements
- Approval workflow requirements

Unknown institution codes return `RequiresReview` status — not `Approved`.

---

## Compliance Result Structure

```rust
pub struct NilComplianceCheck {
    pub athlete_id: AthleteId,
    pub deal_id: String,
    pub state_code: String,
    pub institution_code: String,
    pub state_rule_status: NilStateRuleStatus,
    pub institution_policy_status: NilInstitutionPolicyStatus,
    pub pay_for_play_risk: NilPayForPlayRisk,
    pub recruiting_risk: NilRecruitingRisk,
    pub minor_consent_status: NilMinorConsentStatus,
    pub overall_decision: NilComplianceDecision,
    pub blocked_reasons: Vec<String>,
    pub recommended_actions: Vec<String>,
    pub simulation_only: bool,        // always true
    pub legal_review_required: bool,  // always true
    pub timestamp: chrono::DateTime<Utc>,
}
```

`overall_decision` values:
- `Cleared` — all layers passed, no blocks (simulation-only approval)
- `RequiresReview` — conditional, legal review required
- `Blocked` — hard block due to pay-for-play, recruiting, or consent violation

---

## Control Hub Integration

When compliance evaluation runs through the TypeScript bridge:

- **Blocked reasons** → `createBlockedActionRecord()` entries in the Control Hub DB
- **RequiresReview** → `createRecommendationRecord()` with priority `"high"`
- **Task record status** → `"blocked"` if any blocks, `"simulated"` if cleared

No compliance simulation result bypasses the governance approval gate.

---

## Important Limitation

The NIL compliance runtime **does not provide legal advice**. All compliance check outputs are:
- Based on simulation data, not real legal research
- Not a substitute for qualified NIL legal counsel
- Not valid for athlete disclosure or institutional compliance filing
- Not certified by any athletic association, regulatory body, or government agency

Real-world NIL deals require review by a licensed attorney familiar with applicable state law, NCAA/NAIA/NJCAA governance rules, and the institution's specific NIL policy.
