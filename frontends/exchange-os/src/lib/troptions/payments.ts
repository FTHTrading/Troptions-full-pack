/**
 * TROPTIONS Payment Readiness Layer
 *
 * Stripe is NOT installed. This file provides:
 * - Type definitions for invoice and deposit requests
 * - Safe status detection (no keys = invoice-only mode)
 * - Placeholder creation functions
 *
 * To activate Stripe later:
 *   pnpm add stripe
 *   Set STRIPE_SECRET_KEY in .env.local
 *   Set STRIPE_PRICE_IDS per package
 *
 * See docs/revenue/PAYMENT_READINESS.md for activation guide.
 */

export type PaymentProviderStatus =
  | "not_configured"   // No keys present
  | "invoice_only"     // Manual invoicing only
  | "stripe_ready"     // Stripe configured and active
  | "partial";         // Some keys present but incomplete

export interface InvoiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  company?: string;
  packageId: string;
  packageName: string;
  amount: number;
  currency: "USD";
  description: string;
  dueDate?: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  createdAt: string;
}

export interface DepositRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  packageId: string;
  depositAmount: number;
  totalAmount: number;
  currency: "USD";
  notes?: string;
  status: "pending" | "received" | "refunded";
  createdAt: string;
}

export interface PaymentReadinessReport {
  status: PaymentProviderStatus;
  stripeConfigured: boolean;
  invoiceOnly: boolean;
  message: string;
  activationSteps: string[];
}

/**
 * Returns true only if both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set.
 */
export function isStripeConfigured(): boolean {
  return (
    typeof process.env.STRIPE_SECRET_KEY === "string" &&
    process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
    typeof process.env.STRIPE_WEBHOOK_SECRET === "string" &&
    process.env.STRIPE_WEBHOOK_SECRET.length > 0
  );
}

export function getPaymentReadiness(): PaymentReadinessReport {
  const stripeConfigured = isStripeConfigured();

  if (stripeConfigured) {
    return {
      status: "stripe_ready",
      stripeConfigured: true,
      invoiceOnly: false,
      message: "Stripe is configured. Live payment processing is available.",
      activationSteps: [],
    };
  }

  return {
    status: "not_configured",
    stripeConfigured: false,
    invoiceOnly: true,
    message:
      "No payment provider is configured. Clients can request invoices and deposits via the inquiry flow. Stripe can be activated without a rebuild.",
    activationSteps: [
      "Install Stripe: pnpm add stripe",
      "Add STRIPE_SECRET_KEY to .env.local (starts with sk_live_ or sk_test_)",
      "Add STRIPE_WEBHOOK_SECRET to .env.local",
      "Add STRIPE_PRICE_IDS for each package (optional — or use dynamic pricing)",
      "Restart the server",
    ],
  };
}

/**
 * Creates a placeholder invoice request object (not persisted here — persist via DB layer).
 */
export function createInvoiceRequest(
  clientName: string,
  clientEmail: string,
  packageId: string,
  packageName: string,
  amount: number,
  company?: string
): InvoiceRequest {
  return {
    id: crypto.randomUUID(),
    clientName,
    clientEmail,
    company,
    packageId,
    packageName,
    amount,
    currency: "USD",
    description: `TROPTIONS – ${packageName}`,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates a deposit intent placeholder (no Stripe call made).
 * Returns the object for admin review. Does not charge the client.
 */
export function createDepositIntentPlaceholder(
  clientName: string,
  clientEmail: string,
  packageId: string,
  depositAmount: number,
  totalAmount: number,
  notes?: string
): DepositRequest {
  return {
    id: crypto.randomUUID(),
    clientName,
    clientEmail,
    packageId,
    depositAmount,
    totalAmount,
    currency: "USD",
    notes,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
