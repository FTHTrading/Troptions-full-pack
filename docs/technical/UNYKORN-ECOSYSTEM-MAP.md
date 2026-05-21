# TROPTIONS / UNYKORN Layer 1 Ecosystem Map

**Last Updated:** 2026-05-16
**Compiled By:** DONK AI

---

## Executive Summary

You are running a **multi-chain, multi-layer infrastructure stack** that spans:

| Layer | Chain | Purpose | Status |
|-------|-------|---------|--------|
| **Settlement (L1)** | Apostle Chain 7332 | ATP native asset, agent-to-agent payments | **Local Live** |
| **Commerce (L1)** | Polygon Mainnet | USDC x402 settlement, agent NFTs | **Mainnet Live** |
| **Fan Economy (L1)** | Solana Mainnet | $PICK token, NFT drops, loyalty | **Mainnet Live** |
| **Bridge Layer** | x402 Protocol | AI-to-AI payment standard | **Staged** |
| **Telecom Layer** | NEEDAI + CLAWD | Voice/SMS on-ramp to blockchain | **26/27 Proofs** |
| **Application Layer** | DONK AI + TROPTIONS | Fan engagement, merchant tools | **Active** |

---

## 1. INFRASTRUCTURE LAYER — UnyKorn Core

### 1.1 Apostle Chain (Local L1)
- **Chain ID:** 7332
- **Native Asset:** ATP
- **Runtime:** Rust/Axum (real binary) / Node.js stub (current)
- **Ports:** 7332 (local)
- **Domains:** apostle.unykorn.org (pending EC2), rpc.unykorn.org (height 15680)
- **Status:** LOCAL_CHAIN_LIVE ✅
- **Truth Labels:**
  - ✅ /health 200
  - ✅ /status 200
  - ❌ On-chain Ed25519 settlement (hash/sig mismatch)

**Next Milestone:** Resolve hash/sig mismatch → earn X402_ONCHAIN_SETTLEMENT_PROVEN

### 1.2 x402 Credit Gateway
- **Port:** 4020
- **Mode:** STAGED (mock receipts allowed, real settlement OFF)
- **Runtime:** Node.js/Express
- **Public URL:** https://x402.unykorn.org/health → HTTP 200 ✅
- **Phases Passing:**
  1. Persistent storage ✅
  2. Idempotency keys ✅
  3. Ledger correlation ✅
  4. Signing mode awareness ✅
- **Staged Payment Round-trip:** Proven 2026-05-05 ✅

**Next Milestone:** Wallet rotation + testnet proof → production activation

### 1.3 Popeye Relay (Pending)
- **Purpose:** Watchtower between x402 gateway and Apostle Chain
- **Function:** Monitor ATP balances, detect stale agents, trigger re-registration/ejection
- **Status:** POPEYE_PENDING_PROOF — Architecture defined, binary not started
- **Next:** Define repo, port, health endpoint, wire to agent registry

### 1.4 Cloudflare Tunnel
- **Status:** X402_PUBLIC_CF_TUNNEL_LIVE ✅
- **URL:** https://x402.unykorn.org/health → HTTP 200
- **Compute:** Local sovereign hardware (not cloud)
- ** apostle.unykorn.org:** Pending EC2 activation

---

## 2. TELECOM BRIDGE — NEEDAI + CLAWD

### 2.1 NeedAI (Port 3000)
- **Runtime:** Next.js
- **Functions:**
  - Telecom intake (voice/SMS)
  - Revenue agent routing
  - CLAWD storm/legal intake
  - Ada AI sovereign assistant
- **Proof Checks:** 26/27 passing ✅
- **Status:** NEEDAI_LIVE ✅
- **CLAWD_STORM_AND_LEGAL_INTAKE_ROUTING_CONFIRMED** ✅

### 2.2 Voice/SMS Lines
| Number | Purpose | Status |
|--------|---------|--------|
| **1-888-690-DONK** | DONK AI main line | Active |
| **1-888-827-3432** | Fan/guest line | Active |
| **+1-844-TRX-ONUS** | Sales line | Active |

**Next Milestone:** Live Telnyx SMS (currently dry-run)

### 2.3 Telnyx Integration
- **Status:** Account active, credit negative (-$17.22)
- **Toolkit:** 200+ API skills loaded (Go/Java/JS/Python/Ruby)
- **Functions:** Voice, messaging, numbers, fax, verify, storage

---

## 3. COMMERCE LAYER — Polygon Mainnet

### 3.1 Genesis X402 / Drunks.app
- **Chain:** Polygon Mainnet (chain 137)
- **Asset:** USDC
- **Purpose:** AI agents paying for AI services over HTTP
- **Features:**
  - 15 soul-bound agent NFTs
  - Contracts verified on PolygonScan
  - Settlement Explorer reads live from mainnet
  - Action types: AI_CALL, DATA, COMPUTE, STORAGE
- **Status:** **MAINNET LIVE** ✅
- **Note:** Separate from Apostle Chain local stack

### 3.2 Deterministic Publishing
- **Purpose:** 5-layer cryptographic provenance for manuscripts
- **Stack:** SHA-256 → Merkle → IPFS → Polygon anchor → signed identity
- **Status:** Deployed on Polygon mainnet ✅

---

## 4. FAN ECONOMY LAYER — Solana

### 4.1 $PICK Token
- **Chain:** Solana Mainnet
- **Max Supply:** 1,000,000
- **Type:** Non-custodial
- **DEX:** Jupiter
- **Purpose:** TROPTIONS ecosystem token, prediction markets, rewards
- **Products:**
  - Mint a Moment (NFT collectibles, 0.05–0.5 SOL)
  - Buy $PICK (SOL → PICK swap)
  - Predict & Win (live WC2026 markets)
  - Genesis Vault Pass (99 passes, 0.5 SOL, 10% rev share)

### 4.2 Solana Launchpad (launch.unykorn.org)
- **Type:** NFT + Token launcher
- **Capabilities:**
  - Mint collections up to 10k
  - SPL token creation
  - Candy Machine / Metaplex integration
  - Compressed NFTs (cNFT)
  - Whitelist + presale
  - Royalty enforcement
- **Revenue Model:**
  - Base launch: 2 SOL (~$400)
  - Per-mint: 0.01 SOL
  - Premium managed launch: 10 SOL

### 4.3 TROPTIONS Integration
- **Bridge:** Convert TRX to SOL for gas
- **Payment:** x402 protocol for sponsor launches
- **Phone:** Text "LAUNCH" to 1-888-827-3432
- **Sponsor Payout:** 15% of launch fees via FIFA channel

---

## 5. APPLICATION LAYER — DONK AI + FIFA 2026

### 5.1 DONK AI Runtime
- **Voice:** ElevenLabs Josh
- **Personality:** Punchy, direct, no fluff
- **Phone:** 1-888-690-DONK
- **Company:** TROPTIONS
- **Brand Lock:**
  - Never mention Wilkins
  - Never speak as "OpenClaw" or "assistant"
  - Non-custodial only

### 5.2 FIFA 2026 Atlanta (June 10)
**Venue:** Mercedes-Benz Stadium (75K capacity)

| Date | Match | Priority Languages |
|------|-------|-------------------|
| June 15 | Spain vs. Cabo Verde | Spanish, Portuguese, Kriolu |
| June 18 | Czechia vs. South Africa | Czech, Zulu/Xhosa/Afrikaans |
| June 21 | Spain vs. Saudi Arabia | Spanish, Arabic |
| June 24 | Morocco vs. Haiti | Arabic, French, Haitian Creole |
| June 27 | Congo DR vs. Uzbekistan | French, Lingala, Uzbek/Russian |
| July 1 | Knockout | TBD |
| July 7 | Quarterfinal | TBD |
| July 15 | **SEMIFINAL** | TBD |

**Staff Required:** 1,250 total
**Projected Revenue per Match:** $2,350 (IVR + SMS + sponsor commissions)
**Total 8 Matches:** $18,800

### 5.3 Merchant Launchpad
- **Port:** 5001
- **Features:**
  - 5 token templates
  - 10 languages
  - Sponsor catalog (18 sponsors mapped)
  - QR campaigns
  - Loyalty rewards
  - NFT coupons
  - VIP passes

### 5.4 Sponsors Mapped
**FIFA Official Partners (6):** Adidas, Coca-Cola, Wanda Group, Qatar Airways, Hyundai-Kia, Alibaba Cloud
**FIFA World Cup Sponsors (5):** Budweiser, BYD, Hisense, McDonald's, Vivo
**North American Supporters (3):** AT&T, Delta Air Lines, Ticketmaster
**Atlanta Local (4):** Atlanta United, The Home Depot, Chick-fil-A, Coca-Cola HQ
**TROPTIONS Exclusive:** Digital Asset Partner

---

## 6. PROOF STACK — Truth Labels

| Label | Component | Status | Proven By |
|-------|-----------|--------|-----------|
| LOCAL_CHAIN_LIVE | Apostle Chain | ✅ | /health 200 + /status 200 |
| LOCAL_GATEWAY_LIVE | x402 Gateway | ✅ | Staged round-trip 2026-05-05 |
| X402_PUBLIC_CF_TUNNEL_LIVE | Cloudflare | ✅ | HTTPS 200 |
| NEEDAI_LIVE | NeedAI + CLAWD | ✅ | 26/27 checks |
| POPEYE_PENDING_PROOF | Popeye Relay | ❌ | Not deployed |
| AWS_STAGING_DOCS_EXIST | AWS Layer | ✅ | Runbooks exist |
| AWS_MAINNET_LIVE | AWS Public | ❌ | No live endpoint |
| X402_ONCHAIN_SETTLEMENT_PROVEN | Real settlement | ❌ | Hash/sig mismatch |

---

## 7. CURRENT BLOCKERS

| Priority | Blocker | Action Needed |
|----------|---------|---------------|
| **P0** | Telnyx credit: -$17.22 | Add $20 at portal.telnyx.com |
| **P0** | X402_PAY_TO_ADDRESS dummy | Run UPDATE_X402_WALLET.ps1 |
| **P0** | Exposed secrets | Rotate credentials |
| **P1** | Cloudflare DNS | Wait for propagation |
| **P1** | Apostle Chain settlement | Resolve hash/sig mismatch |
| **P2** | Popeye Relay | Define repo + deploy |
| **P2** | Language audio files | Record/contract voice talent |

---

## 8. FLEET STATUS (PM2)

| Service | Port | Status |
|---------|------|--------|
| SYS-802-x402-core | 18789 | ✅ |
| donk-launchpad | 5001 | ✅ |
| donk-verify | 7500 | ✅ |
| fifa-ivr | 5000 | ✅ |
| fifa-orchestrator | 8400 | ✅ |
| x402-bridge | 7402 | ✅ |
| whichway-webhook | 7403 | ✅ |
| Coder daemons (3) | — | ✅ |
| Telegram bots | — | ✅ |

**Total: 11/11 services online**

---

## 9. GIT REPOSITORIES

| Repo | Status | Uncommitted |
|------|--------|-------------|
| troptions | Active | 2 files (.vscode/) |
| solana-launcher | Active | 6 files (app/c/) |
| donk-ide | Active | 7 files (hooks, standalone HTML, Tauri) |

---

## 10. KEY URLs

| Service | URL |
|---------|-----|
| x402 Health | https://x402.unykorn.org/health |
| Apostle Health | https://apostle.unykorn.org/health |
| RPC Status | https://rpc.unykorn.org/status |
| FIFA IVR | https://fifa.unykorn.org |
| Merchant Launchpad | http://127.0.0.1:5001 |
| Solana Launchpad | launch.unykorn.org |
| Telnyx Dashboard | https://portal.telnyx.com |
| PM2 Dashboard | https://app.pm2.io/#/r/eizgr36ucgz5fpt |
| FIFA Schedule | https://atlantafwc26.com/match-schedule/ |

---

## 11. DOCUMENTATION INVENTORY

### Core Identity
- AGENTS.md — Workspace rules
- SOUL.md — DONK AI persona
- USER.md — Human profile (empty)
- IDENTITY.md — Agent identity (empty)
- TOOLS.md — Environment notes (empty)
- HEARTBEAT.md — 5-min tasks

### Ecosystem Docs
- content/ATLANTA-WC2026-README.md — FIFA configuration
- content/donk-marketing-package.md — Marketing copy
- skills/troptions-revenue/SPONSORS.md — Sponsor registry
- skills/solana-launchpad/SKILL.md — Launchpad spec
- skills/troptions-phone/LAUNCHPAD.md — Phone menu
- skills/solana-funding/FUNDING.md — Solana grant pitch

### Skills (Loaded)
- telnyx-toolkit (200+ API skills)
- solana-launchpad
- troptions-revenue
- troptions-phone
- whichway-live
- local-whisper
- donk-revenue
- solana-funding

---

## 12. REVENUE MODELS

### UnyKorn Infrastructure
| Stream | Rate | Volume | Revenue |
|--------|------|--------|---------|
| x402 settlement fees | Variable | Agent mesh volume | ATP-denominated |
| Popeye relay monitoring | Subscription | Agent count | ATP-denominated |

### DONK AI / TROPTIONS
| Stream | Rate | Per Match | 8 Matches |
|--------|------|-----------|-----------|
| FIFA IVR calls | $0.10 | $100 | $800 |
| DONK Verify SMS | $5 | $250 | $2,000 |
| Merchant tokens | $50 setup | $1,000 | $8,000 |
| Sponsor commissions | 10% | $1,000 | $8,000 |
| **Total** | | **$2,350** | **$18,800** |

### Solana Launchpad
| Tier | Fee |
|------|-----|
| Base launch | 2 SOL (~$400) |
| Per-mint | 0.01 SOL |
| Premium managed | 10 SOL |
| Sponsor revenue share | 15% of FIFA channel |

---

## 13. NEXT ACTIONS (Prioritized)

### This Week
1. **Resolve x402 wallet** — Run UPDATE_X402_WALLET.ps1
2. **Fix Telnyx credit** — Add $20, test live SMS
3. **Apostle Chain settlement** — Debug hash/sig mismatch
4. **Cloudflare propagation** — Verify fifa.unykorn.org

### Next 2 Weeks
5. **Popeye Relay** — Deploy watchtower layer
6. **AWS public endpoint** — Activate EC2 + cutover
7. **Language packs** — Load Tier 2/3 audio
8. **Genesis Wallet UI** — Fix "Offline / No receipts" display

### Pre-WC2026 (June 10)
9. **Staff onboarding** — 1,250 hires
10. **Sponsor activations** — 18 sponsors live
11. **Merchant campaigns** — Launchpad onboarded
12. **$PICK liquidity** — Ensure Jupiter depth

---

**Source:** Compiled from unykorn.org, memory files (2026-05-13 through 2026-05-16), and workspace documentation.
