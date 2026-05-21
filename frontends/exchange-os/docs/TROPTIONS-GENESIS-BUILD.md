# TROPTIONS Genesis Build — Full System Audit Report

**Date**: 2026-04-27  
**Author**: Genesis Build Agent  
**System**: Troptions Settlement Network (TSN)  
**Build Status**: SIMULATION-ONLY — No live transactions have been executed

---

## Executive Summary

This report documents the complete genesis build state for the Troptions Settlement Network (TSN). The system spans 8 brand entities, a 26-crate Rust L1 implementation, XRPL and Stellar integration layers, Polygon smart contracts, Apostle Chain connectivity, and an IPFS-ready genesis manifest.

**Critical Finding**: The primary XRPL wallet `rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1` was compromised in early 2026. No live operations may be performed until 8 fresh per-brand wallets are generated and the legal/compliance gates listed below are cleared.

**Three-tier status framework used throughout this document:**

| Status | Meaning |
|--------|---------|
| **LIVE** | Active on mainnet, real funds, real state |
| **SIMULATION** | Infrastructure built, tests pass, no live execution |
| **SPEC** | Design documented, legal/custody/compliance gates not yet cleared |

---

## 1. Brand Entity Inventory

All 8 TROPTIONS brand entities are encoded in the Rust L1 `tsn-brands` crate and the IPFS genesis manifest.

| Brand ID | Display Name | Domain | Category | L1 Status |
|----------|-------------|--------|----------|-----------|
| `troptions-org` | TROPTIONS.ORG | TROPTIONS.ORG | Institutional Platform | LIVE (read-only) |
| `troptions-xchange` | Troptions Xchange | TROPTIONSXCHANGE.IO | Exchange/Trade | SIMULATION |
| `troptions-unity-token` | Troptions Unity Token | TROPTIONSUNITYTOKEN.COM | Token/Digital Asset | SPEC |
| `troptions-university` | Troptions University | TROPTIONS-UNIVERSITY.COM | Education/Academy | SIMULATION |
| `troptions-tv-network` | Troptions Television Network | TROPTIONSTelevisionNetwork.Tv | Media/Broadcasting | SIMULATION |
| `real-estate-connections` | The Real Estate Connections | TheRealEstateConnections.com | Real Estate/RWA | SIMULATION |
| `green-n-go-solar` | Green-N-Go Solar | Green-N-Go.Solar | Energy/ESG | SIMULATION |
| `hotrcw` | HOTRCW | HOTRCW.COM | Utility/Service | NEEDS REVIEW |

---

## 2. XRPL State

### 2.1 Compromise Forensics

| Field | Detail |
|-------|--------|
| Compromised wallet | `rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1` |
| Master key disabled | 2026-02-25 |
| NFTs burned | 2026-02-21 |
| Funds drained | 2026-03-05 00:29–00:38 UTC |
| USDT drained | ~$184,000,000 |
| GOLD drained | ~$20,000,000 (XAU equivalent) |
| EUR drained | ~$50,000,000 |
| Attack vector | Regular key compromise, two key rotations by attacker |
| NFT forensics registry | **EMPTY** — all previously minted NFTs burned |
| **Action** | **DO NOT USE** `rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1` for any new operations |

### 2.2 Safe Active Wallets

| Role | Address | Status |
|------|---------|--------|
| TROPTIONS Issuer | `rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3` | Active — read-only |
| OPTKAS Genesis Treasury | `rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r` | Active — 2 trustlines established |

### 2.3 Established Trustlines

| ID | Asset | Holder | Status |
|----|-------|--------|--------|
| tl-1 | OPTKAS | `rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r` (treasury) | Authorized |
| tl-2 | SOVBND | `rnAF6Ki5sbmPZ4dTNCVzH5iyb9ScdSqyNr` | Authorized |
| tl-3 | PETRO | `rDEW3swAxG4iJcBSRBdKLim33TfTciKzxX` | **Review required** (high-risk commodity) |

### 2.4 Pending Fresh Wallet Generation

8 new per-brand wallets must be generated using Xumm or a hardware wallet before any live operations:

| Role | Brand | XLS Standard | Legal Gate |
|------|-------|-------------|-----------|
| troptions-xchange-wallet | troptions-xchange | — | ATS/exchange licensing |
| unity-token-mpt-issuer | troptions-unity-token | XLS-33 | Securities counsel + board |
| university-nft-issuer | troptions-university | XLS-20 | None — can proceed after wallet gen |
| tv-network-nft-issuer | troptions-tv-network | XLS-20 | FCC media compliance |
| real-estate-rwa-issuer | real-estate-connections | XLS-20 | Real estate brokerage + securities |
| solar-rwa-issuer | green-n-go-solar | XLS-20 | CFTC/SEC/state utility |
| hotrcw-service-wallet | hotrcw | — | MSB review (if payment intermediation) |
| (shares unity-token-mpt-issuer) | troptions-unity-token | XLS-20 (genesis stake) | Securities counsel (same gate as TUT) |

### 2.5 Issued Assets Registry

9 assets defined in XRPL issued asset catalog:

| Symbol | Type | Status |
|--------|------|--------|
| TROPTIONS | XLS IOU | Active issuer (rPF2M1...) |
| OPTKAS | XLS IOU | Spec — gated |
| SOVBND | XLS IOU | Spec — gated |
| IMPERIA | XLS IOU | Spec — gated |
| GEMVLT | XLS IOU | Spec — gated |
| TERRAVL | XLS IOU | Spec — gated |
| PETRO | XLS IOU | **Review required** |
| ATTEST | XLS-20 NFT | Spec — gated |
| TUT | XLS-33 MPT | **Legal clearance required** |

### 2.6 NFT Collections (XLS-20)

8 collections spec'd, 0 minted. All prior NFTs were burned 2026-02-21.

| Collection | Brand | Transferable | Max Supply | Legal Gate |
|-----------|-------|-------------|-----------|-----------|
| TROPTIONS.ORG Institutional Credential | troptions-org | No | Unlimited | None |
| Xchange Member NFT | troptions-xchange | No | Unlimited | ATS licensing |
| University Completion Certificate | troptions-university | No | Unlimited | None |
| TV Premium Access NFT | troptions-tv-network | **Yes** (2.5% royalty) | Unlimited | FCC |
| Real Estate Proof-of-Interest | real-estate-connections | No | Unlimited | RE + securities |
| Solar REC NFT | green-n-go-solar | **Yes** | Unlimited | CFTC/EPA |
| HOTRCW Service Credential | hotrcw | No | Unlimited | MSB review |
| Unity Token Genesis Stake | troptions-unity-token | No | **1,000** | Securities counsel |

### 2.7 MPT Definition (XLS-33)

| Field | Value |
|-------|-------|
| Symbol | TUT |
| Full name | Troptions Unity Token |
| Max supply | 1,000,000,000 TUT |
| Asset scale | 6 (1 TUT = 1,000,000 base units) |
| Transfer fee | 0 bps |
| Flags | lsfMPTCanTransfer, lsfMPTCanTrade |
| Status | **SPEC ONLY — legal clearance required** |

**Prerequisites for TUT MPT issuance:**
1. Verify XLS-33 Amendment active on mainnet
2. Securities counsel Howey test analysis
3. Board authorization (FTH Trading)
4. Fresh isolated wallet generated
5. KYC/KYB plan for initial holders confirmed

---

## 3. Stellar State

### 3.1 Account Status

All 3 Stellar accounts were generated from `OPTKAS_WALLET_BACKUP` on 2026-02-07.  
**None have been funded or activated on mainnet.**

| Role | Address | Status |
|------|---------|--------|
| Issuer | `GBJIMHMBGTPN5RS42OGBUY5NC2ATZLPT3B3EWV32SM2GQLS46TRJWG4I` | Generated, not funded |
| Distribution | `GAKCD7OKDM4HLZDBEE7KXTRFAYIE755UHL3JFQEOOHDPIMM5GEFY3RPF` | Generated, not funded |
| Anchor | `GC6O6Q7FG5FZGHE5D5BHGA6ZTLRAU7UWFJKKWNOJ36G3PKVVKVYLQGA6` | Generated, not funded |

### 3.2 Activation Checklist (7 Steps)

- [ ] 1. Fund each account with minimum 1 XLM on mainnet
- [ ] 2. Establish trustline: distribution → issuer (TROPTIONS asset code)
- [ ] 3. Issue TROPTIONS asset from issuer to distribution account  
- [ ] 4. Configure `stellar.toml` at `TROPTIONS.ORG/.well-known/stellar.toml`
- [ ] 5. Enable `AUTH_REQUIRED` and `AUTH_REVOCABLE` flags on issuer if KYC-gated
- [ ] 6. Test AMM/DEX liquidity pool creation on Stellar **testnet** first
- [ ] 7. Legal + compliance review before mainnet issuance

### 3.3 Assets to Issue on Stellar

| Code | Purpose | Status | Gate |
|------|---------|--------|------|
| TROPTIONS | Primary Troptions IOU | Spec | Post-activation |
| TUT | Unity Token Stellar representation | Spec | Securities counsel |
| TSU | Troptions University asset | Spec | Post-activation |
| TXC | Troptions Xchange coordination | Spec | Exchange licensing |

---

## 4. Polygon Smart Contracts

**Network**: Polygon Mainnet  
**Status**: LIVE (contracts deployed — read/write capable)

| Contract | Address | Status |
|----------|---------|--------|
| QuantumVaultFactory | `0x9BE7E2A62D8fE9b76E50cBDB9C4e0B80a8b7Ff3A` | Live |
| KENNY Token | `0x93F2a3e8E13E0B81B5cE3a84b5c1BC23E1Ac45Ce` | Live |
| EVL Token | `0xAFe18578D2E7d4C3a9aA5Ef0EF85c2a2D57Bb1A` | Live |
| EVL Sale Contract | `0x496b0c4D2Ae3F7aa3B8Bc3fD9b2d9aFd72BC8e7A` | Live |

---

## 5. Apostle Chain

| Field | Value |
|-------|-------|
| Chain ID | 7332 |
| RPC Port | 7332 |
| Height | 15 (at last audit) |
| Operator Agent | `87724c76-da93-4b1a-9fa6-271ba856338e` (kevan-burns-chairman) |
| Funded Agents | 35+ |
| ATP Treasury Balance | 500,000 ATP (kevan-burns-chairman) |
| Status | SIMULATION — running locally |

---

## 6. Rust L1 (troptions-rust-l1)

### 6.1 Workspace Summary

26 crates in the `troptions-rust-l1/` Rust workspace. Edition 2021.  
All crates are **simulation-only** — no HTTP client, no live RPC calls, no keypair generation.

### 6.2 Core Crates

| Crate | Purpose |
|-------|---------|
| `tsn-brands` | All 8 brand entities with chain registrations |
| `tsn-genesis` | Genesis manifest builder, canonical hash computation |
| `tsn-state` | Settlement state machine |
| `tsn-types` | Core domain types |
| `tsn-xrpl` | XRPL integration layer (simulation) |
| `tsn-stellar` | Stellar integration layer (simulation) |
| `tsn-polygon` | Polygon integration layer (simulation) |
| `tsn-compliance` | GENIUS Act compliance runtime |
| `tsn-governance` | HotStuff BFT governance simulation |
| `tsn-settlement` | Settlement engine |
| + 16 additional support crates | |

### 6.3 Test Results

```
tsn-brands: 8/8 tests pass
tsn-genesis: 10/10 tests pass
All prior 24 crates: passing (committed at 330ce67)
```

### 6.4 Genesis Hash Computation

The `compute_genesis_hash()` function in `tsn-genesis`:
1. Zeros out the `genesis_hash` field in the manifest
2. Serializes to canonical JSON (serde_json, sorted keys via BTreeMap equivalent)
3. SHA-256 of the JSON bytes
4. Returns 64-char hex string

**To recompute before IPFS pinning:**
```rust
let manifest = build_genesis();
let hash = compute_genesis_hash(&manifest);
let json = genesis_to_json(&manifest); // includes computed hash
```

Or in TypeScript from the public JSON:
```typescript
// Zero out genesis_hash, canonicalize, SHA-256
const manifest = { ...genesisJson, genesis_hash: "0".repeat(64) };
const canonical = JSON.stringify(manifest); // note: key order matters — match Rust output
const hash = crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
```

### 6.5 IPFS Pinning Instructions

1. Verify genesis hash is correct (recompute from `cargo run --bin genesis-export`)
2. Pin `public/troptions-genesis.json` to IPFS:
   ```bash
   # Via Pinata:
   curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
     -H "Authorization: Bearer $PINATA_JWT" \
     -F "file=@public/troptions-genesis.json"
   ```
3. Update `ipfs_cid` field in `public/troptions-genesis.json` with returned CID
4. Update `ipfs_cid` in `tsn-genesis` Rust manifest constants
5. Commit and push

---

## 7. TypeScript Platform (troptions Next.js)

### 7.1 Content Registry Files

| File | Purpose | Status |
|------|---------|--------|
| `xrplIssuedAssetRegistry.ts` | 7 XRPL IOU asset definitions | Pre-existing |
| `xrplTrustlineRegistry.ts` | 3 XRPL trustlines | Pre-existing |
| `xrplNftForensicsRegistry.ts` | NFT forensics audit | Pre-existing — EMPTY (all burned) |
| `stellarEcosystemRegistry.ts` | Stellar profiles | Pre-existing |
| `troptionsEcosystemRegistry.ts` | 8 brand entities | Pre-existing |
| `xrplGenesisWalletRegistry.ts` | Post-compromise wallet structure | **NEW (this build)** |
| `xrplMptRegistry.ts` | XLS-33 MPT definitions | **NEW (this build)** |
| `xrplNftGenesisRegistry.ts` | XLS-20 NFT collection specs | **NEW (this build)** |

### 7.2 Public Files

| File | Purpose |
|------|---------|
| `public/troptions-genesis.json` | IPFS-ready genesis manifest |
| `public/troptions-capabilities.json` | Platform capability manifest |
| `public/troptions-knowledge.json` | Knowledge base |
| `public/troptions-entity-map.json` | Entity relationship map |
| `public/troptions-proof-index.json` | Proof registry |

---

## 8. Pre-Live Requirements (Complete Before Any Mainnet Operation)

### Legal and Compliance Gates

| # | Gate | Applies To | Priority |
|---|------|-----------|---------|
| 1 | Securities counsel Howey test analysis for TUT (MPT) | TUT MPT, Genesis Stake NFT | **Critical** |
| 2 | Board authorization (Bryan Stone / FTH Trading) | All token issuance | **Critical** |
| 3 | ATS / exchange licensing review | Troptions Xchange | **Critical** |
| 4 | Real estate brokerage review | Real Estate Connections | High |
| 5 | FCC media compliance review | Troptions TV Network | High |
| 6 | CFTC/SEC/state utility review for REC NFT | Green-N-Go Solar | High |
| 7 | PETRO trustline high-risk review | PETRO asset (tl-3) | Medium |
| 8 | HOTRCW model confirmation + MSB review | HOTRCW | Medium |
| 9 | XLS-33 Amendment verification on XRPL mainnet | TUT MPT | Pre-requisite |

### Technical Gates

| # | Gate | Action Required |
|---|------|----------------|
| 1 | 8 fresh per-brand XRPL wallets | Generate via Xumm or hardware wallet |
| 2 | Stellar accounts funded (3 × min 1 XLM) | Fund from operating account |
| 3 | IPFS genesis hash recomputed | `cargo run --bin genesis-export` → recompute hash |
| 4 | IPFS genesis pinned | Pin via Pinata/web3.storage, update CID in manifest |
| 5 | Stellar.toml configured | Add to TROPTIONS.ORG/.well-known/ |
| 6 | Testnet validation for all NFT/MPT mints | XRPL testnet + Stellar testnet |

### Operational Gates

| # | Gate | Action Required |
|---|------|----------------|
| 1 | Custody arrangement for XRPL wallets | Hardware wallet (Ledger/Trezor) or MPC custody |
| 2 | Key ceremony for new wallets | Document seed phrases in secure cold storage |
| 3 | Incident response plan update | Document compromise forensics, upgrade to new security model |
| 4 | Insurance / bonding review | Commercial crime policy covering digital asset theft |

---

## 9. Codebase Change Summary (This Build)

### New Rust Files

- `troptions-rust-l1/crates/brands/Cargo.toml`
- `troptions-rust-l1/crates/brands/src/lib.rs` (8 brand entity types + functions)
- `troptions-rust-l1/crates/genesis/Cargo.toml`
- `troptions-rust-l1/crates/genesis/src/lib.rs` (genesis manifest builder + hash)

### Updated Rust Files

- `troptions-rust-l1/Cargo.toml` — added `crates/brands` and `crates/genesis` to workspace

### New TypeScript Files

- `src/content/troptions/xrplGenesisWalletRegistry.ts`
- `src/content/troptions/xrplMptRegistry.ts`
- `src/content/troptions/xrplNftGenesisRegistry.ts`

### New Public Files

- `public/troptions-genesis.json`

### New Docs

- `docs/TROPTIONS-GENESIS-BUILD.md` (this file)

### Test Results

```
cargo test -p tsn-brands -p tsn-genesis
    tsn-brands: 8/8 PASS
    tsn-genesis: 10/10 PASS
```

---

## 10. Architecture Summary

```
                    ┌──────────────────────────────────┐
                    │  TROPTIONS Settlement Network     │
                    │        Genesis State              │
                    └──────────────┬───────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
    ┌──────┴──────┐        ┌───────┴──────┐        ┌──────┴──────┐
    │  Rust L1    │        │  TypeScript  │        │  Public     │
    │  26 crates  │        │  Platform    │        │  IPFS       │
    │  SIMULATION │        │  Next.js 15  │        │  Manifest   │
    └──────┬──────┘        └───────┬──────┘        └──────┬──────┘
           │                       │                       │
    ┌──────┴──────┐        ┌───────┴──────┐        ┌──────┴──────┐
    │ tsn-brands  │        │ 8 content    │        │ troptions-  │
    │ tsn-genesis │        │ registries   │        │ genesis.json│
    └─────────────┘        └─────────────┘        └─────────────┘
           │
    ┌──────┴───────────────────────────────────────────┐
    │              Multi-Chain Layer                    │
    ├──────────────┬──────────────┬────────────────────┤
    │    XRPL      │   Stellar    │   Polygon          │
    │  2 safe      │  3 accounts  │  4 live contracts  │
    │  wallets     │  not funded  │                    │
    │  8 pending   │  SIMULATION  │  LIVE              │
    └──────────────┴──────────────┴────────────────────┘
```

---

*This document is informational infrastructure only. Nothing herein constitutes a financial offer, investment solicitation, securities issuance, or regulatory approval. All system capabilities are subject to legal review, licensing, KYC/KYB, AML, custody approval, and board authorization before any live execution may occur.*
