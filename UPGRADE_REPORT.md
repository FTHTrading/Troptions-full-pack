# Production Upgrade Report (Items 1–10)

## Completed

1. **RocksDB** — `l1/crates/state/persistence.rs`, node load/save, tests
2. **Signed submit** — Ed25519 in runtime, `InvalidSignature`, integration test
3. **Settlement HTTP** — `settlement_api.py` + rate limits; optional `settlement_router.py`
4. **Multisig** — `runtime/multisig.rs`, threshold 1000
5. **Treasury L1** — `treasury_balances`, dao cache poll
6. **Docs** — `docs/ROADMAP.md` (sequencer ≠ BFT, Q4 2026 BFT)
7. **Dashboard L1** — `dao_getProposals`, `dao_getVotes`, `treasury_getBalance`
8. **DAO on L1** — governance in runtime; Python light client
9. **Prod deploy** — `docker-compose.prod.yml`, `deploy-production.*`, `deploy.yml`, PM2
10. **Tests + metrics** — Prometheus :9945, `ops/grafana/dashboard.json`, integration tests

## Honest limits

- Consensus is a **single-node sequencer**, not BFT.
- Settlement API allows dev mode without API keys when `SETTLEMENT_API_KEYS` unset.
