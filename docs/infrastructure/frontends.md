---
layout: default
title: Frontends
permalink: /infrastructure/frontends/
---

# Frontends (`frontends/`)

| App | Path | Notes |
|-----|------|-------|
| **exchange-os** | [`frontends/exchange-os/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/exchange-os) | Full TROPTIONS Next.js — XRPL desk tooling, campaigns, revenue modules |
| **dao-dashboard** | [`frontends/dao-dashboard/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/dao-dashboard) | Proposals, treasury, L1 live panel (served by dao-service) |
| **fth-edu** | [`frontends/fth-edu/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/fth-edu) | T-EDU mobile/web |
| **ttn-tv** | [`frontends/ttn-tv/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/ttn-tv) | TTN pages |
| **unified-dashboard** | [`frontends/unified-dashboard/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/unified-dashboard) | Ops overview |
| **landing-pages** | [`frontends/landing-pages/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/landing-pages) | Marketing shells |

## Exchange OS labeling

Desk / proof-of-funds scripts under `frontends/exchange-os/scripts/` may reference large notional amounts (e.g. desk outlines). Treat those as **Exchange OS operator attestation**, not on-chain verification by the L1 repo.

## Local run

See [deploy/quickstart](../deploy/quickstart.html) — `pm2 start ecosystem.config.js` after copying `.env.example` → `.env`.
