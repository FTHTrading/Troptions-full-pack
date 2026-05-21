# TROPTIONS Full DAO — Architecture

## Decision: hybrid L1-native + Python orchestration

| Layer | Location | Role |
|-------|----------|------|
| **Canonical state** | `l1/crates/governance` + `state` | Proposals, soulbound-weighted votes, timelock, namespace registry |
| **RPC** | `l1/crates/rpc` + node `:9944` | Query + `submit_*` for mint, namespace, proposal lifecycle |
| **Orchestration** | `dao/governance`, `dao/treasury`, `dao/registry` | Business rules, multi-chain treasury view, member bridge |
| **HTTP API** | `backend/fth-academy` (`/dao/*`) + `backend/dao-service` (`:8093`) | Dashboard + WebSockets |
| **Persistence** | `backend/shared/dao_db.py` | SQLite mirror + audit log (Postgres-ready) |
| **UI** | `frontends/dao-dashboard` | Proposals, votes, treasury, L1 live panel |

## Why not Polygon-only Governor?

KENNY/EVL on Polygon can use Timelock/Governor stubs (`dao/contracts/`) for escrowed on-chain votes, but **identity and quorum** anchor on L1 soulbound credentials from the 8 genesis brand issuers. That yields sovereignty without forcing every vote through EVM gas.

## Proposal lifecycle

```
draft → active → passed|failed → [timelock] → executed
```

- **Votes**: weight = count of non-revoked soulbound tokens held by voter
- **Quorum**: 10% of active credentials (configurable in `governance` crate)
- **Timelock**: 720 blocks after pass before `submit_proposal_execute`

## Service ports

| Service | Port |
|---------|------|
| L1 node | 9944 |
| DONK | 8090 |
| FTH Academy (includes `/dao/*`) | 8091 |
| TTN | 8092 |
| DAO dashboard API | 8093 |

## Data flow

```
dao-dashboard → dao-service:8093 → l1_client → L1:9944
              ↘ fth-academy:8091/dao/* (enrollment + credentials)
TTN namespaces → registry bridge → submit_namespace_register
```

See `docs/DAO.md` for operator runbook.
