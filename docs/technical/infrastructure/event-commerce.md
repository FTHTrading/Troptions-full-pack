---
layout: default
title: Event Commerce
permalink: /infrastructure/event-commerce/
---

# Event commerce & campaigns

Campaign launcher, Solana DEX, and event-commerce modules are implemented inside **exchange-os**:

- [`frontends/exchange-os/docs/SOLANA_CAMPAIGN_LAUNCHER_IMPLEMENTATION_REPORT.md`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/docs/SOLANA_CAMPAIGN_LAUNCHER_IMPLEMENTATION_REPORT.md)
- [`contracts/solana/scripts/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/contracts/solana/scripts) — mint, LP seed, airdrop helpers

## TTN / broadcast

TTN namespace registry: [`backend/ttn-launcher/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/backend/ttn-launcher) + migration script [`scripts/migrate-namespaces-to-l1.py`](https://github.com/fthtrading/Troptions-full-pack/blob/main/scripts/migrate-namespaces-to-l1.py).

## Commerce rails

Stripe checkout paths in fth-academy; on-chain settlement hooks via L1 `settlement_*` and dao settlement API.

## Status

**8/10** for devnet/mainnet scripting with operator keys; live ticketed events require DNS, TLS, and payment keys — see [production checklist](../deploy/production-checklist.html).
