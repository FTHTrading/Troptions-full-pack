# FIX PLAN — CLIENT-FACING PLATFORM
**Date:** 2026-05-04  
**Source:** CLIENT_FUNCTIONALITY_AUDIT.md + REVENUE_READINESS_GAPS.md  
**Priority:** P0 = blocks trust/compliance, P1 = breaks navigation, P2 = revenue gaps, P3 = quality

---

## P0 — Portal Authentication Gate

**File to change:** `middleware.ts`  
**Change:** Add `/portal/:path*` to the matcher array.

```ts
export const config = {
  matcher: [
    "/troptions/gated/:path*",
    "/portal/:path*",          // ADD THIS
  ],
};
```

**Login redirect target:** `LOGIN_PATH = "/troptions/auth/login"` is already set. The portal visitor will be redirected to login, then back to their intended page via the `redirect` query param (already implemented in the middleware redirect logic).

**Status after fix:** `DONE` — see commit

---

## P1 — Four Missing Pages

### 1. `/troptions/institutional` (homepage CTA — highest priority)

The 14 sub-pages exist. Create an index page that functions as an overview and links to each sub-section.

**File to create:** `src/app/troptions/institutional/page.tsx`  
**Behavior:** Render a table of available institutional services with links to each sub-page.

### 2. `/troptions/compliance`

Sub-pages exist at deeper paths (portal has `/portal/troptions/anti-illicit-finance`, etc.). Create a public-facing compliance overview.

**File to create:** `src/app/troptions/compliance/page.tsx`

### 3. `/troptions/rwa`

Portal has `/portal/troptions/rwa`. Create a public-facing RWA platform overview.

**File to create:** `src/app/troptions/rwa/page.tsx`

### 4. `/troptions/settlement`

API routes exist at `/api/troptions/settlement/*`. Create a public-facing settlement overview.

**File to create:** `src/app/troptions/settlement/page.tsx`

**Status after fix:** All four routes resolve with real content — see commit

---

## P1 — System Status Page

**File to create:** `src/app/troptions/system-status/page.tsx`  
**Behavior:** Static page listing every platform module with status: `Live`, `Demo/Simulation`, `In Development`, or `Documentation Only`.  
**Why P1:** Without this, clients and partners cannot self-assess which features are operational. It also demonstrates transparency and builds trust.

**Status after fix:** `DONE` — see commit

---

## P2 — TypeScript Errors (4 files, same root cause)

**Root cause:** `@types/uuid` not in devDependencies.  
**Command:** `pnpm add -D @types/uuid`  
**Files affected:**
- `src/lib/troptions/mediaRightsSignatureEngine.ts`
- `src/lib/troptions/nilCreatorEngine.ts`
- `src/lib/troptions/sponsorCampaignEngine.ts`
- `src/lib/troptions/tnnContentEngine.ts`

**Status after fix:** `tsc --noEmit` exits 0 — see build output

---

## P2 — Route Smoke Tests

**File to create:** `src/tests/routes.test.ts`  
**Covers:**
1. All 4 previously-404 routes now have `page.tsx`
2. Proof files exist on disk
3. XRPL TX hash format is valid 64-char hex
4. CIS redirect target exists
5. Inquiry API validates required fields (unit test with mock DB)
6. Auth middleware protects `/portal` routes (middleware config check)

---

## P3 — CIS PDF Gating (recommended, not implemented in this plan)

The CIS PDF is currently publicly accessible. Recommended next step (outside scope of this fix plan):
1. Move PDF serving to an API route: `GET /api/troptions/cis/download`
2. Check session in the route handler
3. Log every download attempt with requester identity

---

## P3 — Inquiry Email Notification (recommended, not implemented in this plan)

After inquiry lands in SQLite:
1. Add Resend (or Postmark) to `package.json`
2. Call `sendEmail({ to: process.env.INQUIRY_NOTIFY_EMAIL, ... })` in the POST handler
3. Add `INQUIRY_NOTIFY_EMAIL` and `RESEND_API_KEY` to `.env`

---

## Implementation Checklist (this session)

- [x] Write CLIENT_FUNCTIONALITY_AUDIT.md
- [x] Write ROUTE_STATUS_MATRIX.md
- [x] Write REVENUE_READINESS_GAPS.md
- [x] Write FIX_PLAN_CLIENT_FACING_PLATFORM.md
- [x] Fix portal auth gate (middleware.ts)
- [x] Create `/troptions/institutional/page.tsx`
- [x] Create `/troptions/compliance/page.tsx`
- [x] Create `/troptions/rwa/page.tsx`
- [x] Create `/troptions/settlement/page.tsx`
- [x] Create `/troptions/system-status/page.tsx`
- [x] Fix `@types/uuid` TypeScript errors
- [x] Create `src/tests/routes.test.ts`
- [ ] Configure inquiry email notification (P3 — next session)
- [ ] Gate CIS PDF behind auth/form (P3 — next session)
- [ ] Payment processor integration (P2/future sprint)
