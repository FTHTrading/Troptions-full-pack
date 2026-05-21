# Audit Phase 03 — Wallet Address & Transaction Inventory

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

> **Safety Notice:** Public wallet addresses are included for verification. Private keys, seeds, mnemonics, and signing material must never be disclosed and are NOT present in this document. No blockchain execution was performed during this audit. All transactions in the treasury log are dry-run simulations only.

---

## 1. Active Production Wallet Addresses (Public — Safe to Document)

These are the primary Troptions issuance and distribution addresses. They are embedded in public-facing source code (`chainLiveData.ts`, `troptions-genesis.json`) and are safe to document for audit purposes.

### XRPL (XRP Ledger)

| Role | Address | Network |
|---|---|---|
| XRPL TROPTIONS Issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | XRPL Mainnet |
| XRPL TROPTIONS Distributor | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | XRPL Mainnet |

### Stellar (Stellar Network)

| Role | Address | Network |
|---|---|---|
| Stellar TROPTIONS Issuer | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | Stellar Mainnet |
| Stellar TROPTIONS Distributor | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | Stellar Mainnet |

---

## 2. Flagged / Compromised Address

| Address | Status | Action Required |
|---|---|---|
| `rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1` | **COMPROMISED — DO NOT USE** | Do not use for any new operations. Generate fresh wallets per-brand. |

Source: `public/troptions-genesis.json` contains explicit warning: `"action_required": "DO NOT use rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 for any new operations."`

---

## 3. Asset Hex Identifier

| Asset | Hex Code | Network |
|---|---|---|
| TROPTIONS | `54524F5054494F4E530000000000000000000000` | XRPL |

Source: `chainLiveData.ts` constant `TROPTIONS_HEX`.

---

## 4. Genesis Hash & IPFS Proof

| Item | Value |
|---|---|
| Genesis SHA-256 Hash | `5c0a395f3a83008c8a644325145ac44679747fdd880c9c260ac7781613f4cd29` |
| IPFS CID | `QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H` |

Source: `public/troptions-genesis-release.json`

**Note:** The genesis hash was locked in Phase 20 (`feat(genesis): Phase 20 — lock genesis hash, pin to IPFS, release verification` at commit `6827657`). The IPFS CID provides public, immutable proof of the genesis document state.

---

## 5. Treasury Funding Log Analysis

File: `data/treasury-funding-log.json`

**All entries are dry-run simulations. No live blockchain transactions have been executed.**

### Simulated Operations (sample)

| Chain | Label | Transaction Type | Mode | Status |
|---|---|---|---|---|
| XRPL | Issuer AccountSet | AccountSet | dry-run | simulated |
| XRPL | Distributor TrustSet | TrustSet | dry-run | simulated |
| XRPL | Issue supply | Payment | dry-run | simulated |
| XRPL | Genesis NFT mint #1 | NFTokenMint | dry-run | simulated |
| XRPL | MPT issuance tranche A | MPTokenIssuanceCreate | dry-run | simulated |
| XRPL | DEX sell offer | OfferCreate | dry-run | simulated |
| XRPL | DEX buy offer | OfferCreate | dry-run | simulated |
| Stellar | Issuer set options | SetOptions | dry-run | simulated |
| Stellar | Distributor change trust | ChangeTrust | dry-run | simulated |
| XRPL | Issuer funding | Payment (dry-run) | dry-run | simulated |
| XRPL | Distributor funding | Payment (dry-run) | dry-run | simulated |
| Stellar | Issuer funding | Payment (dry-run) | dry-run | simulated |
| Stellar | Distributor funding | Payment (dry-run) | dry-run | simulated |

**No live transaction hashes exist in the treasury log.** All `status` values are `"simulated"`, all `mode` values are `"dry-run"`.

---

## 6. Live Transaction History (Session Audit Result)

A search across all docs, source files, and data files found **no live mainnet transaction hashes** for this session. All previous session reports confirm:

> "Engines generate unsigned transaction templates only — no signing, no submission"
> "XRPL TROPTIONS issuer `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` — no new transactions this session"
> "XRPL TROPTIONS distributor `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` — no new transactions this session"
> "Stellar TROPTIONS issuer — no new transactions this session"
> "Stellar TROPTIONS distributor — no new transactions this session"

Source: `docs/troptions/final-live-launch-readiness-report.md`

---

## 7. Wallet Architecture in Code

### How the system uses addresses

The system reads addresses as **read-only public constants** in:

- `src/lib/troptions/chainLiveData.ts` — fetches public ledger data via XRPL RPC and Stellar Horizon APIs (no auth required, public endpoints)
- `src/content/troptions/stellarWalletInventoryRegistry.ts` — static wallet inventory registry
- `src/content/troptions/assetRegistry.ts` — asset definitions including issuer addresses
- `public/troptions-genesis.json` — public genesis document

### External signing model

The platform uses an **external signer gate** pattern:
- `src/lib/troptions/xrplExternalSignerGate.ts` — gates that require an external signing service (never inline key)
- No private key material is ever stored in the codebase
- Signing is deferred to external hardware/HSM for any future live operations

### Wallet categories present in codebase

| Category | Examples | Key Status |
|---|---|---|
| XRPL issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | Public address only |
| XRPL distributor | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | Public address only |
| Stellar issuer | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | Public address only |
| Stellar distributor | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | Public address only |
| Demo/showcase wallets | Various (see `demoWalletShowcaseRegistry.ts`) | Demo only — no live funds |
| Compromised (flagged) | `rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1` | BLOCKED |

---

## 8. Live Chain Data Endpoints

The platform uses these **public, unauthenticated** API endpoints for live read operations:

| Network | Endpoint | Auth Required |
|---|---|---|
| XRPL | `https://xrplcluster.com` | None (public RPC) |
| Stellar | `https://horizon.stellar.org` | None (public Horizon API) |

These are read-only calls (`account_info`, `account_lines`, `account_offers`, etc.). No write operations are performed via these endpoints.

---

## 9. Verification Links (Public)

| Item | Link |
|---|---|
| XRPL Issuer on XRPL Explorer | `https://livenet.xrpl.org/accounts/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` |
| XRPL Distributor on XRPL Explorer | `https://livenet.xrpl.org/accounts/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` |
| Stellar Issuer on Stellar Expert | `https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` |
| Stellar Distributor on Stellar Expert | `https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` |
| IPFS Genesis Document | `https://ipfs.io/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H` |
