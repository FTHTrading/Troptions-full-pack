# Phase 20 — Genesis Hash Lock + IPFS Pin

> Completed: 2026-04-27  
> Commit range: d9888a7 → (this phase)  
> Status: **SIMULATION ONLY — no live execution**

---

## What Was Locked

The Phase 20 lock produces three artefacts:

| File | Purpose |
|------|---------|
| `public/troptions-genesis.locked.json` | Canonical, key-sorted genesis manifest with embedded SHA-256 hash |
| `public/troptions-genesis-release.json` | Release record: commit, hash, IPFS CID, safety attestation |
| `public/troptions-genesis.json` | Source manifest updated with `genesis_hash` + `ipfs_cid` |

The locked manifest is the definitive, pinned version. It contains:
- All 8 brand entities (troptions-org, troptions-xchange, troptions-unity-token, troptions-university, troptions-tv-network, real-estate-connections, green-n-go-solar, hotrcw)
- XRPL wallet registry (post-compromise mapping, active issuer + treasury, 7 pending-generation wallet slots)
- Stellar accounts (generated, not funded, activation steps defined)
- Polygon observer registrations
- Apostle Chain integration spec
- MPT definition for TUT (XLS-33, spec-only)
- 8 NFT collection specs (XLS-20, all spec-only)
- Issued assets registry (all `live_execution_allowed: false`)
- Trustline registry
- Governance model

---

## How the Canonical Hash Was Generated

```
1. Load public/troptions-genesis.json as JSON
2. Remove mutable fields:
      genesis_hash
      _note_genesis_hash
      ipfs_cid
      _note_ipfs_cid
      lock_timestamp
3. Recursively sort all object keys (deep canonical sort)
4. JSON.stringify(sortedObject)  — no whitespace
5. SHA-256(UTF-8 bytes of step 4)  → lowercase hex
```

The key sort ensures that the hash is deterministic regardless of the original field ordering in the source file.

To recompute manually with Node.js:

```js
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function canonicalize(v) {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(canonicalize);
  const s = {};
  for (const k of Object.keys(v).sort()) s[k] = canonicalize(v[k]);
  return s;
}

const doc = JSON.parse(readFileSync("public/troptions-genesis.locked.json", "utf8"));
const { genesis_hash, lock_timestamp, ...rest } = doc;
const canonical = JSON.stringify(canonicalize(rest));
const hash = createHash("sha256").update(canonical, "utf8").digest("hex");
console.log(hash);   // must match genesis_hash in the file
```

---

## What the IPFS CID Proves

The CID is the content address of `troptions-genesis.locked.json` on IPFS. It proves:

- The **exact bytes** of the locked manifest were present at the time of pinning
- The file has not been silently modified (any change produces a different CID)
- The CID can be independently verified by any IPFS node worldwide
- The genesis hash embedded in the CID-pinned file was computed deterministically from the manifest contents

---

## What the IPFS CID Does NOT Prove

- It does **not** prove legal authority to operate a settlement network
- It does **not** prove that any XRPL, Stellar, Polygon, or Apostle Chain transactions occurred
- It does **not** prove that any wallet has been funded or any asset has been issued
- It does **not** prove regulatory approval, licensing, or compliance sign-off
- It does **not** mean the manifest content is legally binding
- It does **not** mean the network is live — `simulation_only: true` throughout

---

## Why This Remains Simulation-Only

Every field in the genesis manifest and release record carries `simulation_only: true` and `live_execution_enabled: false`. The safety attestation in `troptions-genesis-release.json` explicitly records:

```json
"safety_attestation": {
  "simulation_only": true,
  "live_execution_enabled": false,
  "live_minting_performed": false,
  "live_settlement_performed": false,
  "bridge_execution_performed": false,
  "private_keys_generated": false,
  "wallets_funded": false,
  "nfts_minted": false,
  "mpt_assets_created": false,
  "stablecoins_issued": false,
  "xrpl_transactions_submitted": false,
  "stellar_transactions_submitted": false
}
```

Transitioning to live execution requires:
1. Legal review and board authorization
2. Regulatory licensing (broker-dealer, MSB, and/or applicable licenses)
3. KYC/KYB onboarding for all participants
4. Wallet key ceremony for the 7 pending-generation wallet slots
5. Securities counsel review for TUT (XLS-33 MPT)
6. Funded XRPL and Stellar accounts on mainnet
7. Separate phase authorization gate

---

## How to Verify the Hash Locally

```powershell
cd C:\Users\Kevan\troptions
npm run genesis:validate
```

Expected output: `✅  All validation checks passed.`

Or manually:

```powershell
# Check the release record
Get-Content public/troptions-genesis-release.json | ConvertFrom-Json | Select-Object genesis_hash, ipfs_cid, simulation_only, live_execution_enabled

# Verify hash matches locked file
node -e "
const {createHash}=require('crypto');
const {readFileSync}=require('fs');
function c(v){if(v===null||typeof v!=='object')return v;if(Array.isArray(v))return v.map(c);const s={};for(const k of Object.keys(v).sort())s[k]=c(v[k]);return s;}
const d=JSON.parse(readFileSync('public/troptions-genesis.locked.json','utf8'));
const {genesis_hash,lock_timestamp,...r}=d;
const h=createHash('sha256').update(JSON.stringify(c(r)),'utf8').digest('hex');
console.log('Stored: ',genesis_hash);
console.log('Computed:',h);
console.log('Match:   ',h===genesis_hash);
"
```

---

## How to View the File Through the Local Gateway

```powershell
# List pinned CIDs
ipfs pin ls --type=recursive

# Read the file via IPFS CLI
ipfs cat <CID>

# Open in browser (local gateway)
Start-Process "http://127.0.0.1:8080/ipfs/<CID>"
```

The local gateway URL is also recorded in `public/troptions-genesis-release.json` under `local_gateway_url`.

---

## Why Kubo RPC Must Remain Private

The Kubo RPC API (port 5001) has **admin-level access** to your IPFS node:

- It can add, delete, and pin arbitrary content
- It can reconfigure the node
- It can shut down the daemon
- There is **no authentication** on the RPC port by default

**Never:**
- Bind port 5001 to `0.0.0.0` or any public IP
- Expose port 5001 through Cloudflare Tunnel, nginx, caddy, or any reverse proxy
- Add `IPFS_RPC_URL` to Vercel environment variables or any cloud hosting env

The `phase20-genesis-lock.mjs` script and `src/lib/troptions/ipfsService.ts` both hard-abort if `IPFS_RPC_URL` is set to a non-localhost address.

For production pinning of content (not admin operations), use a pinning service:
- [Pinata](https://www.pinata.cloud/) — HTTPS API, no port 5001
- [web3.storage](https://web3.storage/) — Filecoin-backed, no port 5001
- [nft.storage](https://nft.storage/) — free for NFT metadata

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run genesis:lock` | Run Phase 20 lock (Kubo must be running) |
| `npm run genesis:validate` | Verify all Phase 20 artefacts are consistent |

---

## Files Changed by Phase 20

```
scripts/phase20-genesis-lock.mjs          — lock script
scripts/validate-phase20.mjs              — validation script
public/troptions-genesis.json             — genesis_hash + ipfs_cid updated
public/troptions-genesis.locked.json      — new: canonical locked manifest
public/troptions-genesis-release.json     — new: release record with CID
docs/PHASE20-GENESIS-HASH-IPFS-LOCK.md   — this file
```
