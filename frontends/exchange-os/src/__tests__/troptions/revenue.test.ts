import {
  SERVICE_PACKAGES,
  calculateEstimatedOpportunityValue,
  qualifyLead,
  getNextRecommendedAction,
  formatPackagePrice,
  getPackageById,
  SERVICE_CATEGORY_LABELS,
  BUDGET_RANGE_LABELS,
  LEAD_STATUS_LABELS,
  type ClientInquiry,
  type BudgetRange,
  type ServiceCategory,
  type LeadStatus,
} from "@/lib/troptions/revenue";

describe("revenue.ts — package data", () => {
  it("loads 4 service packages", () => {
    expect(SERVICE_PACKAGES).toHaveLength(4);
  });

  it("every package has required fields", () => {
    for (const pkg of SERVICE_PACKAGES) {
      expect(typeof pkg.id).toBe("string");
      expect(pkg.id.length).toBeGreaterThan(0);
      expect(typeof pkg.name).toBe("string");
      expect(typeof pkg.priceLabel).toBe("string");
      expect(Array.isArray(pkg.includes)).toBe(true);
      expect(pkg.includes.length).toBeGreaterThan(0);
      expect(Array.isArray(pkg.notIncluded)).toBe(true);
    }
  });

  it("enterprise package requires a quote", () => {
    const enterprise = getPackageById("enterprise-custom");
    expect(enterprise).toBeDefined();
    expect(enterprise!.requiresQuote).toBe(true);
    expect(enterprise!.startingPrice).toBe(0);
  });

  it("starter package does not require a quote", () => {
    const starter = getPackageById("starter-client-setup");
    expect(starter).toBeDefined();
    expect(starter!.requiresQuote).toBe(false);
    expect(starter!.startingPrice).toBe(2500);
  });
});

describe("revenue.ts — formatPackagePrice", () => {
  it("returns 'Custom Quote' for requiresQuote packages", () => {
    const enterprise = getPackageById("enterprise-custom")!;
    expect(formatPackagePrice(enterprise)).toBe("Custom Quote");
  });

  it("returns formatted price for non-quote packages", () => {
    const starter = getPackageById("starter-client-setup")!;
    expect(formatPackagePrice(starter)).toBe("Starting at $2,500");
  });
});

describe("revenue.ts — calculateEstimatedOpportunityValue", () => {
  it("returns 0 for not_specified budget", () => {
    const value = calculateEstimatedOpportunityValue("not_specified", "not_sure");
    expect(value).toBe(0);
  });

  it("returns a positive value for large budgets", () => {
    const value = calculateEstimatedOpportunityValue("over_500k", "custom_platform");
    expect(value).toBeGreaterThan(0);
  });

  it("higher budget produces higher value", () => {
    const small = calculateEstimatedOpportunityValue("under_5k", "client_portal_setup");
    const large = calculateEstimatedOpportunityValue("100k_to_500k", "client_portal_setup");
    expect(large).toBeGreaterThan(small);
  });

  it("institutional services produce higher estimate than baseline", () => {
    const standard = calculateEstimatedOpportunityValue("25k_to_100k", "not_sure");
    const institutional = calculateEstimatedOpportunityValue("25k_to_100k", "custom_platform");
    expect(institutional).toBeGreaterThanOrEqual(standard);
  });
});

describe("revenue.ts — qualifyLead", () => {
  const baseInquiry: ClientInquiry = {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    message: "A short message.",
    budgetRange: "not_specified",
    serviceInterest: "not_sure",
    consentGiven: true,
    source: "website_contact",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("returns 0 for minimal lead", () => {
    const score = qualifyLead(baseInquiry);
    expect(score).toBe(0);
  });

  it("increments score for large budget", () => {
    const score = qualifyLead({ ...baseInquiry, budgetRange: "over_500k" });
    expect(score).toBeGreaterThan(0);
  });

  it("increments score for company presence", () => {
    const withCompany = qualifyLead({ ...baseInquiry, company: "Acme Corp" });
    const without = qualifyLead(baseInquiry);
    expect(withCompany).toBeGreaterThan(without);
  });

  it("score does not exceed 100", () => {
    const richLead: ClientInquiry = {
      ...baseInquiry,
      budgetRange: "over_500k",
      serviceInterest: "custom_platform",
      phone: "+1-555-1234",
      company: "BigCorp",
      website: "https://bigcorp.com",
      message: "A very detailed message with more than 100 characters. We are looking for comprehensive enterprise-grade solutions.",
      timeline: "30 days",
    };
    const score = qualifyLead(richLead);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("revenue.ts — getNextRecommendedAction", () => {
  const baseInquiry: ClientInquiry = {
    id: "test-id",
    name: "Test",
    email: "test@example.com",
    message: "Hi",
    budgetRange: "not_specified",
    serviceInterest: "not_sure",
    consentGiven: true,
    source: "website_contact",
    status: "new",
    leadScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("returns a string for new status", () => {
    const action = getNextRecommendedAction({ ...baseInquiry, status: "new" });
    expect(typeof action).toBe("string");
    expect(action.length).toBeGreaterThan(0);
  });

  it("returns priority follow-up for high-score new leads", () => {
    const action = getNextRecommendedAction({
      ...baseInquiry,
      status: "new",
      leadScore: 75,
    });
    expect(action.toLowerCase()).toContain("priority");
  });

  it("returns proposal action for qualified leads", () => {
    const action = getNextRecommendedAction({ ...baseInquiry, status: "qualified" });
    expect(action.toLowerCase()).toContain("proposal");
  });

  it("returns onboarding action for won leads", () => {
    const action = getNextRecommendedAction({ ...baseInquiry, status: "won" });
    expect(action.toLowerCase()).toContain("onboard");
  });
});

describe("revenue.ts — label maps", () => {
  it("SERVICE_CATEGORY_LABELS has no undefined values", () => {
    const labels = Object.values(SERVICE_CATEGORY_LABELS);
    for (const label of labels) {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("BUDGET_RANGE_LABELS covers all ranges", () => {
    const ranges: BudgetRange[] = [
      "under_5k",
      "5k_to_25k",
      "25k_to_100k",
      "100k_to_500k",
      "over_500k",
      "not_specified",
    ];
    for (const range of ranges) {
      expect(BUDGET_RANGE_LABELS[range]).toBeDefined();
    }
  });

  it("LEAD_STATUS_LABELS covers all statuses", () => {
    const statuses: LeadStatus[] = [
      "new",
      "contacted",
      "qualified",
      "proposal_needed",
      "proposal_sent",
      "won",
      "lost",
      "archived",
    ];
    for (const status of statuses) {
      expect(LEAD_STATUS_LABELS[status]).toBeDefined();
    }
  });
});
