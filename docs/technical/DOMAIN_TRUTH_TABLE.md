---
title: Domain truth table
layout: default
permalink: /technical/DOMAIN_TRUTH_TABLE.html
---

# Domain truth table

**Internal reference + public honesty.** Last verified: **2026-05-21** (HTTP HEAD from operator network).

**Operator note (Bryan):** `ai.troptions.org` and `ttn.troptions.org` are **not** currently run on production DNS. Public surfaces today use the **unykorn.org** family and local dev ports until troptions.org subdomains are pointed.

| Hostname | Intended service | Status | Notes |
|----------|------------------|--------|-------|
| [troptions.unykorn.org](https://troptions.unykorn.org/troptions) | Core brand / Exchange OS institutional hub | **LIVE** (HTTP 200) | Primary investor-facing property |
| [troptionslive.unykorn.org/sports](https://troptionslive.unykorn.org/sports) | TTN sports / WC26 surfaces | **LIVE** (HTTP 200) | Broadcast + sponsorship pipeline |
| [launch.unykorn.org](https://launch.unykorn.org/) | Solana token launcher SaaS | **LIVE** (HTTP 200) | Mint registry, campaigns |
| [fthedu.unykorn.org](https://fthedu.unykorn.org/) | FTH Academy public edu | **LIVE** (HTTP 200) | Stripe tier patterns in revenue docs |
| [ai.troptions.org](https://ai.troptions.org/) | DONK AI tutor (nginx → donk-tutor) | **NOT DEPLOYED** | DNS does not resolve; template only in `infrastructure/nginx/` |
| [ttn.troptions.org](https://ttn.troptions.org/) | TTN launcher API/UI edge | **NOT DEPLOYED** | DNS does not resolve; live sports on unykorn |
| [dao.troptions.org](https://dao.troptions.org/) | DAO dashboard / governance API edge | **NOT DEPLOYED** | DNS does not resolve; run dao-service locally or post-DNS |
| troptions.io / troptions.org apex | Legacy → canonical unykorn paths | **Future DNS** | Documented redirects in Exchange OS; not broken promises |
| `127.0.0.1:8090` | DONK tutor (dev) | **Local dev** | Live AI Q&A when quickstart running |
| `127.0.0.1:8091` | FTH Academy backend | **Local dev** | Mirrors fthedu when deployed |
| `127.0.0.1:8092` | TTN launcher backend | **Local dev** | Powers troptionslive when wired |
| `127.0.0.1:8093` | DAO service | **Local dev** | Governance API before public DNS |
| `127.0.0.1:9944` | TROPTIONS L1 RPC | **Local dev** | Sovereign sequencer |

## How to re-verify

```powershell
Invoke-WebRequest -Uri "https://troptions.unykorn.org/troptions" -Method Head -UseBasicParsing
```

Re-run before investor decks or press. Update this table and [truth labels]({{ '/proof/truth-labels.html' | relative_url }}) when status changes.

## nginx templates

Files under `infrastructure/nginx/sites/` are **configuration templates** — not live edge until DNS A/AAAA records point at the host running Docker/nginx and TLS (certbot) is complete.
