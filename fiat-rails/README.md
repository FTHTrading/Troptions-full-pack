# Fiat rails (post-MSB)

**Status:** `DESIGN` / `PIPELINE` — stubs only until FinCEN MSB program and correspondent bank are live.

| Service | Port | PM2 name |
|---------|------|----------|
| payment-orchestrator | 4022 | `payment-orchestrator` |
| fedwire-adapter | 4023 | `fedwire-adapter` |
| swift-bridge | 4024 | `swift-bridge` |
| compliance-engine | 4025 | `compliance-engine` |
| neobank-api | 4026 | `neobank-api` |
| iou-reserve-monitor | 4027 | `iou-reserve-monitor` |

Legacy Python stubs under `backend/payment-orchestrator` and `backend/msb-compliance` are superseded by this tree.

## Setup

```powershell
cd C:\Users\Kevan\Troptions-full-pack
.\scripts\setup-fiat-rails.ps1
```

## Run (PM2)

```powershell
pm2 start ecosystem.config.js --only payment-orchestrator,fedwire-adapter,swift-bridge,compliance-engine,neobank-api,iou-reserve-monitor
```

## Health

```powershell
curl http://127.0.0.1:4022/health
curl http://127.0.0.1:4025/health
```

Canonical architecture: [`docs/technical/SYSTEM_MANIFEST.md`](../docs/technical/SYSTEM_MANIFEST.md).
