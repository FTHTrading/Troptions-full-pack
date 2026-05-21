# Troptions NIL Rust API Specification

## Crate: `tsn-nil` (v0.1.0)

All public API functions are in the `tsn_nil` namespace. All return types carry `simulation_only: bool = true` and `live_execution_enabled: bool = false` where applicable.

---

## Module: `signals`

### `get_all_signals() -> Vec<NilSignalDefinition>`

Returns all 33 signal definitions.

**Type:**
```rust
pub struct NilSignalDefinition {
    pub id: &'static str,
    pub bucket: NilSignalBucket,
    pub description: &'static str,
    pub weight: f64,
}
```

**Constants:**
```rust
pub const NIL_SIGNAL_COUNT: usize = 33;
pub const NIL_SIGNAL_BUCKET_COUNT: usize = 6;
```

---

## Module: `valuation`

### `create_valuation_report(athlete_id: &AthleteId, signals: &[NilSignalScore]) -> Result<NilValuationResult, NilError>`

Computes a composite score and valuation estimate band from a slice of scored signals.

**Parameters:**
- `athlete_id` — SHA-256 athlete identity hash
- `signals` — slice of `NilSignalScore { signal_id, value: f64 (0.0–1.0), weight: f64 }`

**Returns:** `NilValuationResult`

```rust
pub struct NilValuationResult {
    pub id: Uuid,
    pub athlete_id: AthleteId,
    pub composite_score: f64,           // 0.0–100.0
    pub valuation_band: NilValuationBand,
    pub estimate_low_usd: f64,          // indicative low
    pub estimate_high_usd: f64,         // indicative high
    pub signal_count: usize,
    pub missing_signal_count: usize,
    pub simulation_only: bool,          // true
    pub live_payment_enabled: bool,     // false
    pub disclaimer: String,             // required disclaimer text
    pub timestamp: DateTime<Utc>,
}
```

**Errors:**
- `NilError::InsufficientSignals` — fewer signals than `NIL_MINIMUM_SIGNAL_COUNT`

**Valuation bands:**
- `InsufficientData` (score < 15)
- `Emerging` (15–39)
- `Developing` (40–64)
- `Established` (65–84)
- `Elite` (85+)

---

## Module: `identity`

### `hash_athlete_identity(profile: &AthleteProfile) -> String`

Computes a deterministic SHA-256 hash of an athlete's canonical identity payload.

**Canonical payload format:** `{graduation_band}|{institution_code}|{sport}|{sport_vertical}|{is_minor}`

**Returns:** 64-character lowercase hex string (`AthleteId`).

---

### `create_identity_record(profile: AthleteProfile) -> Result<AthleteIdentityRecord, NilError>`

Creates an `AthleteIdentityRecord` with a pseudonymous identity hash. No PII is stored.

**Returns:** `AthleteIdentityRecord`

```rust
pub struct AthleteIdentityRecord {
    pub id: Uuid,
    pub athlete_id: AthleteId,
    pub sport: String,
    pub sport_vertical: String,
    pub institution_code: String,
    pub graduation_band: String,
    pub is_minor: bool,
    pub guardian_consent_hash: Option<String>,
    pub simulation_only: bool,   // true
    pub created_at: DateTime<Utc>,
}
```

**Errors:**
- `NilError::MinorRequiresGuardianConsent` — `is_minor: true` with no `guardian_consent_hash`

---

## Module: `compliance`

### `evaluate_nil_deal_compliance(deal: &NilDeal, state_code: &str, institution_code: &str) -> NilComplianceCheck`

Evaluates a proposed NIL deal against all compliance layers.

**Returns:** `NilComplianceCheck`

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
    pub simulation_only: bool,        // true
    pub legal_review_required: bool,  // true
    pub timestamp: DateTime<Utc>,
}
```

**`NilComplianceDecision` variants:**
- `Cleared` — all layers passed
- `RequiresReview` — conditional pass, legal review required
- `Blocked` — hard block (pay-for-play, recruiting, or consent violation)

---

## Module: `receipt`

### `create_nil_deal_receipt(deal: &NilDeal, compliance: &NilComplianceCheck) -> Result<NilDealReceipt, NilError>`

Creates an unsigned NIL deal receipt template. Requires compliance decision ≠ `Blocked`.

**Returns:** `NilDealReceipt`

```rust
pub struct NilDealReceipt {
    pub id: Uuid,
    pub athlete_id: AthleteId,
    pub brand_id: String,
    pub deal_type: NilDealType,
    pub compensation_band: String,
    pub state_code: String,
    pub institution_code: String,
    pub compliance_decision: NilComplianceDecision,
    pub proof_hash: String,
    pub receipt_merkle_root: Option<String>,
    pub signature_hex: Option<String>,   // None — unsigned
    pub unsigned: bool,                  // true
    pub simulation_only: bool,           // true
    pub live_payment_enabled: bool,      // false
    pub live_nft_mint_enabled: bool,     // false
    pub created_at: DateTime<Utc>,
    pub legal_review_required: bool,     // true
    pub disclaimer: String,
}
```

**Errors:**
- `NilError::ComplianceBlocked` — compliance decision is `Blocked`

---

### `create_unsigned_web3_receipt_template(receipt: &NilDealReceipt, chain_target: &str) -> Web3ReceiptTemplate`

Creates an unsigned Web3 anchor template for a receipt. Supports `"xrpl"`, `"stellar"`, `"polygon"`.

---

## Module: `proof`

### `create_merkle_root(hashes: &[String]) -> String`

Computes a SHA-256 Merkle root (single-level, sorted) of document hashes.

---

### `create_proof_vault_record(athlete_id: &AthleteId, deal_id: &str, document_hashes: Vec<String>, chain_target: &str) -> ProofVaultRecord`

Creates a proof vault record with Merkle root and optional Web3 anchor template.

---

### `create_web3_anchor_template(vault: &ProofVaultRecord, chain_target: &str) -> Web3ReceiptTemplate`

Creates a chain-specific unsigned anchor template.

---

## Module: `governance`

### `evaluate_nil_governance_decision(decision: NilGovernanceDecision) -> Result<NilL1StateTransition, NilError>`

Evaluates a Control Hub governance decision for the NIL module.

**`NilGovernanceDecision` variants:**
- `ApproveDealReceipt { deal_id, approver_id, notes }`
- `BlockDealReceipt { deal_id, approver_id, reason }`
- `ApproveLiveExecution { deal_id, approver_id }` — **always blocked** (`LIVE_EXECUTION_ENABLED = false`)
- `RequestLegalReview { deal_id, reviewer_id }`

**Returns:** `NilL1StateTransition`

```rust
pub struct NilL1StateTransition {
    pub id: Uuid,
    pub transition_type: String,
    pub athlete_id: AthleteId,
    pub deal_id: String,
    pub from_state: String,
    pub to_state: String,
    pub authorized_by: String,
    pub simulation_only: bool,          // true
    pub live_execution_blocked: bool,   // true
    pub timestamp: DateTime<Utc>,
    pub disclaimer: String,
}
```

**Errors:**
- `NilError::LiveExecutionBlocked` — `ApproveLiveExecution` is always rejected

---

## Module: `agent`

### `NIL_AGENTS: [NilAgentProfile; 9]`

Static array of 9 NIL agent profiles.

```rust
pub struct NilAgentProfile {
    pub id: &'static str,
    pub label: &'static str,
    pub role: &'static str,
    pub capabilities: &'static [&'static str],
    pub simulation_only: bool,   // true
    pub approval_gated: bool,    // true
}
```

Agent IDs (in order): `nil_orchestrator_agent`, `athlete_identity_agent`, `signal_collection_agent`, `valuation_agent`, `compliance_router_agent`, `deal_receipt_agent`, `proof_vault_agent`, `governance_gate_agent`, `audit_recorder_agent`.

---

## Error Types

```rust
pub enum NilError {
    InsufficientSignals,
    MinorRequiresGuardianConsent,
    ComplianceBlocked(Vec<String>),
    PayForPlayDetected,
    RecruitingInducementDetected,
    LiveExecutionBlocked,
    InvalidAthleteId,
    ProofVaultError(String),
    SerializationError(String),
}
```

All errors implement `std::error::Error` via `thiserror`.
