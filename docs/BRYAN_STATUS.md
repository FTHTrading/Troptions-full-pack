# Bryan status — verified paths (single source of truth)

Last reconciled against repo tree on **2026-05-21**. Use this table instead of informal path lists that may drift.

## User paste vs verified

| Claimed (informal) | Verified in repo | Notes |
|--------------------|------------------|-------|
| `docs/investor/ONE_PAGER.md` | **Yes** — `docs/investor/ONE_PAGER.md` | Canonical investor doc |
| `docs/counterparty/BIJAN_EMAIL.md` | **Yes** — `docs/counterparty/BIJAN_EMAIL.md` | Email draft for Bijan |
| `scripts/quickstart.ps1` | **Yes** — wrapper → `quickstart-all.ps1` | |
| `scripts/quickstart.sh` | **Yes** — wrapper → `quickstart-all.sh` | |
| `backends/dao-layer` | **No** | Use `backend/dao-service/` · PM2 name `dao-service` |
| `backend/donk-ai-tutor` | **No** | Use `ai/donk-tutor/` · PM2 name `donk-ai-tutor` |
| `frontend/academy` | **No** | Use `backend/fth-academy/` + `frontends/fth-edu/` |
| `frontend/sports-network` | **No** | Use `backend/ttn-launcher/` + `frontends/ttn-tv/` |
| `scripts/pm2.config.js` | **No** | Use repo root `ecosystem.config.js` |
| `BUILD_AVID_DREAM_ON_TROPTIONS.txt` | **No** | Not in repo |
| `docs/WHATS_BUILT_INVESTOR_ONE_PAGER.md` | **Yes** (legacy alias) | Points to `docs/investor/ONE_PAGER.md` |
| `docs/email-bryan-to-bijan-draft.md` | **Yes** (legacy alias) | Points to `docs/counterparty/BIJAN_EMAIL.md` |

---

## Directory trees (top level)

### `docs/`

| Path | Purpose |
|------|---------|
| `docs/investor/ONE_PAGER.md` | Investor one-pager (canonical) |
| `docs/counterparty/BIJAN_EMAIL.md` | Bijan outreach email |
| `docs/BRYAN_STATUS.md` | This file |
| `docs/TROPTIONS-GENESIS-BUILD.md` | Genesis audit (copy of exchange-os doc) |
| `docs/QUICKSTART.md` | Human quickstart guide |
| `docs/DEPLOY_PRODUCTION.md` | Production Docker deploy |
| `docs/LOOM_DEMO_SCRIPT.md` | 5–7 min demo outline |
| `docs/ARCHITECTURE.md`, `DAO.md`, `RUNBOOK.md`, … | Engineering docs |

### `scripts/`

| Path | Purpose |
|------|---------|
| `scripts/quickstart.ps1` | Thin wrapper → `quickstart-all.ps1` |
| `scripts/quickstart.sh` | Thin wrapper → `quickstart-all.sh` |
| `scripts/quickstart-all.ps1` | Full PM2 stack (Windows) |
| `scripts/quickstart-all.sh` | Full PM2 stack (Linux/macOS) |
| `scripts/deploy-production.ps1` | Docker prod compose (Windows) |
| `scripts/deploy-production.sh` | Docker prod compose (Unix) |
| `scripts/health-check-all.ps1` | Health probe all services |
| `scripts/bootstrap-dao.ps1` / `.sh` | DAO DB bootstrap |

PM2: **`ecosystem.config.js`** at repo root (not under `scripts/`).

### `backend/`

| Path | PM2 app | Port |
|------|---------|------|
| `backend/dao-service/` | `dao-service` | 8093 |
| `backend/fth-academy/` | `fth-backend` | 8091 |
| `backend/ttn-launcher/` | `ttn-launcher` | 8092 |
| `backend/shared/` | (library) | — |

### `ai/`

| Path | PM2 app | Port |
|------|---------|------|
| `ai/donk-tutor/` | `donk-ai-tutor` | 8090 |

### `frontends/`

| Path | Notes |
|------|-------|
| `frontends/exchange-os/` | Next.js Exchange OS — separate `npm run dev` |
| `frontends/dao-dashboard/` | Served by DAO service on :8093 |
| `frontends/fth-edu/` | FTH education UI (pairs with fth-academy) |
| `frontends/ttn-tv/` | TTN media UI |
| `frontends/landing-pages/` | Static landings |
| `frontends/unified-dashboard/` | Legacy unified HTML dashboard |

### `l1/`, `docker/`, `infrastructure/`

| Path | Notes |
|------|-------|
| `l1/` | Rust TROPTIONS L1 crates + node |
| `docker/docker-compose.prod.yml` | Production stack (used by deploy scripts) |
| `infrastructure/nginx/` | nginx.conf + `sites/troptions.conf` |

---

## Ports and health URLs

| Service | URL |
|---------|-----|
| L1 JSON-RPC | http://127.0.0.1:9944 (`state_get`) |
| DONK | http://127.0.0.1:8090/health |
| FTH Academy | http://127.0.0.1:8091/health |
| TTN | http://127.0.0.1:8092/health |
| DAO + dashboard | http://127.0.0.1:8093 · `/health` |

---

## Commands Bryan uses

**Local dev (PM2):**

```powershell
.\scripts\quickstart.ps1
.\scripts\health-check-all.ps1
pm2 status
```

**Production (Docker):**

```powershell
.\scripts\deploy-production.ps1
# optional SSL notes: see docs/DEPLOY_PRODUCTION.md
```

**Exchange OS (separate terminal):**

```powershell
cd frontends\exchange-os
npm install
npm run dev
```

**Demo script:** `docs/LOOM_DEMO_SCRIPT.md`
