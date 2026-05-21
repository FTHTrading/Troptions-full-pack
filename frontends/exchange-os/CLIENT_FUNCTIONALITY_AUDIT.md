# CLIENT FUNCTIONALITY AUDIT — TROPTIONS Main Site
**Date:** 2026-05-04  
**Scope:** `/troptions` homepage and all linked client-facing routes  
**Method:** Static code analysis, directory inspection, API route sampling, middleware review, package.json dependency check

---

## Methodology

Each route was evaluated against three criteria:
1. Does the file exist (no 404)?
2. Does it render real content or a real-backend form (not a stub)?
3. Does any interaction (form, download, API call) actually persist data or produce a verifiable output?

**Status codes used below:**
- `LIVE` — file exists, backend wired, data persists or verifiable output produced
- `UI-ONLY` — page renders but no backend writes; interactive elements are display-only
- `REDIRECT-WORKS` — page redirects to a file/URL that physically exists
- `404` — no `page.tsx` exists for this route; Next.js will 404
- `STUB` — page exists but content is placeholder or simulation-only
- `UNAUTHENTICATED` — page exists but access control is absent

---

## 1. Homepage — `/troptions`

**Status:** `LIVE` (presentation layer)  
**File:** `src/app/troptions/page.tsx`  
**What works:** Renders completely, zero TypeScript errors, clean Berkshire-style layout.  
**What does NOT work from this page alone:**
- Every link is navigational; no data is loaded from a backend on this page itself.
- The "Client Portal" CTA links to `/portal/troptions/dashboard` which is **unauthenticated** (see §3).

---

## 2. Contact / Inquiry Form — `/troptions/contact`

**Status:** `LIVE`  
**File:** `src/app/troptions/contact/page.tsx`  
**Backend:** `POST /api/troptions/inquiries` → `src/lib/troptions/revenue-db.ts` → SQLite `data/revenue.db`  
**Confirmed real:** `better-sqlite3@12.9.0` installed; `CREATE TABLE inquiries` executed on first connect; input validated (email regex, required fields, consent checkbox); lead score calculated and written.  
**Admin read:** `GET /api/troptions/inquiries` exists and requires auth via `getCurrentUser()`.  
**Gap:** No email notification on submission. Inquiries go to DB only. No CRM export configured.

---

## 3. Client Portal — `/portal/troptions/dashboard`

**Status:** `UNAUTHENTICATED`  
**File:** `src/app/portal/troptions/dashboard/page.tsx`  
**Finding:** The portal layout at `src/app/portal/troptions/layout.tsx` is a pass-through (`return children`). The Next.js middleware (`middleware.ts`) protects only `/troptions/gated/:path*` — NOT `/portal/...`. Any visitor can open the dashboard without logging in.  
**Auth system exists:** `POST /api/auth/login` is real (SQLite-backed sessions, bcrypt password hashing). It just is not enforced on the portal route.  
**Fix required:** Add `/portal/:path*` to middleware matcher OR add server-side session check inside the portal layout.

---

## 4. Institutional Inquiry — `/troptions/institutional`

**Status:** `404` (index missing, sub-pages exist)  
**Finding:** The directory `src/app/troptions/institutional/` contains 14 sub-page directories (audit-room, claims, diligence-room, etc.) each with a `page.tsx`. The root `/troptions/institutional/page.tsx` does not exist. Clicking the "Institutional Inquiry" link on the homepage produces a 404.  
**Fix required:** Create `src/app/troptions/institutional/page.tsx` (an index/overview page or redirect to `/troptions/institutional/overview`).

---

## 5. CIS Package — `/troptions/cis`

**Status:** `REDIRECT-WORKS`  
**File:** `src/app/troptions/cis/page.tsx`  
**Behavior:** Immediately calls `redirect('/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf')`.  
**File exists:** `public/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf` — confirmed on disk.  
**Note:** No authentication gate. The CIS PDF is publicly downloadable by anyone with the URL.

---

## 6. Proof of Funds HTML — `/proofs/bryan-stone-usdc-175m.html`

**Status:** `LIVE` (static file)  
**File:** `public/proofs/bryan-stone-usdc-175m.html` — 29,337 bytes, confirmed on disk.  
**Additional:** `public/proofs/troptions-pof-usdc-175m-desk.html` (18,831 bytes), `public/proofs/troptions-pof-usdc-175m-desk.pdf` (466,845 bytes) also exist.

---

## 7. XRPL Transaction Links (in XRPL Issuances table)

**Status:** Likely valid — cannot confirm without live network access  
**Hashes present in page.tsx:**
```
USDC: CD7271274743C20635ED58515F84B399A4113FE40E62CFC8248446A494D1E642  (64 chars ✓)
USDT: 42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F  (64 chars ✓)
DAI:  C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641  (64 chars ✓)
EURC: FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1  (64 chars ✓)
```
All link to `xrpscan.com/tx/<hash>` — valid explorer format, correct length.  
The same hashes appear in `src/app/troptions/verification/page.tsx` with full proof records including trustSetTx and issueTx per stablecoin.  
**Automation:** `pnpm run pof:xrpl:usdc:100m` script exists to re-verify on-chain.

---

## 8. Stablecoin, Wallet, POF, Compliance Pages

| Route | Has page.tsx | Content Quality |
|---|---|---|
| `/troptions/stablecoins` | ✓ | Real issuance records with TX hashes |
| `/troptions/verification` | ✓ | Full proof-chain documentation |
| `/troptions/wallets` | ✓ | Wallet infrastructure page |
| `/troptions/wallet-hub` | ✓ | Page exists |
| `/troptions/wallet-forensics` | ✓ | Page exists |
| `/troptions/compliance` | **MISSING** | 404 |
| `/troptions/settlement` | **MISSING** | 404 |
| `/troptions/rwa` | **MISSING** | 404 |
| `/troptions/pof` | ✓ | POF downloads page |

---

## 9. Authentication System

**Status:** Real, but underdeployed  
- Auth DB: SQLite via `better-sqlite3`, path `data/auth.db`
- Login: `POST /api/auth/login` → bcrypt verify → session cookie
- Logout: `POST /api/auth/logout`
- Register: `POST /api/auth/register`
- Session validation: `src/lib/auth/current-user.ts` → reads cookie → queries DB
- **Gap:** Middleware matcher covers only `/troptions/gated/:path*`. Portal and admin pages are unprotected.

---

## 10. Summary Verdicts

| Check | Result |
|---|---|
| Every link resolves | **FAIL** — 4 links 404 (institutional, compliance, rwa, settlement) |
| Portal has auth | **FAIL** — portal is publicly accessible |
| Institutional form collects data | **FAIL** — no root page exists to reach the form |
| CIS downloads real file | **PASS** — PDF exists on disk |
| POF proof HTML exists | **PASS** — HTML and PDF both exist |
| XRPL hashes are valid format | **PASS** — 64-char hex, correct explorer URL format |
| Stablecoin/POF pages not empty | **PASS** — verification page has full proof records |
| Project-level tests exist | **FAIL** — zero project test files found |
| TypeScript clean | **FAIL** — 4 `uuid` module errors in lib files |
