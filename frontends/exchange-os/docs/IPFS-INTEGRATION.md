# IPFS / Kubo Integration

> Content-addressed evidence layer for the Troptions Settlement Network.

## Overview

This integration connects the Troptions platform to a locally-running [Kubo](https://github.com/ipfs/kubo) IPFS node. It provides:

- **File / JSON upload** → IPFS CID
- **Local pinning** so content is not garbage-collected
- **CID verification** to confirm a file's content has not changed
- **Evidence registry** data model linking documents to CIDs for funding packets, legal docs, token metadata, XRPL/Stellar proofs, and RWA assets

The CID becomes an immutable proof fingerprint:

```
Document → IPFS CID → stored in database/ledger → proof that file content did not change
```

---

## Security Boundaries

```
┌──────────────────────────────────────────────────────┐
│  SAFE (local-only)                                   │
│    RPC API   → http://127.0.0.1:5001  (admin)        │
│    Gateway   → http://127.0.0.1:8080  (read-only)    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  DANGEROUS — NEVER DO THESE                          │
│    Bind 5001 to 0.0.0.0                              │
│    Expose 5001 via Cloudflare tunnel                 │
│    Expose 5001 via nginx/caddy reverse proxy         │
│    Expose 5001 via public IP                         │
└──────────────────────────────────────────────────────┘
```

The RPC API (port 5001) can **add, pin, configure, and shut down** your node. Only `127.0.0.1` access is acceptable.

If you need public access to IPFS content:
- Use a **pinning service** (Pinata, Web3.Storage, nft.storage) and only expose the HTTPS gateway they provide
- Or run a **read-only IPFS gateway** separately from the admin API

---

## Local Kubo Setup

### 1. Install Kubo

Download from [dist.ipfs.tech](https://dist.ipfs.tech/#kubo) or install via Chocolatey:

```powershell
choco install ipfs
```

### 2. Initialise the node (first time)

```powershell
ipfs init
```

### 3. Start the daemon

```powershell
ipfs daemon
```

Expected output:

```
Initializing daemon...
API server listening on /ip4/127.0.0.1/tcp/5001
WebUI: http://127.0.0.1:5001/webui
Gateway server listening on /ip4/127.0.0.1/tcp/8080
Daemon is ready
```

### 4. Verify node identity

```powershell
ipfs id
ipfs swarm peers
ipfs repo stat
```

### 5. Enable the integration

Add to `.env.local`:

```env
IPFS_LOCAL_ENABLED=true
IPFS_RPC_URL=http://127.0.0.1:5001
IPFS_GATEWAY_URL=http://127.0.0.1:8080
```

When `IPFS_LOCAL_ENABLED` is not `true`, all service methods return safe no-op responses and the dashboard shows a disabled state.

---

## Evidence CID Workflow

```
1. Select a document (PDF, JSON, photo, etc.)
2. Call ipfsAddJson / ipfsAddBuffer  →  CID returned
3. Optionally compute SHA-256 of the original file
4. Create an EvidenceRecord  →  store in your database
5. CID + SHA-256 together prove the file content did not change
6. ipfsPin(cid)  →  content survives garbage collection
7. Share ipfs://{cid} as the proof fingerprint
```

### Example — pin the genesis manifest

```powershell
# Add the genesis manifest
ipfs add public/troptions-genesis.json
# Output: added Qm... troptions-genesis.json

# Pin it
ipfs pin add Qm...

# Verify
ipfs pin ls --type=recursive
```

Then store the CID in `public/troptions-genesis.json` under `genesis_hash` / `ipfs_cid`.

---

## API Routes

| Method | Path              | Description                                       |
|--------|-------------------|---------------------------------------------------|
| GET    | `/api/ipfs/health` | Node health check (peer ID, repo stats, peer count) |
| POST   | `/api/ipfs/add`    | Add JSON content, returns CID + gateway URL       |
| GET    | `/api/ipfs/pin?cid=<CID>` | Check if a CID is pinned locally         |
| POST   | `/api/ipfs/pin`    | Pin a CID locally                                 |

All routes return `503` when `IPFS_LOCAL_ENABLED` is not `true`.

---

## Evidence Record Model

```ts
interface EvidenceRecord {
  id: string;            // UUID
  title: string;
  category: EvidenceCategory;
  sourceFileName: string;
  cid: string;           // CIDv0 or CIDv1
  ipfsUri: string;       // ipfs://{cid}
  localGatewayUrl: string; // http://127.0.0.1:8080/ipfs/{cid}
  sha256?: string;       // hex digest of original file
  pinned: boolean;
  createdAt: string;     // ISO 8601
  notes?: string;
  status: "draft" | "verified" | "archived";
}
```

### Categories

`funding-packet`, `lender-evidence`, `asset-photo`, `inspection-report`, `legal-doc`, `token-metadata`, `xrpl-proof`, `stellar-proof`, `polygon-proof`, `apostle-proof`, `rwa-asset`, `kyc-aml`, `compliance-filing`, `genesis-manifest`, `other`

---

## Dashboard Components

| Component           | Location                                     | Purpose                               |
|---------------------|----------------------------------------------|---------------------------------------|
| `IpfsNodeHealth`    | `src/components/troptions/IpfsNodeHealth.tsx` | Live node status, peer count, repo stats |
| `EvidenceTable`     | `src/components/troptions/EvidenceTable.tsx`  | Evidence records with copy-CID / copy-ipfs:// / open-gateway actions |
| `IpfsDashboard`     | `src/components/troptions/IpfsDashboard.tsx`  | Full panel: health + table + pinned CID list |

---

## Future Options — Filecoin / Pinning Services

For production persistence (beyond local Kubo):

### Pinata

```powershell
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" `
  -H "Authorization: Bearer $PINATA_JWT" `
  -F "file=@public/troptions-genesis.json"
```

### web3.storage / nft.storage

Both accept CIDs pinned locally and replicate to Filecoin for long-term storage.

### Workflow

```
Local Kubo (development/testing)
  └→ Pinata / Web3.Storage (production pinning)
       └→ Filecoin (long-term archival)
```

The `ipfs://` CID never changes regardless of which service hosts it — that's the point.

---

## Files Created

```
src/lib/troptions/ipfsService.ts           — Kubo RPC service module
src/lib/troptions/ipfsEvidenceRegistry.ts  — EvidenceRecord types + helpers
src/app/api/ipfs/health/route.ts           — GET health
src/app/api/ipfs/add/route.ts              — POST add
src/app/api/ipfs/pin/route.ts              — GET/POST pin
src/components/troptions/IpfsNodeHealth.tsx
src/components/troptions/EvidenceTable.tsx
src/components/troptions/IpfsDashboard.tsx
src/__tests__/troptions/ipfsIntegration.test.ts
docs/IPFS-INTEGRATION.md                   — this file
```
