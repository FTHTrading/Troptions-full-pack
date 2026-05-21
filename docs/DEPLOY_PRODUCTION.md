# Production deployment (Docker)

One-command deploy for the sovereign Python/Rust stack behind nginx. Exchange OS is **not** included in this compose file — run it separately (`frontends/exchange-os`).

## Prerequisites

- Docker Desktop or Docker Engine + Compose v2
- Ports available: **9944**, **8090–8093**, **80**, **443** (nginx), **11434** (Ollama), **6333** (Qdrant)
- Repo cloned: https://github.com/FTHTrading/Troptions-full-pack

## One command

**Windows (PowerShell):**

```powershell
cd Troptions-full-pack
.\scripts\deploy-production.ps1
```

**Linux / macOS:**

```bash
cd Troptions-full-pack
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

The script:

1. Verifies `docker` and `docker compose`
2. Copies `.env.example` → `.env` only if `.env` is missing (never overwrites)
3. Runs `docker compose -f docker/docker-compose.prod.yml up -d --build`
4. Waits for L1 `state_get` on `:9944`
5. Probes backend `/health` endpoints

## Compose services

| Service | Image/build | Host port |
|---------|-------------|-----------|
| `l1` | Rust node from `l1/` | 9944 |
| `ollama` | ollama/ollama | 11434 |
| `qdrant` | qdrant/qdrant | 6333 |
| `donk-tutor` | `ai/donk-tutor` | 8090 |
| `fth-academy` | `backend/fth-academy` | 8091 |
| `ttn-launcher` | `backend/ttn-launcher` | 8092 |
| `dao-service` | `backend/dao-service` | 8093 |
| `nginx` | alpine + `infrastructure/nginx/` | 80, 443 |

File: `docker/docker-compose.prod.yml`

## Environment

Root `.env` (from `.env.example`) supplies RPC URLs, Stripe keys, Polygon/XRPL addresses, etc. Fill before any public-facing host.

## nginx hostnames

Configured in `infrastructure/nginx/sites/troptions.conf`:

| Host | Upstream |
|------|----------|
| `fthedu.unykorn.org` | fth-academy:8091 |
| `ai.troptions.org` | donk-tutor:8090 |
| `ttn.troptions.org` | ttn-launcher:8092 |
| `dao.troptions.org` | dao-service:8093 |

## TLS / SSL (optional)

```powershell
.\scripts\deploy-production.ps1 -Ssl
```

```bash
./scripts/deploy-production.sh --ssl
```

These flags **document** certbot/Let's Encrypt steps only; they do not obtain certificates automatically.

Typical flow:

1. Point DNS A/AAAA records to the server
2. Run compose with HTTP nginx first
3. `certbot certonly --webroot` (or DNS challenge)
4. Mount `/etc/letsencrypt` into the nginx container and add `listen 443 ssl` server blocks

## Post-deploy verification

| Check | URL |
|-------|-----|
| L1 RPC | `POST http://127.0.0.1:9944` body `{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}` |
| DONK | http://127.0.0.1:8090/health |
| FTH | http://127.0.0.1:8091/health |
| TTN | http://127.0.0.1:8092/health |
| DAO | http://127.0.0.1:8093/health |

```powershell
.\scripts\health-check-all.ps1
```

## Operations

```bash
docker compose -f docker/docker-compose.prod.yml ps
docker compose -f docker/docker-compose.prod.yml logs -f dao-service
docker compose -f docker/docker-compose.prod.yml down
```

## PM2 alternative (dev / bare metal)

For local demos without Docker:

```powershell
.\scripts\quickstart.ps1
```

Uses **`ecosystem.config.js`** at repo root (not `scripts/pm2.config.js`).

## Related docs

- `docs/BRYAN_STATUS.md` — verified path table
- `docs/RUNBOOK.md` — PM2 service matrix
- `docs/LOOM_DEMO_SCRIPT.md` — partner demo outline
