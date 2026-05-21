# TROPTIONS Sovereign Stack — What's Built

> **Canonical path:** [`docs/investor/ONE_PAGER.md`](investor/ONE_PAGER.md) — edit the investor one-pager there; this file is kept for backward links.

**Executive headline:** A single monorepo ships the TROPTIONS L1 node, Python/AI backends, full DAO layer, multi-chain contract references, and production ops (PM2, Docker, nginx) — clone once, run locally, extend to eight Genesis brand domains.

---

## Stack at a glance

| Layer | What it is | Status | Port / URL |
|-------|------------|--------|------------|
| **L1** | Rust sovereign node (soulbound, settlement, governance RPC) | Operational (PM2) | `http://127.0.0.1:9944` |
| **DAO** | Governance API, treasury mirror, WebSocket, dashboard | Operational (PM2) | `http://127.0.0.1:8093` · dashboard same host |
| **FTH Academy** | Courses, Stripe hooks, `/dao/*` routes, L1 bridge | Operational (PM2) | `http://127.0.0.1:8091/health` |
| **DONK AI Tutor** | RAG tutor (Qdrant + Ollama integration) | Operational (PM2) | `http://127.0.0.1:8090/health` |
| **TTN Launcher** | Channel / namespace registry | Operational (PM2) | `http://127.0.0.1:8092/health` |
| **Frontends** | Exchange OS, DAO dashboard, FTH edu, TTN, landing | Built in repo; deploy per host | See `frontends/` |
| **Contracts** | Polygon (KENNY/EVL), XRPL configs, Solana scripts | Addresses documented; stubs for Phase 2 governor | On-chain refs below |
| **Ops** | `ecosystem.config.js`, health scripts, Docker compose, nginx templates | Configured | `scripts/`, `docker/`, `infrastructure/` |

---

## Why this matters (for counterparties)

- **One clone, full stack** — L1, three revenue/ops backends, and DAO service share one repo, one PM2 ecosystem file, and documented health checks (`scripts/health-check-all.ps1`).
- **Sovereign L1 + DAO** — Identity-weighted governance on the Rust L1 with a live DAO API (`backend/dao-service/`, `dao/`, `frontends/dao-dashboard/`), not a dashboard-only mock.
- **Multi-chain footprint** — Polygon KENNY and XRPL gateway addresses are first-class in config and treasury seed data; Exchange OS and contract trees cover Polygon, XRPL, and Solana launch paths.
- **Operations-ready** — PM2 process matrix, runbook, CI for L1 + DAO tests, and production-oriented Docker/nginx layouts reduce time-to-demo for investors and partners.

---

## Key on-chain references

| Asset | Chain | Address |
|-------|-------|---------|
| **KENNY** | Polygon | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` |
| **XRPL Gateway** | XRPL | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` |

Sale/treasury env vars: `.env.example` (not committed).

---

## Genesis brand domains (8)

TROPTIONSXCHANGE.IO · TROPTIONS-UNIVERSITY.COM · TROPTIONSTelevisionNetwork.Tv · HOTRCW.COM · TROPTIONS.IO · TROPTIONS.ORG · TheRealEstateConnections.com · Green-N-Go.Solar

Registry: `dao/registry/genesis_brands.json` · map: `docs/DOMAIN_MAP.md`

---

## What ships next

- Cross-chain HTLC settlement between XRPL escrows and L1 state.
- Polygon Timelock relayer for KENNY treasury moves tied to passed DAO proposals.
- Postgres HA, authenticated submit-RPC relayer, and mainnet issuer key hardening.

---

## Verify locally

```powershell
git clone https://github.com/FTHTrading/Troptions-full-pack.git
cd Troptions-full-pack
.\scripts\quickstart-all.ps1
```

Repo: **https://github.com/FTHTrading/Troptions-full-pack**  
Docs: `docs/ARCHITECTURE.md`, `docs/DAO.md`, `docs/RUNBOOK.md`

*Prepared for investor / partner review. Simulation and compliance gates apply to live mainnet treasury moves; see `frontends/exchange-os/docs/TROPTIONS-GENESIS-BUILD.md`.*
