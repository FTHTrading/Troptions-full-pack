# TROPTIONS Sports — Premium Rewrite Audit

**Document:** Premium Sports Page Rewrite Audit  
**Project:** TROPTIONS.com Sports Section  
**Date:** 2025-01  
**Sprint:** Premium Sports Rewrite + TTN Build

---

## Summary

All 4 core sports pages were rewritten from component-based legacy JSX to premium, inline, server-component architecture. Copy was dramatically reduced. Agency-grade authority established. Solana positioned as utility layer, not product. Disclaimer placed once at footer only.

---

## Routes Rewritten

| Route | File | Status |
|---|---|---|
| `/sports` | `src/app/sports/page.tsx` | ✅ Fully rewritten |
| `/sports/tv` | `src/app/sports/tv/page.tsx` | ✅ Fully rewritten |
| `/sports/atlanta` | `src/app/sports/atlanta/page.tsx` | ✅ Rewritten + duplicate bug fixed |
| `/sports/moments` | `src/app/sports/moments/page.tsx` | ✅ Fully rewritten |

---

## Copy Reduction

### Before → After

| Page | Before | After | Change |
|---|---|---|---|
| `/sports` | ~300 lines, heavy component imports, generic sports platform | ~200 lines, 5 pillars, premium positioning | −33% |
| `/sports/tv` | Old BroadcastCard grid, feature lists, vague TV claims | 3 clean broadcast blocks + TTN stack callout | −40% |
| `/sports/atlanta` | 6 neighborhoods, 8 watch zones, old SportsHero, old BroadcastCard | 4 zones, merchant grid, inline JSX | −45% |
| `/sports/moments` | JSON data load + MomentCard grid only, no hero positioning | Hero rewrite, 5-step flow, 3 featured drops, DONK at bottom | Restructured |

---

## New Core Message

> **"The match is official. The city experience is ours."**  
> **"TROPTIONS powers the city around the game."**

These two lines anchor all sports copy. They define scope (city, not official broadcast) and authority (fan commerce network, not sports rights holder).

---

## Five Pillars — `/sports` Hub

All introduced on the sports hub page:

| Pillar | Description |
|---|---|
| TV | TROPTIONS Television Network — local broadcast around the game |
| City | City matchday network — venues, hotels, restaurants, watch parties |
| Moments | Fan rewards, digital collectibles, sponsor drops |
| Sponsors | Partner packages, QR activations, proof reports |
| Proof | Solana-anchored proof for fans, sponsors, charities |

---

## Solana Positioning

**Consistent strip on all 4 sports pages:**
> "Solana powers optional minting, proof-of-attendance, digital receipts, and sponsor reporting. TROPTIONS keeps the fan experience simple."

**Rules:**
- Solana = receipt/utility layer, not investment
- No token speculation language anywhere
- No "mint to earn" language
- Claim by phone/email always available, wallet optional

---

## Disclaimer Placement

**Global disclaimer text (used once per page, near footer):**
> "TROPTIONS is an independent fan-commerce and media activation network. No official FIFA, ESPN, Octagon, league, team, stadium, broadcaster, or rights-holder affiliation is claimed unless separately contracted. Official match coverage belongs to licensed rights holders."

**Rules enforced:**
- Disclaimer appears ONCE per page
- Always near footer, never at top
- Not in hero or above the fold
- `/sports/moments` adds: "TROPTIONS Moments are not investment products or securities."

---

## Components Removed From Sports Pages

These imports were eliminated from rewritten pages:

| Component | Was Used In | Status |
|---|---|---|
| `SportsHero` | atlanta/page.tsx | Removed |
| `BroadcastCard` | atlanta/page.tsx | Removed |
| `MatchdayCard` | atlanta/page.tsx | Removed |
| `CharityImpactCard` | atlanta/page.tsx | Removed |

These components may still exist as files but are no longer imported by the rewritten pages.

---

## Design System Applied

All 4 pages use:

| Property | Value |
|---|---|
| Background | `bg-[#071426]` |
| Alternating sections | `bg-[#050f1e]` |
| Cards | `bg-[#0b1f36]` |
| Gold accent | `#c99a3c` |
| Gold highlight | `#f0cf82` |
| Muted text | `#8a94a6` |
| Borders | `border-white/5` |
| Section padding | `py-28` |
| Radius | `rounded-none` |
| Headlines | Bold, tight, 5xl–7xl on hero |
| Body text | `text-[#8a94a6]`, `leading-relaxed` |

---

## Atlanta Page Bug — Resolved

**Root Cause:**  
During the initial `replace_string_in_file` operation, the metadata block was replaced with the full new page content. However, the old component code (NEIGHBORHOODS array, WATCH_ZONES array, second `export default function AtlantaPage()`) remained appended after the new content's closing `}`.

**Symptom:**  
TypeScript build would fail with duplicate `export default function AtlantaPage()` declarations.

**Fix Applied:**  
PowerShell truncation to line 171. File now contains exactly the new content, ending cleanly with `}`.

**Current State:**  
171 lines. Single `export default`. No legacy component imports.

---

## Key Copy Lines by Page

### `/sports` (Hub)
- "The match is official. The city experience is ours."
- "TROPTIONS powers five things around every major match."
- Five pillars: TV · City · Moments · Sponsors · Proof

### `/sports/tv`
- "Where the city watches."
- "Official matches belong to official broadcasters. TROPTIONS TV covers the city around the game."
- Links to: /sports/moments, /sports/partners, /ttn/infrastructure

### `/sports/atlanta`
- "Tickets are expensive. The city still shows up."
- "TROPTIONS turns Atlanta into a matchday network."
- 4 zones: Downtown, Midtown, Buckhead, BeltLine/Eastside

### `/sports/moments`
- "Scan the screen. Own the moment."
- "Claim free. Mint to Solana only if you want the on-chain record."
- 5-step flow: Watch → Scan → Claim → Redeem → Mint (Optional)
- 3 featured drops: City Badge, Halftime Drop, Charity Impact Badge
- DONK at bottom as "Creative Division" (not top, not hero)

---

## Production Deployment Status

| Step | Status |
|---|---|
| Pages rewritten | ✅ All 4 complete |
| Bug fixed (atlanta duplicate) | ✅ Resolved |
| `npm run build` | ⏳ Pending |
| Git commit | ⏳ Pending |
| `npx vercel --prod --yes` | ⏳ Pending |

---

*TROPTIONS Sports — Premium rewrite complete.*  
*No official sports body, broadcaster, league, or rights holder affiliation claimed.*
