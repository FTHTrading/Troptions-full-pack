---
layout: default
title: On-Chain Proofs
permalink: /proof/on-chain-proofs/
---

# On-chain proofs (published addresses)

**Canonical registry:** [`ON_CHAIN_PROOF.md`](../ON_CHAIN_PROOF.md) (full table, evidence types, PENDING labels).

## Polygon — KENNY (PROVEN)

| Field | Value |
|-------|-------|
| Token | KENNY |
| Chain | Polygon mainnet |
| Contract | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` |

Explorer: [polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7)

## Polygon — EVL (PROVEN)

| Field | Value |
|-------|-------|
| Token | EVL |
| Chain | Polygon mainnet |
| Contract | `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3` |

Explorer: [polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3](https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3)

Sale/treasury env vars: [`.env.example`](https://github.com/fthtrading/Troptions-full-pack/blob/main/.env.example).

## Genesis World (9 contracts)

See [`GENESIS_POLYGON_CONTRACTS.md`](../GENESIS_POLYGON_CONTRACTS.md).

## XRPL — gateway (PENDING)

| Field | Value |
|-------|-------|
| Role | XRPL gateway (Exchange OS) |
| Address | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` |

Status: **PENDING** — verify on [Bithomp](https://bithomp.com/explorer/rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3) before citing balances.

Verification scripts: [`frontends/exchange-os/scripts/xrpl-verify-issuer-proof.mjs`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/scripts/xrpl-verify-issuer-proof.mjs)

## Solana

Launcher and mint scripts: [`contracts/solana/scripts/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/contracts/solana/scripts). Devnet/mainnet depends on operator RPC keys.

## Not verified here

- Any **$175M** notional claims — Exchange OS desk reference / operator attestation only
- Apostle ATP balances — separate chain (`feature/x402-full-integration`)

**Holder count:** Low holders on a new token does not disprove deployment; use contract tab and mint history.
