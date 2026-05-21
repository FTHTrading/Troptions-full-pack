# Troptions Next Actions
## Prioritized Action List

**Last updated:** See git commit timestamp.

---

## Critical (Block on These)

| # | Action | Owner | Blocker for |
|---|---|---|---|
| C1 | Obtain securities counsel opinion on Unity Token (TUT) | Legal | Any Unity Token public mention or token discussion |
| C2 | Board authorization for live capability activation | Board | Any live financial operation |
| C3 | Custody provider selection and agreement | Legal + Ops | Wallet funding, RWA onboarding |
| C4 | KYC/KYB provider integration | Engineering | Any participant onboarding with live verification |

---

## High Priority (Do Before Bryan Meeting)

| # | Action | Owner | Notes |
|---|---|---|---|
| H1 | Collect all 8 sub-brand logos (SVG/PNG) from Bryan | Bryan / Kevan | Drop in `public/assets/troptions/logos/` |
| H2 | Confirm domain ownership for all 8 sub-brand domains | Bryan | DNS decisions depend on this |
| H3 | Clarify HOTRCW service model | Bryan | Needed to build the public page |
| H4 | Deploy current build to Vercel to show live pages | Engineering | Auto-deploys on Vercel — just confirm |
| H5 | Test all 8 new pages live at troptions.unykorn.org | Kevan | Smoke test each URL |

---

## High Priority (Engineering)

| # | Action | Owner | Notes |
|---|---|---|---|
| E1 | Provision PostgreSQL on Vercel (add `DATABASE_URL`) | Kevan | Replaces ephemeral SQLite — required for production data persistence |
| E2 | Fix `jest.config.ts` — add `roots: ["<rootDir>/src"]` | Engineering | Prevents Jest from scanning `C:\Users\Kevan` causing BOM errors |
| E3 | Run full TypeScript check (0 errors confirmed) | Engineering | `tsc --noEmit` |
| E4 | Upload Mobile Medical photo to `public/assets/troptions/mobile-medical/` | Bryan / Kevan | Referenced in mobile-medical page |
| E5 | Build HOTRCW public page once service model confirmed | Engineering | After H3 above |

---

## Medium Priority

| # | Action | Owner | Notes |
|---|---|---|---|
| M1 | Connect sub-brand DNS to Vercel (start with Xchange) | Bryan / Kevan | After domain confirmation (H2) |
| M2 | Add Option B per-domain routing (middleware.ts) | Engineering | After M1 — if branded domains needed |
| M3 | Integrate KYC/KYB provider into participant onboarding | Engineering | After C4 |
| M4 | Build TV Network live programming schedule page | Engineering / Bryan | After confirming programming status |
| M5 | Add Green-N-Go solar project gallery page | Engineering / Bryan | After confirming active project inventory |
| M6 | Add Real Estate Connections property listing integration | Engineering | Requires property data source |

---

## Low Priority / Future Sprint

| # | Action | Owner | Notes |
|---|---|---|---|
| L1 | Build AI-powered ecosystem search (semantic search over all brands) | Engineering | `/api/troptions/ai/search` exists |
| L2 | Build Unity Token white paper page | Legal + Engineering | After C1 |
| L3 | Add loyalty/access tier system for University graduates | Engineering | After onboarding gate live |
| L4 | Build barter exchange dry-run simulator | Engineering | Educational — non-financial |
| L5 | ESG impact dashboard for Green-N-Go Solar | Engineering | After solar project data confirmed |
| L6 | Mobile Medical clinic deployment map | Engineering | After HIPAA + deployment data confirmed |

---

## Done (This Sprint)

| # | Action | Status |
|---|---|---|
| D1 | Audit existing Troptions codebase | ✅ Complete |
| D2 | Create `troptionsEcosystemRegistry.ts` with 8 sub-brands | ✅ Complete |
| D3 | Create asset folder structure with gitkeep files | ✅ Complete |
| D4 | Build all 8 public sub-brand pages | ✅ Complete |
| D5 | Write system architecture document | ✅ Complete |
| D6 | Build `troptionsLedgerAdapter.ts` (simulation-only) | ✅ Complete |
| D7 | Build `TroptionsDashboard` component | ✅ Complete |
| D8 | Build `/admin/troptions/ecosystem` admin panel | ✅ Complete |
| D9 | Write documentation packet (6 docs) | ✅ Complete |
