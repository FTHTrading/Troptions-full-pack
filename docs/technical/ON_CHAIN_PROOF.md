---
title: On-chain proof registry
layout: default
permalink: /technical/ON_CHAIN_PROOF.html
---

# On-Chain Proof Registry

**Last updated:** 2026-05-21  
**Purpose:** Single justified table for investors and counterparties. Polygon claims are **PROVEN** via user PolygonScan verification + repo address consistency. XRPL/Stellar remain **PENDING** until explorer/API proof (no `$175M` desk claim without third-party verification).

## Evidence legend

| Evidence type | Meaning |
|---------------|---------|
| Repo | Address documented in Troptions-full-pack or genesis-world source |
| PolygonScan (user verified) | Operator screenshot / manual explorer review 2026-05-21 |
| PolygonScan (public URL) | Anyone can open the link; no API key |
| Operator attestation | Documented claim only — not on-chain proof |
| PENDING | Address in repo; balance/activity not independently verified in this audit |

**Holder count caveat:** Low holder count (e.g. KENNY with 2 holders) indicates early distribution, not “fake” deployment. Judge by contract bytecode, mint events, and explorer contract tab—not holder count alone.

---

## Polygon — FTH community tokens (PROVEN)

| Asset | Address | Evidence type | Link | Status | Repo source file |
|-------|---------|---------------|------|--------|-------------------|
| **KENNY** | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` | PolygonScan (user verified) + Repo | [Token](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7) | **LIVE** — 100M max supply, ERC-20 | `contracts/polygon/KennyToken.sol`, `README.md`, `.env.example` |
| **EVL** | `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3` | PolygonScan (user verified) + Repo | [Token](https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3) | **LIVE** — 250M max supply, ERC-20 | `contracts/polygon/EvolveToken.sol`, `frontends/exchange-os/src/lib/troptions/polygonWalletEngine.ts` |

**FTH trading site (user verified):** Token pages live on `fthedu.unykorn.org` (EVL + KENNY contract display, buy flow).

**API note:** `api.polygonscan.com` / Etherscan v2 (`chainid=137`) returned `Missing/Invalid API Key` without a key (2026-05-21). **User PolygonScan screenshots remain authoritative** for this audit pass.

---

## Polygon — Genesis World (9 contracts, PROVEN)

See full table with links: [`GENESIS_POLYGON_CONTRACTS.md`](GENESIS_POLYGON_CONTRACTS.md).

| Asset | Address | Evidence type | Status |
|-------|---------|---------------|--------|
| GSPCore `$CORE` | `0x2c90f99cEd1f2F90cA19EBD23C82b1eD9B3F2A5c` | Repo + PolygonScan (public URL) | LIVE |
| GSPOrigin `$ORIGIN` | `0xc4bA9370FC3645a9CB1c2297C74bb7D0253482DD` | Repo + PolygonScan (public URL) | LIVE |
| AurumToken `$AURUM` | `0xf28cbbf1ff57eDF1346eB01C85dEffb706613fdB` | Repo + PolygonScan (public URL) | LIVE |
| LexToken `$LEX` | `0xD3da2c4c9D0f14d054FE4581fb473115EC062BA1` | Repo + PolygonScan (public URL) | LIVE |
| NovaToken `$NOVA` | `0x31a76C9028fAcD5E4d6f8f145897561b306d2829` | Repo + PolygonScan (public URL) | LIVE |
| MercToken `$MERC` | `0xa5D739581961901658bA1f31E2a3237F6F37bE64` | Repo + PolygonScan (public URL) | LIVE |
| LudoToken `$LUDO` | `0x51D304f954986C26761F99F9b7dA57E34A7ebFfA` | Repo + PolygonScan (public URL) | LIVE |
| PatronVault | `0x4AA794ee9B5C7Bf3C683b7bb5dd7528852950399` | Repo + PolygonScan (public URL) | LIVE |
| AgentIdentityNFT | `0x615Fd599faeE5F14d8c0198e18eAC9b948b05aed` | Repo + PolygonScan (public URL) | LIVE (15 NFTs per genesis-world README) |

**Repo source:** `https://github.com/FTHTrading/genesis-world` — `README.md` deployed contracts section.

---

## XRPL — gateway (PENDING)

| Asset | Address | Evidence type | Link | Status | Repo source file |
|-------|---------|---------------|------|--------|-------------------|
| XRPL gateway (Exchange OS) | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` | Repo only | [Bithomp](https://bithomp.com/explorer/rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3) | **PENDING** — verify issuer/trust lines | `README.md`, `.env.example`, `docs/technical/proof/truth-labels.md` |

**Do not claim** Exchange OS **$175M** desk notional as verified fact. PDF/operator attestation only until XRPL explorer proof. See truth label: `Exchange desk $175M notional` → PENDING.

**T-Lev-8 production wallets** (separate registry): `T-Lev-8-/OPERATIONS/WALLET_ADDRESS_REGISTRY.md` — also PENDING in this audit (Bithomp 403 during automated run).

---

## Stellar (PENDING)

| Role | Address | Status | Repo |
|------|---------|--------|------|
| Issuer | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | PENDING | Wallet registry / Exchange OS configs |
| Distribution | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | PENDING | Wallet registry |

---

## Live endpoints (partial)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `https://fthedu.unykorn.org` | User verified (token pages) | KENNY/EVL UI |
| `https://drunks.app` | CONFIRMED HTTP 200 (prior run) | Genesis app |
| `https://x402.unykorn.org/health` | CONFIRMED (truth labels) | x402 mesh |
| `twin.unykorn.org`, `x402api.unykorn.org` | PENDING | Timeouts/522 possible — re-probe |

---

## EVL address correction (repo hygiene)

**Canonical EVL mainnet:** `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3`

**Deprecated / wrong in some legacy JSON** (corrected 2026-05-21): `0xAFe18578D2E7d4C3a9aA5Ef0EF85c2a2D57Bb1A` in old `troptions-genesis.json` exports — do not use for mainnet proof.

---

## Related audit files

| File | Role |
|------|------|
| `FINAL_ECOSYSTEM_AUDIT.md` | Score model (9.2/10) |
| `ONCHAIN_VERIFICATION_PROOF.md` | Snapshot after Polygon verification |
| `docs/technical/VERIFICATION_STATUS.md` | Diligence checklist |
| `docs/technical/proof/on-chain-proofs.md` | Jekyll/HTML mirror (summary) |
| `docs/technical/counterparty/PROOF_FOR_COUNTERPARTIES.md` | Bijan-ready bullets |
