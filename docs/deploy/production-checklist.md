---
layout: default
title: Production Checklist
permalink: /deploy/production-checklist/
---

# Production checklist

Tracks **7.5 → 10/10** ops maturity after the production upgrade merge. Full checklist:

**[PRODUCTION_READINESS_CHECKLIST.md](../PRODUCTION_READINESS_CHECKLIST.html)** (same content as repo `docs/PRODUCTION_READINESS_CHECKLIST.md`)

## Merge status (engineering)

| Item | Status |
|------|--------|
| Merge `upgrade/10-production` → `main` | **Done** |
| `feature/x402-full-integration` | **Not merged** (optional) |
| `cargo test --workspace` | **Passing** |
| `pytest tests/backend tests/dao` | **Passing** |

## TLS / nginx (ops — not auto-live)

Templates only until certs and DNS are configured:

- [`infrastructure/nginx/nginx.conf`](https://github.com/fthtrading/Troptions-full-pack/blob/main/infrastructure/nginx/nginx.conf)
- [`infrastructure/nginx/sites/troptions.conf`](https://github.com/fthtrading/Troptions-full-pack/blob/main/infrastructure/nginx/sites/troptions.conf)
- Prod compose: [`docker/docker-compose.prod.yml`](https://github.com/fthtrading/Troptions-full-pack/blob/main/docker/docker-compose.prod.yml)

Deploy scripts:

```powershell
.\scripts\deploy-production.ps1
```

```bash
./scripts/deploy-production.sh
```

**Do not claim TLS is live** until certbot (or equivalent) completes and health checks pass on public hostnames.

## Secrets (required for 10/10)

- `SETTLEMENT_API_KEYS` — comma-separated `key_id:secret`
- `L1_PUBLIC_KEY` / signing keys for settlement verify
- Rotate any demo keys; never commit `.env`

## Pre-go-live commands

```powershell
.\scripts\health-check-all.ps1
cd l1; cargo test --workspace
python -m pytest tests/backend tests/dao -q
.\scripts\truth_labels.ps1
```

See also [`docs/DEPLOY_PRODUCTION.md`](../DEPLOY_PRODUCTION.html).
