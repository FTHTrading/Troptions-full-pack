# TROPTIONS Sports Network — Team Page Audit
**Date:** 2025  
**Commit:** `d066480`  
**Status:** Built + deployed to Vercel

---

## What Was Built

### Route
`/sports/team` — Full professional sports media agency org page.

Replaced prior DONK AI creative personas content with a 5-group, 30-role, data-driven organizational structure.

---

## Files Created / Modified

| File | Action | Purpose |
|---|---|---|
| `src/data/sports/team.json` | Created | Data source for all team roles, operating model layers, and group metadata |
| `src/app/sports/team/page.tsx` | Rewritten | Professional org page — server component, reads from team.json |

---

## Data Architecture (`src/data/sports/team.json`)

### Operating Model — 6 layers

| ID | Label | Accent |
|---|---|---|
| `sports-agency` | Sports Agency Layer | Gold |
| `broadcast` | Broadcast / TTN Layer | Blue |
| `fan-experience` | Fan Experience Layer | Amber |
| `sponsor-merchant` | Sponsor + Merchant Layer | Green |
| `solana-launch` | Solana Launch Layer | Purple |
| `infra-proof` | Infrastructure + Proof Layer | Rose |

### Groups — 5 groups, 6 roles each = 30 roles total

| Group ID | Label | Status Mix |
|---|---|---|
| `leadership` | Executive Leadership | 1 active, 5 needed |
| `event-ops` | Event Operations Team | 0 active, 6 needed |
| `media` | Media + Broadcast Team | 0 active, 6 needed |
| `technology` | Technology + Infrastructure | 2 active, 3 needed, 1 advisor |
| `advisory` | Advisory Board | 6 advisory seats |

**Active roles (filled):**
- Founder / Systems Architect (leadership)
- Lead Full-Stack Engineer (technology)
- Infrastructure Engineer (technology)

**Open roles (needed):** 21  
**Advisory seats:** 6

---

## Page Sections

| # | Section | Notes |
|---|---|---|
| — | Hero | Gold top bar, grid overlay, legal disclaimer block |
| 1 | Operating Model | 6-layer color-coded cards from JSON |
| 2 | Leadership Team | Section 01, gold left border, 6 RoleCard |
| 3 | Event Operations | Section 02, amber left border, 6 RoleCard |
| 4 | Media Team | Section 03, blue left border, 6 RoleCard + TTN callout |
| 5 | Technology Team | Section 04, purple left border, 6 RoleCard |
| 6 | Advisory Board | Section 05, white border, 6 AdvisoryCard |
| — | Status Legend | green=Active, amber=Role Open, blue=Advisory Seat |
| — | CTA | 3 CTAs → /sports/partners, /sports/funding, /sports/proof |
| — | Footer disclaimer | Comprehensive legal + collectibles disclaimer |

---

## Design System Applied

- Background: `#071426` (page), `#050f1e` (alternating sections)
- Cards: `#0b1f36` with `border border-white/10`
- Gold accent: `#c99a3c` / `#f0cf82`
- Muted text: `#8a94a6`
- Corners: `rounded-none` — sharp corners throughout
- No emojis
- Font: Geist Sans (inherited from root layout)

---

## Build Result

```
✓ Compiled successfully in 2.1min
```

No TypeScript errors. No lint warnings.

---

## Legal Positioning

All sports pages include:
> TROPTIONS Sports Network is an independent sports media, event commerce, and fan technology company. It is not affiliated with, endorsed by, or a partner of FIFA, the FIFA World Cup, ESPN, Fox Sports, Telemundo, Octagon, CAA Sports, or any official tournament broadcaster or sanctioning body unless separately disclosed.

Team page hero also includes inline disclaimer:
> No official FIFA, ESPN, or Octagon affiliation is claimed unless separately contracted.

---

## Positioning References (per brief)

| Reference | What it informed |
|---|---|
| Octagon agency | Polish, org structure, sponsorship/talent/content framing |
| ESPN Soccer | Media team roles, content depth, analyst + producer structure |
| TROPTIONS Television Network | Media section sub-header, broadcast layer framing |
| Solana Launcher | Technology section, Solana Engineer role |
| UNYKORN / FTH | Infrastructure + Proof layer in operating model |

---

## CTA Links — Current Status

| Button | Target | Status |
|---|---|---|
| Partner With TROPTIONS | `/sports/partners` | Live |
| View Funding Memo | `/sports/funding` | **404 — page not created** |
| See Network Proof | `/sports/proof` | Live |

---

## Open Blockers

### 1. `/sports/funding` page — will 404
The team page CTA "View Funding Memo" links to `/sports/funding`. This route does not exist.

**Recommended content for that page:**
- Four pillars: Sports Agency / Broadcast Media / Event Commerce / Solana Infrastructure
- Next milestone: staff core team, productionize Solana launcher, run FIFA-scale pilot
- Funding structure: seed raise or strategic partner round
- Use of proceeds: staffing (leadership + event ops), technology (Solana, TTN), pilot event activation

**To create:** `src/app/sports/funding/page.tsx`

---

### 2. Stripe webhook not registered
Moments purchase flow (Stripe checkout) requires a webhook at:
```
https://troptions.com/api/worldcup/webhook
```
Event: `checkout.session.completed`

This must be registered at https://dashboard.stripe.com/webhooks.

---

### 3. `/api/moments/mint` route not created
The `/sports/mint` page gracefully degrades to demo mode. To activate real Solana minting, create:
```
src/app/api/moments/mint/route.ts
```
Connects to Solana Launcher infrastructure.

---

## Suggested Next Hires (Priority Order)

1. **Head of Sports Network** — owns all sports programming, matchday activation, and media output
2. **Head of Partnerships** — sponsor and merchant network sales
3. **Event Director** — FIFA-scale activation logistics
4. **Executive Producer** — TROPTIONS Television Network
5. **Solana Engineer** — Moments minting, token infrastructure
6. **UX/UI Designer** — fan experience, ticketing flow, operator dashboard

---

## Suggested Advisory Recruits

| Domain | What They Provide |
|---|---|
| Sports Agency (Octagon / CAA tier) | Talent relationships, activation playbooks, brand deal structure |
| Soccer Media (ESPN / Telemundo tier) | Content credibility, production standards, coverage strategy |
| Solana Ecosystem | Developer relations, launchpad relationships, token UX patterns |
| Sponsor Sales | Enterprise sponsor pitch, activation ROI metrics, renewal strategy |
| Event Safety / Compliance | Crowd management, venue liability, insurance structuring |
| Charity / Community | Impact reporting, nonprofit partnerships, CSR narrative |

---

## Git Log (relevant commits)

| Commit | Description |
|---|---|
| `edb380b` | Full TROPTIONS Sports Network — 14 pages, 7 components, 5 API routes, 3 data files |
| `d066480` | /sports/team rewrite — professional org page + team.json |

---

*End of audit. Run `npm run build` to re-verify at any time. All changes are data-driven — update `src/data/sports/team.json` to reflect hiring progress without touching the page component.*
