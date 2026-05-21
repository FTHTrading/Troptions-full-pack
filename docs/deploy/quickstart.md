---
layout: default
title: Quickstart
permalink: /deploy/quickstart/
---

# Quickstart

## One-command stack (Windows)

```powershell
.\scripts\quickstart.ps1
```

## Full stack (all services)

```powershell
.\scripts\quickstart-all.ps1
```

Bash:

```bash
./scripts/quickstart-all.sh
```

## Prerequisites

1. Copy [`.env.example`](https://github.com/fthtrading/Troptions-full-pack/blob/main/.env.example) → `.env` (never commit `.env`)
2. Rust toolchain for L1
3. Python 3.10+ for backends
4. PM2 for process supervision: `pm2 start ecosystem.config.js`

## L1 only

```powershell
cd l1
cargo test --workspace
cargo run -p node
```

Set `L1_DATA_DIR` for RocksDB persistence.

## Health check

```powershell
.\scripts\health-check-all.ps1
```

## Internal runbook

- [`docs/QUICKSTART.md`](../QUICKSTART.html)
- [`docs/RUNBOOK.md`](../RUNBOOK.html)
- One-click deploy: [`one_click_deploy.ps1`](https://github.com/fthtrading/Troptions-full-pack/blob/main/one_click_deploy.ps1)
