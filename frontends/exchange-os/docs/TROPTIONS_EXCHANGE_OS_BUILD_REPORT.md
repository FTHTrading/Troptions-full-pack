# TROPTIONS Exchange OS — Build Report

**Product**: TROPTIONS Exchange OS  
**Tagline**: Launch. Trade. Earn. Prove.  
**Description**: TROPTIONS Exchange OS turns XRPL trading, token launches, rewards, sponsor offers, and AI-powered commerce into one simple operating system.

---

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| XRPL Rail | `xrpl` npm + WebSocket | Trading, token launch, AMM, trustlines, settlement |
| x402 Rail | x402 protocol v0.3.0 | Paid API access, premium reports, AI services |
| Rewards | On-chain policy engine | Creator/referral/sponsor/liquidity/dev rewards |
| Voice | Deepgram Aura TTS + Nova-3 STT | Voice interface |
| Frontend | Next.js App Router + Tailwind + CSS variables | Exchange OS design system |

**Route group**: `src/app/exchange-os/`  
**Brand scope**: `.xos` CSS class  
**Demo mode**: All features work in demo mode without any env vars. Enable production with `XRPL_MAINNET_ENABLED=true` and `X402_ENABLED=true`.

---

## Security Architecture

1. **No private keys ever** — all transactions return unsigned payloads for wallet signing
2. **Mainnet lock** — `XRPL_MAINNET_ENABLED=true` required for real transactions  
3. **x402 lock** — `X402_ENABLED=true` required for real payment gating
4. **Demo banner** — always visible; cannot be dismissed
5. **No profit guarantees** — all copy uses "estimated rewards", "eligible rewards", "potential earnings"
6. **Risk labels** — shown on all trading/AMM/new-launch assets
7. **Input validation** — XRPL address format checked at every API boundary
8. **Read-only XRPL** — only 10-method allowlist used; no write access via public WebSocket

---

## Files Created

### Config (`src/config/exchange-os/`)
| File | Purpose |
|------|---------|
| `brand.ts` | Brand constants, tagline, powered-by |
| `xrpl.ts` | Network config, TROPTIONS token hex+issuer, mainnet gate |
| `x402.ts` | x402 config, facilitator URL, payment config |
| `fees.ts` | Fee policy, bps helpers, feeDisclaimer |
| `features.ts` | Feature flags (env-gated) |
| `riskLabels.ts` | 13 risk labels, RiskLevel, RiskLabelId type |
| `demoData.ts` | Demo tokens (numeric fields), AMM pools, admin metrics, wallet |
| `packages.ts` | 6 partner packages, PartnerType union |
| `routes.ts` | Nav routes (primary/secondary/mobile) |

### XRPL Lib (`src/lib/exchange-os/xrpl/`)
| File | Purpose |
|------|---------|
| `types.ts` | All shared XRPL types (issuer optional on XrplTokenInfo) |
| `client.ts` | Read-only WebSocket with 10-method allowlist |
| `readToken.ts` | Token info + TROPTIONS hex resolver |
| `readWallet.ts` | Wallet address validation + balance lookup |
| `readAmm.ts` | AMM pool data |
| `quote.ts` | `getXrplQuote()` via ripple_path_find |
| `prepareSwap.ts` | `prepareXrplSwap()` → unsigned OfferCreate |
| `prepareTrustline.ts` | `prepareXrplTrustline()` → unsigned TrustSet |
| `prepareLaunch.ts` | `prepareXrplLaunch()` → multi-step unsigned packet |

### x402 Lib (`src/lib/exchange-os/x402/`)
| File | Purpose |
|------|---------|
| `types.ts` | X402Service, X402PaymentQuote, X402VerifyResult |
| `services.ts` | 10 x402-gated services catalog |
| `quote.ts` | Payment quote generator |
| `verify.ts` | Payment verification via facilitator |
| `middleware.ts` | `checkX402Payment()` middleware |

### Rewards Lib (`src/lib/exchange-os/rewards/`)
| File | Purpose |
|------|---------|
| `types.ts` | RewardPolicy, RewardCalculation, REWARD_DISCLAIMER |
| `rewardPolicy.ts` | 6 reward policies (creator/referral/sponsor/liquidity/api/campaign) |
| `calculateRewards.ts` | Reward estimation + display formatter |

### Risk Lib (`src/lib/exchange-os/risk/`)
| File | Purpose |
|------|---------|
| `types.ts` | RiskAssessment, IssuerRisk, LiquidityRisk |
| `riskLabels.ts` | Token risk profile builder |
| `issuerChecks.ts` | Issuer label derivation + verified issuer check |
| `liquidityChecks.ts` | Liquidity risk labels from AMM pool data |

### Reports Lib (`src/lib/exchange-os/reports/`)
| File | Purpose |
|------|---------|
| `tokenRisk.ts` | Full token risk report generator |
| `launchReadiness.ts` | 9-check launch readiness report |

### Voice Lib (`src/lib/exchange-os/voice/`)
| File | Purpose |
|------|---------|
| `deepgram.ts` | TTS + STT wrappers with dual-key failover |

### Leads Lib (`src/lib/exchange-os/leads/`)
| File | Purpose |
|------|---------|
| `index.ts` | Lead submission (CRM webhook or console in demo) |

### Proof Lib (`src/lib/exchange-os/proof/`)
| File | Purpose |
|------|---------|
| `types.ts` | ProofPacket, ProofPacketInput |
| `createProofPacket.ts` | Proof packet generator with attestation disclaimer |

### CSS
| File | Purpose |
|------|---------|
| `src/styles/exchange-os.css` | Full design system: CSS vars, card variants, badges, buttons, risk box |

### Components (`src/components/exchange-os/`)
| Component | Purpose |
|-----------|---------|
| `AppShell.tsx` | Layout: sidebar nav + mobile nav + demo banner |
| `RiskBadge.tsx` | Single + group risk badge renderer |
| `HeroSection.tsx` | Landing hero with CTAs and proof pillars |
| `FeatureCard.tsx` | Feature highlight card with accent colors |
| `SwapPanel.tsx` | Full DEX swap UI (quote + prepare) |
| `TokenCard.tsx` | Token summary card with risk badges |
| `LaunchWizard.tsx` | 6-step token launch wizard |
| `SignupForm.tsx` | Partner signup form |
| `X402ServiceCard.tsx` | x402 service card + grid |
| `OrderBookPanel.tsx` | XRPL DEX order book (demo + live) |
| `TradingPanel.tsx` | SwapPanel + OrderBook combined layout |
| `AmmPoolCard.tsx` | AMM pool stats card |
| `IssuerVerificationBadge.tsx` | Verified/unverified issuer badge |
| `TrustlineWarning.tsx` | Trustline requirement banner |
| `EarnCard.tsx` | Reward policy card |
| `ProofPacketPanel.tsx` | Proof packet generator UI |
| `AdminMetricCard.tsx` | Admin metric stat card |
| `WalletAnalyticsPanel.tsx` | Wallet address lookup panel |
| `TokenSearch.tsx` | Inline token search with dropdown |
| `SponsorCampaignBuilder.tsx` | Campaign builder form |
| `SalesDeck.tsx` | 10-slide sales deck |

### Pages (`src/app/exchange-os/`)
| Page | Route | Purpose |
|------|-------|---------|
| `layout.tsx` | `/exchange-os` | AppShell wrapper + metadata |
| `page.tsx` | `/exchange-os` | Home: hero, stats, features, tokens |
| `trade/page.tsx` | `/exchange-os/trade` | SwapPanel + explainer sidebar |
| `launch/page.tsx` | `/exchange-os/launch` | LaunchWizard + sidebar |
| `x402/page.tsx` | `/exchange-os/x402` | x402 explainer + service grid |
| `earn/page.tsx` | `/exchange-os/earn` | Reward policy grid |
| `tokens/page.tsx` | `/exchange-os/tokens` | Token registry grid |
| `token/[id]/page.tsx` | `/exchange-os/token/[ticker]` | Token detail + risk + trade CTA |
| `signup/page.tsx` | `/exchange-os/signup` | Partner signup + packages |
| `wallet/page.tsx` | `/exchange-os/wallet` | Wallet analytics lookup |
| `creator/page.tsx` | `/exchange-os/creator` | Creator dashboard |
| `sponsor/page.tsx` | `/exchange-os/sponsor` | Sponsor campaign builder |
| `admin/page.tsx` | `/exchange-os/admin` | Admin metrics overview |
| `deck/page.tsx` | `/exchange-os/deck` | 10-slide sales deck |
| `voice/page.tsx` | `/exchange-os/voice` | Deepgram TTS/STT interface |

### API Routes (`src/app/exchange-os/api/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `health` | GET | Health + feature flags |
| `xrpl/status` | GET | XRPL connectivity check |
| `xrpl/quote` | POST | Path-find quote |
| `xrpl/prepare-swap` | POST | Unsigned OfferCreate |
| `xrpl/prepare-trustline` | POST | Unsigned TrustSet |
| `xrpl/prepare-launch` | POST | Multi-step launch packet |
| `xrpl/token` | GET | Token info lookup |
| `xrpl/wallet` | GET | Wallet balance + trustlines |
| `xrpl/amm` | GET | AMM pool info |
| `x402/quote` | GET/POST | x402 payment quote |
| `x402/health` | GET | x402 service health |
| `x402/services` | GET | Service catalog |
| `x402/verify` | POST | Payment verification |
| `leads` | POST | Partner/sponsor lead submission |
| `proof-packet` | POST | Proof packet generation |
| `reports/token-risk` | POST | Full risk report (x402-gated in prod) |
| `reports/launch-readiness` | POST | Launch readiness report (x402-gated in prod) |
| `voice/speak` | POST | Text → MP3 (Deepgram Aura) |
| `voice/listen` | POST | Audio → transcript (Deepgram Nova-3) |

---

## Environment Variables

See `.env.example` for full reference. Minimum to activate production features:

```bash
# Live XRPL
XRPL_MAINNET_ENABLED=true
XRPL_MAINNET_WS_URL=wss://xrplcluster.com

# x402 payments
X402_ENABLED=true
X402_FACILITATOR_URL=https://your-x402-facilitator.example.com
X402_RECEIVING_ADDRESS=your-base-wallet-address

# Voice (already in .env.local from Ada)
DEEPGRAM_KEY=your-deepgram-key
```

---

## Reward Policy Summary

| Category | Rate |
|----------|------|
| Creator (token launch) | 25% of eligible platform fees |
| Referral | 10% of eligible platform fees |
| Sponsor campaigns | 15% of campaign eligible volume |
| Liquidity providers | 30% of AMM fee revenue |
| API revenue (dev partners) | 20% of x402 API revenue |
| Campaign (promotional) | Configurable per campaign |

All rewards are **estimated** and **eligible** — not guaranteed. See `feeDisclaimer` in `src/config/exchange-os/fees.ts`.

---

## Bug Fixes Applied During Build

1. **DEMO_TOKENS shape** — Added numeric `price`, `change24h`, `volume24h`, `marketCap`, `holders` fields (were strings/missing)
2. **DEMO_ADMIN_METRICS** — Added `x402ApiCalls`, `totalVolumeUsd`, `activeTokens`, `totalCreators` fields
3. **Duplicate RiskLabelId** — Removed manually added type (already derived from `keyof typeof RISK_LABELS`)
4. **XrplTokenInfo.issuer** — Made optional (XRP has no issuer)
5. **x402 priceCents field** — Fixed `priceUsdCents` → `priceCents` in route + component
6. **LaunchRequest fields** — Fixed `tokenName/ticker/totalSupply/issuerAddress` → `issuerWallet/currency/maxSupply`
7. **PartnerPackage.tagline** — Fixed to use `priceNote`
8. **SignupForm state type** — Fixed `useState(PARTNER_TYPES[0])` → `useState<string>(...)`
9. **Quote field names** — `sourceAmount/destinationAmount` → `fromAmount/toAmount`
10. **Prepare-swap field names** — `amount/slippageBps` → `fromAmount/toAmount/slippagePct`

---

*Build completed — zero TypeScript errors, all 15 pages and 19 API routes build green.*
