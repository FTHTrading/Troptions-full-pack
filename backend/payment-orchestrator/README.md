# payment-orchestrator (PIPELINE)

Fiat/crypto routing — **port 4022** (adjacent to `popeye-relay` on **4021**).

- **Label:** PIPELINE until MSB compliance, FedWire, and SWIFT bridges are configured.
- **Health:** `GET http://127.0.0.1:4022/health`
- **PM2:** `payment-orchestrator` with `autorestart: false`.

Operator desk USDC attestations route through **PIPELINE** verification until correspondent + FedWire reporting is live.
