---
title: Quickstart
layout: default
permalink: /technical/QUICKSTART.html
---

# TROPTIONS — One-command quickstart

Published on GitHub Pages: `https://fthtrading.github.io/Troptions-full-pack/technical/QUICKSTART.html`

Start the sovereign stack (L1 → backends → DAO) in dependency order. Repo root: `C:\Users\Kevan\Troptions-full-pack` (adjust path on Linux/macOS).

## Prerequisites

- **PM2** — `npm install -g pm2`
- **Python 3** + pip
- **Rust / cargo** — to build `l1/target/release/troptions-node` if no binary is configured
- Optional: copy `.env.example` → `.env` (secrets stay local)

## Windows (primary)

```powershell
cd C:\Users\Kevan\Troptions-full-pack
.\scripts\quickstart.ps1
```

Dry run (prints steps only):

```powershell
.\scripts\quickstart.ps1 -DryRun
```

## Linux / macOS

```bash
chmod +x scripts/quickstart.sh
./scripts/quickstart.sh
./scripts/quickstart.sh --dry-run
```

## After start

| PM2 name | Port | Health / URL |
|----------|------|----------------|
| `troptions-l1-node` | **9944** | JSON-RPC `state_get` — http://127.0.0.1:9944 |
| `troptions-l1-node` (metrics) | **9945** | Prometheus — http://127.0.0.1:9945/metrics |
| `donk-ai-tutor` | **8090** | http://127.0.0.1:8090/health |
| `fth-backend` | **8091** | http://127.0.0.1:8091/health (also `/health/l1`) |
| `ttn-launcher` | **8092** | http://127.0.0.1:8092/health |
| `dao-service` | **8093** | http://127.0.0.1:8093/health |

**Optional** (in `ecosystem.config.js`, not started by default quickstart):

| PM2 name | Port | URL |
|----------|------|-----|
| `x402-gateway` | **4020** | http://127.0.0.1:4020/health |
| `popeye-relay` | **4021** | http://127.0.0.1:4021/health |

```powershell
pm2 start ecosystem.config.js --only x402-gateway,popeye-relay
```

Health check: `.\scripts\health-check-all.ps1` (Windows) or curl JSON-RPC `state_get` on **9944**.

DAO-only bootstrap (build L1 + init DB): `scripts/bootstrap-dao.ps1` / `scripts/bootstrap-dao.sh`.

Full PM2 stack without the script: `pm2 start ecosystem.config.js` from repo root.

## L1 binary path

`ecosystem.config.js` uses `L1_NODE_BIN` or defaults to `C:\cargo-target-burnzy\release\troptions-node.exe` on Windows. Override:

```powershell
$env:L1_NODE_BIN = "C:\path\to\troptions-node.exe"
.\scripts\quickstart.ps1
```

Metrics port defaults to **9945** (`L1_METRICS_PORT` in the node).

## Related docs

- [Architecture](ARCHITECTURE.html)
- [DAO guide](DAO.html)
- [Runbook](RUNBOOK.md)
- [Bryan status](BRYAN_STATUS.md)
- [Investor one-pager](investor/ONE_PAGER.md)
- [Production deploy](DEPLOY_PRODUCTION.md)
- [Docs hub](https://fthtrading.github.io/Troptions-full-pack/technical/index.html)
