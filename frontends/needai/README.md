# NEED AI — Troptions telecom frontend (minimal)

Minimal static shell for NEED AI phone answering integration. Full NEED AI app lives outside this monorepo (Telnyx + Stripe); Troptions routes calls via:

- `backend/dao-service/telecom_router.py` — Telnyx webhook
- `backend/x402-gateway` — `/v1/needai/dispatch`
- UnyKorn `x402-credit-gateway` needai routes when `X402_UPSTREAM` is set

## Environment (repo root `.env`)

| Variable | Purpose |
|----------|---------|
| `TELNYX_API_KEY` | Telnyx REST (from operator Desktop `tele2 api.txt` via `scripts/setup-local-env.ps1`) |
| `TELNYX_PUBLIC_KEY` | Optional webhook verification |
| `TELNYX_WEBHOOK_SECRET` | Optional signature secret |
| `TELECOM_DRY_RUN` | Default `true` — no outbound until tested |

See [`docs/deploy/secrets-setup.md`](../../docs/deploy/secrets-setup.md).

## Dry-run

Set `TELECOM_DRY_RUN=true` (default). Without `TELNYX_API_KEY`, dao-service forces dry-run. Webhooks return classification without outbound calls.

## Production

```bash
export TELNYX_API_KEY=...   # never commit
export TELECOM_DRY_RUN=false
export TELNYX_WEBHOOK_SECRET=...
```

Open `index.html` for operator status links only — not a full NEED AI clone.
