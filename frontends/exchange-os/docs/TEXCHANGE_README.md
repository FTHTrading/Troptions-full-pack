<div align="center">

# 〒 TExchange

### **Launch. Trade. Earn. Prove.**

*TROPTIONS Exchange OS — Institutional-grade token trading and launch platform powered by XRPL settlement + x402 pay-per-use commerce*

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![XRPL](https://img.shields.io/badge/XRPL-Powered-00AAE4?style=flat-square&logo=xrp&logoColor=white)](https://xrpl.org/)
[![x402](https://img.shields.io/badge/x402-Protocol_v0.3-C9A24A?style=flat-square)](https://x402.org/)
[![Deepgram](https://img.shields.io/badge/Deepgram-Voice_AI-13EF93?style=flat-square)](https://deepgram.com/)
[![License](https://img.shields.io/badge/License-Proprietary-C9A24A?style=flat-square)](./LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Pages & Routes](#-pages--routes)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Security Rules](#-security-rules)
- [Quick Start](#-quick-start)
- [Reward System](#-reward-system)
- [Risk Framework](#-risk-framework)
- [Deployment](#-deployment)

---

## 🟡 Overview

**TExchange** is the official TROPTIONS Exchange OS — a full-stack Next.js 15 application that makes XRPL trading, token launches, and AI-powered commerce simple for anyone.

| Rail | Technology | Purpose |
|------|-----------|---------|
| 🔵 **XRPL Rail** | `xrpl` npm · WebSocket | Token trading, AMM pools, trustlines, on-chain settlement |
| ⚡ **x402 Rail** | x402 Protocol v0.3.0 | Pay-per-use AI reports, premium API access |
| 🟡 **TROPTIONS OS** | Next.js App Router | Launchpad, rewards, proof packets, partner network |
| 🎙 **Voice** | Deepgram Aura + Nova-3 | TTS/STT AI voice interface |

> **Security principle:** TROPTIONS Exchange OS **never holds private keys**. Every transaction returns an **unsigned payload** — your wallet signs on the client side.

---

## ✨ Features

### 🔵 Trading & Exchange
- **Real-time DEX swap** — XRPL path-find quotes, unsigned `OfferCreate` preparation
- **AMM pools** — Pool depth, trading fees, LP token supply display
- **Order book viewer** — XRPL DEX bid/ask spread
- **Live markets ticker** — Scrolling price strip with % change indicators
- **Token search** — Fuzzy search across all registered tokens
- **Wallet analytics** — Read-only XRP balance + trustline inspector

### 🚀 Token Launchpad
- **6-step wizard** — Ticker, supply, metadata, fees, AMM liquidity, proof packet
- **Launch readiness report** — 9-point checklist with score 0–100
- **Proof packets** — Portable, portable verifiable on-chain attestation records
- **Trustline preparation** — Unsigned `TrustSet` generator

### 🟡 Earn & Rewards
| Category | Est. Rate | Description |
|----------|-----------|-------------|
| Creator | 25% of eligible fees | Token launch volume rewards |
| Referral | 10% of eligible fees | Partner referral rewards |
| Sponsor | 15% of campaign volume | Merchant/sponsor campaign share |
| Liquidity | 30% of AMM fees | LP provider share |
| API Revenue | 20% of x402 revenue | Developer partner share |

> All reward rates are **estimated** and **not guaranteed**. See `REWARD_DISCLAIMER`.

### ⚡ x402 Premium Services
10 services gated by x402 micropayments:

| # | Service | Category |
|---|---------|----------|
| 1 | Token Risk Report | risk |
| 2 | Launch Readiness Report | launch |
| 3 | Live Price Feed | data |
| 4 | XRPL Path Analysis | trading |
| 5 | AMM Arbitrage Scanner | trading |
| 6 | Historical Volume Data | data |
| 7 | Creator Analytics Dashboard | analytics |
| 8 | Compliance Report | compliance |
| 9 | Smart Money Signals | intelligence |
| 10 | Wallet Intelligence | intelligence |

### 🎙 Voice Interface
- **TTS** — Text → MP3 via Deepgram Aura (`aura-2-thalia-en`)
- **STT** — WebM audio → transcript via Deepgram Nova-3
- Dual-key failover: `DEEPGRAM_KEY` → `DEEPGRAM_KEY_ALT`

---

## 🏗 Architecture

```
src/
├── app/exchange-os/              # Next.js App Router route group
│   ├── layout.tsx                # AppShell (sidebar + topbar + ticker)
│   ├── page.tsx                  # Home / landing
│   ├── trade/                    # DEX swap + order book
│   ├── launch/                   # Token launchpad wizard
│   ├── earn/                     # Reward policies
│   ├── x402/                     # x402 premium services
│   ├── tokens/                   # Token registry
│   ├── token/[id]/               # Dynamic token detail page
│   ├── wallet/                   # Wallet analytics
│   ├── creator/                  # Creator dashboard
│   ├── sponsor/                  # Campaign builder
│   ├── admin/                    # Operator metrics
│   ├── deck/                     # 10-slide sales deck
│   ├── voice/                    # Voice TTS/STT
│   ├── signup/                   # Partner signup
│   └── api/                      # ← 19 API routes
│       ├── health/
│       ├── xrpl/{quote, prepare-swap, prepare-trustline,
│       │         prepare-launch, token, wallet, amm, status}/
│       ├── x402/{quote, health, services, verify}/
│       ├── reports/{token-risk, launch-readiness}/
│       ├── voice/{speak, listen}/
│       ├── proof-packet/
│       └── leads/
│
├── components/exchange-os/       # 27 React components
│   ├── TroptionsLogo.tsx         # ← SVG double-T gold logo (no files needed)
│   ├── AppShell.tsx              # Layout: sidebar + TopBar + LiveMarketsTicker
│   ├── TopBar.tsx                # Network badge + search + wallet connect
│   ├── LiveMarketsTicker.tsx     # Animated price strip
│   ├── HeroSection.tsx
│   ├── SwapPanel.tsx
│   ├── TokenCard.tsx
│   ├── LaunchWizard.tsx
│   ├── OrderBookPanel.tsx
│   ├── AmmPoolCard.tsx
│   ├── EarnCard.tsx
│   ├── ProofPacketPanel.tsx
│   ├── WalletAnalyticsPanel.tsx
│   ├── TokenSearch.tsx
│   ├── SalesDeck.tsx
│   └── ... (12 more)
│
├── config/exchange-os/           # 9 typed config files
│   ├── brand.ts                  # Name, tagline, powered-by
│   ├── xrpl.ts                   # XRPL network + TROPTIONS hex issuer
│   ├── x402.ts                   # x402 config + facilitator URL
│   ├── fees.ts                   # Fee policy + BPS helpers
│   ├── features.ts               # Feature flags (env-gated)
│   ├── riskLabels.ts             # 13 risk label definitions
│   ├── demoData.ts               # Demo tokens, metrics, AMM pools
│   ├── packages.ts               # 6 partner package tiers
│   └── routes.ts                 # Nav route definitions
│
├── lib/exchange-os/              # Business logic (pure, testable)
│   ├── xrpl/                     # 9 files: client, types, quote, prepare*
│   ├── x402/                     # 5 files: types, services, quote, verify, middleware
│   ├── rewards/                  # 3 files: types, policy, calculator
│   ├── risk/                     # 4 files: types, labels, issuerChecks, liquidityChecks
│   ├── reports/                  # 2 files: tokenRisk, launchReadiness
│   ├── voice/                    # deepgram.ts (TTS + STT)
│   ├── proof/                    # Proof packet generator
│   └── leads/                    # CRM lead submission
│
└── styles/
    └── exchange-os.css           # Full Horizon-grade design system (.xos scope)
```

---

## 📄 Pages & Routes

| Route | Page | Key Components |
|-------|------|---------------|
| `/exchange-os` | 🏠 Home | HeroSection, stats strip, FeatureCards, TokenCard grid |
| `/exchange-os/trade` | 📊 Trade | TradingPanel, SwapPanel, OrderBookPanel |
| `/exchange-os/launch` | 🚀 Launch | LaunchWizard (6 steps), readiness sidebar |
| `/exchange-os/earn` | ◎ Earn | EarnCard grid, REWARD_DISCLAIMER |
| `/exchange-os/x402` | ⚡ x402 | X402ServiceCard grid, explainer |
| `/exchange-os/tokens` | ≡ Tokens | TokenCard grid, TokenSearch |
| `/exchange-os/token/[ticker]` | Token Detail | Price, RiskBadgeGroup, IssuerVerificationBadge |
| `/exchange-os/wallet` | ◈ Wallet | WalletAnalyticsPanel, TrustlineWarning |
| `/exchange-os/creator` | Creator | EarnCard, ProofPacketPanel |
| `/exchange-os/sponsor` | Sponsor | SponsorCampaignBuilder |
| `/exchange-os/admin` | ⚙ Admin | AdminMetricCard grid |
| `/exchange-os/deck` | ▣ Deck | SalesDeck (10 slides) |
| `/exchange-os/voice` | 🎙 Voice | TTS textarea + STT mic recorder |
| `/exchange-os/signup` | Join | SignupForm, PARTNER_PACKAGES |

---

## 🔌 API Reference

All routes: `/exchange-os/api/`. All return `{ data?, error?, demoMode: boolean }`.

### 🔵 XRPL Endpoints

```http
GET  /xrpl/status
POST /xrpl/quote             { fromTicker, toTicker, amount }
POST /xrpl/prepare-swap      { walletAddress, fromTicker, toTicker, ... }
POST /xrpl/prepare-trustline { address, currency, issuer }
POST /xrpl/prepare-launch    { tokenName, ticker, totalSupply, issuerAddress }
GET  /xrpl/token             ?ticker=TROPTIONS&issuer=rXXX
GET  /xrpl/wallet            ?address=rXXX
GET  /xrpl/amm               ?ticker=TROPTIONS&issuer=rXXX&quote=XRP
```

### ⚡ x402 Endpoints

```http
GET  /x402/health
GET  /x402/services          ?category=risk|trading|data|analytics|compliance|intelligence
GET  /x402/quote             ?serviceId=token-risk-report
POST /x402/verify            { serviceId, nonce, txHash?, paymentHeader? }
```

### 📊 Report Endpoints (x402-gated in production)

```http
POST /reports/token-risk        { ticker, issuer }
POST /reports/launch-readiness  { issuerWallet, currency, maxSupply, ... }
```

### 🎙 Voice Endpoints

```http
POST /voice/speak     { text: string }        → audio/mpeg
POST /voice/listen    FormData { audio: Blob } → { transcript: string }
```

### 🛠 Utility Endpoints

```http
GET  /health
POST /leads          { name, email, partnerType, company, ... }
POST /proof-packet   { tokenName, tokenTicker, issuerAddress }
```

---

## ⚙️ Environment Variables

```bash
# ── XRPL ───────────────────────────────────────────────────────
XRPL_NETWORK=testnet
XRPL_WEBSOCKET_URL=wss://s.altnet.rippletest.net:51233
XRPL_MAINNET_WS_URL=wss://xrplcluster.com
XRPL_MAINNET_ENABLED=false           # ← set true for live trading

# ── TROPTIONS Token ─────────────────────────────────────────────
TROPTIONS_XRPL_ISSUER=rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3

# ── x402 Protocol ───────────────────────────────────────────────
X402_ENABLED=false                   # ← set true for real payments
X402_FACILITATOR_URL=https://...
X402_RECEIVING_ADDRESS=your-address
X402_NETWORK=base
X402_ASSET=USDC

# ── Voice (Deepgram) ────────────────────────────────────────────
DEEPGRAM_KEY=dg_...
DEEPGRAM_KEY_ALT=dg_...              # ← failover key

# ── CRM ─────────────────────────────────────────────────────────
TROPTIONS_CRM_WEBHOOK_URL=https://...
```

---

## 🛡 Security Rules

| Rule | How It's Enforced |
|------|------------------|
| **No private keys** | All API routes return **unsigned tx blobs** only |
| **Mainnet gated** | `XRPL_MAINNET_ENABLED=true` env required; default false |
| **x402 gated** | `X402_ENABLED=true` env required; default false |
| **Demo banner** | Always rendered; not dismissable |
| **No profit guarantee** | All copy: "estimated", "eligible", "potential" |
| **XRPL address validation** | Regex + length check at every API boundary |
| **Read-only XRPL** | 10-method allowlist — no write commands via WebSocket |
| **Risk labels** | Mandatory on all token/AMM/new-launch displays |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/FTHTrading/TExchange.git
cd TExchange

# Install (requires pnpm)
pnpm install

# Configure
cp .env.example .env.local
# Edit .env.local

# Start dev server
pnpm dev

# Navigate to
open http://localhost:3000/exchange-os
```

### Build & type-check

```bash
pnpm typecheck    # npx tsc --noEmit (0 errors)
pnpm build        # Production build — all 15 pages + 19 API routes
pnpm start        # Production server
```

---

## 💰 Reward System

```
Platform Fee (30 bps on eligible volume)
    │
    ├── 25% ──► Creator Reward     (who launched the token)
    ├── 10% ──► Referral Reward    (partner who referred the user)
    ├── 15% ──► Sponsor Reward     (campaign sponsor)
    ├── 30% ──► Liquidity Provider (AMM LP share)
    ├── 10% ──► Burn / Treasury
    └── 40% ──► Operator Revenue   (Exchange OS operator share)
```

> Reward eligibility, timing, and amounts depend on real platform usage, program rules, and compliance review. Not financial advice.

---

## ⚠️ Risk Framework

13-label taxonomy shown on every token:

| Label | Level | Meaning |
|-------|-------|---------|
| `VERIFIED_ISSUER` | ✅ Low | In TROPTIONS verified issuer registry |
| `UNVERIFIED_ISSUER` | 🔴 High | No verified identity |
| `FREEZE_ENABLED` | 🟠 Medium | Issuer can freeze holdings |
| `CLAWBACK_ENABLED` | 🔴 High | Issuer can claw back tokens |
| `BLACKLIST_ENABLED` | 🔴 High | Issuer can blacklist addresses |
| `LOW_LIQUIDITY` | 🟠 Medium | < 500 XRP estimated pool depth |
| `NO_LIQUIDITY` | 🔴 High | No AMM or order book found |
| `NEW_TOKEN` | 🟡 Low | < 30 days since launch |
| `TRUSTLINE_REQUIRED` | ℹ️ Info | Must set trustline to hold |
| `TRANSFER_FEE` | ℹ️ Info | Issuer charges transfer fee |
| `MAINNET_ENABLED` | ✅ Low | Live on mainnet |
| `MAINNET_DISABLED` | 🟡 None | Testnet / demo |
| `XRPL_NATIVE` | ✅ Low | XRP native currency |

---

## 📦 Deployment

### Vercel (recommended)
```bash
vercel --prod
# Set env vars in Vercel dashboard
```

### PM2 + Node
```bash
pnpm build && pm2 start "pnpm start" --name texchange
```

### Pre-production checklist
- [ ] `XRPL_MAINNET_ENABLED=true`
- [ ] Production XRPL websocket URL
- [ ] `X402_ENABLED=true` + facilitator URL + receiving address
- [ ] Both Deepgram keys set
- [ ] CRM webhook configured
- [ ] Domain SSL/TLS active

---

<div align="center">

**troptionsxchange.com**

Built on [XRPL](https://xrpl.org) · Powered by [x402](https://x402.org) · TROPTIONS Exchange OS

© 2026 FTH Trading — All rights reserved

</div>
