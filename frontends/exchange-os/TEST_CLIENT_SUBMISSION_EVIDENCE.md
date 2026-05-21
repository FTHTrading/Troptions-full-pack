# Test Client Submission Evidence

**Verification Date:** 2026-05-04  
**Environment:** Local production build — `http://localhost:3002`  
**DB:** `data/revenue.db`  

---

## Test Submission 1 — CIS (Client Identification Statement)

**Endpoint:** `POST /api/troptions/cis-requests`  
**Purpose:** Verify CIS intake form stores data and returns download link  

**Request:**
```json
{
  "name": "Test Client Alpha",
  "email": "test-alpha@example.com",
  "purpose": "Verification pass - CIS intake test. TROPTIONS gold-pegged asset acquisition.",
  "consentGiven": true,
  "entityType": "individual",
  "jurisdiction": "United States"
}
```

**Response (HTTP 201):**
```json
{
  "success": true,
  "id": "26b037ab-d4dd-4f2f-bc8c-8cae39edf001",
  "downloadUrl": "/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf",
  "message": "Your CIS package request has been received. The TROPTIONS compliance team will be in touch within 2 business days. Download your CIS template below."
}
```

**DB Record Confirmed:**
```json
{
  "id": "26b037ab-d4dd-4f2f-bc8c-8cae39edf001",
  "name": "Test Client Alpha",
  "email": "test-alpha@example.com",
  "status": "received",
  "created_at": "2026-05-04T16:29:48.504Z"
}
```

---

## Test Submission 2 — Institutional Inquiry

**Endpoint:** `POST /api/troptions/inquiries`  
**Purpose:** Verify institutional inquiry form persists and triggers lead queue  

**Request:**
```json
{
  "name": "Test Institutional Beta",
  "email": "test-beta@example.com",
  "message": "Verification pass test inquiry - institutional interest in TROPTIONS gold-backed settlement rails.",
  "inquiryType": "institutional",
  "consentGiven": true
}
```

**Response (HTTP 201):**
```json
{
  "success": true,
  "id": "b10354b1-cbb3-4750-ba9a-1ea24e5d435a",
  "message": "Your inquiry has been received. The TROPTIONS team will be in touch within 1 business day."
}
```

**DB Record Confirmed:**
```json
{
  "id": "b10354b1-cbb3-4750-ba9a-1ea24e5d435a",
  "name": "Test Institutional Beta",
  "email": "test-beta@example.com",
  "status": "new",
  "created_at": "2026-05-04T16:29:57.909Z"
}
```

---

## Test Submission 3 — Portal Access Request

**Endpoint:** `POST /api/troptions/inquiries`  
**Purpose:** Verify portal access request flow from `/troptions/request-access`  

**Request:**
```json
{
  "name": "Test Portal Gamma",
  "email": "test-gamma@example.com",
  "company": "Verification Corp",
  "message": "Verification pass test - portal access request for institutional client onboarding.",
  "inquiryType": "portal_access",
  "consentGiven": true
}
```

**Response (HTTP 201):**
```json
{
  "success": true,
  "id": "84d1de45-a0af-46fe-880e-6f9c757f4319",
  "message": "Your inquiry has been received. The TROPTIONS team will be in touch within 1 business day."
}
```

**DB Record Confirmed:**
```json
{
  "id": "84d1de45-a0af-46fe-880e-6f9c757f4319",
  "name": "Test Portal Gamma",
  "email": "test-gamma@example.com",
  "status": "new",
  "created_at": "2026-05-04T16:30:02.618Z"
}
```

---

## Admin Intake Dashboard

All 3 submissions are queryable via the admin intake endpoint (authenticated):

- **CIS requests table:** 1 record (`status: "received"`)
- **Inquiries table:** 2 records (`status: "new"`) + prior test data
- **Admin page:** `/admin/troptions/intake` — renders unified view of CIS + inquiries + bookings (requires `troptions_session` cookie; redirects to login without it)

---

## CSV Export Gate

`GET /api/troptions/inquiries/export` returns `401 {"error":"Unauthorized"}` without a valid session cookie. Admin must authenticate before downloading CRM export.

---

## Input Validation Evidence

Consent enforcement confirmed — missing `consentGiven` returns:
```
HTTP 400: {"error": "Consent is required to submit an inquiry"}
```

Email validation confirmed — empty or malformed email returns:
```
HTTP 400: {"error": "A valid email address is required"}
```
