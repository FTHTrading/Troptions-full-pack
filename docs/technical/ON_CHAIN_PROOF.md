---
title: On-chain proof registry
layout: default
permalink: /technical/ON_CHAIN_PROOF.html
---

# On-Chain Proof Registry

**Last updated:** 2026-05-21  
**Purpose:** Single justified table for investors and counterparties. Labels: **PROVEN** (explorer-verified), **PIPELINE**, **PROJECTION** (illustrative only).

**XRPL/Stellar detail:** [`XRPL_STELLAR_VERIFICATION.md`](XRPL_STELLAR_VERIFICATION.html) — user-verified 2026-05-21 via WebSocket + Horizon.

---

## Evidence legend

| Evidence type | Meaning |
|---------------|---------|
| Repo | Address documented in Troptions-full-pack or partner repos |
| Explorer (user verified) | Operator live query / manual explorer review 2026-05-21 |
| Explorer (public URL) | Anyone can open the link |
| Operator attestation | Documented claim only — not on-chain proof |
| PENDING | Address in repo; balance/activity not verified in this pass |

**Issued supply:** IOU amounts on ledger — **not** market cap, desk PnL, or secondary trading volume.

---

## Polygon — FTH community tokens (PROVEN)

| Asset | Address | Link | Status |
|-------|---------|------|--------|
| **KENNY** | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` | [PolygonScan](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7) | **LIVE** — 100M max supply |
| **EVL** | `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3` | [PolygonScan](https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3) | **LIVE** — 250M max supply |

**FTH trading UI:** [fthedu.unykorn.org](https://fthedu.unykorn.org) — operator-verified token pages.

---

## Polygon — Genesis World (9 contracts, PROVEN)

Full table: [`GENESIS_POLYGON_CONTRACTS.md`](GENESIS_POLYGON_CONTRACTS.html). Live app: [drunks.app](https://drunks.app).

---

## XRPL — production issuance (PROVEN)

| Role | Address | Explorer |
|------|---------|----------|
| Issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | [XRPScan](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ) |
| Distribution | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | [XRPScan](https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt) |
| AMM pool | `rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp` | [XRPScan](https://xrpscan.com/account/rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp) |
| Ops | `rfbZzM6SGZHbfxrg85vyeKSEMMQCfNXTNw` | [XRPScan](https://xrpscan.com/account/rfbZzM6SGZHbfxrg85vyeKSEMMQCfNXTNw) |
| Bootstrap (deprecated) | `rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3` | [XRPScan](https://xrpscan.com/account/rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3) |
| Legacy gateway (README) | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` | [Bithomp](https://bithomp.com/explorer/rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3) |

### XRPL issued supply on ledger (distribution holdings, PROVEN)

| Asset | Amount (XRPL leg) |
|-------|-------------------|
| TROPTIONS | ~100,000,000 |
| USDC | 174,000,000 |
| USDT | 100,000,000 |
| EURC | 50,000,000 |
| DAI | 50,000,000 |

**AMM:** Active pool on `rBU6ex…` (~1k TROPTIONS + LP tokens). **Reserves:** XRP thin but operational.

**Do not claim** Exchange OS **$175M desk** as verified on-chain fact. Use **274M USDC issued** (XRPL+Stellar) per [`XRPL_STELLAR_VERIFICATION.md`](XRPL_STELLAR_VERIFICATION.html).

---

## Stellar (PROVEN)

| Role | Address | Explorer |
|------|---------|----------|
| Issuer | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | [Stellar Expert](https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4) |
| Distribution | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | [Stellar Expert](https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC) |

### Stellar issued supply (distribution, PROVEN)

| Asset | Amount (Stellar leg) |
|-------|----------------------|
| TROPTIONS | ~99,990,000 |
| USDC | 100,000,000 |
| USDT | 100,000,000 |
| EURC | 50,000,000 |
| DAI | 50,000,000 |

---

## Cross-chain totals (PROVEN — issued supply on ledger)

| Asset | Total |
|-------|-------|
| TROPTIONS | **~200M** |
| USDC | **274M** |
| USDT | **200M** |
| EURC | **100M** |
| DAI | **100M** |
| **Sum** | **~874M** issued IOU units |

---

## Live endpoints (partial)

| Endpoint | Status |
|----------|--------|
| [fthedu.unykorn.org](https://fthedu.unykorn.org) | PROVEN — KENNY/EVL UI |
| [x402.unykorn.org/health](https://x402.unykorn.org/health) | PROVEN |
| [troptions.unykorn.org](https://troptions.unykorn.org/troptions) | PROVEN |
| [launch.unykorn.org](https://launch.unykorn.org) | PROVEN |
| [drunks.app](https://drunks.app) | PROVEN |
| twin.unykorn.org, x402api.unykorn.org | PENDING — CF origin flaky |

---

## Related audit files

| File | Role |
|------|------|
| [`FINAL_ECOSYSTEM_AUDIT.md`](FINAL_ECOSYSTEM_AUDIT.html) | Score **9.5/10** |
| [`XRPL_STELLAR_VERIFICATION.md`](XRPL_STELLAR_VERIFICATION.html) | Full XRPL/Stellar report |
| [`counterparty/PROOF_FOR_COUNTERPARTIES.md`](counterparty/PROOF_FOR_COUNTERPARTIES.html) | Bijan-ready bullets |
| [`ECOSYSTEM_MAP.md`](ECOSYSTEM_MAP.html) | Repos + live URLs |
