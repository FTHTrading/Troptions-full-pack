---
title: XRPL & Stellar verification
layout: default
permalink: /technical/XRPL_STELLAR_VERIFICATION.html
---

# XRPL & Stellar verification (user-verified)

**Date:** 2026-05-21  
**Method:** XRPL WebSocket (`wss://xrplcluster.com`) + Stellar Horizon (`https://horizon.stellar.org`)  
**Overall stack score:** **9.5 / 10** — only remaining gap: intermittent Cloudflare origin health on some web endpoints (`twin`, `x402api`).

**Language discipline:** Figures below are **issued supply on ledger** (IOU issuance / trust-line balances), **not** market cap, trade-desk PnL, or verified secondary-market value. Do **not** cite Exchange OS **$175M desk** notional as an on-chain fact.

**IOU vs native stablecoin:** **USDC**, **USDT**, **DAI**, and **EURC** rows below are **TROPTIONS-issued IOUs** on the production issuer accounts — **not** Circle/Tether/Maker native assets. Holders have ledger credits (promise-to-pay); **regulated 1:1 fiat redemption** is **PIPELINE** until MSB + bank omnibus + FedWire/SWIFT are operational. See [System manifest](SYSTEM_MANIFEST.html).

---

## XRPL production wallets

| Role | Address | Explorer |
|------|---------|----------|
| **Production issuer** | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | [XRPScan](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) · [Bithomp](https://bithomp.com/explorer/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) |
| **Distribution treasury** | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | [XRPScan](https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt) · [Bithomp](https://bithomp.com/explorer/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt) |
| **AMM pool** | `rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp` | [XRPScan](https://xrpscan.com/account/rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp) |
| **Ops spend** | `rfbZzM6SGZHbfxrg85vyeKSEMMQCfNXTNw` | [XRPScan](https://xrpscan.com/account/rfbZzM6SGZHbfxrg85vyeKSEMMQCfNXTNw) |
| **Bootstrap (deprecated)** | `rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3` | [XRPScan](https://xrpscan.com/account/rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3) — legacy genesis; **not** production issuer |
| **Legacy gateway (docs only)** | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` | [Bithomp](https://bithomp.com/explorer/rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3) — README/.env; superseded by production issuer above |

**Account status (2026-05-21):** All six accounts returned live ledger data. Production XRP reserves are **thin but operational** (~20.5 XRP across production wallets; issuer/AMM near minimum reserve).

---

## XRPL issued supply (issuer `rJLMST…`)

Issued to distribution `rNX4fa…` unless noted. Amounts from live `account_lines` / issuance queries.

| Asset | Issued (XRPL) | Notes |
|-------|---------------|-------|
| TROPTIONS | ~100,000,000 | ~100M on XRPL leg of ~200M cross-chain |
| USDC (TROPTIONS IOU) | 174,000,000 | XRPL leg of **274M** USDC-labeled IOU cross-chain total — **not Circle native** |
| USDT | 100,000,000 | |
| EURC | 50,000,000 | XRPL leg of **100M EURC** cross-chain |
| DAI | 50,000,000 | XRPL leg of **100M DAI** cross-chain |
| TROPTIONS (AMM) | ~1,000 | Pool `rBU6ex…` — **AMM liquidity live** |

---

## Stellar production wallets

| Role | Address | Explorer |
|------|---------|----------|
| **Issuer** | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | [Stellar Expert](https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4) |
| **Distribution** | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | [Stellar Expert](https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC) |

**Distribution holdings (2026-05-21):** TROPTIONS ~99.99M, USDC 100M, USDT 100M, EURC 50M, DAI 50M — mirror of XRPL issuance strategy.

---

## Cross-chain issued supply totals (PROVEN)

| Asset | XRPL | Stellar | **Total issued on ledger** |
|-------|------|---------|----------------------------|
| **TROPTIONS** | ~100M | ~100M | **~200M** |
| **USDC (IOU)** | 174M | 100M | **274M** |
| **USDT** | 100M | 100M | **200M** |
| **EURC** | 50M | 50M | **100M** |
| **DAI** | 50M | 50M | **100M** |
| **Approx. total** | | | **~874M** issued units (1:1 IOU labels, not USD market cap) |

---

## Honest caveats

1. **Bootstrap deprecated** — `rPF2M1Qjd…` and README gateway `rPF2M1QjRj…` are legacy; production issuance flows through `rJLMST…` / `rNX4fa…`.
2. **Reserve margin** — Production XRP balances are low; ops wallet carries most spend buffer.
3. **Desk narrative** — Any Exchange OS desk notional is **operator attestation** until matched to ledger exports; use **274M USDC issued** language, not “$175M verified desk.”
4. **Registry source** — `T-Lev-8-/OPERATIONS/WALLET_ADDRESS_REGISTRY.md`, `frontends/exchange-os/src/content/troptions/troptionsWalletHubRegistry.ts`

---

## Related

- [`ON_CHAIN_PROOF.md`](ON_CHAIN_PROOF.html) — Polygon + unified proof registry  
- [`FINAL_ECOSYSTEM_AUDIT.md`](FINAL_ECOSYSTEM_AUDIT.html) — **9.5/10** scorecard  
- [`counterparty/PROOF_FOR_COUNTERPARTIES.md`](counterparty/PROOF_FOR_COUNTERPARTIES.html) — institutional counterparty pack
