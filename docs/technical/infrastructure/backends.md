---
layout: default
title: Backends
permalink: /infrastructure/backends/
---

# Backends (`backend/`)

| Service | Port | Path | Role |
|---------|------|------|------|
| **fth-academy** | 8091 | [`backend/fth-academy/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/backend/fth-academy) | Courses, Stripe, `/dao/*`, L1 client |
| **ttn-launcher** | 8092 | [`backend/ttn-launcher/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/backend/ttn-launcher) | Channel / namespace registry |
| **dao-service** | 8093 | [`backend/dao-service/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/backend/dao-service) | DAO API, WebSocket hub, settlement gateway |
| **shared** | — | [`backend/shared/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/backend/shared) | `dao_db`, `ws_hub`, models |

## DAO light client

`dao-service` polls L1 for proposals, votes, and treasury balances. Governance logic also lives in [`dao/governance/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/dao/governance).

## Settlement API

Authenticated settlement submit forwards signed operations to L1:

- [`settlement_api.py`](https://github.com/fthtrading/Troptions-full-pack/blob/main/backend/dao-service/settlement_api.py)
- [`settlement_router.py`](https://github.com/fthtrading/Troptions-full-pack/blob/main/backend/dao-service/settlement_router.py)

**Dev note:** When `SETTLEMENT_API_KEYS` is unset, submit allows local dev (documented in `UPGRADE_REPORT.md`). Production must set comma-separated `key_id:secret` pairs.

## Health

```powershell
.\scripts\health-check-all.ps1
```

Tests: `python -m pytest tests/backend tests/dao -q`
