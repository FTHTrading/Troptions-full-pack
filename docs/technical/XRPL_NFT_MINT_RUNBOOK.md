---
title: XRPL NFT mint runbook (TANTHEM)
layout: default
permalink: /technical/XRPL_NFT_MINT_RUNBOOK.html
---

# XRPL NFT mint runbook — TANTHEM (operator: Bryan)

**Audience:** Operator with custody of the XRPL production issuer key.  
**Security:** This repo never stores XRPL family seeds. Agents and CI must not read Desktop files, run `--sign`, or paste seeds into chat or git.

---

## Issuer (public only)

| Field | Value |
|-------|--------|
| **Role** | Production issuer / TANTHEM minter |
| **Address** | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` |
| **Explorer** | [XRPScan — issuer account](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) |

Confirmed in [`ON_CHAIN_PROOF.md`](ON_CHAIN_PROOF.html), [`TANTHEM_NFT_COLLECTION.md`](TANTHEM_NFT_COLLECTION.html), and external registry `T-Lev-8-/OPERATIONS/WALLET_ADDRESS_REGISTRY.md` (addresses only).

---

## Prerequisites

1. **Repo** cloned at a trusted path (e.g. `Troptions-full-pack`).
2. **Python 3.10+** with dependencies for XRPL signing when signing is implemented (`xrpl-py` recommended for production).
3. **Issuer seed** from your secure store only (Coldcard backup, Xaman, hardware wallet export workflow, or password manager) — **not** from this repository, Desktop text files, or chat history.
4. **Issuer XRP balance** sufficient for 703 × mint fees (batch uses `Fee: "12"` drops per tx in `XRPL_MINT_BATCH.json`; fund issuer per [`WALLET_ADDRESS_REGISTRY`](https://github.com/fthtrading/T-Lev-8-) notes if under-reserved).
5. **Unsigned batch present:** `XRPL_MINT_BATCH.json` — **703** unsigned `NFTokenMint` transactions, no `TxnSignature`, empty `SigningPubKey`.

---

## Local environment (seed never in git)

1. Copy `.env.example` → `.env` (local only; `.env` is gitignored).
2. Set the placeholder (empty in repo):

   ```bash
   # .env — local machine only
   XRPL_ISSUER_SEED=
   ```

   Paste the issuer family seed **only** into your local `.env` on the signing machine. Do not commit `.env`.

3. Optional: load env before commands:

   ```powershell
   # PowerShell — example; use your own secret injection method
   Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { Set-Item -Path "env:$($matches[1])" -Value $matches[2] } }
   ```

---

## Inspect batch (safe, no secrets)

From repository root:

```bash
python scripts/xrpl_mint_ready.py --show
```

Review tier counts against `TROPTIONS_NFT_RARITY_MANIFEST.json` (703 total, 6 tiers).

---

## Sign and submit (operator machine only)

> **Warning:** `--sign` and `XRPL_ISSUER_SEED` expose the family seed in process memory and shell history. Prefer an air-gapped or dedicated signing host. Rotate the key if exposure is suspected.

**Option A — environment variable (preferred):**

```bash
# Seed loaded from local .env or secure enclave — never echo or log
python scripts/xrpl_mint_ready.py --sign
```

When `--sign` is passed with no value, the script reads `XRPL_ISSUER_SEED` from the environment.

**Option B — explicit CLI (discouraged; appears in shell history):**

```bash
python scripts/xrpl_mint_ready.py --sign YOUR_SEED_HERE
```

**Current tooling note:** As of this runbook, `scripts/xrpl_mint_ready.py` documents signing; full broadcast may require `xrpl-py` or Xaman manual sign of each prepared tx. Treat [`TANTHEM_NFT_COLLECTION.md`](TANTHEM_NFT_COLLECTION.html) mint table as **PENDING** until explorer shows NFTs on the issuer account.

---

## Post-mint verification

1. Open [XRPScan issuer account](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ).
2. Confirm **NFTs** tab (or NFToken offers) shows **703** minted items for collection taxons 1–6.
3. Spot-check URI hex decodes to `ipfs://…` CIDs listed in [`assets/audio/README.md`](assets/audio/README.html).
4. Update internal status: set mint row to **PROVEN** in `TANTHEM_NFT_COLLECTION.md` only after explorer confirmation.
5. Do **not** commit signed blobs, seeds, or `TxnSignature`-filled batch exports to git.

---

## Related artifacts

| File | Purpose |
|------|---------|
| `XRPL_MINT_BATCH.json` | 703 unsigned mint txs |
| `TROPTIONS_NFT_RARITY_MANIFEST.json` | Tier supply table |
| `scripts/xrpl_mint_ready.py` | Overview / prepare / sign entrypoint |
| `docs/technical/TANTHEM_NFT_COLLECTION.md` | Collection spec + honest mint status |

---

## If something goes wrong

- **Wrong sequence:** Re-fetch issuer sequence from XRPL, regenerate batch with `python scripts/xrpl_mint_ready.py --prepare --sequence <n>` (operator only).
- **Partial submit:** Record last successful sequence; do not reuse consumed sequence numbers.
- **Suspected seed leak:** Stop minting, rotate issuer per your key ceremony; never paste seeds into issues, PRs, or agent chats.
