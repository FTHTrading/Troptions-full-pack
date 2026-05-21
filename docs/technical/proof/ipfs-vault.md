---
layout: default
title: IPFS Vault
permalink: /proof/ipfs-vault/
---

# IPFS vault (planned / partial)

## Architecture intent

Education and credential flows target IPFS-backed artifact storage with L1 soulbound references — see [`docs/ARCHITECTURE.md`](../ARCHITECTURE.html) (certificates → IPFS planned).

## Exchange OS vault tooling

Operational vault scripts live under Exchange OS:

- [`frontends/exchange-os/scripts/vault-deploy.mjs`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/scripts/vault-deploy.mjs)
- [`vault-status.mjs`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/scripts/vault-status.mjs)
- [`vault-lock.mjs`](https://github.com/fthtrading/Troptions-full-pack/blob/main/frontends/exchange-os/scripts/vault-lock.mjs)

## Truth label

| Status | Item |
|--------|------|
| **PENDING** | Public IPFS gateway + pinned credential manifest on production domain |
| **CONFIRMED** | Soulbound mint/revoke on L1 (`l1/crates/soulbound/`) |

## Verify soulbound locally

```powershell
cd l1
cargo test -p soulbound
```

Do not claim end-to-end IPFS proof pipeline is live until operator publishes CIDs and DNS.
