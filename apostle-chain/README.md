# Apostle Chain (external)

TROPTIONS does not vendor the full Apostle Chain source. Point builds at your local clone:

| Platform | Path |
|----------|------|
| Windows | `C:\Users\Kevan\apostle-chain` |
| Linux | `$HOME/apostle-chain` |

## Build & run

```bash
# From apostle-chain repo (see upstream README)
cargo build --release
# Default API: http://127.0.0.1:7332
```

Use `scripts/deploy_apostle.sh` or `scripts/deploy_apostle.ps1` from Troptions root after Apostle is built.

## API (chain_id 7332)

- `GET /health`, `GET /status`
- `POST /v1/agents/register`, `POST /v1/agents/heartbeat`
- `POST /v1/tx`, `POST /v1/airdrop`
- ATP amounts are **strings** with 18 decimals.
