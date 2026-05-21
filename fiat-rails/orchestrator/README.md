# Payment orchestrator (wire → IOU)

**PM2 name:** `payment-orchestrator` · **Port:** `4022` · **Label:** **PIPELINE** until MSB + bank omnibus live.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service health |
| `POST` | `/api/v1/payments/wire` | Bank webhook: wire received → compliance → verify → mint IOU |
| `GET` | `/api/v1/payments/:id` | Payment status |
| `GET` | `/api/v1/payments` | Admin list (paginated) |

OpenAPI: [`openapi.yaml`](openapi.yaml)

## Environment (operator `.env` only — never commit)

Copy [`../.env.template`](../.env.template) to `fiat-rails/.env`:

| Variable | Purpose |
|----------|---------|
| `ISSUER_SEED` | XRPL issuer wallet seed for live mint — **omit** for PIPELINE mock hashes |
| `ISSUER_ADDRESS` | Display issuer (`rJLMST…` default) |
| `COMPLIANCE_URL` | Default `http://127.0.0.1:4025` |
| `FEDWIRE_ADAPTER` | Default `http://127.0.0.1:4023` |
| `COMPLIANCE_STRICT` | Set `true` to force compliance holds in dev |
| `EXCHANGE_OS_URL` | Optional deposit notification |

**NEVER commit `ISSUER_SEED` or bank credentials.**

## Local run

```powershell
cd C:\Users\Kevan\Troptions-full-pack\fiat-rails\orchestrator
npm install
$env:PORT=4022
node index.js
```

## Test wire webhook

```powershell
curl -X POST http://127.0.0.1:4022/api/v1/payments/wire `
  -H "Content-Type: application/json" `
  -d '{"source_wire_ref":"TEST-001","amount":"100","currency":"USD","recipient_address":"rPT1MdvSi4WpeE4d3bAMEYaFBPZsTF8j1E","sender_info":{"name":"Test Sender"},"reference":"smoke"}'
```

Without `ISSUER_SEED`, response includes `"label":"PIPELINE"` and `iou_tx_hash` prefixed with `PIPELINE_`.
