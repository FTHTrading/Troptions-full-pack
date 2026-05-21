# Payment Readiness — TROPTIONS Platform

## Current Status: Invoice-Only Mode

Stripe is **not configured**. The platform is in invoice-only mode. All payment processing is manual.

`getPaymentReadiness()` returns `status: "not_configured"`, `invoiceOnly: true`.

---

## What Is Live Today

| Method | Status | Notes |
|---|---|---|
| Manual invoice (email/PDF) | Ready | Admin issues manually after lead qualification |
| Bank wire / ACH | Ready | Admin provides details after agreement |
| USDC / Stablecoin | Requires separate legal review | See compliance notice on payments page |
| Stripe online checkout | Not configured | Requires keys below |
| Crypto native pay | Requires separate legal review | — |

---

## How to Activate Stripe

1. Create a Stripe account at https://stripe.com
2. Add to environment (`.env.local` or deployment secrets):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
3. The `isStripeConfigured()` check in `src/lib/troptions/payments.ts` will automatically return `true`.
4. `getPaymentReadiness()` will return `status: "stripe_ready"`, `invoiceOnly: false`.
5. Build and deploy. The payments page at `/troptions/payments` will reflect the new status.

**Use `sk_test_...` keys for development/staging.** Never commit keys to git.

---

## Architecture

```
src/lib/troptions/payments.ts
├── isStripeConfigured()           → checks env vars, returns boolean
├── getPaymentReadiness()          → returns PaymentReadinessReport
├── createInvoiceRequest()         → structures invoice object (no Stripe API call)
└── createDepositIntentPlaceholder() → structures deposit object (no Stripe API call)
```

When Stripe is configured, replace placeholder functions with actual `stripe.invoices.create()` and `stripe.paymentIntents.create()` calls. The type interfaces are already defined.

---

## Invoice Flow (Manual Today)

1. Lead submits inquiry at `/troptions/contact`
2. Admin reviews at `/admin/revenue`
3. Admin calls `createInvoiceRequest()` server-side or builds invoice manually
4. Admin emails PDF invoice to client
5. Client wires funds or pays by ACH
6. Admin marks inquiry status as `won` in the dashboard
7. Delivery begins per `/troptions/client-onboarding`

---

## Deposit Flow (Manual Today)

Standard engagement: 50% deposit to start, 50% on delivery.

1. Admin generates deposit amount from package pricing
2. Admin issues deposit invoice manually
3. Client pays deposit
4. Admin marks status as `proposal_sent` → delivery starts

---

## Security Notes

- Never log Stripe secret keys
- Webhook secret must be validated on every webhook receipt
- Use Stripe's webhook signature verification (`stripe.webhooks.constructEvent`)
- All Stripe calls must be server-side only (never expose `sk_live_*` to the browser)
- Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` only in client-side Stripe.js
