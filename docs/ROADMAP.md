# TROPTIONS L1 Roadmap

## Current (v0.1 — production upgrade branch)

- **Sovereign Sequencer (single-node)** — one `troptions-node` orders transactions locally
- RocksDB persistence (state, soulbounds, settlements, balances)
- Signed `submit_transaction` RPC (Ed25519)
- On-chain treasury balances + multisig for debits > 1000
- DAO governance on L1; dao-service is a light client
- Prometheus metrics on `:9945`

## Q3 2026

- Multi-sequencer federation with **fraud proof challenge window**
- Light client state proofs export
- Hardened settlement gateway (mTLS, HSM keys)

## Q4 2026

- **BFT quorum** committee for sequencer set (not implemented today)
- Cross-region sequencer failover
- External audit of consensus + treasury multisig

## Explicitly not claimed today

- Full Byzantine fault tolerant consensus
- Permissionless validator set
- Instant finality across multiple independent sequencers
