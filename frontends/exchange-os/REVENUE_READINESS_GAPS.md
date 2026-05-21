# REVENUE READINESS GAPS — TROPTIONS Client Platform
**Date:** 2026-05-04  
**Assessment basis:** Code audit only. No gap is inferred — each finding cites the specific file or absence thereof.

---

## Gap 1 — Portal Has No Authentication Gate (CRITICAL)

**Impact:** Any visitor who guesses or is given the URL `/portal/troptions/dashboard` can view the client dashboard, proof-of-funds status, wallet data, KYC status, XRPL account data, and all 60+ portal sub-pages with no login required.

**Evidence:**
- `middleware.ts` matcher: `["/troptions/gated/:path*"]` — does not cover `/portal/...`
- `src/app/portal/troptions/layout.tsx`: `return children` — no auth check

**Revenue Impact:** Any institution performing due diligence that discovers client data is publicly visible will walk. This is also a compliance/liability issue.

**Fix:** Add `/portal/:path*` to the middleware matcher. One-line change.

---

## Gap 2 — Four Homepage Links Return 404 (HIGH)

**Impact:** The homepage CTAs "Institutional Inquiry" and ecosystem verticals for Compliance, RWA Platform, and Settlement all 404. First impression for any institutional visitor clicking these links is a broken site.

**Missing pages:**
- `src/app/troptions/institutional/page.tsx` — linked twice on homepage
- `src/app/troptions/compliance/page.tsx`
- `src/app/troptions/rwa/page.tsx`
- `src/app/troptions/settlement/page.tsx`

**Fix:** Create a minimal but real index page for each. The `/troptions/institutional` case is most urgent as it is in the hero CTA.

---

## Gap 3 — No Email Notification on Inquiry Submission (MEDIUM)

**Impact:** Client inquiries are written to `data/revenue.db` but no notification is sent. If the SQLite file is on a cloud deployment (Vercel, Netlify), it will be ephemeral and data will be lost between deploys.

**Evidence:** `src/lib/troptions/revenue-db.ts` — SQLite write, no email call. No SMTP or transactional email package in `package.json`.

**Revenue Impact:** Every inquiry form submission is silently lost unless someone actively queries the DB.

**Fix options (in priority order):**
1. Add webhook/email on submission (Resend, SendGrid, or Postmark)
2. OR export inquiries to a durable store (Postgres, Notion, Airtable)
3. At minimum: log to a file that survives deploys + document the admin query command

---

## Gap 4 — CIS Package Is Not Gated (MEDIUM)

**Impact:** `/troptions/cis` redirects immediately to the CIS PDF without any authentication, inquiry form, or identity check. The PDF is publicly downloadable by anyone who visits `/troptions/cis` or discovers the static URL directly.

**Evidence:** `src/app/troptions/cis/page.tsx` — `redirect('/troptions/downloads/...')` with no auth check.

**Fix:** Either:
- Require login before serving the PDF (serve via API route with session check instead of static file), OR
- Add a gated form (name/email/company/consent) before the redirect, writing the record to the DB

---

## Gap 5 — No Revenue-Generating Flows Are Operational (HIGH)

**Impact:** The platform has UI for many revenue-adjacent features (trading, settlement, stablecoin rails, POF workflows) but none complete an actual transaction, payment, or billable event.

**Evidence:** All `/api/troptions/*/simulate` routes return mock data. No payment processor integration found in `package.json` (no Stripe, no MoonPay, no direct wire instruction system). No `ORDER_CONFIRMATION` or `PAYMENT_RECEIPT` table in any DB schema.

**Specific gaps:**
- Trading simulation: returns mock P&L, no live execution
- Settlement: route handler exists but no page.tsx; API calls return simulation data
- Stablecoin rails: simulation only — no live XRPL payment signing from the web app
- KYC: form exists but `POST /api/troptions/kyc/submit` writes to DB with status "pending" — no integration with Persona, Sumsub, or equivalent

---

## Gap 6 — No Project-Level Tests (MEDIUM)

**Impact:** Zero project test files exist (only `node_modules` tests from third-party packages). There is no test coverage for:
- Auth flows
- Inquiry form submission
- Route resolution (4 routes currently 404)
- Proof file existence
- XRPL hash format validation

**Evidence:** Search of workspace for `*.test.ts`, `*.spec.ts` returns only `node_modules/...` paths.

**Revenue Impact:** Any regression (e.g., an edit that breaks the contact form or breaks the CIS redirect) will go undetected until a real client hits it.

---

## Gap 7 — TypeScript Has 4 Compilation Errors (LOW-MEDIUM)

**Impact:** `pnpm exec tsc --noEmit` exits with code 1. The errors are in:
- `src/lib/troptions/mediaRightsSignatureEngine.ts`
- `src/lib/troptions/nilCreatorEngine.ts`
- `src/lib/troptions/sponsorCampaignEngine.ts`
- `src/lib/troptions/tnnContentEngine.ts`

All four: `Cannot find module 'uuid' or its corresponding type declarations`

**Cause:** `@types/uuid` is missing from devDependencies. The `uuid` package itself appears to be available (it is a transitive dep) but its types are not explicitly declared.

**Fix:** `pnpm add -D @types/uuid`

---

## Gap 8 — No System Status / Health Page for Clients (LOW)

**Impact:** There is no public-facing page that tells a client or institutional visitor which modules are live vs. in development. This forces them to navigate the full site to discover what works.

**Fix:** Create `/troptions/system-status` page showing module status matrix.

---

## Summary Table

| Gap | Severity | Blocks Revenue? | Fix Complexity |
|---|---|---|---|
| Portal unauthenticated | CRITICAL | Yes (compliance/trust) | Low — 1-line middleware change |
| 4 homepage links 404 | HIGH | Yes (first impression) | Low — 4 minimal pages |
| No inquiry email | MEDIUM | Yes (leads lost) | Medium — email service integration |
| CIS not gated | MEDIUM | No, but liability | Low — add auth check |
| No payment flows live | HIGH | Yes (direct) | High — payment processor integration |
| No project tests | MEDIUM | Indirectly | Medium — test suite setup |
| TypeScript errors | LOW | No | Trivial — install @types/uuid |
| No status page | LOW | No | Low — static page |
