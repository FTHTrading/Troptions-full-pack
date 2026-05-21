# Revenue Flow Implementation

**Session:** Revenue-Readiness Implementation Pass  
**Status:** ✅ LIVE — all routes, forms, DB tables, and tests are in place

---

## Overview

The TROPTIONS platform now has a working intake → portal → admin revenue workflow. Every module listed here has a working route, real form, stored data, downloadable file, tested API, or verified external link.

---

## Route Map

### Client-Facing Intake

| Route | Component | Status |
|-------|-----------|--------|
| `/troptions/contact` | Institutional inquiry form → SQLite | ✅ Live |
| `/troptions/book` | Trade Desk scheduling form → SQLite | ✅ Live |
| `/troptions/cis` | CIS intake form → SQLite + PDF download | ✅ Live (was redirect; now real form) |
| `/troptions/request-access` | Portal access request → inquiry DB | ✅ Live (new) |
| `/troptions/proof-room` | Public proof document index | ✅ Live (new) |
| `/troptions/system-status` | 35-module platform status matrix | ✅ Live |

### Protected Portal

| Route | Auth | Status |
|-------|------|--------|
| `/portal/troptions/dashboard` | Middleware cookie + layout DB session | ✅ Double-gated |
| `/portal/troptions/*` | Same — force-dynamic, server-side auth | ✅ All subpages |
| `/troptions/gated/downloads` | Middleware cookie check | ✅ Live |

### Admin

| Route | Status |
|-------|--------|
| `/admin/revenue` | Inquiries, bookings, pipeline value | ✅ Live |
| `/admin/troptions/intake` | CIS + inquiries + bookings unified view | ✅ Live (new) |

---

## API Endpoints

| Endpoint | Method | Auth | Function |
|----------|--------|------|----------|
| `POST /api/troptions/inquiries` | Public | — | Submit institutional inquiry |
| `GET /api/troptions/inquiries` | Admin | `getCurrentUser()` | List all inquiries |
| `GET /api/troptions/inquiries/export` | Admin | `getCurrentUser()` | CRM CSV download |
| `POST /api/troptions/cis-requests` | Public | — | Submit CIS intake |
| `GET /api/troptions/cis-requests` | Admin | `getCurrentUser()` | List CIS requests |
| `POST /api/troptions/booking-requests` | Public | — | Schedule trade desk call |
| `GET /api/troptions/booking-requests` | Admin | `getCurrentUser()` | List bookings |

---

## Database Tables (SQLite — `data/revenue.db`)

### `inquiries`
- `id, name, email, phone, company, website, service_interest, budget_range, timeline, message, lead_score, status, source, consent_given, ip_hash, created_at, updated_at`
- Statuses: `new | contacted | qualified | proposal_needed | proposal_sent | won | lost | archived`

### `booking_requests`
- `id, name, email, company, preferred_date, preferred_time, timezone, call_type, notes, status, created_at`
- Statuses: `pending | confirmed | cancelled`

### `cis_requests` *(new this session)*
- `id, name, email, phone, company, entity_type, jurisdiction, purpose, transaction_type, estimated_amount, consent_given, status, created_at, updated_at`
- Statuses: `received | under_review | complete | declined`

---

## Downloadable Files (all verified present on disk)

| File | Path |
|------|------|
| CIS Master Package | `/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf` |
| KYC Onboarding Handbook | `/troptions/downloads/kyc-onboarding-handbook.pdf` |
| XRPL IOU Issuance Handbook | `/troptions/downloads/xrpl-iou-issuance-handbook.pdf` |
| RWA Tokenisation Handbook | `/troptions/downloads/rwa-tokenisation-handbook.pdf` |
| POF USDC Desk Report (HTML) | `/downloads/troptions-pof-usdc-175m-desk.html` |
| POF USDC Desk Report (PDF) | `/downloads/troptions-pof-usdc-175m-desk.pdf` |
| USDC $175M Proof (HTML) | `/proofs/bryan-stone-usdc-175m.html` |
| Verification Commands | `/proofs/bryan-stone-usdc-175m-verification-commands.txt` |
| + 13 additional PDFs | Listed in `/troptions/proof-room` |

---

## What Was NOT Done (Intentionally Out of Scope)

- Email SMTP sending: stub hook comment added in inquiry route — requires SMTP config at runtime
- Real Calendly/Cal.com integration: booking form stores data locally; calendar link TBD
- Payment processing: no payments tied to intake forms — out of scope for this pass
- Admin user provisioning UI: users created via `POST /api/auth/register` only

---

## Test Coverage

42 smoke tests in `src/tests/routes.test.ts` covering:
- All page files exist on disk
- All proof files verified present
- API routes validate required fields
- Portal auth layers confirmed in source
- CIS functions exported from revenue-db
- CSV export is admin-gated and returns attachment header
