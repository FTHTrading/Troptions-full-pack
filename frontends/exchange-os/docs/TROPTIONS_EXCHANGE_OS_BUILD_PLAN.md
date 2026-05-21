# TROPTIONS Exchange OS — Build Plan

**Product:** TROPTIONS Exchange OS  
**Tagline:** Launch. Trade. Earn. Prove.  
**Status:** Build in progress — May 2026  
**Location:** `src/app/exchange-os/` within the existing Troptions monorepo  

---

## Architecture Decision

Built as a route group within the existing Troptions Next.js app (`C:\Users\Kevan\troptions`), reusing:
- Existing XRPL infrastructure (`src/lib/troptions/xrpl*`)
- Existing market data registries (`src/content/troptions/xrpl*`)
- Existing brand/Tailwind system
- Existing Deepgram voice service

Exchange OS lives at `/exchange-os/**` with its own layout, nav, and brand treatment.

---

## Rails

| Rail | Purpose |
|------|---------|
| **XRPL** | Token trading, AMM liquidity, DEX orders, trustlines, token launch, issuer controls, settlement |
| **x402** | Paid AI reports, premium API calls, launch packets, agent-to-agent commerce |
| **TROPTIONS** | Verification layer, rewards engine, proof packets, sponsor/creator commerce |

---

## Route Map

| Route | Page |
|-------|------|
| `/exchange-os` | Landing — hero, features, CTAs |
| `/exchange-os/trade` | Trading dashboard — swap, AMM, order book |
| `/exchange-os/launch` | Token launchpad wizard (5 steps) |
| `/exchange-os/earn` | Earn hub — rewards, LP, referrals, sponsor |
| `/exchange-os/x402` | x402 premium service catalog |
| `/exchange-os/tokens` | Token discovery — trending, verified, search |
| `/exchange-os/token/[id]` | Token detail — price, chart, swap, issuer |
| `/exchange-os/wallet` | Wallet analytics — holdings, trustlines, PnL |
| `/exchange-os/creator` | Creator/developer console |
| `/exchange-os/sponsor` | Sponsor campaign builder |
| `/exchange-os/admin` | Operator dashboard |
| `/exchange-os/deck` | Sales deck (10 slides) |
| `/exchange-os/signup` | Partner signup wizard |
| `/exchange-os/voice` | WWAI voice assistant |

---

## API Routes (at `/exchange-os/api/**`)

- `GET /api/health`
- `GET /api/xrpl/status`
- `GET /api/xrpl/token`
- `GET /api/xrpl/wallet`
- `GET /api/xrpl/amm`
- `POST /api/xrpl/quote`
- `POST /api/xrpl/prepare-swap`
- `POST /api/xrpl/prepare-trustline`
- `POST /api/xrpl/prepare-launch`
- `GET /api/x402/health`
- `GET /api/x402/services`
- `POST /api/x402/quote`
- `POST /api/x402/verify`
- `POST /api/reports/token-risk`
- `POST /api/reports/launch-readiness`
- `POST /api/leads`
- `POST /api/proof-packet`

---

## New Files Created

### Config (`src/config/exchange-os/`)
- `brand.ts` — product name, tagline, colors
- `xrpl.ts` — network, websocket, mainnet gate
- `x402.ts` — facilitator URL, receiving address, asset
- `fees.ts` — fee policy engine (bps-based)
- `features.ts` — feature flags
- `riskLabels.ts` — risk label definitions
- `demoData.ts` — demo tokens, pools, wallets
- `packages.ts` — partner packages
- `routes.ts` — nav route definitions

### XRPL Lib (`src/lib/exchange-os/xrpl/`)
- `types.ts` — shared TypeScript types
- `client.ts` — XRPL WebSocket client (read-only)
- `readToken.ts` — fetch token info from XRPL
- `readWallet.ts` — fetch wallet info and trustlines
- `readAmm.ts` — fetch AMM pool data
- `quote.ts` — best-route quote simulation
- `prepareSwap.ts` — prepare unsigned swap transaction
- `prepareTrustline.ts` — prepare unsigned trustline transaction
- `prepareLaunch.ts` — prepare unsigned token issuance

### x402 Lib (`src/lib/exchange-os/x402/`)
- `types.ts`
- `services.ts` — service catalog with prices
- `quote.ts` — payment quote generation
- `verify.ts` — payment verification
- `middleware.ts` — HTTP 402 middleware

### Rewards/Risk/Proof (`src/lib/exchange-os/`)
- `rewards/types.ts`, `rewardPolicy.ts`, `calculateRewards.ts`
- `risk/types.ts`, `riskLabels.ts`, `issuerChecks.ts`, `liquidityChecks.ts`
- `proof/types.ts`, `createProofPacket.ts`
- `reports/tokenRisk.ts`, `launchReadiness.ts`
- `leads/index.ts`
- `voice/deepgram.ts`

### Components (`src/components/exchange-os/`)
- `AppShell.tsx` — layout shell with sidebar + mobile nav
- `BrandHeader.tsx` — TROPTIONS logo header
- `SidebarNav.tsx` — desktop sidebar navigation
- `MobileBottomNav.tsx` — mobile bottom tab bar
- `DemoModeBanner.tsx` — truth label banner
- `HeroSection.tsx` — landing hero
- `FeatureCard.tsx` — feature grid card
- `TradingPanel.tsx` — main trading interface
- `SwapPanel.tsx` — swap widget
- `TokenCard.tsx` — token list card
- `AmmPoolCard.tsx` — AMM pool card
- `RiskBadge.tsx` — risk label badge
- `IssuerVerificationBadge.tsx` — verified/unverified badge
- `TrustlineWarning.tsx` — trustline requirement warning
- `X402ServiceCard.tsx` — premium service card
- `EarnCard.tsx` — earn opportunity card
- `LaunchWizard.tsx` — 5-step token launch wizard
- `ProofPacketPanel.tsx` — proof packet viewer
- `AdminMetricCard.tsx` — admin stat card
- `WalletAnalyticsPanel.tsx` — wallet holdings panel
- `SalesDeck.tsx` — 10-slide sales deck
- `SignupForm.tsx` — partner signup form

### Styles
- `src/styles/exchange-os.css` — Exchange OS CSS variables and utilities

---

## Safety Rules Applied

1. No private keys ever requested, stored, or transmitted
2. All write transactions return unsigned payloads — wallet must sign
3. Mainnet locked behind `XRPL_MAINNET_ENABLED=true` env var
4. x402 payments locked behind `X402_ENABLED=true` env var
5. Demo mode banner always shown when not in production
6. No profit guarantees in any copy
7. All earning copy uses "eligible rewards", "potential payouts", "subject to rules"
8. Risk labels on all trading, AMM, and new launch assets
9. No hardcoded secrets — all from env vars
10. CRM webhook only fires when `TROPTIONS_CRM_WEBHOOK_URL` is set

---

## Acceptance Criteria

- [ ] App builds with `pnpm build`
- [ ] TypeScript passes with `pnpm typecheck`
- [ ] All 14 routes render without errors
- [ ] All 17 API routes return JSON responses
- [ ] Demo mode banner visible on all pages
- [ ] Trading panel shows order book in read-only mode
- [ ] Launch wizard completes 5 steps and generates demo launch packet
- [ ] x402 service catalog renders all 9 services
- [ ] Earn hub renders with risk disclaimers
- [ ] Admin dashboard shows demo metrics
- [ ] Sales deck renders all 10 slides
- [ ] Partner signup form validates and submits (to CRM webhook or demo)
- [ ] Voice page renders with WWAI assistant placeholder
- [ ] Build report generated at `docs/TROPTIONS_EXCHANGE_OS_BUILD_REPORT.md`
