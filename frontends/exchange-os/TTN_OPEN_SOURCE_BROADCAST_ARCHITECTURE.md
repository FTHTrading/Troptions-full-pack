# TTN Open-Source Broadcast Architecture

**Document:** Technical Architecture + Stack Rationale  
**Project:** TROPTIONS Television Network  
**Date:** 2025-01  
**Status:** Design + MVP Execution

---

## 1. Current TTN State

TROPTIONS Television Network currently exists as frontend channel pages (Next.js) with placeholder content. No live streaming infrastructure, video CMS, or broadcast backend is deployed. The current state is frontend-only with route scaffolding.

### Existing Routes
- `/ttn/channels` — channel grid (rewritten to use channels.json)
- `/ttn/infrastructure` — **new: broadcast OS architecture page**
- `/ttn/web3` — **new: Solana proof layer documentation**
- `/ttn/launch-channel` — **new: creator/brand channel application**

---

## 2. Target Architecture

TTN is designed as a **fully owned broadcast operating system** — not a YouTube channel, not a streaming platform dependency. The model is:

> Own the infrastructure. Own the audience. Own the data. Layer Web3 proof on top.

### Architecture Diagram (Conceptual)

```
                    [TROPTIONS TV Frontend — Next.js]
                            |
             ┌──────────────┼──────────────┐
             │              │              │
        [Live Stream]   [VOD / CMS]   [Moments Engine]
        Owncast +       MediaCMS      QR drops, claim
        MistServer      (AGPLv3)      codes, fan badges
             │              │              │
             └──────────────┼──────────────┘
                            │
                    [Solana Proof Layer]
                    Proof-of-view, attendance,
                    sponsor receipts, charity records
                            │
                    [Sponsor OS]
                    QR drops, branded segments,
                    proof reports, merchant listings
```

---

## 3. Stack Rationale

### MediaCMS (AGPLv3)
- **Why:** Self-hosted video CMS. Upload, transcode, organize VOD. No YouTube/Vimeo dependency.
- **Capability:** Multi-bitrate transcoding, media library, API access, embed support.
- **Deployment:** Docker. Single VPS or cloud VM. 4GB+ RAM recommended.

### Owncast (MIT)
- **Why:** Self-hosted live streaming with real-time chat. No Twitch/YouTube live dependency.
- **Capability:** RTMP ingest (OBS compatible), HLS delivery, chat, viewer counts.
- **Deployment:** Single binary or Docker. Lightweight. Works on $20/month VPS.

### MistServer (LGPL)
- **Why:** Professional broadcast-grade server. Multi-bitrate adaptive streaming, OTT outputs, RTMP/SRT ingest.
- **Use case:** High-production events (sports, concerts, conferences) where Owncast's simplicity isn't enough.
- **Deployment:** Binary. Ubuntu/Debian. Separate instance from Owncast.

### Next.js 15
- **Why:** Server-rendered, fast, SEO-ready. All channel pages, city guides, sponsor flows, and fan UX.
- **Current state:** Already deployed on Vercel. All TTN routes live.

### Solana
- **Why:** Proof layer — not speculation. Proof-of-view, proof-of-attendance, sponsor receipts, charity records.
- **Integration:** Solana Launcher (existing TROPTIONS infrastructure). Moments Engine QR → Solana record.
- **Fan requirement:** None. Wallet optional. Claim by phone/email always available.

### Livepeer (Optional)
- **Why:** Decentralized video transcoding. Reduces infrastructure cost for high-volume live events.
- **Status:** Optional add-on. TTN runs without it.

---

## 4. Channel Architecture

8 sovereign channel verticals, each with:
- Independent content strategy
- Own revenue model (sponsor, creator, event, charity)
- Separate Web3 utility layer
- Solana proof integration

| Channel | Status | Revenue Model | Web3 |
|---|---|---|---|
| TTN Sports | Active | Sponsor activations, QR drops | Proof-of-view, moment drops |
| TTN Music | Coming Soon | Creator monetization, sponsors | Artist passes, collectibles |
| TTN Creators | Coming Soon | Revenue share, memberships | Supporter passes, gated content |
| TTN Charity | Active | Sponsor-funded campaigns | On-chain donation receipts |
| TTN Local | Coming Soon | Local merchant advertising | Neighborhood badge drops |
| TTN Business | Coming Soon | B2B sponsorships | Sponsor proof reports |
| TTN Events | Active | Event sponsor packages | Proof-of-attendance, moment drops |
| TTN Web3 | Coming Soon | Protocol sponsorships, gated content | On-chain passes, analytics |

---

## 5. MVP Deployment Plan

### Phase 1 — Infrastructure (Priority)
1. Deploy MediaCMS on VPS (Hetzner CX31 or similar, 4GB RAM, Ubuntu 22.04)
2. Deploy Owncast on same or adjacent VPS
3. Configure RTMP ingest for OBS/external encoder
4. Connect MediaCMS VOD to TTN frontend via API
5. Test full live stream → archive → VOD workflow

### Phase 2 — Channel Activation
1. TTN Sports channel — full live integration for World Cup matchday events
2. Moments Engine QR drops wired to Solana Launcher
3. Sponsor QR drop activation system
4. Proof report generation (scan count, redemption, on-chain anchoring)

### Phase 3 — Creator Portal
1. Creator channel applications via `/ttn/launch-channel`
2. Creator revenue share backend
3. Supporter pass issuance (Solana)
4. MediaCMS API integration for creator upload

### Phase 4 — Scale
1. MistServer for high-production events
2. Livepeer integration for cost reduction at scale
3. Multi-city TTN deployment (beyond Atlanta)
4. TTN Web3 + TTN Business channel launch

---

## 6. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| MediaCMS transcoding CPU cost | Medium | Use cloud VPS with adequate CPU, or offload to Livepeer |
| Owncast viewer concurrency limits | Medium | Upgrade VPS or add CDN in front of HLS |
| Solana network downtime | Low | Proof layer is optional — fan experience continues without it |
| Creator monetization disputes | Medium | Clear terms of service, revenue share contract template |
| Live streaming rights for sports events | High | TTN covers city around game — not official match feed. Scope defined. |

---

## 7. Open-Source License Summary

| Tool | License | Notes |
|---|---|---|
| MediaCMS | AGPLv3 | Source must be available if modified |
| Owncast | MIT | Permissive, can modify freely |
| MistServer | LGPL | Commercial use permitted |
| Next.js | MIT | Permissive |
| Solana CLI tools | Apache 2.0 | Permissive |

---

## 8. Data Flows

```
Fan scans QR at venue
    → Claim code validated (Next.js API)
    → Fan enters phone/email
    → Moment record created (DB)
    → Optional: Solana mint triggered
    → Sponsor receives scan proof
    → Proof report updated
```

```
Creator goes live
    → OBS pushes RTMP to Owncast/MistServer
    → HLS stream served to fans
    → Viewer proof-of-view logged
    → VOD archived to MediaCMS after stream
    → Supporter passes available to claim
```

---

*TROPTIONS Television Network — Owned Broadcast OS*  
*Not affiliated with any official sports broadcaster, league, or rights holder.*
