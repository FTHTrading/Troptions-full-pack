---
title: Genesis Polygon contracts
layout: default
permalink: /technical/GENESIS_POLYGON_CONTRACTS.html
---

# Genesis World — Polygon Mainnet Contracts (9)

**Source of truth:** [`genesis-world/README.md`](https://github.com/FTHTrading/genesis-world/blob/main/README.md) (deployed contracts table).  
**Verification:** PolygonScan public URLs (no API key required for human review). User screenshot audit 2026-05-21.

| # | Contract | Symbol / role | Address | PolygonScan |
|---|----------|---------------|---------|-------------|
| 1 | GSPCore | `$CORE` | `0x2c90f99cEd1f2F90cA19EBD23C82b1eD9B3F2A5c` | [View](https://polygonscan.com/address/0x2c90f99cEd1f2F90cA19EBD23C82b1eD9B3F2A5c) |
| 2 | GSPOrigin | `$ORIGIN` | `0xc4bA9370FC3645a9CB1c2297C74bb7D0253482DD` | [View](https://polygonscan.com/address/0xc4bA9370FC3645a9CB1c2297C74bb7D0253482DD) |
| 3 | AurumToken | `$AURUM` | `0xf28cbbf1ff57eDF1346eB01C85dEffb706613fdB` | [View](https://polygonscan.com/address/0xf28cbbf1ff57eDF1346eB01C85dEffb706613fdB) |
| 4 | LexToken | `$LEX` | `0xD3da2c4c9D0f14d054FE4581fb473115EC062BA1` | [View](https://polygonscan.com/address/0xD3da2c4c9D0f14d054FE4581fb473115EC062BA1) |
| 5 | NovaToken | `$NOVA` | `0x31a76C9028fAcD5E4d6f8f145897561b306d2829` | [View](https://polygonscan.com/address/0x31a76C9028fAcD5E4d6f8f145897561b306d2829) |
| 6 | MercToken | `$MERC` | `0xa5D739581961901658bA1f31E2a3237F6F37bE64` | [View](https://polygonscan.com/address/0xa5D739581961901658bA1f31E2a3237F6F37bE64) |
| 7 | LudoToken | `$LUDO` | `0x51D304f954986C26761F99F9b7dA57E34A7ebFfA` | [View](https://polygonscan.com/address/0x51D304f954986C26761F99F9b7dA57E34A7ebFfA) |
| 8 | PatronVault | Staking vault | `0x4AA794ee9B5C7Bf3C683b7bb5dd7528852950399` | [View](https://polygonscan.com/address/0x4AA794ee9B5C7Bf3C683b7bb5dd7528852950399) |
| 9 | AgentIdentityNFT | `GSPID` (15 soul-bound) | `0x615Fd599faeE5F14d8c0198e18eAC9b948b05aed` | [View](https://polygonscan.com/address/0x615Fd599faeE5F14d8c0198e18eAC9b948b05aed) |

## Related surfaces (not part of the 9)

| Surface | URL / note |
|---------|------------|
| drunks.app | [https://drunks.app](https://drunks.app) — live app; see `genesis-world/drunks-app/README.md` |
| gsp-api health | `https://gsp-api.kevanbtc.workers.dev/api/health` |
| Genesis X402 redeploy set | `genesis-world/drunks-app/src/lib/contracts/addresses.ts` — **post–wallet-recovery** adapter/NFT addresses; do not mix with the nine GSP rail contracts above without explicit migration notes |

## Honesty

- **PROVEN (Polygon):** Contracts exist at listed addresses; genesis-world README + PolygonScan explorer pages are the evidence path.
- **Separate from Troptions-full-pack KENNY/EVL:** Community tokens are documented in [`ON_CHAIN_PROOF.md`](ON_CHAIN_PROOF.md).
