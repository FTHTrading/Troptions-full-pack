---
layout: default
title: On-Chain Proofs
permalink: /proof/on-chain-proofs/
---

# On-chain proofs (published addresses)

Addresses below are **CONFIRMED** as documented contract/gateway identifiers in [`README.md`](https://github.com/fthtrading/Troptions-full-pack/blob/main/README.md). Verify balances and activity on chain explorers independently.

## Polygon — KENNY

| Field | Value |
|-------|-------|
| Token | KENNY |
| Chain | Polygon mainnet |
| Contract | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` |

Explorer: [polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7)

Sale/treasury env vars: see [`.env.example`](https://github.com/fthtrading/Troptions-full-pack/blob/main/.env.example).

## XRPL — gateway

| Field | Value |
|-------|-------|
| Role | XRPL gateway (Exchange OS) |
| Address | `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` |

Verification scripts: [`frontends/exchange-os/scripts/xrpl-verify-issuer-proof.mjs`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/scripts/xrpl-verify-issuer-proof.mjs)

## Solana

Launcher and mint scripts: [`contracts/solana/scripts/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/contracts/solana/scripts). Devnet/mainnet depends on operator RPC keys.

## Not verified here

- Any **$175M** notional claims — Exchange OS desk reference / operator attestation only
- Apostle ATP balances — separate chain (`feature/x402-full-integration`)
