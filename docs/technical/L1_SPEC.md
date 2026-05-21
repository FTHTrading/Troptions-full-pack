# TROPTIONS L1 Specification (v0.1)

## Workspace crates (8)

| Crate | Role |
|-------|------|
| `primitives` | AccountId, AssetId, Amount types |
| `crypto` | Ed25519 signing |
| `state` | Balances, soulbound, settlements, events |
| `runtime` | Transaction execution + atomic rollback |
| `soulbound` | Non-transferable credentials |
| `settlement` | HTLC, time-lock, multi-sig escrows |
| `atomic-router` | Batch / atomic swap builder |
| `rpc` | Query helpers |
| `node` | HTTP JSON-RPC server |

## JSON-RPC (port 9944)

POST `http://127.0.0.1:9944` with body:

```json
{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}
```

### Methods

| Method | Params | Description |
|--------|--------|-------------|
| `state_get` | — | Chain summary (height, counts) |
| `balance_get` | `account`, `asset` (default `NATIVE`) | Account balance |
| `soulbound_get` | `token_id` (hex) | Single credential |
| `soulbound_by_owner` | `owner` (hex account) | All credentials for owner |
| `settlement_get` | `settlement_id` | Escrow record |

### Gaps (honest)

- **Submit / mint RPC** for soulbound and settlement not yet exposed over HTTP (runtime supports ops internally).
- **bridge-xrpl**, **bridge-stellar**, **consensus** BFT — documented targets, not in this 8-crate workspace.
- Production binary path on this machine: `C:\cargo-target-burnzy\release\troptions-node.exe`.

## Python client

`backend/fth-academy/l1_client.py` — `TroptionsL1Client` wrapping the methods above.
