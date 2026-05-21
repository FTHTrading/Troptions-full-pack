---
title: Cloudflare origin fix — twin & x402api
layout: default
permalink: /technical/CLOUDFLARE_ORIGIN_FIX.html
---

# Cloudflare origin fix — `twin.unykorn.org` & `x402api.unykorn.org`

**Last updated:** 2026-05-21  
**Symptom:** Cloudflare **522** (connection timed out) or browser **timeout** on these hostnames while `https://x402.unykorn.org/health` returns **200**.

**Root cause (typical):** Cloudflare reaches the edge, but the **origin** behind the hostname (EC2 process, tunnel connector, or wrong DNS target) is down, unreachable, or listening on the wrong port.

Production mesh and operator runbooks live in **[UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws)** (`aws/`, `packages/x402-credit-gateway/docs/`). This doc is the Troptions operator checklist for the two flaky Unykorn hostnames.

---

## Prerequisites

1. **Local credentials** (gitignored):

   ```powershell
   .\scripts\setup-cloudflare-env.ps1
   # Optional custom path:
   .\scripts\setup-cloudflare-env.ps1 "C:\path\to\Read all resources API token was su.txt"
   ```

2. **Variables** in repo-root `.env`:

   | Variable | Purpose |
   |----------|---------|
   | `CLOUDFLARE_API_TOKEN` | Zone/DNS/tunnel API ("Read all resources" `cfut_…`) |
   | `CLOUDFLARE_ACCOUNT_ID` | Account scope for API calls (set manually if not in txt) |

3. **Verify token** (redact token in logs; use env var):

   ```powershell
   $token = (Get-Content .env -Raw | Select-String 'CLOUDFLARE_API_TOKEN=(.+)' -AllMatches).Matches[0].Groups[1].Value
   curl.exe -s "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer $token"
   ```

   Expect `"success": true`.

---

## Hostname map

| Hostname | Role | Healthy reference |
|----------|------|-------------------|
| `x402.unykorn.org` | Public gateway health | `/health` → **200** |
| `twin.unykorn.org` | Digital twin / agent mesh UI | Should return HTML/JSON, not 522 |
| `x402api.unykorn.org` | x402 API docs / edge | Should return docs or API, not timeout |
| `goat.unykorn.org` | GoatX SPL token site | CF tunnel → local **:3001** (`goat-site`) — **502** when origin stopped |
| `junior.unykorn.org` | Junior / Tilden AI node | CF tunnel → **:4099** (`junior-tilden`); aliases `tilden`, `jr` |
| `portfolio.unykorn.org` | UNYKORN portfolio book | Cloudflare Pages (`portfolio-unykorn`) — usually **200** |
| `fifa.unykorn.org` | WWAI FIFA router | Worker `fifa-unykorn-router` (`fifa app/wrangler.toml`) |
| `whichway.live` | WhichWay guest OS | Worker `whichway-live` |

**Do not conflate** monorepo `backend/x402-gateway` (:4020) with the public mesh unless you repoint DNS yourself. See [X402_INTEGRATION.md](X402_INTEGRATION.html).

### Cloudflare Workers (UnyKorn-X402-aws + satellites)

| Worker / repo | Route pattern | Notes |
|---------------|---------------|-------|
| `fifa-unykorn-router` | `fifa.unykorn.org/*` | `C:\Users\Kevan\Desktop\fifa-unykorn-router\wrangler.toml` |
| `whichway-live` | `whichway.live` | `fifa app/wrangler.toml` |
| `fth-x402-gateway` | staging/production Workers | `FACILITATOR_URL` → `https://x402api.unykorn.org` in production env |
| `unykorn-api` | `api.unykorn.org/*` | ICO / exchange API proxy |
| `x407-ai-proxy` | (407 / AI edge) | Optional `ai.407.unykorn.org` route — commented in wrangler |

**Tunnel origins (not Workers):** `goat.unykorn.org` → `:3001`, `junior.unykorn.org` → `:4099`. Operator landings on GitHub Pages: `/sites/goat/`, `/sites/junior/`.

---

## Diagnosis order

### 1. Edge vs origin (curl)

From any machine:

```bash
curl -sS -o /dev/null -w "twin HTTP %{http_code} time %{time_total}s\n" --max-time 25 https://twin.unykorn.org/
curl -sS -o /dev/null -w "x402api HTTP %{http_code} time %{time_total}s\n" --max-time 25 https://x402api.unykorn.org/
curl -sS -o /dev/null -w "health HTTP %{http_code} time %{time_total}s\n" --max-time 15 https://x402.unykorn.org/health
```

| Result | Meaning |
|--------|---------|
| health **200**, twin/x402api **522** or timeout | Origin for twin/x402api down; health may use a different route/tunnel |
| All **522** | Broader origin/tunnel outage on AWS host |
| **403/1010** | WAF or access rule — check Cloudflare Security |

PowerShell equivalent:

```powershell
foreach ($u in @(
  'https://twin.unykorn.org/',
  'https://x402api.unykorn.org/',
  'https://x402.unykorn.org/health'
)) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 25
    Write-Host "$u -> $($r.StatusCode)"
  } catch {
    Write-Host "$u -> $($_.Exception.Message)"
  }
}
```

### 2. Cloudflare DNS (dashboard or API)

In **Cloudflare → DNS → Records** for zone `unykorn.org`:

- Confirm `twin` and `x402api` records exist and point to the **intended** target (tunnel CNAME `*.cfargotunnel.com`, A/AAAA to EC2, or Worker route).
- Compare with the working `x402` record — often twin/x402api still point at a **stale EC2 IP** while health uses **cloudflared**.

List records (requires `CLOUDFLARE_API_TOKEN` + zone ID):

```powershell
# Zone ID from dashboard → unykorn.org → Overview (right column)
$env:CF_TOKEN = (Select-String -Path .env -Pattern '^CLOUDFLARE_API_TOKEN=(.+)$').Matches[0].Groups[1].Value
$zoneId = 'YOUR_ZONE_ID'
curl.exe -s "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?name=twin.unykorn.org" -H "Authorization: Bearer $env:CF_TOKEN"
curl.exe -s "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?name=x402api.unykorn.org" -H "Authorization: Bearer $env:CF_TOKEN"
```

### 3. Workers routes vs tunnel vs direct origin

Check **Workers & Pages → Routes** and **Zero Trust → Tunnels**:

| Pattern | Fix |
|---------|-----|
| Hostname routed to **Worker** with no healthy `fetch()` to origin | Update Worker script or route `twin` / `x402api` to live origin URL |
| **Tunnel** hostname missing or connector offline | Restart `cloudflared` on EC2; re-bind public hostname in tunnel config |
| **Proxied A record** to stopped EC2 | Start services on origin IP **or** repoint DNS to active tunnel |

UnyKorn operator docs: `aws/X402_AWS_DEPLOYMENT_RUNBOOK.md`, tunnel cutover notes in `UnyKorn-X402-aws`.

### 4. Origin health on AWS (EC2)

SSH to the x402 production host and verify processes that serve twin and API docs (ports vary by deployment; mesh gateway is commonly **4020**, facilitator **3100**):

```bash
sudo systemctl status cloudflared x402-gateway  # names per UnyKorn unit files
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4020/health
ss -tlnp | grep -E '4020|3100|7332'
```

If localhost is healthy but public hostnames fail, the break is **Cloudflare routing** (DNS/tunnel/Worker), not the app binary.

### 5. SSL/TLS mode

**SSL/TLS → Overview:** use **Full (strict)** when origin serves valid HTTPS; **Full** only if origin uses self-signed. Wrong mode can cause 525/526 (not 522), but worth confirming while in the dashboard.

---

## Fix checklist (operator)

1. [ ] `setup-cloudflare-env.ps1` — `CLOUDFLARE_API_TOKEN` in `.env` (never commit).
2. [ ] Token verify API returns success.
3. [ ] `x402.unykorn.org/health` still **200** (baseline).
4. [ ] DNS: `twin` and `x402api` match the **same class** of target as working `x402` (tunnel vs EC2).
5. [ ] `cloudflared` / tunnel connector running on origin host.
6. [ ] App processes for twin UI and API docs listening on expected ports.
7. [ ] **GoatX:** `goat-site` on `:3001` — tunnel healthy (Exchange OS: tunnel a2da25a0).
8. [ ] **Junior:** `junior-tilden` on `:4099` — tunnel healthy.
7. [ ] Workers route rules updated if hostnames are Worker-fronted.
8. [ ] Re-run curl block — expect **200** or **301/302**, not **522** or timeout.

---

## After fix — verification (copy/paste)

```bash
curl -sS -D- --max-time 25 https://twin.unykorn.org/ -o /dev/null | head -n 1
curl -sS -D- --max-time 25 https://x402api.unykorn.org/ -o /dev/null | head -n 1
curl -sS https://x402.unykorn.org/health | head -c 400
```

**Pass criteria:**

- First two lines: `HTTP/2 200` (or `301`/`302` to HTTPS canonical URL), **not** `522` or empty reply.
- Health JSON includes live gateway / chain fields (see [X402_AWS_VERIFICATION.md](X402_AWS_VERIFICATION.html)).

Update investor-facing status in `VERIFICATION_STATUS.md` / `ECOSYSTEM_MAP.md` after a clean probe.

---

## Token types (do not mix)

| Token file | Env var | Use |
|------------|---------|-----|
| Read all resources (Downloads) | `CLOUDFLARE_API_TOKEN` | DNS, zones, tunnels, origin diagnostics |
| Workers AI (Desktop, 3rd `cfut_`) | `CLOUDFLARE_WORKERS_AI_TOKEN` | Workers AI inference in donk-tutor / dao-service |

`setup-local-env.ps1` handles Workers AI + Telnyx + ElevenLabs; `setup-cloudflare-env.ps1` handles the **Read all resources** admin token only.

---

## Related docs

- [X402_INTEGRATION.md](X402_INTEGRATION.html)
- [deploy/secrets-setup.md](deploy/secrets-setup.html)
- [ECOSYSTEM_MAP.md](ECOSYSTEM_MAP.html) — live URL matrix
- [UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws)
