# Configure Avid on TROPTIONS Sovereign Stack

**Audience:** Bryan (internal), Bijan / Avid engineering (under NDA + client intake)  
**Repo:** https://github.com/FTHTrading/Troptions-full-pack  
**Tone:** 10–50× faster than greenfield — not a magic button.

---

## Timeline (read first)

| Phase | Duration | What you get |
|-------|----------|----------------|
| **Orientation** | **~15 minutes** | Clone repo, run local quickstart, read architecture + genesis audit doc. Confirms the stack boots on your machine — **not** a production Avid deployment. |
| **Avid configure (with TROPTIONS engineering)** | **2–4 weeks** | Hardened persistence, signed submit-RPC in prod, DAO realm for Avid, namespace/soulbound mapping, treasury on L1, liquidity hooks, compliance review, TLS/nginx host cutover. |
| **Optional x402 / Apostle / telecom** | **+2–4 weeks** | Staged payments, Apostle Chain sidecar, metered APIs — branch `feature/x402-full-integration` (~6.5/10). **Only if Avid explicitly asks**; keep separate from core Avid go-live. |

**Branch honesty (internal):**

| Branch | Maturity (subjective) | Notes |
|--------|----------------------|--------|
| `main` | ~4.5/10 | Demo-ready PM2 stack; docs and ops templates present. |
| `upgrade/10-production` | ~7.5/10 | RocksDB persistence, 24+ Rust tests, signed RPC, treasury + DAO on L1, prod Docker/nginx — **merge target before counterparty prod**. |
| `feature/x402-full-integration` | ~6.5/10 | x402 sidecar, Apostle, staged payments — do not oversell in Avid core timeline. |

---

## What Avid gets (mapped to repo)

| Capability | Repo paths |
|------------|------------|
| **Sovereign L1** (soulbound, settlement, governance RPC) | `l1/` · spec `docs/L1_SPEC.md` |
| **DAO** (proposals, votes, treasury lens, dashboard) | `dao/`, `backend/dao-service/`, `frontends/dao-dashboard/` · guide `docs/DAO.md` |
| **Token / brand config** | `dao/registry/genesis_brands.json`, `.env.example` (KENNY/EVL/XRPL) |
| **WC2026 hooks** (namespaces, campaigns, edu content) | `frontends/exchange-os/src/data/locked-namespaces.ts`, `backend/fth-academy/main.py`, `ai/donk-tutor/` |
| **RWA module references** (XRPL/Polygon labs, Exchange OS content) | `contracts/xrpl/`, `contracts/polygon/`, `frontends/exchange-os/src/content/troptions/xrplNftGenesisRegistry.ts`, `docs/DOMAIN_MAP.md` |
| **Exchange OS integration** | `frontends/exchange-os/` · genesis copy `frontends/exchange-os/docs/TROPTIONS-GENESIS-BUILD.md` |
| **Multi-chain addresses (documented)** | `README.md` contract table · seeded in `backend/dao-service` treasury |
| **Ops** (PM2 local, Docker prod, nginx) | `ecosystem.config.js`, `scripts/quickstart.ps1`, `docker/docker-compose.prod.yml`, `infrastructure/nginx/` |

---

## Prerequisites (non-negotiable)

- [ ] **Mutual NDA** executed before repo access beyond public skim.
- [ ] **Client intake** completed (Avid entity, compliance owner, key custody, environments).
- [ ] **No joint venture** framing — this is **licensed stack configuration + engineering services**, not a partnership equity narrative.
- [ ] Engineering contact on both sides for signed-RPC keys, settlement API keys, and DNS/TLS.

---

## Executable steps (engineer or AI agent)

### 1. Clone and orient (~15 min)

```powershell
git clone https://github.com/FTHTrading/Troptions-full-pack.git
cd Troptions-full-pack
git checkout main
git pull origin main
```

Read:

- `docs/ARCHITECTURE.md`
- `docs/TROPTIONS-GENESIS-BUILD.md` (canonical; mirror at `frontends/exchange-os/docs/TROPTIONS-GENESIS-BUILD.md`)
- `docs/BRYAN_STATUS.md` (verified paths)

### 2. Local environment

```powershell
Copy-Item .env.example .env   # fill locally — never commit
.\scripts\quickstart.ps1
.\scripts\health-check-all.ps1
```

Optional DAO-only bootstrap: `.\scripts\bootstrap-dao.ps1`

### 3. Verify L1 (:9944)

```powershell
# JSON-RPC state_get
Invoke-RestMethod -Uri http://127.0.0.1:9944 -Method Post -ContentType "application/json" -Body '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
```

PM2 app: `troptions-l1-node` · binary via `L1_NODE_BIN` or build:

```powershell
cd l1
cargo test --workspace
cargo build -p node --release
```

### 4. Verify DAO service (:8093)

- Dashboard + API: http://127.0.0.1:8093  
- Health: http://127.0.0.1:8093/health  
- State: `GET /dao/state` (L1 + governance + treasury mirror)

Code: `backend/dao-service/main.py`, `frontends/dao-dashboard/app.js`

### 5. Verify FTH Academy (:8091)

- Health: http://127.0.0.1:8091/health  
- L1 bridge: `/health/l1`, `/dao/*` routes  
- Code: `backend/fth-academy/`

### 6. Contract addresses (from README — verify before mainnet moves)

| Asset | Chain | Address |
|-------|-------|---------|
| **KENNY** | Polygon | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` |
| **XRPL Gateway** | XRPL | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` |

Env template: `.env.example` (`KENNY_CONTRACT`, `XRPL_GATEWAY_ADDRESS`, `SETTLEMENT_API_KEYS`, `L1_PUBLIC_KEY`).

### 7. Avid-specific configuration (2–4 weeks — TROPTIONS engineering)

Work with TROPTIONS engineering; not self-serve:

1. Define **Avid DAO realm** — proposals, voter credentials, treasury policy (`dao/governance/`, L1 `governance` crate).
2. Map **Avid namespaces → L1 soulbounds** — `scripts/migrate-namespaces-to-l1.py` (dry-run first).
3. Wire **Exchange OS** brand surfaces for Avid — `frontends/exchange-os/` env + domain map.
4. **Production cutover** — merge `upgrade/10-production` → `main`, then `.\scripts\deploy-production.ps1` + TLS per `docs/DEPLOY_PRODUCTION.md`.
5. Set **`SETTLEMENT_API_KEYS`** and **`L1_PUBLIC_KEY`** in prod; disable dev-open settlement mode.
6. **Compliance sign-off** on genesis audit gates (`docs/TROPTIONS-GENESIS-BUILD.md` § legal gates) before live treasury disbursement.

### 8. Optional x402 / Apostle (+2–4 weeks)

Only after core Avid stack is accepted:

```powershell
git fetch origin feature/x402-full-integration
# Review with engineering — do not merge to main without client ask
```

---

## Explicit limitations (say these out loud)

- **Not BFT mainnet today.** Consensus is a **single-node sovereign sequencer**; BFT quorum is roadmap (Q4 2026 on `upgrade/10-production` docs). Do not describe current L1 as Byzantine-fault tolerant.
- **Not self-serve mainnet.** Production keys, TLS, compliance, and signed submit paths require TROPTIONS engineering — clone + quickstart is **dev/demo**, not Avid production.
- **Genesis build is SIMULATION-heavy.** Live XRPL treasury moves remain gated; compromised wallet documented in genesis audit — **do not reuse** flagged addresses.
- **x402 branch is optional** and lower maturity than `upgrade/10-production`; keep off Avid critical path unless contracted.

---

## Attachments for outbound email

When Bryan emails Bijan, attach or link:

1. This file — `docs/counterparty/BUILD_AVID_ON_TROPTIONS.md`
2. `docs/TROPTIONS-GENESIS-BUILD.md`
3. Optional: `docs/investor/ONE_PAGER.md`

Email draft: `docs/counterparty/BIJAN_EMAIL.md`

---

## Related docs

| Doc | Path |
|-----|------|
| Verified paths | `docs/BRYAN_STATUS.md` |
| Production checklist (7.5→10) | `docs/PRODUCTION_READINESS_CHECKLIST.md` |
| Quickstart | `docs/QUICKSTART.md` |
| Production deploy | `docs/DEPLOY_PRODUCTION.md` |

> **Note:** `BUILD_AVID_DREAM_ON_TROPTIONS.txt` was never in this repo. Use **this file** as the canonical Avid configure prompt.
