# TROPTIONS Sports Network — Funding Page Audit
**Date:** 2026-05-09  
**Commit:** `3d3e0db`  
**Status:** Built + deployed to Vercel

---

## Route Created

`/sports/funding` — TROPTIONS Sports Network Funding Memo

**Fixes:** `/sports/team` CTA "View Funding Memo" was pointing to a 404. This route is now live.

---

## File Created

| File | Lines | Purpose |
|---|---|---|
| `src/app/sports/funding/page.tsx` | ~280 | Professional funding memo page, fully inline data, no external data file needed |

---

## Sections Created

| # | Section | Content |
|---|---|---|
| — | Hero | "Funding the Event Commerce Network" — headline, subheadline, legal disclaimer block |
| 01 | What We Built | 6 cards — TROPTIONS Sports Network, TTN, Moments+Claim, Sponsor+Merchant, Charity, Solana Launcher |
| 02 | Why This Matters | 2-col layout — narrative paragraph + 6 actor/problem rows (sponsors, merchants, charities, media, fans, organizers) |
| 03 | Why Solana | 8 cards — low-cost tx, fast settlement, wallet-native rewards, SPL tokens, NFT/moments, on-chain receipts, liquidity, mobile-first |
| 04 | Funding Milestones | 3 tiers — $25K Grant, $75K–$150K Grant, $250K Accelerator/Pre-Seed |
| 05 | Use of Funds | 8 cards — Engineering, Solana, Security, Sponsor Sales, Media, Merchant, Event Pilot, Analytics |
| 06 | Grant + Partnership Targets | 10 cards — Solana Foundation through local merchant groups |
| 07 | Current Proof | 13 live links — all /sports routes + API + infra |
| 08 | Strategic Ask | Narrative + 6 ask-type badges |
| — | CTA | 4 buttons → /sports/team, /sports/proof, /sports/partners, /sports/moments |
| — | Footer disclaimer | Comprehensive legal — no affiliation, no investment promise |

---

## Funding Tiers

| Tier | Amount | Label | Key Deliverables |
|---|---|---|---|
| Tier 1 | $25K Grant | Event Launch Kit | Documentation, devnet deployment, sponsor demo, QR pilot, proof dashboard |
| Tier 2 | $75K–$150K | Production Hardening | Mainnet integrations, security review, Stripe+on-chain checkout, TTN production stack |
| Tier 3 | $250K | Accelerator / Pre-Seed | Live event pilot, 7–10 hires, full sponsor/merchant/charity campaign execution |

---

## Grant Targets

| Target | Category |
|---|---|
| Solana Foundation | Core ecosystem grants |
| Colosseum | Hackathon + accelerator |
| Superteam | Builder community + regional |
| Solana Mobile | Mobile-first alignment |
| Helius / QuickNode | RPC infrastructure credits |
| Pinata / IPFS | NFT metadata storage credits |
| Metaplex | Digital moments minting |
| Raydium / Meteora / Jupiter | DEX liquidity + token discovery |
| Event Sponsors | Brand activation budgets |
| Local Merchant Groups | Cooperative sponsorships |

---

## Design System Applied

- Background: `#071426` (page) / `#050f1e` (alternating sections)
- Cards: `#0b1f36` with `border border-white/10`
- Gold: `#c99a3c` / `#f0cf82` (primary accent, section labels, CTA)
- Blue: `border-blue-400` (Tier 2, Solana cards)
- Purple: `border-purple-400` (Tier 3, Why Solana section)
- No emojis, no meme-token language, no fake affiliations
- `rounded-none` — sharp corners throughout

---

## Build Result

```
✓ Compiled successfully in 2.6min
```

No TypeScript errors.

---

## CTA Status — All Links

| Button | Route | Status |
|---|---|---|
| View Team | `/sports/team` | Live |
| View Sports Proof | `/sports/proof` | Live |
| Partner With TROPTIONS | `/sports/partners` | Live |
| View Moments | `/sports/moments` | Live |

---

## Blocker Resolved

| Before | After |
|---|---|
| `/sports/team` CTA "View Funding Memo" → **404** | `/sports/funding` is **live** |

---

## Remaining Blockers

### 1. `/sports/funding` references `/sports/team` in proof list — both now live ✅

### 2. `/sports/solana` — not yet created
Referenced as a tunnel hostname (`solana.unykorn.org → localhost:3000`). Should be a dedicated Solana Event Token Launcher page.

### 3. `/sports/grants` — not yet created
Would be a direct grant application + status tracker page for Solana Foundation, Colosseum, etc.

### 4. Stripe webhook not registered
Moments purchase flow requires registration at https://dashboard.stripe.com/webhooks:
- URL: `https://troptions.com/api/worldcup/webhook`
- Event: `checkout.session.completed`

### 5. `/api/moments/mint` route not created
`/sports/mint` page degrades gracefully to demo mode. Real Solana minting requires:
`src/app/api/moments/mint/route.ts`

### 6. Apostle API 502 (apostle-api.unykorn.org)
Cloudflare tunnel routes `apostle-api.unykorn.org → localhost:7332`. The apostle-chain service at port 7332 is returning 502 — likely not running. Check: `pm2 list | findstr apostle` or verify the Rust service is active.

---

## Next Pages (in priority order)

| Route | Priority | Reason |
|---|---|---|
| `/sports/solana` | High | Dedicated Solana Launcher page — grant applications need it |
| `/sports/grants` | High | Direct outreach tool for Solana Foundation / Colosseum |
| `/sports/world-cup` | Medium | Event-specific landing — FIFA-scale market pitch |
| `/sports/demo` | Medium | Interactive demo for sponsor/grant pitches |
| `/sports/proof/infrastructure` | Medium | Deeper infrastructure proof beyond summary |

---

## Git Log (funding-related)

| Commit | Description |
|---|---|
| `edb380b` | Full TROPTIONS Sports Network — 14 pages, 7 components, 5 API routes |
| `d066480` | /sports/team — professional org page + team.json |
| `3d3e0db` | /sports/funding — funding memo + TROPTIONS_TEAM_PAGE_AUDIT.md |

---

*Update `src/app/sports/funding/page.tsx` inline data arrays to reflect actual grant outreach status as relationships develop.*
