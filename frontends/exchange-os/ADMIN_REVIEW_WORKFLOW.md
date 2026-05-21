# Admin Review Workflow

**Status:** ✅ Two admin dashboards operational. Both require valid session.

---

## Access Control

All admin pages are protected by:

1. **`src/app/admin/layout.tsx`** — exports `dynamic = "force-dynamic"` to prevent static pre-rendering, and ensures the Next.js segment is treated as server-rendered on demand.

2. **Per-page auth check** — every admin page calls `getCurrentUser()` and redirects if null:
   ```ts
   const user = await getCurrentUser();
   if (!user) redirect("/login?next=/admin/revenue");
   ```

There is no public fallback — unauthenticated requests to any `/admin/*` route are immediately redirected to `/login`.

---

## Dashboard 1 — Revenue Overview

**Route:** `/admin/revenue`  
**File:** `src/app/admin/revenue/page.tsx`

### What It Shows
- Summary cards: Total inquiries, New leads, Qualified leads, Pending bookings
- Inquiry table: id, name, company, service interest, lead score, status, date
- Booking request table: id, name, company, date/time, call type, status
- Export button → `GET /api/troptions/inquiries/export`

### Data Sources
- `listInquiries(100, 0)` from `data/revenue.db`
- `listBookingRequests(50, 0)` from `data/revenue.db`
- `getInquirySummary()` — `{ total, newLeads, qualified }`
- `getBookingSummary()` — `{ total, pending }`

---

## Dashboard 2 — Intake Unified View (new this session)

**Route:** `/admin/troptions/intake`  
**File:** `src/app/admin/troptions/intake/page.tsx`

### What It Shows
Four summary cards:
- Total inquiries (`inquirySummary.total`)
- CIS requests pending (`cisSummary.pending`)
- Bookings pending (`bookingSummary.pending`)
- Qualified leads (`inquirySummary.qualified`)

Three data tables:
1. **CIS Requests** — id, name, email, company, entity type, purpose, status, date
2. **Inquiries** — id, name, company, service interest, lead score, status, date
3. **Booking Requests** — id, name, company, date, time, call type, notes, status

Export CTA → `GET /api/troptions/inquiries/export`

### Data Sources
- `listCisRequests(100, 0)` — `data/revenue.db` → `cis_requests`
- `listInquiries(100, 0)` — `data/revenue.db` → `inquiries`
- `listBookingRequests(50, 0)` — `data/revenue.db` → `booking_requests`
- `getInquirySummary()`, `getBookingSummary()`, `getCisSummary()`

---

## CSV Export API

**Endpoint:** `GET /api/troptions/inquiries/export`  
**File:** `src/app/api/troptions/inquiries/export/route.ts`

```ts
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const rows = await listInquiries(2000, 0);
  const csv = buildCsv(rows); // escapeCsv() on all fields
  
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="troptions-inquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
```

**Admin use:** Go to `/admin/revenue` or `/admin/troptions/intake` → click "Export CSV". Browser downloads `troptions-inquiries-YYYY-MM-DD.csv`. Import directly to HubSpot, Salesforce, Airtable, or any CRM.

---

## API Endpoints Used by Admin

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/troptions/inquiries` | GET | `{ inquiries, summary }` |
| `/api/troptions/inquiries/export` | GET | CSV file download |
| `/api/troptions/cis-requests` | GET | `{ requests, summary }` |
| `/api/troptions/booking-requests` | GET | `{ requests, summary }` |

All require a valid `troptions_session` cookie. All return 401 JSON if unauthenticated.

---

## Admin User Setup

Users are created via `POST /api/auth/register`:

```json
{
  "email": "admin@troptions.com",
  "password": "your-secure-password"
}
```

Stored in `data/auth.db` → `users` table. Password is SHA-256 hashed. No UI for user management — programmatic only.

Login at `/login` or `/troptions/auth/login`.

---

## Review Workflow (Recommended Operating Procedure)

1. **Daily**: Visit `/admin/troptions/intake` to see overnight CIS submissions and inquiries
2. **Weekly**: Click "Export CSV" → import to CRM for lead scoring and follow-up campaigns
3. **On CIS receipt**: Contact submitter within 24h, update status in DB via admin API
4. **On booking confirmation**: Confirm preferred date, update `booking_requests.status = 'confirmed'`
5. **On qualified lead**: Update `inquiries.status = 'qualified'` → triggers lead counter update

---

## Proof Room (Admin-Adjacent)

There is also an admin proof room at `/admin/proof-room` (pre-existing) for managing claims and evidence packages. The public-facing proof document index is at `/troptions/proof-room` (new this session) — 22 files listed with categories, descriptions, and verified XRPL TX hashes.

---

## Build Confirmation

```
✓ /admin/troptions/intake   ƒ Dynamic
✓ /admin/revenue            ƒ Dynamic
✓ /api/troptions/inquiries/export  ƒ Dynamic

809/809 pages generated — exit code 0
TypeScript: 0 errors
Tests: 42/42 passing
```
