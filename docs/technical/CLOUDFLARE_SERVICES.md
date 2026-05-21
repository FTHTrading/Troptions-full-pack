---
title: Cloudflare services — junior, goat, twin, x402
layout: default
permalink: /technical/CLOUDFLARE_SERVICES.html
---

# Cloudflare services — junior, goat, twin, x402

**Last verified:** 2026-05-21  
**Zone:** `unykorn.org` (`8aa6916f4c1c7e8e42130455dfd5c029`)  
**Operator script:** `scripts/cloudflare-status.ps1` (reads `CLOUDFLARE_API_TOKEN` from gitignored `.env`)

---

## Summary

| Hostname | DNS target | Origin (expected) | Status (2026-05-21) |
|----------|------------|-------------------|---------------------|
| `x402.unykorn.org` | CNAME → `x402-unykorn.pages.dev` | Cloudflare Pages / mesh health | **CONFIRMED** — `/health` HTTP 200 |
| `goat.unykorn.org` | CNAME → `a2da25a0-…cfargotunnel.com` | Local `127.0.0.1:8850` (GoatX site) | **CONFIRMED** when tunnel + `node server.js` running |
| `junior.unykorn.org` | CNAME → `3fe7b6d1-…cfargotunnel.com` | Local `127.0.0.1:4099` (Junior/Tilden OS) | **PENDING** — tunnel OK; origin :4099 must be started |
| `twin.unykorn.org` | A → `98.91.89.169` (EC2) | EC2 `:8402` digital twin | **PENDING** — Cloudflare 522 (EC2 origin down) |
| `x402api.unykorn.org` | A → `98.91.89.169` (EC2) | EC2 API docs | **PENDING** — same stale EC2 IP as twin |

**Do not conflate** `x402.unykorn.org` (healthy Pages/tunnel path) with `twin` / `x402api` (legacy A records to EC2).

---

## Junior (Tilden OS)

| Item | Value |
|------|--------|
| Public URLs | `https://junior.unykorn.org`, `https://jr.unykorn.org`, `https://tilden.unykorn.org`, `https://tilden-api.unykorn.org` |
| Tunnel config | `C:\Users\Kevan\.cloudflared\junior-tilden.yml` (tunnel `3fe7b6d1-ea63-48f3-b70b-a9ccedb0f336`) |
| Ingress | `junior` / `jr` → `http://localhost:4099`; `tilden` → `:3000`; `tilden-api` → `:4001` |
| Repo (Exchange OS registry) | `kevanbtc/junior-tilden` |

**Boot checklist**

1. Start Junior API on port **4099** (project path on operator machine — not in Troptions-full-pack).
2. Ensure `tilden` (:3000) and `tilden-api` (:4001) if those hostnames are needed.
3. Run tunnel: `cloudflared tunnel --config C:\Users\Kevan\.cloudflared\junior-tilden.yml run`
4. Probe: `curl -I https://junior.unykorn.org`

---

## Goat (GoatX / TGOAT)

| Item | Value |
|------|--------|
| Public URL | `https://goat.unykorn.org` |
| Tunnel config | `C:\Users\Kevan\.cloudflared\goat.yml` (tunnel `a2da25a0-808e-49ed-8acd-18a732f2db70`) |
| Origin | `C:\Users\Kevan\iCloudDrive\Archives\projects\goat-launch\server.js` → **8850** |
| PM2 (optional) | `iCloudDrive\Archives\projects\goat-launch\ecosystem.config.js` — `tgoat-governance` daemon |

**Boot checklist**

1. `cd goat-launch && node server.js` (listens `127.0.0.1:8850`).
2. `cloudflared tunnel --config C:\Users\Kevan\.cloudflared\goat.yml run` (or systemd equivalent).
3. Probe: `curl -I https://goat.unykorn.org` → expect **200**.

---

## Twin & x402api (EC2 origin — manual fix)

Per [UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws) (`x402-book/src/ops/infrastructure.md`):

- `twin.unykorn.org` → EC2 **:8402** (`digital_twin_server.py`)
- `x402api.unykorn.org` → EC2 mesh API docs

**Current DNS (API read):** both are **A** records to `98.91.89.169` (proxied). Health uses **CNAME** to Pages — different path.

**Fix options (operator)**

1. **Restore EC2** — SSH production host, start twin (:8402) and API processes; confirm security group allows Cloudflare.
2. **Retarget DNS** — Point `twin` / `x402api` CNAME to the same **cloudflared tunnel** as working `x402` health (only if those services run behind that tunnel).
3. See [CLOUDFLARE_ORIGIN_FIX.md](CLOUDFLARE_ORIGIN_FIX.html) for curl probes and Cloudflare dashboard steps.

API token scope may allow **read** DNS but not **write** — if PATCH fails, use dashboard manually.

---

## x402 routing

| Surface | Role |
|---------|------|
| `https://x402.unykorn.org/health` | Public mesh health (**CONFIRMED**) |
| Monorepo `backend/x402-gateway` | Local sidecar **:4020** — set `X402_UPSTREAM=http://127.0.0.1:4020` when co-located with UnyKorn gateway |
| Apostle Chain | **:7332** — ATP settlement |
| Popeye relay | **:4021** |

See [X402_INTEGRATION.md](X402_INTEGRATION.html).

---

## GitHub Pages custom domains (impact / aurora)

Per [IMPACT_DNS.md](IMPACT_DNS.html). **Zone:** `unykorn.org` (`8aa6916f4c1c7e8e42130455dfd5c029`).

| Hostname | DNS (Cloudflare) | Origin | Status (2026-05-21) |
|----------|------------------|--------|---------------------|
| `impact.unykorn.org` | CNAME → `fthtrading.github.io` (DNS only) | [impact-site](https://github.com/FTHTrading/impact-site) Pages | **PENDING TLS** — NXDOMAIN fixed; Pages **200** at `/impact-site/` |
| `aurora.unykorn.org` | CNAME → `fthtrading.github.io` (DNS only) | [aurora-site](https://github.com/FTHTrading/aurora-site) Pages | **PENDING TLS** — same pattern |

**Manual dashboard:** DNS → Add CNAME `impact` / `aurora` → `fthtrading.github.io` → Proxy **off**.  
**GitHub:** Each repo → Settings → Pages → Source **GitHub Actions**; custom domain must match repo root `CNAME` file.

---

## Related live surfaces (same zone)

| Hostname | Notes |
|----------|--------|
| `portfolio.unykorn.org` | Portfolio registry — HTTP 200 |
| `fifa.unykorn.org` | WWAI FIFA — HTTP 200 |
| `whichway.live` | Separate zone — WWAI guest OS |

---

## Scripts

```powershell
.\scripts\cloudflare-status.ps1
.\scripts\activate-ai-stack.ps1
```

Never commit `CLOUDFLARE_API_TOKEN` or log full tokens (suffix `e4fa5` is sufficient for audit notes).
