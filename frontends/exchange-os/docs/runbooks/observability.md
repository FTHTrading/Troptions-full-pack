# Observability Runbook

## Dashboard Endpoints
- `/admin/troptions/observability`
- `/admin/troptions/metrics`
- `/admin/troptions/logs`

## Snapshot Export
```bash
node scripts/export-observability-snapshot.mjs
```

## Durable Observability (Postgres)

When `TROPTIONS_DB_ADAPTER=postgres` and `DATABASE_URL` is configured, the platform writes:

- structured logs to `control_plane_structured_logs`
- metric events to `control_plane_metrics_events`
- escalations to `control_plane_escalations`
- incident drill runs to `control_plane_incident_drills`

## Authenticated API Exports

- `GET /api/troptions/observability/snapshot`
- `GET /api/troptions/observability/export?limit=500`

Both endpoints are protected by control-plane auth guards and operator security controls.

## Minimum Review Cadence
- Daily: request failures, auth failures, gate blocks.
- Weekly: trend review and policy updates.

## Sensitive Data Rules
- Never store raw bearer tokens, private keys, or secret values in logs.
- Use redacted logs only.
