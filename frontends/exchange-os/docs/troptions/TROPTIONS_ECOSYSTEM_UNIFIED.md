# TROPTIONS Ecosystem — Unified Map (Bryan Stone)

**Owner:** Bryan Stone · **Est.** 2003 · **Institutional OS:** Exchange OS + Proof + Launch  
**Code:** `C:\Users\Kevan\troptions` · **Launcher:** `C:\Users\Kevan\solana-launcher`

This document is the **single map** of what is live, what was 404ing, and how branded domains sync.

---

## Live today (verified stack)

| Property | URL | What it does | Deploy |
|----------|-----|--------------|--------|
| **TROPTIONS institutional** | https://troptions.unykorn.org/troptions | History, proof, CIS, wallets, verticals | `troptions` Worker |
| **Exchange OS** | https://troptionsexchange.unykorn.org/exchange-os | Launch control, proof room, partner demo, Solana/XRPL maps | Same Worker |
| **TROPTIONS Live** | https://troptionslive.unykorn.org/sports | Events, merchants, campaigns | Same Worker |
| **Token Launcher** | https://launch.unykorn.org | SPL mint, GoatX, .troptions roots, mint registry, system truth | `solana-launcher` (Vercel) |
| **WhichWay / WWAI** | https://whichway.live | Guest OS, TROPTIONS commerce, WC2026 | Separate CF/Next project |
| **WWAI alt host** | https://fifa.unykorn.org | Same product family | `FIFA---Wilkins` |
| **GoatX** | https://goat.unykorn.org | $GOATX mainnet proof | External |
| **Portfolio** | https://portfolio.unykorn.org | UNYKORN system book | `portfolio-unykorn` |
| **T-LEV-8 deal room** | https://fthtrading.github.io/T-Lev-8-/ | LEV8 partnership gates | GitHub Pages |

**Devnet note on launcher:** Configure production RPC + wallet rails before live minting (as shown on launcher UI).

---

## What was 404ing (fixed in this pass)

| Broken link | Cause | Fix |
|-------------|-------|-----|
| `/mints` on Exchange OS host | Page only on launcher | `next.config` → redirect to launch.unykorn.org/mints |
| `/system/truth` on Exchange OS | Same | Redirect to launch.unykorn.org/system/truth |
| Footer relative `/mints` | ecosystem-nav | Absolute launcher URLs |
| `/exchange-os/token-proof-packet` | No page | New page at `src/app/exchange-os/token-proof-packet/page.tsx` |
| `hotrcw.com` | No route | New `/troptions/hotrcw` stub |

---

## Bryan Stone domain list → canonical routes

| Domain | Status | Canonical URL (bookmark this) |
|--------|--------|-------------------------------|
| **troptions.io** | DNS pending | https://troptions.unykorn.org/troptions |
| **troptions.org** | Legacy | https://troptions.unykorn.org/troptions/legacy |
| **troptionsxchange.io** | Legacy redirect | https://troptions.unykorn.org/troptions/xchange |
| **troptionsxchange.com** | DNS pending | https://troptions.unykorn.org/troptions/xchange |
| **troptions-university.com** | DNS pending | https://troptions.unykorn.org/troptions/university |
| **troptionstelevisionnetwork.tv** | DNS pending | https://troptions.unykorn.org/troptions/media |
| **therealestateconnections.com** | DNS pending | https://troptions.unykorn.org/troptions/real-estate |
| **green-n-go.solar** | DNS pending | https://troptions.unykorn.org/troptions/solar |
| **hotrcw.com** | DNS pending | https://troptions.unykorn.org/troptions/hotrcw |

**Source of truth in code:** `src/data/troptions-branded-domains.ts`  
**Middleware:** Root `/` on wired domains → canonical path.

---

## Proof assets (mainnet — show on launcher, link from Exchange)

| Asset | Mint / root | Verify |
|-------|-------------|--------|
| GoatX $GOATX | 9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv | Solscan |
| .troptions root | 53GXQSyKBdbG4i5ndcKrwLT73mVQunD6L2PTCgUEaJf3 | Solscan |
| .usa.26wc | HnyPLjho9wXRr2eNWc8PMFvDFtHwcdfcV5H1xF84yb6B | Solscan |
| .mexico.26wc | 5NWiDSUijgG5CkiXcyJR9R7fKUeRYkoN7j3wBdtMvc4k | Solscan |
| .canada.26wc | 8s1JKz2Ns6PdgekdZw4ZR85ymHVg44iaTWCneUEAXzXP | Solscan |

XRPL proof ($175M USDC desk, stablecoins): troptions.unykorn.org/troptions + proof room.

---

## Visual identity (recognizable as TROPTIONS)

| Element | Rule |
|---------|------|
| Wordmark | TROPTIONS Official Mark on all properties |
| Footer | Import `ECOSYSTEM_FOOTER_LINKS` from `ecosystem-nav.ts` |
| Launcher | “TROPTIONS Token Launcher” + verified .troptions root |
| Exchange OS | “Institutional Operating System” + proof-first language |
| WhichWay | “Powered by TROPTIONS” badge on every page |
| Colors | Navy/slate glass + blue accent (deal room + main site aligned) |

---

## DNS / Vercel checklist (Bryan + ops)

For each domain in **dns_pending**:

1. Confirm registrar access (Bryan Stone).  
2. Add domain to Cloudflare or Vercel `troptions` project.  
3. CNAME → Worker / Vercel target.  
4. Verify SSL.  
5. Hit `/` → should 302 to canonical path via middleware.  
6. Add migration banner on **troptions.org** only.

```bash
# After DNS propagates (example)
npx wrangler deployments list
# Or Vercel: vercel domains add troptions.io
```

---

## Next moves (priority)

| # | Action | Owner |
|---|--------|-------|
| 1 | Deploy `troptions` Worker with redirect + middleware fixes | Engineering |
| 2 | Wire **troptions.io** + **troptionsxchange.com** DNS | Bryan / ops |
| 3 | Point **whichway.live** footer “Mint Registry / System Truth” to launcher absolute URLs | WWAI repo |
| 4 | Production Solana RPC on launch.unykorn.org | Engineering |
| 5 | Copy `ecosystem-nav.ts` pattern into solana-launcher footer | Engineering |
| 6 | LEV8: send term sheet (T-LEV-8 repo) — separate track | Bryan |

---

## Navigation import (developers)

```ts
import { ECOSYSTEM_SITES, ECOSYSTEM_FOOTER_LINKS } from '@/data/ecosystem-nav';
import { BRANDED_DOMAINS, getDomainByHost } from '@/data/troptions-branded-domains';
```

---

*Last updated: 2026-05-20 — sync with T-LEV-8 Protocol Governor*
