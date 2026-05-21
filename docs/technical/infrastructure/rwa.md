---
layout: default
title: RWA
permalink: /infrastructure/rwa/
---

# Real World Assets (RWA)

RWA tokenization and marketplace logic primarily lives in **Exchange OS** docs and adapters:

- [`frontends/exchange-os/docs/troptions/rwa/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/frontends/exchange-os/docs/troptions/rwa)

## Provider-neutral rules

Exchange OS maintains adapter registry and evidence requirements for asset listings. L1 soulbound credentials can attest completions; full compliance workflow is **counterparty-specific**.

## Related contracts

- Polygon assets in [`contracts/polygon/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/contracts/polygon)
- Separate **RWA platform** skill/repo may apply for greenfield tokenization — this pack focuses on TROPTIONS integration surfaces.

## Status

**7.5/10** — schemas and audits exist in Exchange OS; mainnet listing gates depend on operator KYC/evidence, not automated by L1 alone.
