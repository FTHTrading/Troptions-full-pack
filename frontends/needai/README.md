# NEED AI — Troptions telecom frontend (minimal)

Minimal static shell for NEED AI phone answering integration. Full NEED AI app lives outside this monorepo (Telnyx + Stripe); Troptions routes calls via:

- `backend/dao-service/telecom_router.py` — Telnyx webhook
- `backend/x402-gateway` — `/v1/needai/dispatch`
- UnyKorn `x402-credit-gateway` needai routes when `X402_UPSTREAM` is set

## Dry-run

Set `TELECOM_DRY_RUN=true` (default). Webhooks return classification without outbound calls.

## Production

```bash
export TELECOM_DRY_RUN=false
export X402_MODE=production
export TELNYX_WEBHOOK_SECRET=...
```

Open `index.html` for operator status links only — not a full NEED AI clone.
