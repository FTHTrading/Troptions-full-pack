---
layout: default
title: Production Checklist
permalink: /deploy/production-checklist/
---

# Production checklist

Tracks **9.0 → 10/10** ops maturity. Full checklist: **[PRODUCTION_READINESS_CHECKLIST.md](../PRODUCTION_READINESS_CHECKLIST.html)**

## Engineering (9.0 on `main`)

| Item | Status |
|------|--------|
| TLS nginx template (`docker/nginx/`, HTTPS `/l1/` … `/dao/`) | **Done** |
| API key auth (`API_KEYS`, `verify_api_key`) | **Done** |
| DAO dashboard → L1 RPC reads | **Done** |
| Signed DAO RPC + integration test | **Done** |
| Sovereign Sequencer docs (not BFT) | **Done** |
| Fraud proofs design doc | **Done** (implementation Q4 2026) |
| `feature/x402-full-integration` | **Not merged** |

## Ops (remaining for 10/10)

| Item | Status |
|------|--------|
| Public TLS (certbot + DNS) | Pending |
| `API_KEYS` / `SETTLEMENT_API_KEYS` in prod `.env` | Pending |
| Prometheus scrape + Grafana | Pending |
| `scripts/verify-9-production.ps1` on staging host | Pending |

## Commands

```powershell
.\scripts\setup-tls.ps1
.\scripts\verify-9-production.ps1
cd l1; cargo test --workspace
python -m pytest tests/backend tests/dao -q
.\scripts\truth_labels.ps1
```

Deploy: [`docker/docker-compose.prod.yml`](https://github.com/fthtrading/Troptions-full-pack/blob/main/docker/docker-compose.prod.yml)
