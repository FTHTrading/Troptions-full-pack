# Live Route Checklist

**Verification Date:** 2026-05-04  
**Environment:** Local production build — `http://localhost:3002`  
**Build:** `pnpm run build` exit 0, 809/809 pages  

---

## Public Routes (Task 4)

| Route | Expected | Actual | Status |
|---|---|---|---|
| `/troptions` | 200 | 200 | ✅ PASS |
| `/troptions/cis` | 200 | 200 | ✅ PASS |
| `/troptions/request-access` | 200 | 200 | ✅ PASS |
| `/troptions/proof-room` | 200 | 200 | ✅ PASS |
| `/troptions/contact` | 200 | 200 | ✅ PASS |
| `/troptions/book` | 200 | 200 | ✅ PASS |

All 6/6 public routes return HTTP 200.

---

## Protected Routes — Unauthenticated (Task 5)

| Route | Expected | Actual | Status |
|---|---|---|---|
| `/portal/troptions/dashboard` | 307 redirect → login | 307 → `/troptions/auth/login?redirect=/portal/troptions/dashboard` | ✅ PASS |
| `/admin/troptions/intake` | 307 redirect → login | 307 → `/login?next=/admin/troptions/intake` | ✅ PASS |

Both protected page routes redirect unauthenticated users to login.

---

## Admin API Routes — Unauthenticated (Task 5)

| Endpoint | Method | Expected | Actual | Status |
|---|---|---|---|---|
| `/api/troptions/inquiries/export` | GET | 401 Unauthorized | 401 `{"error":"Unauthorized"}` | ✅ PASS |
| `/api/troptions/cis-requests` | GET | 401 Unauthorized | 401 `{"error":"Unauthorized"}` | ✅ PASS |
| `/api/troptions/inquiries` | GET | 401 Unauthorized | 401 `{"error":"Unauthorized"}` | ✅ PASS |

All admin-gated API endpoints block unauthenticated access.

---

## Public API Routes — Form Submissions

| Endpoint | Method | Expected | Actual | Status |
|---|---|---|---|---|
| `/api/troptions/cis-requests` | POST | 201 with ID | 201 `{"success":true,"id":"26b037ab-..."}` | ✅ PASS |
| `/api/troptions/inquiries` | POST | 201 with ID | 201 `{"success":true,"id":"b10354b1-..."}` | ✅ PASS |
| `/api/troptions/inquiries` | POST (portal) | 201 with ID | 201 `{"success":true,"id":"84d1de45-..."}` | ✅ PASS |

All public submission endpoints accept and persist data.

---

## Static Assets — Proof Room

| Asset | Expected | Actual | Status |
|---|---|---|---|
| `/proofs/bryan-stone-usdc-175m.html` | 200 | 200 | ✅ PASS |
| `/downloads/troptions-pof-usdc-175m-desk.pdf` | 200 application/pdf | 200 application/pdf | ✅ PASS |

---

## Summary

**All routes verified: 6/6 public pages, 2/2 protected redirects, 3/3 admin API blocks, 3/3 form submissions, 2/2 proof assets.**
