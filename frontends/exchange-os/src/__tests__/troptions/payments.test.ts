import {
  getPaymentReadiness,
  isStripeConfigured,
  createInvoiceRequest,
  createDepositIntentPlaceholder,
} from "@/lib/troptions/payments";

describe("payments.ts — isStripeConfigured", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns false when no keys set", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    expect(isStripeConfigured()).toBe(false);
  });

  it("returns false when key does not start with sk_", () => {
    process.env.STRIPE_SECRET_KEY = "not_a_stripe_key";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_something";
    expect(isStripeConfigured()).toBe(false);
  });

  it("returns true when both keys are properly set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc123";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_testkey";
    expect(isStripeConfigured()).toBe(true);
  });
});

describe("payments.ts — getPaymentReadiness", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns not_configured when no Stripe keys", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const report = getPaymentReadiness();
    expect(report.status).toBe("not_configured");
    expect(report.invoiceOnly).toBe(true);
    expect(report.stripeConfigured).toBe(false);
    expect(report.activationSteps.length).toBeGreaterThan(0);
  });

  it("returns stripe_ready when Stripe keys present", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc123";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_testkey";
    const report = getPaymentReadiness();
    expect(report.status).toBe("stripe_ready");
    expect(report.stripeConfigured).toBe(true);
    expect(report.invoiceOnly).toBe(false);
  });

  it("does not throw without Stripe keys (build safety)", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    expect(() => getPaymentReadiness()).not.toThrow();
  });
});

describe("payments.ts — createInvoiceRequest", () => {
  it("returns a valid invoice request object", () => {
    const invoice = createInvoiceRequest(
      "Test Client",
      "test@example.com",
      "starter-client-setup",
      "Starter Client Setup",
      2500,
      "Test Corp"
    );
    expect(invoice.id).toBeDefined();
    expect(invoice.clientName).toBe("Test Client");
    expect(invoice.clientEmail).toBe("test@example.com");
    expect(invoice.amount).toBe(2500);
    expect(invoice.currency).toBe("USD");
    expect(invoice.status).toBe("draft");
    expect(typeof invoice.createdAt).toBe("string");
  });
});

describe("payments.ts — createDepositIntentPlaceholder", () => {
  it("returns a valid deposit object", () => {
    const deposit = createDepositIntentPlaceholder(
      "Test Client",
      "test@example.com",
      "growth-system-build",
      5000,
      10000,
      "50% deposit"
    );
    expect(deposit.id).toBeDefined();
    expect(deposit.depositAmount).toBe(5000);
    expect(deposit.totalAmount).toBe(10000);
    expect(deposit.status).toBe("pending");
    expect(deposit.currency).toBe("USD");
  });
});
