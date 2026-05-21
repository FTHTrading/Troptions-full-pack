---
title: TANTHEM mint DApp — security
layout: default
permalink: /technical/MINT_DAPP_SECURITY.html
---

# TANTHEM mint DApp — security model

**Live DApp:** [https://fthtrading.github.io/Troptions-full-pack/mint.html](https://fthtrading.github.io/Troptions-full-pack/mint.html)

**Source:** `sites/investor/mint.html` (copied to `docs/mint.html` for GitHub Pages)

---

## Core rule: seed never leaves the browser

| Data | Sent to server? | Where it lives |
|------|-----------------|----------------|
| XRPL issuer seed (`s…`) | **Never** | Password field in browser only; used by `xrpl.js` to sign locally |
| Unsigned mint batch | **No** (embedded in page) | Static JSON in `mint.html` |
| Signed transactions | **No** | Submitted from browser directly to XRPL validators via WebSocket |

GitHub Pages serves **static HTML only**. There is no backend that can receive, log, or store a seed.

---

## Operator checklist

1. **Prefer the browser mint DApp** over `scripts/xrpl_mint_ready.py --sign` when possible — avoids seed in shell history or `.env` on shared machines.
2. **Do not** paste seeds into chat, docs, CI, or agent prompts.
3. **Do not** commit `.env`, signed tx dumps, or screenshots containing seeds.
4. Use a **dedicated issuer machine** or air-gapped workflow for production mint.
5. **Clear browser cache** (and close the tab) after minting completes or if you abandon the session.
6. Verify results on [XRPSCAN issuer account](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) before external “collection live” claims.

---

## What the DApp does

1. Loads `xrpl.js` from CDN (`unpkg.com`).
2. Connects to XRPL mainnet via public WebSocket (`wss://xrplcluster.com` or equivalent in page).
3. Reads 703 prepared `NFTokenMint` payloads from embedded `MINT_BATCH`.
4. Signs each transaction **in-browser** with the seed you enter.
5. Submits signed txs to the ledger.

No step sends the seed over HTTP to FTH, GitHub, or Cursor.

---

## Python script (fallback only)

`scripts/xrpl_mint_ready.py` can sign with `XRPL_ISSUER_SEED` in local `.env`. Use only on a hardened host; **never** run via CI or remote agents. Prefer browser mint for seed safety.

---

## Honest status labels

| Step | Label |
|------|--------|
| IPFS audio + manifest | **PROVEN** |
| L1 collection hash anchor | **PROVEN** (`TROPTIONS_L1_ANCHOR_CONFIRMED.json`) |
| Mint DApp deployed | **LIVE** (static; user must sign) |
| 703 NFTs on XRPL mainnet | **PENDING** until XRPSCAN shows issuer `NFToken` entries |

---

## Related

- [TANTHEM_NFT_COLLECTION.md](TANTHEM_NFT_COLLECTION.html)
- [XRPL_NFT_MINT_RUNBOOK.md](XRPL_NFT_MINT_RUNBOOK.html)
- [NFT gallery](https://fthtrading.github.io/Troptions-full-pack/nft/)
