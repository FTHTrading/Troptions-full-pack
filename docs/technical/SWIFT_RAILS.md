# TROPTIONS Institutional Rails — SWIFT / FedWire / MSB
## Status: PARTNER ENGAGED — DILIGENCE IN PROGRESS
## Last Updated: 2026-05-21

---

## 🔒 Truth Labels

| Claim | Status | Evidence Path |
|-------|--------|---------------|
| Code exists for all rails | ✅ PROVEN | `fiat-rails/` — 8 services built |
| Mock endpoints respond | ✅ PROVEN | Health checks return 200 |
| Bank partner has MSB | ⚠️ PARTNER ATTESTATION | Verify FinCEN registration |
| Bank partner has Connected BIC | ⚠️ PARTNER ATTESTATION | Verify SWIFT directory + RMA |
| Nostro / omnibus account | ⚠️ PARTNER ATTESTATION | Need account numbers |
| API integration live | 🔴 PIPELINE | Requires bank API credentials |
| Real wire settlement | 🔴 PIPELINE | Requires all of above + test wires |

---

## 🏛️ Partner Asset Summary

**What they bring (if verified):**

| Asset | What It Is | Why It Matters |
|-------|-----------|----------------|
| **MSB** | US money-transmission license | Legal right to touch fiat in/out |
| **Connected BIC** | SWIFT-registered institution ID | Cross-border wires (EUR, GBP, etc.) |
| **Nostro / Omnibus** | Settlement accounts | Where your reserves sit |

**What "Connected BIC" actually means:**
- Not all BICs are equal
- **Connected** = can send/receive on SWIFTNet
- **Directory-only** = listed but not active
- **Sponsor model** = they use someone else's BIC

**Questions to verify in partner meeting:**

1. Is the BIC Connected or directory-only?
2. Whose name appears on SWIFT messages — yours, theirs, or correspondent bank?
3. Which RMA corridors are active (USD, EUR, GBP, JPY)?
4. What are the nostro/omnibus account details?
5. Is there an API into their system (host-to-host, webhooks)?
6. What are fees — SWIFT, FX, MSB program, revenue share?
7. What happens to your IOU holders if the relationship ends?

---

## 🔌 How It Fits Your Stack

| Layer | Before Partner | With Partner (Verified + Wired) |
|-------|---------------|-----------------------------------|
| `$874M` issued IOUs | ✅ PROVEN (ledger demand) | Same — still not "fully backed" until reserves deposited |
| Pools / arb / x402 / agents | PIPELINE until seed | Can go PROVEN with seed + volume |
| FedWire USD | PIPELINE | PROVEN when bank API live |
| SWIFT cross-border | PIPELINE (`:4024` mock) | PROVEN when BIC + nostro + API live |
| Neobank / BaaS | PROJECTION | Still PROJECTION until card program |

---

## 📋 Partner Diligence Checklist

**Before signing anything, verify:**

- [ ] FinCEN MSB registration number (Form 107)
- [ ] SWIFT BIC in Connected directory (not just published)
- [ ] RMA relationships for target corridors
- [ ] Nostro account numbers / IBAN
- [ ] API documentation (webhooks, host-to-host)
- [ ] Fee schedule (SWIFT, FX, program fees)
- [ ] Exclusivity / termination clauses
- [ ] What happens to IOU holders on exit
- [ ] Insurance / bonding (if applicable)
- [ ] Audit trail capabilities

---

## 🎯 Meeting Frame

**What you say:**

> "We have the issuance ledger, exchange orchestration, and AI trading agents built and running. You bring MSB + connected BIC + nostro settlement. Together we turn $874M in IOU demand into legally redeemable, cross-border digital dollars — without us becoming a bank on day one."

**What you do NOT say:**
- ❌ "We have 2,200 connected BICs" (verify first)
- ❌ "Fully backed" (not until reserves audited)
- ❌ "Live revenue" (not until first wire settles)

---

## 🚀 What Makes This Valuable Specifically

1. **IOU redemption story** — TROPTIONS IOUs move from "promise" to "redeemable via partner bank rail"
2. **Two-rail orchestrator** — FedWire (US) + SWIFT (global) finally has a real counterparty
3. **Institutional sales** — Counterparties ask for BIC, LEI, MSB. You're not hand-waving.
4. **Multi-bank mesh** — EU correspondent + US omnibus becomes plausible
5. **Regulatory spine** — What investors and banks care about first

---

## ⚠️ Red Flags to Watch

| Claim | Reality Check |
|-------|--------------|
| "We have a BIC" | Directory-only vs Connected? |
| "Connected BIC" | Whose name on messages? |
| "SWIFT access" | Can send MT103 today? |
| "Nostro account" | Prefunded? Minimum balance? |
| "MSB license" | Which states? Active? |

---

## 📁 Related Docs

- `TROPTIONS_IOU_ISSUER_MANIFEST.md` — Revenue model
- `SYSTEM_MANIFEST_v3.md` — Full architecture
- `fiat-rails/ecosystem.config.js` — PM2 config
- `PARTNER_BANK_MESH.md` — Multi-bank mesh design

---

**Status: PARTNER DISCUSSIONS ACTIVE — DILIGENCE CHECKLIST ABOVE**
