# TROPTIONS Client-Facing Revenue System

## What Was Built

This document describes the client-facing revenue and lead generation layer added to the TROPTIONS platform. It is the first version of the system designed to generate real revenue from qualified client inquiries, booking requests, and service package proposals — without depending on live tokens, live trading, or the Rust Layer-1.

---

## Revenue Entry Funnel (How a Client Becomes Revenue)

```
Client visits /troptions/services or /troptions/pricing
       ↓
CTA → /troptions/contact (inquiry form)
       ↓
POST /api/troptions/inquiries → creates ClientInquiry in data/revenue.db
       ↓
Admin reviews at /admin/revenue
       ↓
Admin contacts client → sends proposal → marks status → won/lost
       ↓
Invoice issued (manual or via Stripe when configured)
       ↓
Client deposits → delivery begins → /troptions/client-onboarding
```

---

## Pages Added

| Route | Purpose | Revenue Role |
|---|---|---|
| `/troptions/services` | 8 service cards with status, price, scope | First client touchpoint |
| `/troptions/pricing` | 4 service packages with pricing | Converts browsers → leads |
| `/troptions/contact` | Full inquiry form with consent | Primary lead capture |
| `/troptions/book` | Discovery call booking form | Secondary lead capture |
| `/troptions/client-onboarding` | 6-step onboarding overview | Sets client expectations |
| `/troptions/trust` | What is operational, what requires review | Trust-building, compliance |
| `/troptions/disclaimers` | 9-section plain-language legal page | Legal coverage |
| `/troptions/payments` | Current payment status, invoice-only mode | Sets payment expectations |
| `/troptions/insights` | 6 article cards with SystemStatus badges | SEO + inbound traffic |

---

## APIs Added

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/troptions/inquiries` | POST | Public | Submit new client inquiry |
| `/api/troptions/inquiries` | GET | Admin | List all inquiries + summary |
| `/api/troptions/booking-requests` | POST | Public | Submit booking request |
| `/api/troptions/booking-requests` | GET | Admin | List all bookings + summary |
| `/api/troptions/revenue/opportunities` | GET | Admin | Aggregated revenue dashboard data |

---

## Admin Dashboard

`/admin/revenue` — auth-gated (requires active session cookie `troptions_session`).

Shows:
- Summary: Total Inquiries, New Leads, Qualified, Booking Requests, Est. Pipeline Value
- Inquiries by Service (breakdown)
- Inquiries by Budget (breakdown)
- Priority Leads table (lead score ≥ 50)
- All Inquiries (full cards with estimated value + recommended next action)
- All Booking Requests (table)

---

## Service Packages

| ID | Name | Starting Price | Requires Quote |
|---|---|---|---|
| `starter-client-setup` | Starter Client Setup | $2,500 | No |
| `growth-system-build` | Growth System Build | $10,000 | No |
| `institutional-platform-sprint` | Institutional Platform Sprint | $50,000 | No |
| `enterprise-custom` | Enterprise Custom Engagement | — | Yes |

---

## What Can Make Money Immediately

1. **Qualified client inquiries** — any submission at `/troptions/contact` creates a lead in the admin dashboard with a score, estimated pipeline value, and recommended next action. Manual follow-up is all that's required.
2. **Discovery call bookings** — any submission at `/troptions/book` appears in the admin booking table. Manual calendar confirmation required.
3. **Manual invoice issuance** — `createInvoiceRequest()` in `src/lib/troptions/payments.ts` creates an invoice object. Manual delivery via PDF or email today; Stripe invoice when Stripe is configured.
4. **Deposit collection** — `createDepositIntentPlaceholder()` structures the deposit request. Stripe Checkout link can be added once keys are configured.

---

## What Still Needs Manual Setup

| Item | Status | Notes |
|---|---|---|
| Stripe payment processing | Not configured | See `docs/revenue/PAYMENT_READINESS.md` |
| Calendar integration | Not automated | Booking form shows manual confirmation warning |
| CRM integration | Not built | Admin dashboard is the CRM for now |
| Email notifications | Not built | Admin must poll `/admin/revenue` |
| Proposal PDF generation | Not built | Manual Word/PDF workflow for now |
| Client portal access | Intake Open | `/troptions/client-onboarding` explains steps |

---

## Library Files

| File | Purpose |
|---|---|
| `src/lib/troptions/revenue.ts` | Types, SERVICE_PACKAGES data, scoring, utilities |
| `src/lib/troptions/revenue-db.ts` | SQLite persistence (data/revenue.db) |
| `src/lib/troptions/payments.ts` | Payment readiness layer, invoice/deposit placeholders |

---

## Components Added

| Component | Purpose |
|---|---|
| `src/components/troptions/SystemStatusBadge.tsx` | Status badges: Live, Client Ready, Intake Open, In Development, etc. |
| `src/components/troptions/ComplianceNotice.tsx` | Orange compliance notice for RWA/token/escrow content |

---

## Lead Scoring

`qualifyLead()` in `revenue.ts` scores 0–100 based on:
- Budget size (+points per tier)
- Company presence (+10)
- Phone presence (+5)
- Website presence (+5)
- Message length >100 chars (+10)
- Service specificity (+5 if not "not_sure")
- Timeline provided (+5)

Score ≥ 50: shown in Priority Leads table, recommended "Priority follow-up."
Score ≥ 70: marked as high-value, "Schedule proposal call."

---

## Compliance Design

- All RWA, stablecoin, escrow, trade desk, and token pages display `<ComplianceNotice>`.
- `/troptions/trust` explicitly lists what is operational vs what requires legal/compliance review.
- `/troptions/disclaimers` has 9 sections covering investment advice, returns, KYC/KYB, securities, jurisdiction, and data.
- No financial return claims or guaranteed outcome language anywhere in the codebase.
