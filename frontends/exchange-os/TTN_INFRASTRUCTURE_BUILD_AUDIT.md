# TTN Infrastructure Build Audit

**Document:** Build Audit — TTN Broadcast OS Infrastructure Sprint  
**Project:** TROPTIONS Television Network  
**Date:** 2025-01  
**Sprint:** TTN Broadcast OS + Premium Sports Rewrite

---

## Summary

Full TTN broadcast OS infrastructure was scaffolded in this sprint:
routes created, data files created, API routes added, channel registry migrated,
and open-source stack architecture documented.

---

## Routes Created

| Route | File | Status |
|---|---|---|
| `/ttn/infrastructure` | `src/app/ttn/infrastructure/page.tsx` | ✅ Created |
| `/ttn/web3` | `src/app/ttn/web3/page.tsx` | ✅ Created |
| `/ttn/channels` | `src/app/ttn/channels/page.tsx` | ✅ Rewritten (was ChannelCard component) |
| `/ttn/launch-channel` | `src/app/ttn/launch-channel/page.tsx` | ✅ Created |
| `/api/ttn/channels` | `src/app/api/ttn/channels/route.ts` | ✅ Created |

---

## Data Created

| File | Contents | Status |
|---|---|---|
| `src/data/ttn/channels.json` | 8 TTN channels with full metadata | ✅ Created |

### Channel Registry — 8 channels
1. TTN Sports — Active
2. TTN Music — Coming Soon
3. TTN Creators — Coming Soon
4. TTN Charity — Active
5. TTN Local — Coming Soon
6. TTN Business — Coming Soon
7. TTN Events — Active
8. TTN Web3 — Coming Soon

---

## API Created

### GET `/api/ttn/channels`
- Reads `src/data/ttn/channels.json`
- Returns full channel array as JSON
- Server-side file read via Node.js `fs`
- No auth required (public data)

---

## Stack Recommendation

| Layer | Tool | Rationale |
|---|---|---|
| Live Streaming | Owncast (MIT) | Self-hosted, no platform dependency, OBS-compatible |
| Pro Broadcast | MistServer (LGPL) | Multi-bitrate, RTMP/SRT ingest, OTT outputs |
| Video CMS | MediaCMS (AGPLv3) | Full VOD library, transcoding, API access |
| Frontend | Next.js 15 | Server-rendered, SEO-ready, already deployed |
| Proof Layer | Solana | Optional on-chain proof for fans, sponsors, creators |
| Moments Engine | TROPTIONS Moments | QR drops, claim codes, fan badges, sponsor activations |

---

## Web3 Layer

Solana proof layer covers:
- Proof-of-view (fan watched event)
- Proof-of-attendance (fan scanned at venue)
- Digital moments (fan collectibles)
- Charity receipts (donation proof)
- Sponsor QR claims (sponsor proof)
- Creator supporter passes
- Channel membership passes

All Solana features are **optional**. Claim-by-phone-or-email is always available without wallet.

---

## Channel Page Migration

`/ttn/channels` was previously using:
- `TTN_CHANNELS` imported from `@/content/ttn/channelRegistry`
- `ChannelCard` component from `@/components/ttn/ChannelCard`
- Old data model (status: "live" | "scheduled" | "draft")

**Migration:**
- Now reads from `src/data/ttn/channels.json`
- Status model: `active` | `coming-soon`
- Inline JSX — no ChannelCard component dependency
- Full premium navy/gold design system applied
- Server component — no client JS

---

## Build Notes

### Potential Build Issues
1. **ChannelCard + channelRegistry** — these may still exist as files but are no longer imported by `/ttn/channels`. If they have TypeScript errors independently, they may still fail build.
2. **SportsHero, BroadcastCard, MatchdayCard, CharityImpactCard** — no longer imported by `/sports/atlanta/page.tsx`. If they had pre-existing TS errors, those are now isolated to their own files.
3. **Atlanta page** — was repaired. Duplicate `export default function AtlantaPage()` removed. File now 171 lines.

### Files to Monitor in Build
- `src/components/ttn/ChannelCard.tsx` — may have TS errors, no longer imported
- `src/content/ttn/channelRegistry.ts` — may have TS errors, no longer imported
- `src/components/sports/SportsHero.tsx`, `BroadcastCard.tsx`, `MatchdayCard.tsx`, `CharityImpactCard.tsx` — no longer used by Atlanta page

---

## Deployment Status

| Step | Status |
|---|---|
| Files created/updated | ✅ Complete |
| `npm run build` | ⏳ Pending verification |
| Git commit | ⏳ Pending |
| `npx vercel --prod --yes` | ⏳ Pending |

---

## Next Phase

1. **Infrastructure deployment** — Provision VPS, deploy MediaCMS + Owncast
2. **RTMP configuration** — OBS → Owncast RTMP ingest test
3. **VOD pipeline** — MediaCMS archive workflow from live stream
4. **Moments Engine** — Wire QR drops to Solana Launcher for live events
5. **Proof reports** — Build sponsor proof report generator
6. **Creator portal** — Channel application → provisioning workflow

---

*TROPTIONS Television Network — Broadcast OS Infrastructure*
