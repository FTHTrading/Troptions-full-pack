# Ecosystem URL verification

**Generated:** 2026-05-21 18:32 UTC

**Script:** `scripts/verify-all-ecosystem-sites.ps1`

Summary: **19** LIVE Â· **15** need operator attention (of 34 probed).

| Group | Surface | URL | HTTP | Status |
|-------|---------|-----|------|--------|
| GitHub Pages | Investor hub | https://fthtrading.github.io/Troptions-full-pack/ | 200 | LIVE |
| GitHub Pages | Ecosystem status hub | https://fthtrading.github.io/Troptions-full-pack/ecosystem/ | 404 | 404 |
| GitHub Pages | T-Lev-8 deal room | https://fthtrading.github.io/T-Lev-8-/ | 200 | LIVE |
| GitHub Pages | Aurora RWA site | https://fthtrading.github.io/aurora-site/ | 200 | LIVE |
| GitHub Pages | Impact site | https://fthtrading.github.io/impact-site/ | 404 | 404 |
| GitHub Pages | DAO public page | https://fthtrading.github.io/Troptions-full-pack/dao/ | 200 | LIVE |
| GitHub Pages | Mint DApp | https://fthtrading.github.io/Troptions-full-pack/mint.html | 200 | LIVE |
| GitHub Pages | NFT gallery | https://fthtrading.github.io/Troptions-full-pack/nft/ | 200 | LIVE |
| GitHub Pages | Landing ai (Pages) | https://fthtrading.github.io/Troptions-full-pack/sites/ai/ | 404 | 404 |
| GitHub Pages | Landing ttn (Pages) | https://fthtrading.github.io/Troptions-full-pack/sites/ttn/ | 404 | 404 |
| GitHub Pages | Landing dao (Pages) | https://fthtrading.github.io/Troptions-full-pack/sites/dao/ | 404 | 404 |
| GitHub Pages | Landing goat (Pages) | https://fthtrading.github.io/Troptions-full-pack/sites/goat/ | 404 | 404 |
| GitHub Pages | Landing junior (Pages) | https://fthtrading.github.io/Troptions-full-pack/sites/junior/ | 404 | 404 |
| Unykorn LIVE | TROPTIONS hub | https://troptions.unykorn.org/troptions | 200 | LIVE |
| Unykorn LIVE | Exchange OS edge | https://troptionsexchange.unykorn.org/exchange-os | 200 | LIVE |
| Unykorn LIVE | TTN sports | https://troptionslive.unykorn.org/sports | 200 | LIVE |
| Unykorn LIVE | Solana launcher | https://launch.unykorn.org | 200 | LIVE |
| Unykorn LIVE | FTH Academy | https://fthedu.unykorn.org | 200 | LIVE |
| Unykorn LIVE | Portfolio registry | https://portfolio.unykorn.org | 200 | LIVE |
| Unykorn LIVE | GoatX surface | https://goat.unykorn.org | 200 | LIVE |
| Unykorn LIVE | Junior / Tilden OS | https://junior.unykorn.org | 502 | ORIGIN |
| Unykorn LIVE | FIFA router | https://fifa.unykorn.org | 200 | LIVE |
| Unykorn LIVE | WhichWay guest OS | https://whichway.live | 200 | LIVE |
| x402 mesh | x402 health | https://x402.unykorn.org/health | 200 | LIVE |
| x402 mesh | Digital twin | https://twin.unykorn.org | 522 | ORIGIN |
| x402 mesh | x402 API docs | https://x402api.unykorn.org | 522 | ORIGIN |
| External | Genesis GSP (drunks.app) | https://drunks.app | 200 | LIVE |
| External | GSP API Worker health | https://gsp-api.kevanbtc.workers.dev/api/health | 200 | LIVE |
| External | Troptions Vercel | https://troptions.vercel.app | 200 | LIVE |
| Future DNS | ai.troptions.org | https://ai.troptions.org | ERR | DNS |
| Future DNS | ttn.troptions.org | https://ttn.troptions.org | ERR | DNS |
| Future DNS | dao.troptions.org | https://dao.troptions.org | ERR | DNS |
| Broken DNS | aurora.unykorn.org | https://aurora.unykorn.org | ERR | DNS |
| Broken DNS | impact.unykorn.org | https://impact.unykorn.org | ERR | DNS |

## Operator actions

- **twin / x402api / goat / junior (502/522):** restart tunnel + origin per [CLOUDFLARE_ORIGIN_FIX.md](../technical/CLOUDFLARE_ORIGIN_FIX.md).
- **troptions.org subdomains:** use Pages landings under `/sites/*` until DNS cutover.
- **impact-site Pages:** fix deploy branch (404 on GitHub Pages project).

