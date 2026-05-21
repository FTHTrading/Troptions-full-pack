# Troptions NIL Identity & Receipt Protocol

## Overview

The NIL Identity & Receipt Protocol defines how athlete identity is represented in the Troptions NIL system and how NIL deal receipts are created. The protocol is built on two core principles:

1. **Pseudonymity** — no personally identifiable information (PII) is ever stored, transmitted, or anchored on-chain
2. **Unsigned templates** — all receipt outputs are unsigned templates requiring legal and institutional approval before any use

---

## Athlete Identity Hashing

### Canonical Payload

Athlete identity is represented as a **SHA-256 hash** of a canonical payload. The canonical payload contains only:

```
graduation_band|institution_code|sport|sport_vertical|is_minor_flag
```

**Example canonical payload:**
```
2025|UNIV_001|basketball|NCAA_DI|false
```

**No name, date of birth, student ID, SSN, address, or contact information** is ever included in the canonical payload or stored in the identity record.

### Hash Computation

```rust
// In crates/nil/src/identity.rs
pub fn hash_athlete_identity(profile: &AthleteProfile) -> String {
    let canonical = format!(
        "{}|{}|{}|{}|{}",
        profile.graduation_band,
        profile.institution_code,
        profile.sport,
        profile.sport_vertical,
        profile.is_minor,
    );
    tsn_crypto::hash_evidence(&canonical)
    // → sha256(canonical.as_bytes()) → hex string
}
```

The output is a 64-character lowercase hex string. This string is the `AthleteId` used throughout the NIL protocol.

### Identity Record

```rust
pub struct AthleteIdentityRecord {
    pub id: Uuid,
    pub athlete_id: AthleteId,        // SHA-256 hash
    pub sport: String,
    pub sport_vertical: String,
    pub institution_code: String,
    pub graduation_band: String,
    pub is_minor: bool,
    pub guardian_consent_hash: Option<String>,  // None = not consented
    pub simulation_only: bool,        // always true
    pub created_at: DateTime<Utc>,
}
```

No PII fields exist on this struct. The `guardian_consent_hash` field stores a hash of a consent document (if provided) — never the document itself.

### Determinism Property

Given the same canonical payload, `hash_athlete_identity` always produces the same `AthleteId`. This is validated by integration test:

```rust
// test_05_deterministic_identity_hash
let hash_a = tsn_nil::identity::hash_athlete_identity(&profile);
let hash_b = tsn_nil::identity::hash_athlete_identity(&profile);
assert_eq!(hash_a, hash_b);
```

---

## NIL Deal Receipt Creation

### Deal Receipt Structure

```rust
pub struct NilDealReceipt {
    pub id: Uuid,
    pub athlete_id: AthleteId,        // hash only
    pub brand_id: String,             // brand identifier hash
    pub deal_type: NilDealType,
    pub compensation_band: String,
    pub state_code: String,
    pub institution_code: String,
    pub compliance_decision: NilComplianceDecision,
    pub proof_hash: String,           // SHA-256 of receipt content
    pub receipt_merkle_root: Option<String>,
    pub signature_hex: Option<String>,   // always None — unsigned
    pub unsigned: bool,               // always true
    pub simulation_only: bool,        // always true
    pub live_payment_enabled: bool,   // always false
    pub live_nft_mint_enabled: bool,  // always false
    pub created_at: DateTime<Utc>,
    pub legal_review_required: bool,  // always true
    pub disclaimer: String,
}
```

### Creation Flow

1. Athlete identity is verified (hash exists, consent checked if minor)
2. Compliance check passes (no pay-for-play, no recruiting inducement blocks)
3. Receipt content is serialized to JSON
4. `proof_hash = sha256(receipt_content_json)`
5. Receipt created with `unsigned: true`, `signature_hex: None`, `live_payment_enabled: false`
6. Receipt is stored in proof vault with Merkle root

### What the Receipt Is NOT

A NIL deal receipt from the Troptions NIL protocol:
- Is NOT a legally binding contract
- Does NOT authorize any payment
- Does NOT represent a completed deal
- Does NOT guarantee any amount is due
- Is NOT signed by any party
- Is NOT admissible as evidence of any agreement

It is an **unsigned simulation template** documenting the parameters of a proposed NIL arrangement. Actual contracts must be prepared by qualified legal counsel.

---

## Web3 Receipt Template (Unsigned)

For proof vault anchoring, an unsigned Web3 receipt template is generated:

```rust
pub struct Web3ReceiptTemplate {
    pub template_id: Uuid,
    pub chain_target: String,       // "xrpl", "stellar", "polygon"
    pub transaction_type: String,
    pub from_address: Option<String>,    // None — not set
    pub to_address: Option<String>,      // None — not set
    pub memo_hex: String,                // hex-encoded proof metadata
    pub amount_drops: Option<u64>,       // None — not set
    pub sequence: Option<u32>,           // None — not set
    pub fee: Option<u64>,                // None — not set
    pub signature: Option<String>,       // None — unsigned
    pub signed: bool,                    // always false
    pub live_submission_enabled: bool,   // always false
    pub simulation_only: bool,           // always true
    pub disclaimer: String,
}
```

The `memo_hex` field contains a hex-encoded JSON payload with the athlete ID hash, proof hash, deal ID, and Merkle root. No private keys are ever involved in template creation.

---

## Disclaimer (Required)

All identity and receipt outputs carry the following disclaimer:

> SIMULATION ONLY — this record is an unsigned template for devnet use. No payment, legal agreement, on-chain transaction, or binding commitment is created. No PII is stored. Identity hash is pseudonymous. Legal and institutional review required before any real-world use.
