import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { TROPTIONS_MEMBERSHIP_PLANS } from "@/content/troptions-cloud/membershipRegistry";
import { TROPTIONS_AI_SYSTEMS } from "@/content/troptions-cloud/aiSystemRegistry";

// ──────────────────────────────────────────────
// Namespace Registry
// ──────────────────────────────────────────────

describe("namespaceRegistry", () => {
  it("namespace slugs are unique", () => {
    const slugs = TROPTIONS_NAMESPACES.map((n) => n.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("all namespace slugs start with 'troptions'", () => {
    for (const ns of TROPTIONS_NAMESPACES) {
      expect(ns.slug).toMatch(/^troptions/);
    }
  });

  it("every namespace has simulationOnly === true", () => {
    for (const ns of TROPTIONS_NAMESPACES) {
      expect(ns.simulationOnly).toBe(true);
    }
  });

  it("every namespace has liveExecutionEnabled === false", () => {
    for (const ns of TROPTIONS_NAMESPACES) {
      expect(ns.liveExecutionEnabled).toBe(false);
    }
  });

  it("every namespace has a non-empty displayName", () => {
    for (const ns of TROPTIONS_NAMESPACES) {
      expect(typeof ns.displayName).toBe("string");
      expect(ns.displayName.length).toBeGreaterThan(0);
    }
  });

  it("every namespace has at least one enabled module", () => {
    for (const ns of TROPTIONS_NAMESPACES) {
      expect(Array.isArray(ns.enabledModules)).toBe(true);
      expect(ns.enabledModules.length).toBeGreaterThan(0);
    }
  });
});

// ──────────────────────────────────────────────
// Membership Registry
// ──────────────────────────────────────────────

describe("membershipRegistry", () => {
  it("every membership plan has simulationOnly === true", () => {
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      expect(plan.simulationOnly).toBe(true);
    }
  });

  it("every membership plan has liveExecutionEnabled === false", () => {
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      expect(plan.liveExecutionEnabled).toBe(false);
    }
  });

  it("every membership plan has liveTradingEnabled === false", () => {
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      expect(plan.liveTradingEnabled).toBe(false);
    }
  });

  it("every membership plan has liveInvestmentAccessEnabled === false", () => {
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      expect(plan.liveInvestmentAccessEnabled).toBe(false);
    }
  });

  it("every membership plan has legalReviewRequiredForOpportunities === true", () => {
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      expect(plan.legalReviewRequiredForOpportunities).toBe(true);
    }
  });

  it("no membership plan description contains prohibited financial language", () => {
    const prohibited = ["returns", "yield", "profit", "guaranteed"];
    for (const plan of TROPTIONS_MEMBERSHIP_PLANS) {
      for (const word of prohibited) {
        expect(plan.description.toLowerCase()).not.toContain(word);
      }
    }
  });

  it("membership plan IDs are unique", () => {
    const ids = TROPTIONS_MEMBERSHIP_PLANS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("membership plan slugs are unique", () => {
    const slugs = TROPTIONS_MEMBERSHIP_PLANS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("free plans have monthlyDues of 0", () => {
    const freePlans = TROPTIONS_MEMBERSHIP_PLANS.filter(
      (p) => p.tier === "visitor" || p.tier === "registered"
    );
    for (const plan of freePlans) {
      expect(plan.monthlyDues).toBe(0);
    }
  });
});

// ──────────────────────────────────────────────
// AI System Registry
// ──────────────────────────────────────────────

describe("aiSystemRegistry", () => {
  it("all AI systems have simulationOnly === true", () => {
    for (const sys of TROPTIONS_AI_SYSTEMS) {
      expect(sys.simulationOnly).toBe(true);
    }
  });

  it("all AI systems have liveExecutionEnabled === false", () => {
    for (const sys of TROPTIONS_AI_SYSTEMS) {
      expect(sys.liveExecutionEnabled).toBe(false);
    }
  });

  it("all AI systems have externalApiCallsEnabled === false", () => {
    for (const sys of TROPTIONS_AI_SYSTEMS) {
      expect(sys.externalApiCallsEnabled).toBe(false);
    }
  });

  it("all AI systems have requiresControlHubApproval === true", () => {
    for (const sys of TROPTIONS_AI_SYSTEMS) {
      expect(sys.requiresControlHubApproval).toBe(true);
    }
  });

  it("AI system IDs are unique", () => {
    const ids = TROPTIONS_AI_SYSTEMS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("AI system slugs are unique", () => {
    const slugs = TROPTIONS_AI_SYSTEMS.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("healthcare AI system has a policy covering no-diagnosis", () => {
    const healthSystem = TROPTIONS_AI_SYSTEMS.find((s) => s.id === "ai-sys-006");
    expect(healthSystem).toBeDefined();
    const policyTexts = healthSystem!.policies.map((p) => p.rule.toLowerCase());
    const hasDiagnosisPolicy = policyTexts.some(
      (t) => t.includes("diagnos") || t.includes("treatment")
    );
    expect(hasDiagnosisPolicy).toBe(true);
  });

  it("healthcare AI system has a policy covering no-PHI", () => {
    const healthSystem = TROPTIONS_AI_SYSTEMS.find((s) => s.id === "ai-sys-006");
    expect(healthSystem).toBeDefined();
    const policyTexts = healthSystem!.policies.map((p) => p.rule.toLowerCase());
    const hasPhiPolicy = policyTexts.some((t) => t.includes("phi") || t.includes("protected health"));
    expect(hasPhiPolicy).toBe(true);
  });

  it("healthcare AI system has a policy covering no-emergency-guidance", () => {
    const healthSystem = TROPTIONS_AI_SYSTEMS.find((s) => s.id === "ai-sys-006");
    expect(healthSystem).toBeDefined();
    const policyTexts = healthSystem!.policies.map((p) => p.rule.toLowerCase());
    const hasEmergencyPolicy = policyTexts.some((t) => t.includes("emergency"));
    expect(hasEmergencyPolicy).toBe(true);
  });

  it("all AI system slugs start with 'troptions'", () => {
    for (const sys of TROPTIONS_AI_SYSTEMS) {
      expect(sys.slug).toMatch(/^troptions/);
    }
  });
});
