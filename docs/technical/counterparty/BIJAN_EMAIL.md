# Email draft — Bryan → Bijan (Avid)

> **Superseded for outreach:** Use the generic institutional pack — [`PROOF_FOR_COUNTERPARTIES.md`](PROOF_FOR_COUNTERPARTIES.md) and [`PROOF_FOR_COUNTERPARTIES.html`](PROOF_FOR_COUNTERPARTIES.html). **Do not use** this named email for new counterparty diligence.

Use placeholders below. Attach **`docs/counterparty/BUILD_AVID_ON_TROPTIONS.md`** and **`docs/TROPTIONS-GENESIS-BUILD.md`**. Optional: export `docs/investor/ONE_PAGER.md` as PDF.

**Framing:** Client technical review under NDA — not a joint venture or partnership equity discussion.

---

## Subject line options

1. **TROPTIONS stack for Avid — repo walkthrough + 2–4 week configure timeline**
2. **Avid on TROPTIONS: sovereign L1 + DAO (local demo today, production configure in weeks)**

---

## Body

Hi [Bijan],

[Bryan] here. Sharing the **TROPTIONS Sovereign Stack** monorepo for Avid’s technical review — the same infrastructure we use for genesis brands, DAO governance, and Exchange OS.

**Repository:** https://github.com/FTHTrading/Troptions-full-pack

**What exists today:** A working local stack — Rust L1, DAO service + dashboard, FTH Academy, DONK tutor, TTN launcher, contract references, and production-oriented Docker/nginx templates. You can clone and run it on your machine in about **15 minutes** to validate architecture and read the genesis audit — that step is orientation, **not** “Avid live on mainnet in 15 minutes.”

**Configure timeline for Avid production:** **2–4 weeks** with TROPTIONS engineering — persistence hardening, signed submit-RPC in prod, Avid DAO realm, namespace/soulbound mapping, treasury on L1, host/TLS cutover, and compliance review. Optional x402/Apostle/telecom work is **+2–4 weeks** on a separate branch if Avid wants it later.

**Attached / linked:**

| Document | Purpose |
|----------|---------|
| `docs/counterparty/BUILD_AVID_ON_TROPTIONS.md` | Executable configure prompt (steps, ports, limitations) |
| `docs/TROPTIONS-GENESIS-BUILD.md` | Full genesis/system audit (8 brands, compliance gates) |
| `docs/investor/ONE_PAGER.md` | Optional executive summary |

**Access:** We’ll proceed under **mutual NDA** and standard **client intake** (entity, compliance owner, environments). This is **licensed stack configuration**, not a JV.

**Local stack (verified ports):**

| Service | Port |
|---------|------|
| TROPTIONS L1 (JSON-RPC) | **9944** |
| FTH Academy | **8091** |
| TTN Launcher | **8092** |
| DAO service + dashboard | **8093** |
| DONK AI Tutor | **8090** |

**Quickstart (Windows):**

```powershell
git clone https://github.com/FTHTrading/Troptions-full-pack.git
cd Troptions-full-pack
Copy-Item .env.example .env   # fill locally only — never commit
.\scripts\quickstart.ps1
.\scripts\health-check-all.ps1
```

Then open the DAO dashboard at **http://127.0.0.1:8093** and skim `docs/DAO.md`.

**Suggested ask:** [30-minute technical walkthrough — week of [date] — focused on Avid DAO realm + Exchange OS integration paths.]

Best,  
[Bryan]  
[date]

---

## Call-to-action checklist (for Bijan)

- [ ] Clone repo and run `scripts/quickstart.ps1` (or `scripts/quickstart.sh` on Linux)
- [ ] Read `docs/counterparty/BUILD_AVID_ON_TROPTIONS.md` (timeline + limitations)
- [ ] Review DAO dashboard at http://127.0.0.1:8093
- [ ] Deep dive (optional): `docs/TROPTIONS-GENESIS-BUILD.md`
- [ ] Executive summary (optional): `docs/investor/ONE_PAGER.md`
