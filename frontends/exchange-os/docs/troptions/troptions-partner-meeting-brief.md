# Troptions Partner Meeting Brief
## Bryan Meeting — Preparation Notes

**Purpose:** Prepare for in-person partner review with Bryan — the co-founder / brand owner of Troptions.  
**Goal:** Validate the integration layer, confirm asset availability, identify any corrections needed, and align on next steps.

---

## What to Demo (Safe to Show)

| Item | URL | Notes |
|---|---|---|
| Institutional landing | `/troptions` | Proof-ready, full disclaimer |
| Ecosystem map | `/troptions/ecosystem` | All 8 sub-brands listed |
| Troptions history | `/troptions/history` | Gary Dupuis narrative |
| Legal standing | `/troptions/legal` | Securities + tax treatment |
| RWA overview | `/troptions/rwa` | Asset-backed value explainer |
| Stablecoins | `/troptions/stablecoins` | USDF + stable unit architecture |
| Chain coverage | `/troptions/chains` | XRPL, Stellar, EVM, Solana |
| Custody overview | `/troptions/custody` | Custody model |
| Funding routes | `/troptions/funding` | Institutional capital formation |
| **NEW:** Troptions Xchange | `/troptions/xchange` | Full sub-brand page |
| **NEW:** Unity Token | `/troptions/unity-token` | With securities warning |
| **NEW:** University | `/troptions/university` | Curriculum overview |
| **NEW:** TV Network | `/troptions/media` | Content categories |
| **NEW:** Real Estate | `/troptions/real-estate` | RWA types |
| **NEW:** Solar | `/troptions/solar` | ESG assets |
| **NEW:** Mobile Medical | `/troptions/mobile-medical` | HIPAA callout |
| **NEW:** Ledger Overview | `/troptions/ledger` | Simulation — all gates shown |
| **NEW:** Admin Dashboard | `/admin/troptions/ecosystem` | Internal — show only if Bryan has admin access |

---

## What to Keep Internal

| Item | Reason |
|---|---|
| Admin command center | Full risk/claim matrix visible |
| Wallet control tower | Private wallet registry |
| All settlement engine internals | Not ready for external review |
| XRPL platform admin pages | Internal ops only |
| AI Ops panel | Internal development tools |
| `troptionsLedgerAdapter.ts` | Technical — share summary only |
| Live execution capabilities | Zero currently — only show simulation |

---

## Questions for Bryan

### Domain & Asset Ownership
1. Do you own / control all 8 domains listed? (troptionsxchange.com, unitytoken.io, troptionsuniversity.com, troptionstelevision.com, realestateconnections.io, greenngo.solar, hotrcw.com, troptionsmobilemedical.com)
2. Who is the DNS registrar? Can you grant DNS management access or will you make the changes yourself?
3. Do you have vector (SVG) or high-res PNG logos for all 8 sub-brands?
4. Do you have the Mobile Medical Units photo already (`.png` referenced in the system)?
5. Any additional logo variants (horizontal, stacked, dark/light versions)?

### Legal & Compliance
6. Has Unity Token (TUT) been reviewed by securities counsel? Is there a legal opinion letter we can reference?
7. What is the current operational status of Troptions Xchange — is it actively processing trades, or is it in development?
8. Is there any active regulatory communication (SEC, CFTC, state securities) we should know about?
9. Are there KYC/KYB provider agreements already in place? (Jumio, Persona, Onfido, etc.)

### Brand & Content
10. Is the Troptions University content live and published, or is it being developed?
11. Does HOTRCW have a defined service model for the portal? (It is registered but has no public page — flagged as `needs-review`)
12. Is Green-N-Go Solar actively deploying solar panels, or is it an asset/investment vehicle?
13. Does the TV Network have live programming, or is it in planning stage?

### Technology & Integration
14. Are there existing CRM records for institutional participants we need to import?
15. Is there a preferred custody partner already selected, or is that TBD?
16. Any specific chain preferences for Unity Token issuance (XRPL, Stellar, Polygon, Solana)?
17. Do you want sub-brand domains to redirect to troptions.unykorn.org, or have their own full sites?

---

## What Bryan Needs to Bring / Deliver

| Item | Status | Notes |
|---|---|---|
| SVG/PNG logos — all 8 sub-brands | ❌ needed | Place in `public/assets/troptions/logos/` |
| Mobile Medical photo | ❌ needed | Place in `public/assets/troptions/mobile-medical/` |
| DNS access or DNS changes | ❌ needed | For all 8 domains |
| Securities counsel opinion (TUT) | ❌ needed | Before any token discussion goes public |
| KYC/KYB provider name | ❌ needed | For compliance gate integration |
| Existing participant data format | ❌ needed | For CRM import if applicable |
| HOTRCW service model brief | ❌ needed | To build the public page |

---

## Post-Meeting Action Items (Draft)

1. Upload all logos → commit + push → Vercel redeploy
2. Confirm domain DNS strategy → Option A (redirects) or Option B (per-domain routing)
3. Connect DNS for priority domains (Xchange + Unity Token first)
4. Add securities counsel opinion reference to Unity Token page
5. Add KYC/KYB provider integration to onboarding gate
6. Build HOTRCW page once service model confirmed
7. Provision PostgreSQL on Vercel (`DATABASE_URL`)
8. Schedule board authorization call for live capability activation

---

## Tone for the Meeting

- Show the system as professional, institutional-grade, and defensively compliant.
- Emphasize that ALL live execution is gated — this is a strength, not a weakness.
- Do NOT present Unity Token as "ready to sell" — present it as infrastructure awaiting legal clearance.
- Position the 8 new sub-brand pages as: *"We've already built the home for every brand — you just need to confirm the assets and the domains."*
