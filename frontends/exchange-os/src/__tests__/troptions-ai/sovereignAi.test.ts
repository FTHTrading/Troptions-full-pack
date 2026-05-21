import {
  SOVEREIGN_AI_TEMPLATES,
  SOVEREIGN_AI_SYSTEMS,
  SOVEREIGN_AI_GLOBAL_POLICIES,
  getAiTemplate,
  getAiSystemsByNamespace,
  getVerticalLabel,
  getRiskLevelLabel,
  type TroptionsSovereignAiStatus,
} from "@/content/troptions-ai/sovereignAiRegistry";
import {
  KNOWLEDGE_ITEMS,
  KNOWLEDGE_VAULTS,
  KNOWLEDGE_SENSITIVITY_RULES,
  getSensitivityRule,
  getKnowledgeItemsByNamespace,
  getKnowledgeVaultByNamespace,
  type TroptionsKnowledgeSensitivity,
} from "@/content/troptions-ai/knowledgeVaultRegistry";
import {
  MODEL_ROUTES,
  MODEL_POLICIES,
  routeModel,
  getRouteByProvider,
  getProviderLabel,
} from "@/lib/troptions-ai/modelRouter";
import { evaluateAiSystemPolicy } from "@/lib/troptions-ai/sovereignAiPolicyEngine";

// ────────────────────────────────────────────────────────
// Sovereign AI Registry — Safety Invariants
// ────────────────────────────────────────────────────────

describe("SOVEREIGN_AI_SYSTEMS safety invariants", () => {
  it("every system has simulationOnly === true", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.simulationOnly).toBe(true);
    }
  });

  it("every system has liveExecutionEnabled === false", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.liveExecutionEnabled).toBe(false);
    }
  });

  it("every system has externalApiCallsEnabled === false", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.externalApiCallsEnabled).toBe(false);
    }
  });

  it("every system has requiresControlHubApproval === true", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.requiresControlHubApproval).toBe(true);
    }
  });

  it("every system has requiresDataReview === true", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.requiresDataReview).toBe(true);
    }
  });

  it("every system has requiresLegalReviewForSensitiveUse === true", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.requiresLegalReviewForSensitiveUse).toBe(true);
    }
  });

  it("no system has an empty id", () => {
    for (const system of SOVEREIGN_AI_SYSTEMS) {
      expect(system.id.trim().length).toBeGreaterThan(0);
    }
  });
});

// ────────────────────────────────────────────────────────
// Sovereign AI Templates
// ────────────────────────────────────────────────────────

describe("SOVEREIGN_AI_TEMPLATES", () => {
  it("has at least 12 templates", () => {
    expect(SOVEREIGN_AI_TEMPLATES.length).toBeGreaterThanOrEqual(12);
  });

  it("all template IDs are unique", () => {
    const ids = SOVEREIGN_AI_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all templates have simulationOnly === true", () => {
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      expect(template.simulationOnly).toBe(true);
    }
  });

  it("all templates have liveExecutionEnabled === false", () => {
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      expect(template.liveExecutionEnabled).toBe(false);
    }
  });

  it("all templates have at least one required approval step", () => {
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      expect(template.requiredApprovals.length).toBeGreaterThan(0);
    }
  });

  it("healthcare templates do not allow diagnosis or PHI tools", () => {
    const BLOCKED = ["medical_diagnosis", "treatment_planner", "phi_reader", "clinical_decision_support"];
    const healthcareTemplates = SOVEREIGN_AI_TEMPLATES.filter((t) => t.vertical === "healthcare_admin");
    for (const template of healthcareTemplates) {
      for (const blocked of BLOCKED) {
        expect(template.allowedTools).not.toContain(blocked);
      }
    }
  });

  it("no template allows investment or securities tools", () => {
    const BLOCKED = ["investment_advisor", "financial_returns_calculator", "securities_router"];
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      for (const blocked of BLOCKED) {
        expect(template.allowedTools).not.toContain(blocked);
      }
    }
  });

  it("no template names reference outside ecosystems", () => {
    const FORBIDDEN = ["unykorn", "fth", "jefe", "apostle", "kalishi"];
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      for (const word of FORBIDDEN) {
        expect(template.name.toLowerCase()).not.toContain(word);
        expect(template.description.toLowerCase()).not.toContain(word);
      }
    }
  });

  it("no template data contains private keys, passwords, or seed phrases", () => {
    const FORBIDDEN_PATTERNS = ["private_key", "password", "seed_phrase", "mnemonic", "ssn", "social_security"];
    const serialized = JSON.stringify(SOVEREIGN_AI_TEMPLATES).toLowerCase();
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(serialized).not.toContain(pattern);
    }
  });

  it("getAiTemplate returns the correct template by id", () => {
    const first = SOVEREIGN_AI_TEMPLATES[0];
    const found = getAiTemplate(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });

  it("getAiTemplate returns undefined for unknown id", () => {
    expect(getAiTemplate("does-not-exist")).toBeUndefined();
  });

  it("getVerticalLabel returns a non-empty string", () => {
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      const label = getVerticalLabel(template.vertical);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getRiskLevelLabel returns a non-empty string", () => {
    for (const template of SOVEREIGN_AI_TEMPLATES) {
      const label = getRiskLevelLabel(template.riskLevel);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

// ────────────────────────────────────────────────────────
// Global Policies
// ────────────────────────────────────────────────────────

describe("SOVEREIGN_AI_GLOBAL_POLICIES", () => {
  it("has at least 8 policies", () => {
    expect(SOVEREIGN_AI_GLOBAL_POLICIES.length).toBeGreaterThanOrEqual(8);
  });

  it("all policy IDs are unique", () => {
    const ids = SOVEREIGN_AI_GLOBAL_POLICIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all blocking policies have non-empty rules", () => {
    for (const policy of SOVEREIGN_AI_GLOBAL_POLICIES.filter((p) => p.enforcementLevel === "blocking")) {
      expect(policy.rule.length).toBeGreaterThan(10);
    }
  });
});

// ────────────────────────────────────────────────────────
// Namespace queries
// ────────────────────────────────────────────────────────

describe("getAiSystemsByNamespace", () => {
  it("returns only systems matching the namespace", () => {
    const ns = "ns-001";
    const systems = getAiSystemsByNamespace(ns);
    for (const system of systems) {
      expect(system.namespaceId).toBe(ns);
    }
  });

  it("returns empty array for unknown namespace", () => {
    expect(getAiSystemsByNamespace("ns-unknown")).toHaveLength(0);
  });
});

// ────────────────────────────────────────────────────────
// Knowledge Vault Registry
// ────────────────────────────────────────────────────────

describe("KNOWLEDGE_ITEMS", () => {
  it("has at least one item", () => {
    expect(KNOWLEDGE_ITEMS.length).toBeGreaterThan(0);
  });

  it("all item IDs are unique", () => {
    const ids = KNOWLEDGE_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no knowledge item data contains private credentials", () => {
    const FORBIDDEN = ["private_key", "password", "seed_phrase", "mnemonic", "ssn", "bank_account_number", "routing_number"];
    const serialized = JSON.stringify(KNOWLEDGE_ITEMS).toLowerCase();
    for (const word of FORBIDDEN) {
      expect(serialized).not.toContain(word);
    }
  });

  it("getKnowledgeItemsByNamespace returns items for a valid namespace", () => {
    const ns = "ns-001";
    const items = getKnowledgeItemsByNamespace(ns);
    for (const item of items) {
      expect(item.namespaceId).toBe(ns);
    }
  });

  it("getKnowledgeItemsByNamespace returns empty for unknown namespace", () => {
    expect(getKnowledgeItemsByNamespace("ns-unknown")).toHaveLength(0);
  });
});

describe("KNOWLEDGE_VAULTS", () => {
  it("has at least one vault", () => {
    expect(KNOWLEDGE_VAULTS.length).toBeGreaterThan(0);
  });

  it("getKnowledgeVaultByNamespace returns vault for known namespace", () => {
    const ns = KNOWLEDGE_VAULTS[0].namespaceId;
    const vault = getKnowledgeVaultByNamespace(ns);
    expect(vault).toBeDefined();
    expect(vault?.namespaceId).toBe(ns);
  });

  it("getKnowledgeVaultByNamespace returns undefined for unknown namespace", () => {
    expect(getKnowledgeVaultByNamespace("ns-unknown")).toBeUndefined();
  });
});

describe("KNOWLEDGE_SENSITIVITY_RULES", () => {
  it("all sensitivity rules have allowLiveAiRouting === false", () => {
    for (const rule of KNOWLEDGE_SENSITIVITY_RULES) {
      expect(rule.allowLiveAiRouting).toBe(false);
    }
  });

  it("healthcare_restricted sensitivity requires review and blocks live routing", () => {
    const rule = getSensitivityRule("healthcare_restricted");
    expect(rule).toBeDefined();
    expect(rule?.allowLiveAiRouting).toBe(false);
    expect(rule?.requiresReview).toBe(true);
  });

  it("financial_restricted sensitivity blocks live routing", () => {
    const rule = getSensitivityRule("financial_restricted");
    expect(rule).toBeDefined();
    expect(rule?.allowLiveAiRouting).toBe(false);
  });

  it("getSensitivityRule returns undefined for unknown sensitivity", () => {
    expect(getSensitivityRule("unknown_level" as TroptionsKnowledgeSensitivity)).toBeUndefined();
  });
});

// ────────────────────────────────────────────────────────
// Model Router
// ────────────────────────────────────────────────────────

describe("MODEL_ROUTES", () => {
  it("all routes have isAvailable === false", () => {
    for (const route of MODEL_ROUTES) {
      expect(route.isAvailable).toBe(false);
    }
  });

  it("all routes have simulationOnly === true", () => {
    for (const route of MODEL_ROUTES) {
      expect(route.simulationOnly).toBe(true);
    }
  });

  it("all routes have liveExecutionEnabled === false", () => {
    for (const route of MODEL_ROUTES) {
      expect(route.liveExecutionEnabled).toBe(false);
    }
  });

  it("all routes have externalApiCallsEnabled === false", () => {
    for (const route of MODEL_ROUTES) {
      expect(route.externalApiCallsEnabled).toBe(false);
    }
  });
});

describe("routeModel", () => {
  it("unknown provider is blocked", () => {
    const decision = routeModel("unknown_provider_xyz", "public", false);
    expect(decision.allowed).toBe(false);
    expect(decision.provider).toBe("blocked");
  });

  it("any known provider is blocked when externalApiCallsEnabled is false", () => {
    const decision = routeModel("openai_placeholder", "public", false);
    expect(decision.allowed).toBe(false);
  });

  it("sensitive data is blocked from external providers even when calls enabled", () => {
    const decision = routeModel("openai_placeholder", "healthcare_restricted", true);
    expect(decision.allowed).toBe(false);
  });

  it("routeModel always returns allowed: false (simulation phase)", () => {
    for (const route of MODEL_ROUTES) {
      const decision = routeModel(route.provider, "public", false);
      expect(decision.allowed).toBe(false);
    }
  });

  it("getRouteByProvider returns route for known provider", () => {
    const route = getRouteByProvider("troptions_placeholder");
    expect(route).toBeDefined();
    expect(route?.provider).toBe("troptions_placeholder");
  });

  it("getRouteByProvider returns undefined for unknown provider", () => {
    // @ts-expect-error testing invalid
    expect(getRouteByProvider("does-not-exist")).toBeUndefined();
  });

  it("getProviderLabel returns a non-empty string for all providers", () => {
    for (const route of MODEL_ROUTES) {
      const label = getProviderLabel(route.provider);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

// ────────────────────────────────────────────────────────
// Policy Engine
// ────────────────────────────────────────────────────────

describe("evaluateAiSystemPolicy", () => {
  const baseInput = {
    namespaceActive: true,
    membershipActive: true,
    aiSystem: SOVEREIGN_AI_SYSTEMS[0],
    dataSensitivities: [] as TroptionsKnowledgeSensitivity[],
    externalApiCallsEnabled: false,
    liveAutomationRequested: false,
  };

  it("always returns blockedForLive === true", () => {
    const decision = evaluateAiSystemPolicy(baseInput);
    expect(decision.blockedForLive).toBe(true);
  });

  it("live automation request always adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({ ...baseInput, liveAutomationRequested: true });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("live automation"))).toBe(true);
  });

  it("external provider with calls disabled adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({
      ...baseInput,
      requestedModelProvider: "openai_placeholder",
      externalApiCallsEnabled: false,
    });
    expect(decision.blockers.length).toBeGreaterThan(0);
  });

  it("inactive namespace adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({ ...baseInput, namespaceActive: false });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("namespace"))).toBe(true);
  });

  it("inactive membership adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({ ...baseInput, membershipActive: false });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("membership"))).toBe(true);
  });

  it("blocked AI system status adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({
      ...baseInput,
      aiSystem: { ...SOVEREIGN_AI_SYSTEMS[0], status: "blocked" as TroptionsSovereignAiStatus },
    });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("blocked"))).toBe(true);
  });

  it("pending_review AI system status adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({
      ...baseInput,
      aiSystem: { ...SOVEREIGN_AI_SYSTEMS[0], status: "pending_review" as TroptionsSovereignAiStatus },
    });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("pending"))).toBe(true);
  });

  it("control hub approval is always required in requiredApprovals", () => {
    const decision = evaluateAiSystemPolicy(baseInput);
    expect(decision.requiredApprovals.some((a) => a.toLowerCase().includes("control hub"))).toBe(true);
  });

  it("healthcare blocked tool adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({
      ...baseInput,
      aiSystem: { ...SOVEREIGN_AI_SYSTEMS[0], vertical: "healthcare_admin" as const },
      requestedTool: "medical_diagnosis",
    });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("medical_diagnosis") || b.toLowerCase().includes("blocked"))).toBe(true);
  });

  it("financial blocked tool adds a blocker", () => {
    const decision = evaluateAiSystemPolicy({
      ...baseInput,
      requestedTool: "investment_advisor",
    });
    expect(decision.blockers.some((b) => b.toLowerCase().includes("investment_advisor") || b.toLowerCase().includes("blocked"))).toBe(true);
  });

  it("decision includes required approvals list", () => {
    const decision = evaluateAiSystemPolicy(baseInput);
    expect(Array.isArray(decision.requiredApprovals)).toBe(true);
  });

  it("decision always has blockedForLive === true (simulation phase invariant)", () => {
    const decision = evaluateAiSystemPolicy(baseInput);
    expect(decision.blockedForLive).toBe(true);
    expect(decision.requiredApprovals.length).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────────────
// Brand safety (no outside ecosystems referenced)
// ────────────────────────────────────────────────────────

describe("Brand safety — Troptions-only content", () => {
  const FORBIDDEN_BRAND_WORDS = ["unykorn", "fth trading", "jefe coin", "kalishi", "apostle chain"];

  it("SOVEREIGN_AI_TEMPLATES contain no outside brand references", () => {
    const serialized = JSON.stringify(SOVEREIGN_AI_TEMPLATES).toLowerCase();
    for (const word of FORBIDDEN_BRAND_WORDS) {
      expect(serialized).not.toContain(word);
    }
  });

  it("SOVEREIGN_AI_SYSTEMS contain no outside brand references", () => {
    const serialized = JSON.stringify(SOVEREIGN_AI_SYSTEMS).toLowerCase();
    for (const word of FORBIDDEN_BRAND_WORDS) {
      expect(serialized).not.toContain(word);
    }
  });

  it("KNOWLEDGE_ITEMS contain no outside brand references", () => {
    const serialized = JSON.stringify(KNOWLEDGE_ITEMS).toLowerCase();
    for (const word of FORBIDDEN_BRAND_WORDS) {
      expect(serialized).not.toContain(word);
    }
  });
});
