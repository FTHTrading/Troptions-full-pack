# TROPTIONS Sovereign Stack — Operations Runbook

## Service matrix

| PM2 name | Port | Health |
|----------|------|--------|
| troptions-l1-node | 9944 | JSON-RPC `state_get` |
| donk-ai-tutor | 8090 | `/health` |
| fth-backend | 8091 | `/health`, `/health/l1` |
| ttn-launcher | 8092 | `/health` |
| dao-service | 8093 | `/health` |

## Daily health

```powershell
.\scripts\health-check-all.ps1
pm2 status
```

## Recovery: L1 node down

```powershell
pm2 restart troptions-l1-node
# or
cd l1
cargo run -p node -- 9944
```

Verify: `Invoke-RestMethod -Uri http://127.0.0.1:9944 -Method Post -Body '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}' -ContentType application/json`

## Recovery: DAO API down

```powershell
pm2 restart dao-service
pip install -r backend/dao-service/requirements.txt
python backend/dao-service/main.py
```

## Recovery: FTH / DONK import errors

DONK prompt path must be `ai/donk-tutor/system_prompt.py` (fixed in fth-academy `main.py`). Restart:

```powershell
pm2 restart fth-backend donk-ai-tutor
```

## Recovery: full stack (Docker)

```powershell
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

## Logs

| Service | Path |
|---------|------|
| L1 | `logs/troptions-l1-node-*.log` |
| DAO | `logs/dao-service-*.log` |
| PM2 | `pm2 logs` |

## Database

- FTH: `backend/fth-academy/fth_backend.db`
- TTN: `backend/ttn-launcher/ttn_channels.db`
- DAO: `dao/data/dao_state.db`

Backup before upgrades:

```powershell
Copy-Item dao\data\dao_state.db dao\data\dao_state.db.bak
```

## CI

`.github/workflows/dao-ci.yml` — `cargo test --workspace` + Python DAO tests.

## Escalation

1. L1 unreachable → restart node, check port 9944 firewall
2. Proposals fail → voter needs soulbound credential; check `soulbound_by_owner`
3. Treasury stale → on-chain balances require external indexer (Phase 2)
