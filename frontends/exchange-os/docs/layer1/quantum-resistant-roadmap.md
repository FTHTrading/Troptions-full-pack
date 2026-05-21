# Quantum-Resistant Cryptography Roadmap

**Document**: TSN Cryptography Series
**Standards**: NIST FIPS 203, FIPS 204, FIPS 205 (approved August 2024)
**Status**: Architecture roadmap — no production post-quantum cryptography deployed in current scaffold

---

## Why Quantum Resistance Matters for Financial Infrastructure

A sufficiently powerful quantum computer running Shor's algorithm can break the elliptic curve discrete logarithm problem (ECDLP) that underlies Ed25519 and secp256k1, the signature schemes used by virtually all current blockchain networks.

For a regulated financial settlement network with multi-year asset records and custody obligations, the threat model includes:
1. **Harvest now, decrypt later** — an adversary captures encrypted communication today, decrypts it after quantum computers become available
2. **Key compromise** — a future quantum adversary could potentially derive private keys from public keys stored on-chain
3. **Regulatory requirements** — financial regulators may require quantum-resistant cryptography for critical infrastructure within the coming decade

TSN's architecture plans for this transition rather than ignoring it.

---

## NIST Post-Quantum Cryptography Standards (Finalized 2024)

NIST finalized three post-quantum cryptography standards in August 2024:

| Standard | Algorithm | Category | Purpose |
|---|---|---|---|
| **FIPS 203** | ML-KEM (Module-Lattice KEM) | Key Encapsulation | Encrypted session establishment, key exchange |
| **FIPS 204** | ML-DSA (Module-Lattice DSA) | Digital Signature | Transaction signing, validator signatures |
| **FIPS 205** | SLH-DSA (Stateless Hash-Based DSA) | Digital Signature | Long-term archival signatures |

NIST states that ML-KEM and ML-DSA are believed secure even against adversaries with quantum computers.

---

## TSN Quantum Migration Path: TQSP

The **Troptions Quantum-Safe Path (TQSP)** defines a staged migration:

### Stage 1 — Current: Classic Only
```
Signature:  Ed25519 / secp256k1
Encryption: X25519 (Diffie-Hellman)
Status:     Standard blockchain crypto — vulnerable to quantum adversary
Timeline:   Now → devnet
```

### Stage 2 — Near Term: Hybrid
```
Signature:  Ed25519 + ML-DSA (both signs; both must verify)
Encryption: X25519 + ML-KEM (hybrid KEM)
Status:     Transition period — backwards compatible with classic nodes
            Provides quantum safety even if one scheme is broken
Timeline:   After devnet validation
```

### Stage 3 — Future: Post-Quantum Native
```
Signature:  ML-DSA (primary) + SLH-DSA (archival/long-term)
Encryption: ML-KEM (session encryption)
Status:     Full post-quantum native — no classic key dependency
Timeline:   After testnet security audit
```

### Stage 4 — Long-Term: FIPS-Certified
```
All cryptographic operations use FIPS-certified implementations
Validator key ceremonies use hardware security modules (HSMs)
FIPS-validated ML-DSA, ML-KEM, SLH-DSA implementations
Timeline:   Pre-mainnet, after regulatory review
```

---

## `tsn-pq-crypto` Crate

The `tsn-pq-crypto` crate provides:
- Type definitions for quantum key profiles
- Migration status tracking per account and validator
- NIST FIPS reference documentation embedded in types
- Placeholder structures for future ML-DSA and ML-KEM implementations

```rust
pub enum QuantumSignatureScheme {
    MlDsa,               // NIST FIPS 204
    SlhDsa,              // NIST FIPS 205
    HybridEd25519MlDsa,  // Transition hybrid
}

pub enum QuantumKemScheme {
    MlKem,               // NIST FIPS 203
    HybridX25519MlKem,   // Transition hybrid
}

pub struct QuantumKeyProfile {
    pub address: String,
    pub migration_status: QuantumMigrationStatus,
    pub classic_public_key: String,
    pub pq_signature_scheme: Option<QuantumSignatureScheme>,
    pub pq_kem_scheme: Option<QuantumKemScheme>,
    pub pq_public_key_placeholder: Option<String>,
    pub nist_fips_reference: String,
    pub migrated_at: Option<DateTime<Utc>>,
}
```

**Important**: The scaffold `tsn-pq-crypto` crate contains type definitions and roadmap structures only. It does NOT implement production post-quantum cryptography operations. Real ML-DSA / ML-KEM implementation requires a production-grade, audited library such as `pqcrypto` or `oqs-rust`.

---

## Application to TSN Financial Operations

### Transaction Signing
- Stage 1: Ed25519 — standard blockchain signing
- Stage 2: Hybrid Ed25519 + ML-DSA — dual-signing during transition
- Stage 3: ML-DSA native — quantum-safe signing

### Validator Key Ceremonies
- Stage 1: Ed25519 key generation
- Stage 2: Validator key migration to hybrid profiles
- Stage 3: HSM-backed ML-DSA key generation

### Session Encryption (Node-to-Node)
- Stage 1: X25519 ECDH
- Stage 2: Hybrid X25519 + ML-KEM
- Stage 3: ML-KEM native

### Audit Record Integrity
- Long-term audit records (legal hold) should eventually use SLH-DSA signatures for archival durability
- SLH-DSA is a stateless hash-based scheme with no algebraic structure — maximally conservative against unknown attacks

### Reserve Attestation Signatures
- Reserve attestations for stablecoin issuers should be signed with durable signatures
- SLH-DSA archival signatures are appropriate for reserve certificates

---

## What TSN Will NOT Claim

- "Quantum-proof" — no system is provably quantum-proof
- "Quantum-safe today" — current Ed25519 is vulnerable to a future quantum adversary
- "FIPS-certified" — requires formal certification process and audited implementation
- "Secure against all future attacks" — cryptographic security evolves

## What TSN CAN Say

> Designed with a quantum-resistant roadmap aligned to NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA), with planned hybrid transition and post-quantum native migration phases.

---

## Recommended Rust Libraries (Future)

For production post-quantum cryptography implementation:

| Library | Algorithms | Notes |
|---|---|---|
| `pqcrypto` | ML-KEM, ML-DSA, SLH-DSA | Pure Rust PQC implementations |
| `oqs-rust` | liboqs bindings | NIST candidates + finalized standards |
| `crystals-dilithium` | Dilithium (ML-DSA basis) | Production-grade |
| `kyber` | Kyber (ML-KEM basis) | Production-grade |

All library choices require independent security audit before use in financial infrastructure.

---

## Compliance Note

Financial regulators may require quantum-resistant cryptography for critical financial infrastructure under future standards. TSN's roadmap is designed to enable migration when required, without requiring a full protocol rewrite.
