# Email draft — Bryan → Bijan

> **Canonical path:** [`docs/counterparty/BIJAN_EMAIL.md`](counterparty/BIJAN_EMAIL.md)  
> **Avid configure prompt:** [`docs/counterparty/BUILD_AVID_ON_TROPTIONS.md`](counterparty/BUILD_AVID_ON_TROPTIONS.md) — replaces informal `BUILD_AVID_DREAM_ON_TROPTIONS.txt` (never in repo).

Use placeholders below. Attach `BUILD_AVID_ON_TROPTIONS.md`, `docs/TROPTIONS-GENESIS-BUILD.md`, and optionally `docs/investor/ONE_PAGER.md`.

---

## Subject line options

1. **TROPTIONS sovereign stack — monorepo live (L1 + DAO + backends)**
2. **Partnership review: Troptions-full-pack on GitHub — one-command quickstart**

---

## Body

Hi [Bijan],

[Bryan] here — sharing the consolidated **TROPTIONS Sovereign Stack** we packaged for partners and technical review.

**Repository:** https://github.com/FTHTrading/Troptions-full-pack

Everything runs from a single monorepo: Rust L1, Python backends, full DAO layer, frontends, contracts, and PM2/Docker/nginx ops templates.

**Live local stack (PM2):**

| Service | Port |
|---------|------|
| TROPTIONS L1 node | **9944** (JSON-RPC) |
| DAO service + dashboard | **8093** |
| FTH Academy | **8091** |
| DONK AI Tutor | **8090** |
| TTN Launcher | **8092** |

**Quickstart (Windows):**

```powershell
git clone https://github.com/FTHTrading/Troptions-full-pack.git
cd Troptions-full-pack
cp .env.example .env   # fill locally only
.\scripts\quickstart.ps1
.\scripts\health-check-all.ps1
```

Then open the DAO dashboard at **http://127.0.0.1:8093** and skim `docs/DAO.md` for governance flows.

**Executable build context for tokenized ecosystems:**  
Use `docs/TROPTIONS-GENESIS-BUILD.md` as the genesis/system audit prompt (8 brands, L1, XRPL/Polygon/Solana layers, compliance gates). For day-to-day ops, `docs/RUNBOOK.md` and `scripts/bootstrap-dao.ps1` mirror what we run in production-style PM2 layouts.

**Suggested ask:** [specific ask/meeting — e.g., 30-minute technical walkthrough week of [date], or review of DAO + Exchange OS integration for [project name].]

Happy to pair on namespace → soulbound migration (`scripts/migrate-namespaces-to-l1.py`) or Exchange OS readiness paths if that fits your roadmap.

Best,  
[Bryan]  
[date]

---

## Call-to-action checklist (for Bijan)

- [ ] Clone repo and run `scripts/quickstart.ps1` (or `scripts/quickstart.sh` on Linux)
- [ ] Review `frontends/dao-dashboard/` via http://127.0.0.1:8093
- [ ] Read one-pager: `docs/investor/ONE_PAGER.md`
- [ ] Optional deep dive: `docs/TROPTIONS-GENESIS-BUILD.md`
