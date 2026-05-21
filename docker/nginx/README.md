# Production nginx (TLS termination)

HTTPS **443** reverse proxy paths:

| Path | Backend | Port |
|------|---------|------|
| `/l1/` | L1 JSON-RPC | 9944 |
| `/ai/` | DONK tutor | 8090 |
| `/fth/` | FTH Academy | 8091 |
| `/ttn/` | TTN launcher | 8092 |
| `/dao/` | DAO service | 8093 |

## TLS setup

```powershell
.\scripts\setup-tls.ps1
```

```bash
./scripts/setup-tls.sh
```

## Docker Compose

[`docker/docker-compose.prod.yml`](../docker-compose.prod.yml) mounts this directory and `ssl/`.

- **Linux (default):** upstreams use Compose service names (`l1`, `dao-service`, …).
- **Windows Docker Desktop (host PM2):** set `NGINX_*_HOST=host.docker.internal` in compose env if backends run on the host.

## Health

`curl -k https://localhost/health` — nginx TLS smoke check.
