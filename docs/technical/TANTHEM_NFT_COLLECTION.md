---
title: TANTHEM — XRPL NFT collection
layout: default
permalink: /technical/TANTHEM_NFT_COLLECTION.html
---

# TANTHEM — TROPTIONS Anthem NFT collection (XRPL)

**Status labels:** IPFS audio **PROVEN** (pinned CIDs). XRPL mint batch **PREPARED** — not live on ledger until the operator signs and submits locally.

**Not legal advice.** Supply figures and benefits are product design in-repo; on-chain state is authoritative after mint.

---

## Collection summary

| Field | Value |
|-------|--------|
| **Symbol** | `TANTHEM` |
| **Collection name** | TROPTIONS Anthem — Mainframe Explode |
| **Issuer** | [`rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ`](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) |
| **Total supply** | 703 NFTs (6 tiers) |
| **Transfer fee** | 2.5% (2500 basis points on XRPL `TransferFee`) |
| **IPFS manifest** | [`Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7`](https://ipfs.io/ipfs/Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7) |
| **Mint batch file** | `XRPL_MINT_BATCH.json` (703 unsigned `NFTokenMint` transactions) |

---

## Rarity tiers

| Tier | Supply | Track / edition | IPFS CID (animation) |
|------|--------|-----------------|----------------------|
| **LEGENDARY** | 5 | Official TROPTIONS song (`troptions-theme-primary.mp3`) | [`QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb`](https://ipfs.io/ipfs/QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb) |
| **EPIC** | 22 | 22 Years narrative (`troptions-anthem-22-years.mp3`) | [`Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV`](https://ipfs.io/ipfs/Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV) |
| **RARE** | 50 | Latest master cut (`troptions-anthem-mainframe-152254.mp3`) | [`QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def`](https://ipfs.io/ipfs/QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def) |
| **UNCOMMON** | 100 | Alternate studio mix (`troptions-theme-alt.mp3`) | [`QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A`](https://ipfs.io/ipfs/QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A) |
| **COMMON** | 500 | Session edit (`troptions-anthem-151853.mp3`) | [`QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj`](https://ipfs.io/ipfs/QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj) |
| **SPECIAL** | 26 | ElevenLabs Charlie AI voice (`troptions-anthem-elevenlabs-charlie.mp3`) | [`QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV`](https://ipfs.io/ipfs/QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV) |

Canonical machine-readable tier table: `TROPTIONS_NFT_RARITY_MANIFEST.json` (repo root).

---

## Mint status (honest)

| Step | Status | Notes |
|------|--------|--------|
| Audio pinned to IPFS | **PROVEN** | Six tracks + manifest; see [`assets/audio/README.md`](assets/audio/README.html) |
| Unsigned mint batch built | **PREPARED** | `XRPL_MINT_BATCH.json` — no `TxnSignature` in repo |
| Signed + submitted to XRPL mainnet | **PENDING** | Operator-only; **never** commit seeds or signed secrets |
| Operator runbook | **READY** | [`XRPL_NFT_MINT_RUNBOOK.md`](XRPL_NFT_MINT_RUNBOOK.html) — Bryan / custody holder |

### Operator mint (local only)

Full steps: **[`XRPL_NFT_MINT_RUNBOOK.md`](XRPL_NFT_MINT_RUNBOOK.html)**.

From repo root, on an offline or air-gapped machine if possible:

```bash
# Preferred: seed in local .env only (see .env.example XRPL_ISSUER_SEED)
python scripts/xrpl_mint_ready.py --sign
```

- Set `XRPL_ISSUER_SEED` in **local** `.env` (never committed) or pass `--sign` only on a hardened host — **not** in git, docs, or CI.
- This repository documents addresses and unsigned batches only; **no XRPL family seeds** are stored here.
- After submission, verify NFTs on [XRPSCAN issuer account](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) before external claims of a live collection.

---

## Related files

| File | Purpose |
|------|---------|
| `TROPTIONS_IPFS_CIDS.json` | Filename → CID map |
| `TROPTIONS_ANTHEM_COMPLETE_DELIVERABLE.md` | Delivery checklist |
| `scripts/xrpl_mint_ready.py` | Sign/submit helper (unsigned batch in repo) |
| `docs/technical/XRPL_NFT_MINT_RUNBOOK.md` | Operator mint + verification checklist |
| `scripts/xrpl_nft_rarity.py` | Tier design generator |
| [`PROOF_FOR_COUNTERPARTIES.md`](counterparty/PROOF_FOR_COUNTERPARTIES.html) | Diligence index |
