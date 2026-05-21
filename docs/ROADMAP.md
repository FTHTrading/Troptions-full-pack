---
layout: default
title: Roadmap
permalink: /roadmap/
---

# Roadmap

Canonical L1 roadmap: [`docs/ROADMAP.md`](ROADMAP.html) (also at repo root after merge).

## Current (v0.1 on `main`)

- **Sovereign Sequencer** — single-node ordering (not BFT)
- RocksDB persistence, signed submit, on-chain DAO + treasury
- Prometheus metrics `:9945`
- DAO dashboard reads L1 RPC

**Maturity:** **8.2/10** code + tests; **~8.5/10** after ops TLS + API keys + DNS

## Q3 2026

- Multi-sequencer federation with fraud-proof challenge window
- Light client state proof export
- Hardened settlement gateway (mTLS, HSM)

## Q4 2026

- **BFT quorum** for sequencer set
- Cross-region failover
- External audit of consensus + treasury multisig

## Explicitly not claimed today

- Byzantine fault tolerant consensus
- Permissionless validator set
- Instant multi-sequencer finality
- Public x402 facilitator (optional branch)

## Optional integrations (separate branches)

| Track | Branch | Maturity |
|-------|--------|----------|
| x402 / Apostle | `feature/x402-full-integration` | ~6.5/10 |
| Avid counterparty pack | docs under `docs/counterparty/` | planning only |
