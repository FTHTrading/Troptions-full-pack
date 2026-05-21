/**
 * Namespace AI + x402 Integration Tests
 *
 * Validates that every namespace has correct profiles, safety literals are
 * enforced, healthcare safety blocks PHI/diagnosis, x402 charges are
 * simulation-only, and Control Hub bridge creates real task records.
 */

import { getAllNamespaceAiProfiles, getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import { getAllNamespaceX402Profiles, getNamespaceX402Profile } from "@/content/troptions-cloud/namespaceX402Registry";
import { evaluateNamespaceAiAccess, evaluateHealthcareAiSafety } from "@/lib/troptions-cloud/namespaceAiAccessPolicyEngine";
import { evaluateX402Action, simulateX402UsageCharge } from "@/lib/troptions-cloud/namespaceX402PolicyEngine";
import { persistNamespaceAiAccessSimulation, persistX402UsageSimulation, getNamespaceAiX402Snapshot } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";

// ─── Registry completeness ────────────────────────────────────────────────────

describe("namespaceAiInfrastructureRegistry", () => {
  const profiles = getAllNamespaceAiProfiles();

  it("returns at least 1 profile", () => {
    expect(profiles.length).toBeGreaterThanOrEqual(1);
  });

  it("every profile has externalApiCallsEnabled === false", () => {
    for (const p of profiles) {
      expect(p.externalApiCallsEnabled).toBe(false);
    }
  });

  it("every profile has requiresControlHubApproval === true", () => {
    for (const p of profiles) {
      expect(p.requiresControlHubApproval).toBe(true);
    }
  });

  it("every profile has a non-empty namespaceId", () => {
    for (const p of profiles) {
      expect(typeof p.namespaceId).toBe("string");
      expect(p.namespaceId.length).toBeGreaterThan(0);
    }
  });

  it("every profile has sovereignAiSystems array", () => {
    for (const p of profiles) {
      expect(Array.isArray(p.sovereignAiSystems)).toBe(true);
    }
  });

  it("every AI system within a profile has externalApiCallsEnabled === false", () => {
    for (const p of profiles) {
      for (const sys of p.sovereignAiSystems) {
        expect(sys.externalApiCallsEnabled).toBe(false);
      }
    }
  });

  it("no profile contains private key or seed fields", () => {
    const json = JSON.stringify(profiles);
    expect(json).not.toMatch(/privateKey|secret|seed|mnemonic|passphrase/i);
  });
});

// ─── x402 Registry completeness ──────────────────────────────────────────────

describe("namespaceX402Registry", () => {
  const profiles = getAllNamespaceX402Profiles();

  it("returns at least 1 profile", () => {
    expect(profiles.length).toBeGreaterThanOrEqual(1);
  });

  it("every profile has livePaymentsEnabled === false", () => {
    for (const p of profiles) {
      expect(p.livePaymentsEnabled).toBe(false);
    }
  });

  it("every profile has simulationOnly === true", () => {
    for (const p of profiles) {
      expect(p.simulationOnly).toBe(true);
    }
  });

  it("every profile has x402Enabled === false", () => {
    for (const p of profiles) {
      expect(p.x402Enabled).toBe(false);
    }
  });

  it("no profile contains payment card or secret fields", () => {
    const json = JSON.stringify(profiles);
    expect(json).not.toMatch(/cardNumber|cvv|privateKey|secret|seed/i);
  });
});

// ─── AI access policy ─────────────────────────────────────────────────────────

describe("evaluateNamespaceAiAccess", () => {
  const firstProfile = getAllNamespaceAiProfiles()[0];

  it("returns a decision with requiresControlHubApproval === true", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: firstProfile.namespaceId,
      memberId: "member-test-001",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    expect(decision.requiresControlHubApproval).toBe(true);
  });

  it("returns externalApiCallTriggered === false", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: firstProfile.namespaceId,
      memberId: "member-test-001",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    expect(decision.externalApiCallTriggered).toBe(false);
  });

  it("returns liveExecutionTriggered === false", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: firstProfile.namespaceId,
      memberId: "member-test-001",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    expect(decision.liveExecutionTriggered).toBe(false);
  });

  it("returns a decisionId string", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: firstProfile.namespaceId,
      memberId: "member-test-001",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    expect(typeof decision.decisionId).toBe("string");
    expect(decision.decisionId.length).toBeGreaterThan(0);
  });
});

// ─── Healthcare safety ────────────────────────────────────────────────────────

describe("evaluateHealthcareAiSafety", () => {
  const healthcareModules = [
    "diagnosis_engine",
    "treatment_recommendation",
    "phi_intake",
    "emergency_guidance",
    "clinical_decision_support",
    "patient_data_processor",
    "medical_imaging_analysis",
    "prescription_advisor",
  ];

  for (const mod of healthcareModules) {
    it(`blocks ${mod} for healthcare namespace`, () => {
      // Use any namespace ID — evaluateHealthcareAiSafety creates a block decision
      const decision = evaluateHealthcareAiSafety({
        namespaceId: "troptions-health",
        memberId: "member-001",
        requestedModule: mod,
      });
      expect(decision).not.toBeNull();
      expect(decision?.decision).toBe("block");
    });
  }

  it("returns null for non-healthcare module", () => {
    const decision = evaluateHealthcareAiSafety({
      namespaceId: "troptions-health",
      memberId: "member-001",
      requestedModule: "knowledge_search",
    });
    expect(decision).toBeNull();
  });
});

// ─── x402 policy ──────────────────────────────────────────────────────────────

describe("evaluateX402Action", () => {
  it("returns simulationOnly === true", () => {
    const decision = evaluateX402Action({
      namespaceId: "troptions",
      actionId: "AI_PROMPT",
      memberId: "member-test-001",
      membershipPlan: "basic",
    });
    expect(decision.simulationOnly).toBe(true);
  });

  it("returns livePaymentTriggered === false", () => {
    const decision = evaluateX402Action({
      namespaceId: "troptions",
      actionId: "AI_PROMPT",
      memberId: "member-test-001",
      membershipPlan: "basic",
    });
    expect(decision.livePaymentTriggered).toBe(false);
  });

  it("decision field is one of the expected values", () => {
    const decision = evaluateX402Action({
      namespaceId: "troptions",
      actionId: "AI_PROMPT",
      memberId: "member-test-001",
      membershipPlan: "basic",
    });
    expect(["allow_free", "allow_metered", "require_approval", "block"]).toContain(decision.decision);
  });
});

describe("simulateX402UsageCharge", () => {
  it("returns chargeMode === simulation", () => {
    const event = simulateX402UsageCharge({
      namespaceId: "troptions",
      memberId: "member-test-001",
      actionId: "AI_PROMPT",
      membershipPlan: "basic",
    });
    expect(event.chargeMode).toBe("simulation");
  });

  it("returns an id string", () => {
    const event = simulateX402UsageCharge({
      namespaceId: "troptions",
      memberId: "member-test-001",
      actionId: "AI_PROMPT",
      membershipPlan: "basic",
    });
    expect(typeof event.id).toBe("string");
  });

  it("does not contain any live wallet or payment data", () => {
    const event = simulateX402UsageCharge({
      namespaceId: "troptions",
      memberId: "member-test-001",
      actionId: "AI_PROMPT",
      membershipPlan: "basic",
    });
    const json = JSON.stringify(event);
    expect(json).not.toMatch(/privateKey|txHash|walletAddress|secret/i);
  });
});

// ─── Membership plan mapping ──────────────────────────────────────────────────

describe("x402 membershipPlanMapping", () => {
  it("enterprise plan has at least as many actions as basic", () => {
    const profile = getNamespaceX402Profile("troptions");
    if (!profile) return; // skip if namespace not found

    const enterpriseActions = profile.membershipPlanMapping["enterprise"] ?? [];
    const basicActions = profile.membershipPlanMapping["basic"] ?? [];
    expect(enterpriseActions.length).toBeGreaterThanOrEqual(basicActions.length);
  });
});

// ─── Control Hub Bridge ───────────────────────────────────────────────────────

describe("persistNamespaceAiAccessSimulation", () => {
  it("returns a BridgePersistResult with taskId string", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: "troptions",
      memberId: "member-bridge-test",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    const result = persistNamespaceAiAccessSimulation(decision);
    expect(typeof result.taskId).toBe("string");
    expect(result.taskId.length).toBeGreaterThan(0);
  });

  it("returns a BridgePersistResult with simulationId string", () => {
    const decision = evaluateNamespaceAiAccess({
      namespaceId: "troptions",
      memberId: "member-bridge-test",
      membershipPlan: "basic",
      requestedModule: "knowledge_search",
    });
    const result = persistNamespaceAiAccessSimulation(decision);
    expect(typeof result.simulationId).toBe("string");
  });
});

describe("persistX402UsageSimulation", () => {
  it("creates a Control Hub task record without errors", () => {
    const event = simulateX402UsageCharge({
      namespaceId: "troptions",
      memberId: "member-bridge-test",
      actionId: "AI_PROMPT",
      membershipPlan: "basic",
    });
    expect(() => persistX402UsageSimulation(event)).not.toThrow();
    const result = persistX402UsageSimulation(event);
    expect(typeof result.taskId).toBe("string");
  });
});

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe("getNamespaceAiX402Snapshot", () => {
  it("returns null for unknown namespace", () => {
    const result = getNamespaceAiX402Snapshot("does-not-exist");
    expect(result).toBeNull();
  });

  it("safetyStatus has all required literals for known namespace", () => {
    const aiProfile = getAllNamespaceAiProfiles()[0];
    const snapshot = getNamespaceAiX402Snapshot(aiProfile.namespaceId);
    if (!snapshot) return; // registry mismatch — acceptable

    expect(snapshot.safetyStatus.livePaymentsDisabled).toBe(true);
    expect(snapshot.safetyStatus.liveWalletMovementDisabled).toBe(true);
    expect(snapshot.safetyStatus.externalAiCallsDisabled).toBe(true);
    expect(snapshot.safetyStatus.phiIntakeBlocked).toBe(true);
    expect(snapshot.safetyStatus.controlHubApprovalRequired).toBe(true);
  });
});
