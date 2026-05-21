# Audit Phase 10 — Deployment & DNS Audit

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

---

## 1. Deployment Configuration Summary

### netlify.toml

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | 22 |
| Plugin | `@netlify/plugin-nextjs` |
| Functions directory | `.netlify/functions` |
| Edge functions directory | `.netlify/edge-functions` |
| Redirects / Rewrites | `/_next/image` → Netlify image CDN |

### .github/workflows/netlify.yml

| Setting | Value |
|---|---|
| Trigger | Push/PR to `main` |
| Runner | `ubuntu-latest` |
| Node | 22 |
| Deploy action | `nwtgck/actions-netlify@v3` |
| Production branch | `main` |
| Deploy alias | `stg-{PR number}` on PR |

### vercel.json (Legacy — Not Primary)

| Setting | Value |
|---|---|
| Status | Present in repo — not primary deployment target |
| Function region | `iad1` |
| XRPL proxy rewrites | Present |

### open-next.config.ts / wrangler.jsonc (Optional CF Workers)

| Setting | Value |
|---|---|
| Status | Present — optional Cloudflare Workers path |
| Primary target | **Netlify** (not Cloudflare) |

---

## 2. DNS Resolution Results

### troptions.unykorn.org

| Property | Value |
|---|---|
| IPv4 | `104.21.71.137`, `172.67.170.153` |
| CDN Provider | **Cloudflare** (proxied — these are Cloudflare Anycast IPs) |
| Origin | Unknown — not Netlify (Netlify returns distinct IPs) |
| HTTP `/` | **200 OK** |
| HTTP `/api/health/live` | **200 OK** |
| HTTP `/api/health/ready` | **503 Service Unavailable** |
| HTTP `/troptions/momentum` | **404 Not Found** |

**Assessment:** `troptions.unykorn.org` is resolving through Cloudflare but the origin behind it is NOT the Netlify-deployed Next.js app. The domain is serving some content (returning 200 on `/`), but application routes like `/troptions/momentum` return 404. The `/api/health/ready` returning 503 indicates the full application is not live at this origin.

### troptions-live.netlify.app

| Property | Value |
|---|---|
| IPv4 | `98.84.224.111`, `18.208.88.157` |
| CDN Provider | **Netlify** |
| HTTP Status | **404** — site not deployed |

**Assessment:** The Netlify site `troptions-live` (ID: `3e8f8c18-d896-4249-959e-7be9deb60d43`) has never received a successful deployment via GitHub Actions. The 404 confirms no code has reached Netlify.

### troptions.com

| Property | Value |
|---|---|
| IPv4 | `15.197.225.128`, `3.33.251.168` |
| CDN Provider | Netlify Anycast |
| HTTP Status | Not verified in this session |

---

## 3. GitHub Actions Deployment Status

### Workflow: netlify.yml

All 5 recent workflow runs show **"completed success"** but with a critical caveat:

```
"Netlify credentials not provided, not deployable"
```

This message is logged silently. The build step passes (Next.js compiles successfully). The deploy step skips without error. The workflow returns exit code 0.

### Root Cause

| Missing Secret | Impact |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Deploy step silently skipped |
| `NETLIFY_SITE_ID` | Deploy step silently skipped |

These two secrets must be added to GitHub repository Settings → Secrets → Actions for deployment to succeed.

---

## 4. Netlify Site Information

| Property | Value |
|---|---|
| Site Name | `troptions-live` |
| Site ID | `3e8f8c18-d896-4249-959e-7be9deb60d43` |
| Expected URL | `https://troptions-live.netlify.app` |
| Custom Domain | `troptions.unykorn.org` (requires DNS update) |
| Current Deploy State | **No successful deploys** |

---

## 5. Deployment Blockers (In Priority Order)

| # | Blocker | Severity | Resolution |
|---|---|---|---|
| 1 | `NETLIFY_AUTH_TOKEN` missing from GitHub secrets | **Critical** | Add Netlify personal access token to GitHub secrets |
| 2 | `NETLIFY_SITE_ID` missing from GitHub secrets | **Critical** | Add `3e8f8c18-d896-4249-959e-7be9deb60d43` to GitHub secrets |
| 3 | Netlify environment variables not set | **High** | Set `TROPTIONS_JWT_KEYS_JSON`, `TROPTIONS_BASE_URL`, and other production env vars in Netlify site settings |
| 4 | `troptions.unykorn.org` DNS points to wrong origin | **High** | Update DNS CNAME in Cloudflare to point to `troptions-live.netlify.app` after successful deploy |
| 5 | `troptions-live.netlify.app` has no deploy | **High** | Resolved by fixing blocker 1+2 |

---

## 6. DNS Configuration Actions Required

After fixing the GitHub secrets and completing a successful Netlify deploy:

1. In the Cloudflare dashboard for `unykorn.org`:
   - Change the `troptions` DNS record from its current origin to `troptions-live.netlify.app`
   - OR disable Cloudflare proxy (orange cloud → gray cloud) if using Netlify's CDN directly
2. In Netlify site settings:
   - Add custom domain `troptions.unykorn.org`
   - Provision SSL certificate

---

## 7. Health Check Endpoint Audit

| Endpoint | Current Status | Expected Status | Notes |
|---|---|---|---|
| `/api/health/live` | 200 ✅ | 200 | Returns `{"status":"ok"}` from unknown origin |
| `/api/health/ready` | 503 ❌ | 200 | Application not fully started / database not ready |
| `/troptions/momentum` | 404 ❌ | 200 | Route not served by current DNS origin |

The 503 on `/api/health/ready` indicates the current origin serving `troptions.unykorn.org` does not have a working database connection or has failed startup checks.

---

## 8. Deployment Architecture Diagram

```
GitHub Repository (main)
        │
        ▼
GitHub Actions (netlify.yml)
        │  npm ci → npm run build
        │  [Deploy step: SKIPPED — no secrets]
        │
        ▼
Netlify (troptions-live site)
        │  No successful deploy yet
        │  404 at troptions-live.netlify.app
        │
        ▼
Custom Domain: troptions.unykorn.org
        │  Currently → Cloudflare Anycast
        │  Cloudflare → Unknown origin (NOT Netlify)
        │  / → 200 (wrong origin serving content)
        │  /troptions/momentum → 404
        │  /api/health/ready → 503
```

---

## 9. Deployment Readiness Checklist

| Item | Status |
|---|---|
| Next.js build passes | ✅ |
| GitHub Actions workflow runs | ✅ |
| `NETLIFY_AUTH_TOKEN` configured | ❌ Missing |
| `NETLIFY_SITE_ID` configured | ❌ Missing |
| Netlify site exists (`troptions-live`) | ✅ |
| Netlify env vars configured | ❌ Unknown |
| Custom domain configured on Netlify | ❌ Not set |
| DNS points to Netlify | ❌ Points to Cloudflare/other |
| SSL certificate | ❌ Not provisioned yet |
| `/api/health/ready` returns 200 | ❌ Returns 503 |
