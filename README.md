# TROPTIONS Sovereign Stack — Full Pack

> **Monorepo** for the TROPTIONS L1 node, FTH Academy, DONK AI Tutor, TTN Launcher, Exchange OS, and multi-chain contracts.  
> Assembled from production paths on Windows (UNYKORN Ecosystem + clawd workspace).

[![L1](https://img.shields.io/badge/L1-operational-9944-success)](http://127.0.0.1:9944)
[![DONK](https://img.shields.io/badge/DONK-8090-blue)](http://127.0.0.1:8090/health)
[![FTH](https://img.shields.io/badge/FTH_Academy-8091-purple)](http://127.0.0.1:8091/health)
[![TTN](https://img.shields.io/badge/TTN-8092-red)](http://127.0.0.1:8092/health)

## Live services (PM2)

| Service | Port | Path in monorepo |
|---------|------|------------------|
| `troptions-l1-node` | **9944** | `l1/` |
| `donk-ai-tutor` | **8090** | `ai/donk-tutor/` |
| `fth-backend` | **8091** | `backend/fth-academy/` |
| `ttn-launcher` | **8092** | `backend/ttn-launcher/` |

```bash
cp .env.example .env   # fill secrets locally — never commit .env
pm2 start ecosystem.config.js
```

## Architecture (ASCII)

```
   [8 Genesis Domains]
            │
    ┌───────┴───────┐
    ▼               ▼
 Exchange OS     TTN.Tv / University
 (Next.js)       (FastAPI + TTN UI)
    │               │
    └───────┬───────┘
            ▼
    FTH Academy + DONK (8091/8090)
            │
            ▼ JSON-RPC
    TROPTIONS L1 Node (9944)
    ├─ soulbound (credentials)
    ├─ settlement (HTLC / locks)
    └─ atomic-router (batch txs)
            │
            ▼
 Polygon · XRPL · Solana
```

## Repository layout

```
Troptions-full-pack/
├── l1/                    # Rust workspace (8 crates)
├── backend/
│   ├── fth-academy/       # Revenue engine, courses, Stripe, l1_client.py
│   ├── ttn-launcher/      # Channel + namespace registry
│   └── shared/
├── ai/
│   ├── donk-tutor/        # RAG tutor, Qdrant, Whisper
│   └── knowledge-base/    # OpenClaw + whichway docs
├── frontends/
│   ├── exchange-os/       # Full TROPTIONS Next.js app
│   ├── fth-edu/           # T-EDU mobile/web app
│   ├── ttn-tv/            # TTN pages (extracted from exchange-os)
│   ├── unified-dashboard/
│   └── landing-pages/
├── contracts/
│   ├── polygon/           # KENNY, EVL, vaults
│   ├── solana/            # Launcher scripts
│   └── xrpl/              # XRPL exchange-os configs
├── scripts/               # migrate-namespaces-to-l1.py, etc.
├── docs/                  # ARCHITECTURE, L1_SPEC, API, DOMAIN_MAP
├── docker/
└── .github/workflows/
```

## Contract addresses

| Asset | Chain | Address |
|-------|-------|---------|
| **KENNY** | Polygon | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` |
| **XRPL Gateway** | XRPL | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` |

Polygon sale/treasury env vars: see `.env.example`.

## Genesis domains

- TROPTIONSXCHANGE.IO  
- TROPTIONS-UNIVERSITY.COM  
- TROPTIONSTelevisionNetwork.Tv  
- HOTRCW.COM  
- TROPTIONS.IO  
- TROPTIONS.ORG  
- TheRealEstateConnections.com  
- Green-N-Go.Solar  

Details: [`docs/DOMAIN_MAP.md`](docs/DOMAIN_MAP.md)

## Quick start

### L1

```powershell
cd l1
cargo test --workspace
cargo build -p node --release
# .\target\release\troptions-node.exe 9944
```

### Python backends

```powershell
pip install -r backend/fth-academy/requirements.txt
pip install -r ai/donk-tutor/requirements.txt
pip install -r backend/ttn-launcher/requirements.txt
```

### Exchange OS

```powershell
cd frontends/exchange-os
npm install
npm run dev
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)  
- [L1 RPC spec](docs/L1_SPEC.md)  
- [HTTP APIs](docs/API.md)  
- [Domain map](docs/DOMAIN_MAP.md)  

## Source provenance

This pack was synthesized from:

- `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\` (L1, backends, edu app)  
- `C:\Users\Kevan\troptions\` (Exchange OS + TTN UI)  
- `C:\Users\Kevan\.openclaw\workspace\` (clawd operational context)  
- Kenny/EVL contracts from FTH archive projects  

## License

Components retain their original licenses (MIT/Apache-2.0 for L1). See per-package notices.
