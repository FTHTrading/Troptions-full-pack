# Loom demo script — Bryan (5–7 minutes)

Honest walkthrough of what is **running in-repo** vs **stubs/simulation**. Record screen + voice; keep terminal and browser visible.

---

## 0. Prep (before recording)

```powershell
cd Troptions-full-pack
.\scripts\quickstart.ps1
.\scripts\health-check-all.ps1
```

Optional second terminal for Exchange OS:

```powershell
cd frontends\exchange-os
npm run dev
```

Have open: `docs/investor/ONE_PAGER.md`, `docs/TROPTIONS-GENESIS-BUILD.md`

---

## 1. Opening (~30 sec)

**Say:**  
“This is the TROPTIONS sovereign stack in one monorepo: a Rust L1 node, four Python services under PM2, DAO dashboard, and separate Exchange OS for XRPL/Polygon/Solana product surfaces. Everything you’ll see on localhost is wired in `ecosystem.config.js` — not a slide deck mock.”

**Show:** Repo root in Explorer or `docs/BRYAN_STATUS.md` path table.

---

## 2. L1 RPC — state & soulbound (~60 sec)

**Terminal:**

```powershell
$body = '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
Invoke-RestMethod -Uri http://127.0.0.1:9944 -Method Post -Body $body -ContentType application/json
```

**Say:**  
“Port 9944 is JSON-RPC. `state_get` returns chain state from the Rust node in `l1/`. Soulbound and governance submit paths exist in the L1 crates; **on-chain submit from this demo stack is not a signed mainnet relayer yet** — treat governance writes as integration stubs until relayer hardening ships.”

**Honest caveat:** RAM-backed / dev L1 mode may apply depending on build flags — check `docs/TROPTIONS_L1_STATUS.md` if asked.

---

## 3. DAO dashboard — :8093 (~90 sec)

**Browser:** http://127.0.0.1:8093

**Say:**  
“DAO service is `backend/dao-service` with static dashboard in `frontends/dao-dashboard`. Treasury mirror, proposals, and WebSocket events are live against SQLite + L1 read RPC.”

**Do:** Open a proposal if seeded; mention vote flow (UI → API → L1 read / future submit).

**Say:**  
“PM2 process name is `dao-service`, not `dao-layer` — that’s an old path alias.”

---

## 4. FTH Academy — :8091 (~45 sec)

**Browser:** http://127.0.0.1:8091/health

**Say:**  
“FTH backend covers courses, Stripe webhook hooks, and `/dao/*` bridge routes. Checkout is env-gated — you’ll see health OK without live Stripe keys in a fresh clone.”

**Optional:** `http://127.0.0.1:8091/health/l1` to show L1 bridge connectivity.

---

## 5. TTN launcher — :8092 (~45 sec)

**Browser:** http://127.0.0.1:8092/health

**Say:**  
“TTN is the namespace/channel registry service — pairs with `frontends/ttn-tv` for media UX. Migration helper: `scripts/migrate-namespaces-to-l1.py`.”

---

## 6. DONK tutor — :8090 (~45 sec, optional)

**Browser:** http://127.0.0.1:8090/health

**Say:**  
“DONK is RAG over Qdrant + Ollama. If Ollama isn’t running, health may be degraded — skip live chat in the recording rather than faking a response.”

**Skip if:** `pm2 logs donk-ai-tutor` shows connection errors to :11434.

---

## 7. Exchange OS — separate dev server (~60 sec)

**Browser:** local Next dev URL (typically http://localhost:3000)

**Say:**  
“Exchange OS is the institutional portal — XRPL proof room, batch launch pad, genesis brand map. It runs outside PM2: `cd frontends/exchange-os && npm run dev`. Marketing figures like USDC desk size are **UI-attested proof links** — verify on XRPL before external claims; genesis legal gates are in `docs/TROPTIONS-GENESIS-BUILD.md`.”

**Do:** Flash proof-room or troptions landing — do not read dollar figures as audited financials.

---

## 8. Closing — counterparties & NDA (~30 sec)

**Say:**  
“For Bijan-style technical review: attach `docs/investor/ONE_PAGER.md` and point to `docs/TROPTIONS-GENESIS-BUILD.md` for the eight-brand genesis audit. Production Docker path is `scripts/deploy-production.ps1` + `docs/DEPLOY_PRODUCTION.md`. Happy to walk under NDA on wallet generation and compromised-wallet forensics in section 2 of the genesis doc.”

**CTA:** Clone → `quickstart.ps1` → DAO URL → genesis doc.

---

## Bullet cheat sheet (on-screen notes)

- One repo, PM2 matrix, ports 9944 / 8090–8093
- L1: `state_get` works; signed submit = roadmap
- DAO: real API + dashboard, not mock HTML only
- FTH / TTN / DONK: health + integration boundaries
- Exchange OS: separate npm dev; proof content ≠ this repo’s L1 write path
- Deploy: Docker compose prod OR PM2 quickstart
- No `dao-layer`, no `scripts/pm2.config.js` — see `docs/BRYAN_STATUS.md`
