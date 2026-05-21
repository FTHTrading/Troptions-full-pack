# Solana Campaign Launcher — Implementation Report
Generated: 2026-05-15

## Repo
`C:\Users\Kevan\troptions`  
Deploy target: Cloudflare (troptions.unykorn.org + custom domains)

## Files created

### i18n — 10 languages
| File | Language |
|------|----------|
| `src/i18n/locales/en.ts` | English (base) |
| `src/i18n/locales/es.ts` | Spanish |
| `src/i18n/locales/pt.ts` | Portuguese |
| `src/i18n/locales/fr.ts` | French |
| `src/i18n/locales/de.ts` | German |
| `src/i18n/locales/ar.ts` | Arabic (RTL) |
| `src/i18n/locales/zh.ts` | Mandarin Chinese |
| `src/i18n/locales/ja.ts` | Japanese |
| `src/i18n/locales/ko.ts` | Korean |
| `src/i18n/locales/it.ts` | Italian |
| `src/i18n/config.ts` | Locale registry, RTL list, type definitions |
| `src/i18n/useI18n.ts` | React hook — detect, persist, switch locale |

### UI components
| File | Purpose |
|------|---------|
| `src/components/i18n/LanguageSelector.tsx` | Language dropdown, persists to localStorage, RTL-aware |
| `src/components/ai/AIAssistant.tsx` | Collapsible AI guide — stub mode + provider-ready |

### Solana service layer
| File | Purpose |
|------|---------|
| `src/lib/solana/campaignTypes.ts` | CampaignAssetType, sanitizeNamespace, labels |
| `src/lib/solana/campaignMetadata.ts` | Metaplex-compatible NFT metadata builder |
| `src/lib/solana/network.ts` | Devnet/mainnet toggle, truth labels, RPC config |
| `src/lib/solana/mintCampaignAsset.ts` | prepareCampaignMint, requestMintTransaction (stub) |
| `src/lib/solana/qr.ts` | QR URL builder + generateQrDataUrl via qrcode package |

### API routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/solana/campaign/prepare` | POST | Build campaign metadata + stub mint prep |
| `/api/solana/campaign/metadata` | GET | Return on-chain-compatible metadata JSON |
| `/api/solana/campaign/mint` | POST | Stub — returns safety rules, pending Metaplex |
| `/api/solana/campaign/qr` | GET | Generate QR PNG data URL for namespace |
| `/api/ai/chat` | POST | AI chat — stub or live via AI_GATEWAY_URL |
| `/api/ai/campaign-builder` | GET | Rule-based campaign suggestions by type |

### Pages
| Route | File | Description |
|-------|------|-------------|
| `/sports/solana-launcher` | `src/app/sports/solana-launcher/page.tsx` | 5-step wizard: type → details → preview → wallet → mint |

## Files modified
| File | Change |
|------|--------|
| `src/app/sports/merchant/page.tsx` | Added LanguageSelector, AIAssistant (merchant mode), Solana Launcher CTA |
| `src/app/sports/tribute/page.tsx` | Added LanguageSelector, AIAssistant (fan mode), Solana Launcher CTA |
| `src/app/sports/qr-campaign/page.tsx` | Added LanguageSelector, AIAssistant (merchant mode), Solana Launcher CTA |
| `.env.example` | Added SOLANA and AI env vars (names only, no values) |

## Campaign types available in wizard
1. Merchant Namespace
2. QR Campaign
3. Loyalty Reward
4. NFT Coupon
5. VIP Pass
6. Fan Tribute
7. Sponsor Offer
8. Local Giveaway
9. Event Promo

## Devnet / mainnet status
- **Devnet**: ready (default)
- **Mainnet**: disabled — requires `NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true`
- Truth labels shown on every launcher page

## Minting safety rules
1. No private keys on server
2. No seed phrase handling
3. Non-custodial: client wallet adapter signs only
4. Devnet only until env opt-in
5. All metadata includes `not_investment=true` and `not_prediction_market=true` attributes
6. Safety disclaimer on every public page

## AI assistant status
- **Mode**: `stub` (guide-mode responses, no live AI required)
- **Provider-ready**: set `AI_ASSISTANT_ENABLED=true` + one of:
  - `AI_PROVIDER=openai` + `OPENAI_API_KEY`
  - `AI_PROVIDER=ollama` + `OLLAMA_BASE_URL`
  - `AI_PROVIDER=unykorn-team-api` + `UNYKORN_TEAM_API_URL`
- Truth label `AI RUNTIME — STUBBED` shown when not connected

## Verification results
| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** |
| `eslint` (new files) | **PASS — 0 errors** |
| `npm run build` | **PASS** |
| `npm run cf:deploy` | **DEPLOYED** → troptions.unykorn.org |

## Remaining blockers for full mint flow
1. **Wallet adapter** — add `@solana/wallet-adapter-react` + `@solana/wallet-adapter-phantom` for live wallet connection
2. **Metaplex** — add `@metaplex-foundation/mpl-token-metadata` or Umi for on-chain NFT creation
3. **Metadata upload** — wire Arweave / NFT.storage / IPFS for permanent metadata URI
4. **Merchant database** — campaigns currently stateless; need Postgres / SQLite record per campaign
5. **QR redemption route** — `/c/[namespace]` route needs to be created

## Deploy instructions
```powershell
cd "C:\Users\Kevan\troptions"
npm run cf:deploy
```
Already deployed in this session (Version ID: 3fb2b6fd).

---

## Production Layer — Phase 2

Generated: 2026-05-15

### Files created

| File | Purpose |
|------|---------|
| `src/lib/campaigns/store.ts` | Campaign persistence — SQLite primary, JSON fallback, in-memory last resort |
| `src/components/solana/CampaignStatusLabel.tsx` | Mint-status pill: DEVNET · STUB / DEVNET · PENDING / DEVNET · MINTED / MAINNET · MINTED |
| `src/app/api/solana/campaign/save/route.ts` | POST — save campaign, validate namespace uniqueness, return record |
| `src/app/api/solana/campaign/[namespace]/route.ts` | GET — look up campaign by namespace slug, 404 if missing |
| `src/app/c/[namespace]/page.tsx` | QR scan landing page — public-facing campaign redemption page |
| `src/app/admin/campaigns/solana/page.tsx` | Admin campaign list — server component, reads store directly |

### Files modified

| File | Change |
|------|--------|
| `src/app/sports/solana-launcher/page.tsx` | Step 2 → calls `/api/solana/campaign/save`; shows saved confirmation + `/c/{namespace}` link; namespace-conflict error handled |
| `.env.example` | Added `CAMPAIGN_DB_PATH` |

### Routes added

| Route | Method | Purpose |
|-------|--------|---------|
| `/c/[namespace]` | GET (page) | QR scan landing page — customer-facing |
| `/api/solana/campaign/save` | POST | Persist campaign, validate namespace uniqueness |
| `/api/solana/campaign/[namespace]` | GET | Fetch campaign by namespace slug |
| `/admin/campaigns/solana` | GET (page) | Admin list — all campaigns, table view |

### Storage status

| Backend | Status | Notes |
|---------|--------|-------|
| SQLite (`data/campaigns.db`) | **Primary** — used in local dev and Node.js environments | Auto-created on first save |
| JSON (`data/campaigns.json`) | **Fallback** — used if SQLite module unavailable | Auto-created on first save |
| In-memory (`Map`) | **Last resort** — used in CF Workers runtime (no filesystem) | Not persistent across requests |

> **Note:** Cloudflare Workers has no filesystem, so the in-memory backend is active in production. For persistent production storage, wire a Cloudflare D1 or external Postgres adapter.

### QR redemption status

- **Working** — `/c/[namespace]` page is live
- Shows: campaign name, business, offer, city/event, image/placeholder, type badge, status label, share link, quantity, expiry, safety disclaimer
- OG metadata exported for social sharing
- 404 state with graceful "Campaign not found" UI
- SAFETY_DISCLAIMER from `src/data/merchant-campaigns.ts` included on every landing page

### Mint status

- **Devnet stub** — `mintStatus: 'stub'` on all new campaigns
- CampaignStatusLabel renders `DEVNET · STUB` by default
- Full Metaplex integration remains a blocker (same as Phase 1)

### Safety rules enforced

- All records: `not_investment: true`, `not_prediction_market: true`
- `NEXT_PUBLIC_SOLANA_MAINNET_ENABLED` guard respected in save API
- No private keys, no seed phrases, no custodial wallet code
- SAFETY_DISCLAIMER on every public landing page

### Remaining blockers

1. **Persistent production storage** — wire Cloudflare D1 or external DB for CF Workers environment
2. **Wallet adapter** — `@solana/wallet-adapter-react` for live devnet minting
3. **Metaplex** — `@metaplex-foundation/mpl-token-metadata` or Umi for on-chain NFT creation
4. **Admin auth** — add middleware/token auth to `/admin/campaigns/solana` before production

### Deploy command

```powershell
cd "C:\Users\Kevan\troptions" && npm run cf:deploy
```
