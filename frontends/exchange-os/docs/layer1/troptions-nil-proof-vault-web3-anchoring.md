# Troptions NIL Proof Vault & Web3 Anchoring

## Overview

The NIL Proof Vault is a simulation-mode document hash registry for NIL deal evidence. It provides Merkle root computation and unsigned Web3 anchor templates for XRPL, Stellar, and Polygon. All Web3 anchoring is disabled for live submission — templates are generated for review only.

---

## Proof Vault Record

```rust
pub struct ProofVaultRecord {
    pub id: Uuid,
    pub athlete_id: AthleteId,
    pub deal_id: String,
    pub document_hashes: Vec<String>,      // SHA-256 of each document
    pub merkle_root: String,               // Merkle root of all document hashes
    pub vault_hash: String,                // SHA-256 of the whole vault record
    pub ipfs_cid_template: Option<String>, // unsigned IPFS CID template
    pub web3_anchor_template: Option<Web3ReceiptTemplate>,
    pub simulation_only: bool,             // always true
    pub live_submission_enabled: bool,     // always false
    pub created_at: DateTime<Utc>,
    pub disclaimer: String,
}
```

No raw document content is ever stored — only SHA-256 hashes of documents.

---

## Merkle Root Computation

The Merkle root is computed over the sorted document hashes:

```rust
pub fn create_merkle_root(hashes: &[String]) -> String {
    if hashes.is_empty() {
        return sha256_hex(b"empty_proof_vault");
    }
    let mut sorted = hashes.to_vec();
    sorted.sort();
    let combined = sorted.join("|");
    sha256_hex(combined.as_bytes())
}
```

For a single document hash `h0`:
```
merkle_root = sha256("h0")
```

For two document hashes `h0`, `h1` (sorted):
```
merkle_root = sha256("h0|h1")
```

This is a simplified Merkle root (single-level hash of sorted leaves), not a binary tree. It provides a deterministic fingerprint of the document set — sufficient for simulation and devnet proof-of-concept use.

### Determinism Property

The sort ensures the Merkle root is deterministic regardless of the order in which document hashes are provided. The integration test `test_10_proof_vault_stores_hash_not_raw_content` verifies that only hashes appear in vault records, never raw document content.

---

## IPFS CID Template

For IPFS pinning, an unsigned CID template is generated:

```json
{
  "template_type": "ipfs_cid_placeholder",
  "athlete_id_hash": "<sha256-hash>",
  "merkle_root": "<merkle-root-hex>",
  "deal_id": "<deal-id>",
  "simulation_only": true,
  "live_pin_enabled": false,
  "note": "SIMULATION ONLY — no live IPFS pinning is enabled"
}
```

This template is encoded as `ipfs://UNSIGNED_TEMPLATE/<base64-json>`. No real IPFS node is contacted. No content is pinned. The CID is not a valid IPFS CID.

---

## Web3 Anchor Templates

The proof vault can generate unsigned anchor templates for three chain targets:

### XRPL Template

```json
{
  "TransactionType": "Payment",
  "Account": "NOT_SET",
  "Destination": "NOT_SET",
  "Amount": "NOT_SET",
  "Memos": [
    {
      "Memo": {
        "MemoData": "<hex-encoded-payload>",
        "MemoType": "74726f7074696f6e735f6e696c5f70726f6f66",
        "MemoFormat": "6170706c69636174696f6e2f6a736f6e"
      }
    }
  ],
  "Fee": "NOT_SET",
  "Sequence": "NOT_SET",
  "Signature": null
}
```

### Stellar Template

```json
{
  "type": "transaction",
  "network": "testnet",
  "operations": [
    {
      "type": "manage_data",
      "name": "nil_proof",
      "value": "<hex-encoded-payload>"
    }
  ],
  "source_account": "NOT_SET",
  "sequence": "NOT_SET",
  "signature": null
}
```

### Polygon Template

```json
{
  "type": "eth_sendTransaction",
  "to": "NOT_SET",
  "from": "NOT_SET",
  "data": "<hex-encoded-payload>",
  "value": "0x0",
  "gasLimit": "NOT_SET",
  "chainId": 80001,
  "signature": null
}
```

All `NOT_SET` fields must be filled in by a qualified on-chain integration team after full legal review and compliance gating. **No private keys are ever involved in template generation.**

---

## Hex-Encoded Payload (All Chains)

The `memo_hex` / `data` field in anchor templates contains a hex-encoded JSON payload:

```json
{
  "protocol": "troptions_nil_proof_vault",
  "version": "0.1.0",
  "athlete_id_hash": "<sha256-hash>",
  "deal_id": "<deal-id>",
  "merkle_root": "<merkle-root-hex>",
  "simulation_only": true,
  "timestamp": "<iso8601-utc>"
}
```

This payload contains no PII — only hashes and metadata safe for public ledger storage.

---

## Safety Gates

| Gate | Status |
|---|---|
| Live IPFS pinning | Disabled |
| Live XRPL submission | Disabled |
| Live Stellar submission | Disabled |
| Live Polygon submission | Disabled |
| Private key usage | Disabled |
| NFT minting | Disabled |
| Token minting | Disabled |
| Wallet seed generation | Disabled |

All of these gates are enforced by the `LIVE_WEB3_ANCHOR_ENABLED: bool = false` constant in `crates/nil/src/lib.rs`.

---

## Integration Test Coverage

```rust
// test_10_proof_vault_stores_hash_not_raw_content
// → verifies no raw document content in vault record

// test_11_web3_anchor_template_unsigned_not_live
// → verifies signed: false, live_submission_enabled: false, signature: None
```
