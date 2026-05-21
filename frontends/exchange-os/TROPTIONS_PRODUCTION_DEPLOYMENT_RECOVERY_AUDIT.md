# TROPTIONS Production Deployment Recovery Audit

**Date:** May 9, 2026  
**Status:** RESOLVED — All routes confirmed live at 200  
**Repo:** FTHTrading/Troptions @ main  
**Deployment:** troptions.vercel.app

---

## 1. Executive Summary

TROPTIONS Sports Network is live in production. Seven public routes are verified returning HTTP 200 after a multi-blocker deployment failure was diagnosed and resolved. The network is now fundable, demonstrable, and ready for sponsor and media outreach.

---

## 2. Routes Verified (All 200)

| Route | Status |
|-------|--------|
| `https://troptions.vercel.app/sports` | 200 |
| `https://troptions.vercel.app/sports/team` | 200 |
| `https://troptions.vercel.app/sports/funding` | 200 |
| `https://troptions.vercel.app/sports/moments` | 200 |
| `https://troptions.vercel.app/sports/proof` | 200 |
| `https://troptions.vercel.app/sports/partners` | 200 |
| `https://troptions.vercel.app/sports/tv` | 200 |

---

## 3. Root Causes Fixed

### 3.1 — Vercel rootDirectory Misconfiguration
**Problem:** Vercel project had `rootDirectory` set to `apps/web` — a monorepo path that does not exist in this repository.  
**Impact:** Every build attempt failed immediately. Vercel tried to deploy a nonexistent subdirectory.  
**Fix:** Cleared `rootDirectory` to `null` via Vercel REST API PATCH.

```powershell
$tok = (Get-Content "$env:APPDATA\com.vercel.cli\Data\auth.json" | ConvertFrom-Json).token
Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/prj_3z1BGv3guL1hvrNG3fvLgFl4SCxc?teamId=team_moGmte3wISNYxMMhqSfSYyGp" -Method PATCH -Headers @{Authorization="Bearer $tok";"Content-Type"="application/json"} -Body '{"rootDirectory":null}'
```

---

### 3.2 — pnpm Detection by Vercel
**Problem:** `pnpm-lock.yaml` existed in the repo root. Vercel auto-detected this and attempted `pnpm install`, which failed (pnpm not available in Vercel build environment, or version mismatch).  
**Impact:** Install step failed, build never ran.  
**Fix:** Added `installCommand` override to `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next",
  "regions": ["iad1"]
}
```

Commit: `f8fdc2d`

---

### 3.3 — Placeholder Git Email Blocking GitHub-Triggered Deploys
**Problem:** `git config --global user.email` was set to `kevan@yourdomain.com` — a placeholder value.  
**Impact:** GitHub-triggered Vercel deployments returned `COMMIT_AUTHOR_REQUIRED` / `TEAM_ACCESS_REQUIRED` block. Vercel mapped the commit author email to a secondary Vercel account (`unykornenergy-3034`) that lacks project access.  
**Fix:**

```powershell
git config --global user.email "kevanbtc@gmail.com"
```

Commit: `441319d`

---

## 4. Fixes Applied (Summary)

| Fix | Method | Commit |
|-----|--------|--------|
| Clear Vercel `rootDirectory` | REST API PATCH | — |
| Force npm install | `vercel.json` installCommand | `f8fdc2d` |
| Fix git author email | `git config --global` | `441319d` |
| Fix `.vercelignore` (root-anchor `/data/`) | File edit | `9f9d2c4` |
| Rebuild `/sports/tv` Octagon-tier | Page rebuild | `a2e4b14` |

---

## 5. Current Deployment Method

GitHub auto-deploys are partially blocked (see Section 6). Use manual CLI deploy:

```powershell
cd C:\Users\Kevan\troptions
npx vercel --prod --yes
```

Build time: ~5 minutes. Status moves from BUILDING to READY.

---

## 6. Permanent Auto-Deploy Fix Needed

**Problem:** GitHub user `kevanbtc` (gitUserId `35906852`) maps to a secondary Vercel account `unykornenergy-3034`, which does not have project-level access.

**Resolution options:**
1. **Vercel Dashboard → Project Settings → Git → Deployment Protection** — add `unykornenergy-3034` as contributor
2. **Disable "Commit Author Required"** — if acceptable for this project's access model
3. **Re-link GitHub integration** using the primary Vercel account that owns the project

Until resolved, `npx vercel --prod --yes` bypasses GitHub entirely and deploys directly via authenticated CLI.

---

## 7. Funding Impact

This deployment makes the TROPTIONS Sports Network usable as public proof for:

- **Solana Foundation** — sports fan-commerce on-chain proof
- **Colosseum** — Solana moment minting, scan-to-claim infrastructure
- **Superteam** — regional sports/media builder story
- **Solana Mobile** — mobile-first QR reward claim workflow
- **Sports agencies** — Octagon, CAA, WME — live city activation playbook
- **Event sponsors** — restaurant, hotel, retail — live commerce pages
- **Media partners** — TTN broadcast infrastructure, channel launch pitch

The live site covers the full pitch arc:  
`Team → Funding → Proof → Partners → Moments → TV`

---

## 8. Next Routes to Build

| Route | Priority | Purpose |
|-------|----------|---------|
| `/sports/world-cup` | High | World Cup 2026 city activation landing |
| `/sports/grants` | High | Solana Foundation / grant application proof |
| `/sports/solana` | Medium | Solana infrastructure explainer |
| `/ttn/infrastructure` | High | TTN broadcast OS public page |
| `/ttn/web3` | High | TTN Web3 utility layer |
| `/ttn/channels` | High | TTN 8-channel network |
| `/ttn/launch-channel` | High | Creator/business channel launch portal |
| `/ttn/live` | Phase 2 | Live broadcast embed page |
| `/ttn/creators` | Phase 2 | Creator portal landing |
| `/ttn/sponsors` | Phase 2 | Sponsor advertising packages |

---

## 9. Commits

```
f8fdc2d  fix: force npm install on Vercel — override pnpm-lock.yaml detection
441319d  fix: set correct git author email (kevanbtc@gmail.com) — unblock Vercel deployments
a2e4b14  feat: /sports/tv full rebuild — Octagon-tier design + audit file
9f9d2c4  fix: anchor /data/ in vercelignore to root-only, use npm run build on Vercel
```

---

*TROPTIONS Sports Network — Live in Production. May 9, 2026.*
