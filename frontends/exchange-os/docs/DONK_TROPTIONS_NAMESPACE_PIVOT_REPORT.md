# DONK AI / TROPTIONS — Namespace & Merchant Pivot Report
Generated: 2026-05-15

## Repos inspected
- `C:\Users\Kevan\troptions` (primary — full pivot implemented)
- Other repos (needai, solana-launcher, fifa troptions, whichway-donk-build-os, uny-ai-command-center) — identified in MASTER-SYSTEM-MAP.md for follow-up

## Prediction-market language audit

### Files scanned
All `src/**/*.tsx`, `*.ts`, `*.md`, `*.json` (excluding node_modules, .next).

### Language found and removed

| File | Language found | Action |
|------|----------------|--------|
| `src/content/troptions/xrplNftGenesisRegistry.ts` | "genesis stake credential", "Genesis stake NFT", "genesis stake structure" | Replaced with "genesis founding credential" throughout |
| All other scanned files | `predictable` / `prediction` appears only in safe contexts (finance math, domain expertise) | No change needed |

### Confirmed NOT present in repo
- `prediction market` — not found
- `betting` — not found
- `gambling` — not found
- `wager` / `odds` — not found
- `sportsbook` — not found
- `pick market` / `pick market framing` — not found
- `win money` — not found

The live site content at `launch.unykorn.org` (showing PICK token, prediction markets) is from an older Cloudflare Pages build. The source repo (`troptions/`) does NOT contain prediction-market framing in the main routes — the `/sports` route already uses sponsor, fan NFTs, local commerce, and QR campaign language.

## Files modified

| File | Change |
|------|--------|
| `src/content/troptions/xrplNftGenesisRegistry.ts` | "stake" → "founding credential" (3 occurrences) — legal NFT registry language cleanup |

## New data files created

| File | Purpose |
|------|---------|
| `src/data/merchant-campaigns.ts` | MERCHANT_PRODUCTS, CAMPAIGN_STEPS, CAMPAIGN_TYPES, SAFE_CAMPAIGN_LANGUAGE, SAFETY_DISCLAIMER |
| `src/data/fan-tributes.ts` | FAN_TRIBUTE_TEMPLATES, FAN_TRIBUTE_FLOW, FAN_TRIBUTE_DISCLAIMER |
| `src/data/namespace-products.ts` | NAMESPACE_PRODUCTS (merchant, event, sponsor, fan community tiers) |
| `src/data/donk-products.ts` | DONK_PRODUCTS, DONK_HERO (campaign builder product catalog) |

## New pages / routes created

| Route | File | Description |
|-------|------|-------------|
| `/sports/merchant` | `src/app/sports/merchant/page.tsx` | Merchant Launch Kit — all products, campaign types, how-it-works |
| `/sports/tribute` | `src/app/sports/tribute/page.tsx` | Fan Tribute builder — templates, flow, no-gambling disclaimer |
| `/sports/qr-campaign` | `src/app/sports/qr-campaign/page.tsx` | QR Campaign — use cases, build steps, safety disclaimer |

## New products available (data layer)

### Merchant products
1. **Merchant Namespace** — $299 setup + $49/mo — branded campaign identity
2. **QR Campaign** — included in namespace — scan-to-engage
3. **NFT Coupon** — $49/campaign — collectible promotional coupon
4. **VIP Pass** — $49/campaign — event/merchant access pass
5. **Fan Tribute** — Free / $49 custom — commemorative community page
6. **Local Business Launch Kit** — $299 + $49/mo — full campaign kit
7. **Sponsor Activation** — included in sponsor namespace — brand overlay on fan touchpoints

### Namespace tiers
1. **Merchant Namespace Starter** — $299 + $49/mo
2. **Event Namespace** — $499 + $99/mo
3. **Sponsor Namespace** — $999 + $199/mo
4. **Fan Community Namespace** — $99 + $19/mo

## Safety disclaimers added
Every new page and data record includes this disclaimer (or variant):
> "Campaign assets are for loyalty, access, rewards, coupons, collectibles, fan engagement, and promotional utility only. They are not investments, securities, gambling products, prediction markets, or financial instruments."

## Verification results

| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** — exits 0, no errors |
| `eslint` (new files only) | **PASS** — 0 errors, 0 warnings |
| `npm run build` | **PASS** — clean build, new routes compiled as static |

## New routes in build output
- `/sports/merchant` — static
- `/sports/tribute` — static
- `/sports/qr-campaign` — static

## Remaining items for follow-up

1. **Deploy to Cloudflare** — `npm run cf:deploy` — this will update `launch.unykorn.org` and remove the old prediction-market build that is currently live
2. **Update main redirect** — `src/app/page.tsx` redirects to `/sports` — could be changed to `/sports/merchant` as the primary landing after deploy
3. **Apply pivot to `needai/` routes** — NeedAI app (`needai/app/api/moltbot`, `needai/app/api/x402`, etc.) should also use merchant/fan language — follow-up task
4. **Apply pivot to `solana-launcher/`** — FIFA token launch pages should emphasize utility and campaign assets, not investment
5. **Add navigation links** to main `/sports` page pointing to `/sports/merchant`, `/sports/tribute`, and `/sports/qr-campaign`
6. **20 Merchant DMs** — DONK AI can generate outreach templates using MERCHANT_PRODUCTS data — ready when NeedAI is deployed

## What to do next to deploy
```powershell
cd "C:\Users\Kevan\troptions"
npm run cf:deploy
```
This pushes the clean build to Cloudflare Pages, replacing the old prediction-market content at `launch.unykorn.org` with the merchant namespace / fan tribute positioning.
