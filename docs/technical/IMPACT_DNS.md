---
title: Impact & Aurora DNS — GitHub Pages on unykorn.org
layout: default
permalink: /technical/IMPACT_DNS.html
---

# Impact & Aurora DNS — GitHub Pages on unykorn.org

**Last verified:** 2026-05-21  
**Zone:** `unykorn.org` (`8aa6916f4c1c7e8e42130455dfd5c029`)  
**Symptom:** Browser `DNS_PROBE_POSSIBLE` / “site can’t be reached” for `impact.unykorn.org` (and `aurora.unykorn.org`).

---

## Root cause (2026-05-21)

| Layer | `impact.unykorn.org` | `aurora.unykorn.org` |
|-------|----------------------|----------------------|
| **Public DNS** | **Missing** — `nslookup` returned NXDOMAIN | **Missing** — same |
| **Cloudflare** | No CNAME in zone `unykorn.org` | No CNAME |
| **GitHub Pages** | Workflow failed until Pages source = Actions; then **404** on `/impact-site/` | **200** on `/aurora-site/` |
| **Repo CNAME file** | `impact.unykorn.org` in [impact-site/CNAME](https://github.com/FTHTrading/impact-site/blob/main/CNAME) | `aurora.unykorn.org` in aurora-site |

`DNS_PROBE_POSSIBLE` was **not** a GitHub outage — the hostname did not exist in DNS. Secondary issue: **impact-site** Pages deploy had never succeeded (Actions run failed at `configure-pages` until Pages was enabled).

---

## Correct DNS (Cloudflare)

Add **one CNAME per hostname** (DNS only — **disable** orange-cloud proxy for GitHub custom domains unless you follow GitHub’s SSL proxy docs):

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `impact` | `fthtrading.github.io` | **DNS only** (grey cloud) |
| CNAME | `aurora` | `fthtrading.github.io` | **DNS only** |

Full names: `impact.unykorn.org`, `aurora.unykorn.org`.

**API (token in gitignored `.env` as `CLOUDFLARE_API_TOKEN`):**

```powershell
$zoneId = "8aa6916f4c1c7e8e42130455dfd5c029"
$token = $env:CLOUDFLARE_API_TOKEN  # or read from .env locally — never commit
$body = '{"type":"CNAME","name":"impact","content":"fthtrading.github.io","ttl":1,"proxied":false}'
curl.exe -s -X POST "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" `
  -H "Authorization: Bearer $token" -H "Content-Type: application/json" `
  --data-binary "@impact-cname.json"
```

Repeat with `"name":"aurora"` for Aurora.

**Dashboard (no API):** Cloudflare → **unykorn.org** → DNS → Add record → CNAME → name `impact` → target `fthtrading.github.io` → Proxy status **DNS only** → Save.

---

## GitHub Pages (impact-site)

Repo: [FTHTrading/impact-site](https://github.com/FTHTrading/impact-site)

1. **Settings → Pages → Build and deployment:** Source = **GitHub Actions** (workflow `.github/workflows/pages.yml` on `main`).
2. **Custom domain:** `impact.unykorn.org` — must match root `CNAME` file in repo.
3. After DNS propagates, wait for **HTTPS certificate** (can take up to 24h; usually minutes).
4. If workflow fails with `Get Pages site failed`, enable Pages in Settings once, then re-run workflow:

```bash
gh workflow run "Deploy to GitHub Pages" -R FTHTrading/impact-site
```

**Canonical URLs**

| Surface | URL |
|---------|-----|
| Impact Pages | https://fthtrading.github.io/impact-site/ |
| Impact custom | https://impact.unykorn.org/ |
| Aurora Pages | https://fthtrading.github.io/aurora-site/ |
| Aurora custom | https://aurora.unykorn.org/ |
| Investor landing | https://fthtrading.github.io/Troptions-full-pack/sites/impact/ |

---

## Verification

```powershell
nslookup impact.unykorn.org
nslookup aurora.unykorn.org
curl.exe -sI https://fthtrading.github.io/impact-site/
curl.exe -sI https://impact.unykorn.org/
.\scripts\verify-all-ecosystem-sites.ps1
```

Expect: CNAME to `fthtrading.github.io` (or GitHub Pages anycast A after flattening), HTTP **200** on Pages URL, then custom domain once TLS is ready.

---

## Operator actions already taken (2026-05-21)

- Created Cloudflare CNAME `impact` → `fthtrading.github.io` (DNS only).
- Created Cloudflare CNAME `aurora` → `fthtrading.github.io` (DNS only).
- Re-ran **Deploy to GitHub Pages** on `impact-site` — workflow **success**.

**You should still confirm in GitHub UI:** impact-site → Pages → custom domain shows verified green check.

---

## Related docs

- [CLOUDFLARE_SERVICES.md](CLOUDFLARE_SERVICES.html) — tunnels, x402, junior, goat
- [ECOSYSTEM_MAP.md](ECOSYSTEM_MAP.html) — full repo catalog
- Monorepo landing: [/sites/impact/](../sites/impact/)
