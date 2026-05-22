---
title: What you can do NOW
layout: default
permalink: /technical/WHAT_YOU_CAN_DO_NOW.html
---

# What you can do NOW — operator matrix

**Last updated:** 2026-05-21  
**Investor page:** [Overview](https://fthtrading.github.io/Troptions-full-pack/overview/)  
**Institutional rails:** [SWIFT / FedWire](https://fthtrading.github.io/Troptions-full-pack/swift/)

**Labels:** **PROVEN** · **PIPELINE** · **PROJECTION** — same definitions as [System manifest](SYSTEM_MANIFEST.html).

---

## Honesty (read first)

- **No** guaranteed **$825/hour** or **$874K/month** — modeled in `ACTIVATE_NOW.md` and Telegram `/revenue` (**PROJECTION**).
- **~874M issued IOUs** on XRPL/Stellar = ledger demand proof — **not** bank reserves.
- **Fiat** (MSB + partner BIC + nostro) = **PIPELINE** until bank wired.

---

## Capability matrix

| Capability | Label | How |
|------------|-------|-----|
| Clone monorepo + quickstart | **PROVEN** | `git clone` → `.env` from template → `scripts/quickstart.ps1` |
| On-chain proof (~874M IOUs) | **PROVEN** | [ON_CHAIN_PROOF](ON_CHAIN_PROOF.html) · [XRPL verification](XRPL_STELLAR_VERIFICATION.html) |
| Academy + launcher revenue | **PROVEN** | fthedu.unykorn.org · launch.unykorn.org |
| x402 public health | **PROVEN** | https://x402.unykorn.org/health |
| Wallet seeds in `.env` | **PROVEN** | Operator host only — never commit |
| BaaS batch pools | **PIPELINE** | `fiat-rails/baas-api` **:8097** — [BAAS_BATCH_POOLS](BAAS_BATCH_POOLS.html) |
| Arbitrage + orchestrator | **PIPELINE** | `:4022` · [ARBITRAGE_AND_BAAS](ARBITRAGE_AND_BAAS.html) |
| x402 US/EU/JP gateways | **PIPELINE** | `:4030` / `:4034` / `:4035` — [X402_GLOBAL_MESH](X402_GLOBAL_MESH.html) |
| Agent orchestrator + MCP | **PIPELINE** | `:4100` / `:4101` — [AGENTIC_RAG_AMM](AGENTIC_RAG_AMM.html) |
| Telegram bot | **PIPELINE** | `TELEGRAM_BOT_TOKEN` → pm2 `telegram-bot` — [TELEGRAM_OPERATOR](TELEGRAM_OPERATOR.html) |
| Fiat MSB + BIC + nostro | **PIPELINE** | [MSB_FIAT_RAILS](MSB_FIAT_RAILS.html) · [SWIFT investor page](../swift/) |
| MSB revenue A–E booked | **PROJECTION** | [TROPTIONS_REVENUE_ENGINE](TROPTIONS_REVENUE_ENGINE.html) |

---

## Operator routes (GitHub Pages)

| Route | Purpose |
|-------|---------|
| `/` | Investor home |
| `/command-center/` | Ports, PM2, activation |
| `/overview/` | This matrix (UI) |
| `/swift/` | Institutional fiat rails |
| `/revenue/` | Revenue summary |
| `/telegram/` | Bot setup |
| `/ecosystem/` | Live URL status |
| `/technical/index.html` | Full doc hub |

---

## PROVEN vs PIPELINE vs needs partner

| Area | Status |
|------|--------|
| Code + tests + PM2 configs | **PROVEN** |
| Live unykorn URLs (hub, academy, launcher, x402 health) | **PROVEN** |
| XRPL/Stellar/Polygon ledger issuance | **PROVEN** (IOU demand, not reserves) |
| fiat-rails `/health` on :4022–:4027 | **PIPELINE** |
| FedWire :4023 · SWIFT :4024 production wires | **PIPELINE** — **needs partner bank** |
| MSB omnibus + BIC + RMA | **PIPELINE** — **needs partner** |
| Neobank / BaaS scenario fees | **PROJECTION** |
| $825/hr · $874K/mo run-rate | **PROJECTION** |

---

## Links

- [Command Center](../command-center/)
- [AWS activation runbook](AWS_ACTIVATION_RUNBOOK.html)
- [Partner bank mesh](PARTNER_BANK_MESH.html)
- [GitHub monorepo](https://github.com/FTHTrading/Troptions-full-pack)
