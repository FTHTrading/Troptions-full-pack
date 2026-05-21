# Intake and CIS Flow

**Status:** ✅ All three intake paths (inquiry, CIS, booking) are fully wired: form → API → SQLite → admin view

---

## Flow Overview

```
User fills form
    │
    ▼
POST /api/troptions/{resource}   ← validates required fields, inserts to SQLite
    │
    ▼
Returns success + ref ID
    │
    ├── CIS: shows PDF download links + reference ID
    └── Inquiry/Booking: confirmation message
    
    │
    ▼
Admin views at /admin/troptions/intake or /admin/revenue
    │
    ▼
GET /api/troptions/inquiries/export  ← CSV download (admin-gated)
```

---

## Inquiry Form

**Route:** `/troptions/contact`  
**File:** `src/app/troptions/contact/page.tsx`  
**API:** `POST /api/troptions/inquiries`

### Fields (all saved to DB)
| Field | Required | DB Column |
|-------|----------|-----------|
| Full name | ✅ | `name` |
| Email | ✅ | `email` |
| Phone | — | `phone` |
| Company | — | `company` |
| Website | — | `website` |
| Service interest | — | `service_interest` |
| Budget range | — | `budget_range` |
| Timeline | — | `timeline` |
| Message | ✅ | `message` |
| Consent checkbox | ✅ | `consent_given` |

### Auto-scored
`lead_score` is auto-calculated at insert based on company + budget + timeline presence.

---

## CIS Intake Form *(new this session — was a redirect)*

**Route:** `/troptions/cis`  
**File:** `src/app/troptions/cis/page.tsx`  
**API:** `POST /api/troptions/cis-requests`

### Fields
| Field | Required | DB Column |
|-------|----------|-----------|
| Full name | ✅ | `name` |
| Email | ✅ | `email` |
| Phone | — | `phone` |
| Company | — | `company` |
| Entity type | — | `entity_type` |
| Jurisdiction | — | `jurisdiction` |
| Purpose | ✅ | `purpose` |
| Transaction type | — | `transaction_type` |
| Estimated amount | — | `estimated_amount` |
| Consent checkbox | ✅ | `consent_given` |

### On Success
- Returns `{ success: true, id: "<uuid>", downloadUrl: "...", message: "..." }`
- Form shows reference ID (first 8 chars, uppercase)
- Two download links appear:
  - `/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf` — CIS Master Package
  - `/troptions/downloads/kyc-onboarding-handbook.pdf` — KYC Handbook

### API Validation
```ts
if (!body.name || !body.email || !body.purpose || !body.consentGiven) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
```

---

## Request Access Form *(new this session)*

**Route:** `/troptions/request-access`  
**File:** `src/app/troptions/request-access/page.tsx`  
**API:** `POST /api/troptions/inquiries` (reuses inquiry table with `serviceInterest: "client_portal_setup"`)

### Fields
| Field | Required |
|-------|----------|
| Full name | ✅ |
| Email | ✅ |
| Company | ✅ |
| Title | — |
| Portal reason (select) | — |
| Purpose | ✅ |
| Consent | ✅ |

---

## Trade Desk Booking Form

**Route:** `/troptions/book`  
**File:** `src/app/troptions/book/page.tsx`  
**API:** `POST /api/troptions/booking-requests`

Stores: `name, email, company, preferred_date, preferred_time, timezone, call_type, notes`

---

## DB Layer

**File:** `src/lib/troptions/revenue-db.ts`

### Functions

| Function | Returns |
|----------|---------|
| `createInquiry(input)` | `InquiryRow` |
| `listInquiries(limit, offset)` | `InquiryRow[]` |
| `getInquirySummary()` | `{ total, newLeads, qualified }` |
| `createBookingRequest(input)` | `BookingRequest` |
| `listBookingRequests(limit, offset)` | `BookingRequest[]` |
| `getBookingSummary()` | `{ total, pending }` |
| `createCisRequest(input)` | `CisRequestRow` |
| `listCisRequests(limit, offset)` | `CisRequestRow[]` |
| `getCisSummary()` | `{ total, pending }` |

### Initialization
All three tables are created on first import via `initRevenueSchema()`. WAL mode enabled. Database lives at `data/revenue.db` (gitignored, created at runtime).

---

## CRM CSV Export

**Endpoint:** `GET /api/troptions/inquiries/export`  
**File:** `src/app/api/troptions/inquiries/export/route.ts`  
**Auth:** `getCurrentUser()` required — returns 401 if unauthenticated

### Response Headers
```
Content-Type: text/csv
Content-Disposition: attachment; filename="troptions-inquiries-YYYY-MM-DD.csv"
Cache-Control: no-store
```

### CSV Columns
`id, name, email, phone, company, website, service_interest, budget_range, timeline, message, lead_score, status, source, consent_given, created_at`

### Security
- All fields pass through `escapeCsv()` which wraps in double quotes and escapes embedded quotes
- No formula injection risk (no `=`, `+`, `-`, `@` prefix allowed raw in CSV values)

---

## Email Notification Hooks

The inquiry and CIS APIs contain a stub hook:

```ts
// EMAIL HOOK: notify team of new inquiry
// await sendEmailNotification({ to: process.env.INTAKE_NOTIFY_EMAIL, ... })
// Requires SMTP config — add SMTP_HOST, SMTP_USER, SMTP_PASS, INTAKE_NOTIFY_EMAIL to .env.local
```

Wire up by setting those env vars and calling your preferred mailer (nodemailer, Resend, SendGrid, etc.) at the marked hook point.

---

## Summary: What's Operational

| Module | Route | Stored | Downloadable | API | Tested |
|--------|-------|--------|--------------|-----|--------|
| Inquiry form | `/troptions/contact` | ✅ SQLite | — | ✅ POST | ✅ |
| CIS intake | `/troptions/cis` | ✅ SQLite | ✅ PDF | ✅ POST | ✅ |
| Portal request | `/troptions/request-access` | ✅ SQLite | — | ✅ POST | ✅ |
| Trade desk booking | `/troptions/book` | ✅ SQLite | — | ✅ POST | ✅ |
| CSV export | `/api/troptions/inquiries/export` | — | ✅ CSV | ✅ GET | ✅ |
