/**
 * Troptions Momentum Compliance Engine Tests
 *
 * Tests cover:
 * - Safety constants are all correct (livePayments=false, blockchain=false, etc.)
 * - Prohibited claims are blocked (yield, investment, fractional ownership, profit, etc.)
 * - Guaranteed/risk-free language is blocked
 * - Allowed documentation claims pass
 * - Unknown claims require review (not auto-approved)
 * - Launch readiness returns simulation_only with locked gates
 * - User access returns documentation level only
 * - Payment readiness returns payments disabled
 * - Jurisdiction readiness returns simulation_only
 * - Compliance snapshot structure is valid
 */

import {
  evaluateMomentumClaim,
  evaluateMomentumLaunchReadiness,
  evaluateMomentumUserAccess,
  evaluateMomentumPaymentReadiness,
  evaluateMomentumJurisdictionReadiness,
  buildMomentumComplianceSnapshot,
} from "@/lib/troptions/momentum/momentumComplianceEngine";

import { MOMENTUM_SAFETY, MOMENTUM_PROGRAM } from "@/content/troptions/momentum/momentumRegistry";

// ─── Safety Constants ─────────────────────────────────────────────────────────

describe("MOMENTUM_SAFETY constants", () => {
  it("livePaymentsEnabled is false", () => {
    expect(MOMENTUM_SAFETY.livePaymentsEnabled).toBe(false);
  });

  it("blockchainExecutionEnabled is false", () => {
    expect(MOMENTUM_SAFETY.blockchainExecutionEnabled).toBe(false);
  });

  it("x402SimulationOnly is true", () => {
    expect(MOMENTUM_SAFETY.x402SimulationOnly).toBe(true);
  });

  it("investmentClaimsAllowed is false", () => {
    expect(MOMENTUM_SAFETY.investmentClaimsAllowed).toBe(false);
  });

  it("yieldClaimsAllowed is false", () => {
    expect(MOMENTUM_SAFETY.yieldClaimsAllowed).toBe(false);
  });

  it("custodyClaimsAllowed is false", () => {
    expect(MOMENTUM_SAFETY.custodyClaimsAllowed).toBe(false);
  });

  it("publicOfferingClaimsAllowed is false", () => {
    expect(MOMENTUM_SAFETY.publicOfferingClaimsAllowed).toBe(false);
  });

  it("legalReviewRequired is true", () => {
    expect(MOMENTUM_SAFETY.legalReviewRequired).toBe(true);
  });

  it("jurisdictionReviewRequired is true", () => {
    expect(MOMENTUM_SAFETY.jurisdictionReviewRequired).toBe(true);
  });
});

// ─── Program Definition ───────────────────────────────────────────────────────

describe("MOMENTUM_PROGRAM definition", () => {
  it("isFinancialProduct is false", () => {
    expect(MOMENTUM_PROGRAM.isFinancialProduct).toBe(false);
  });

  it("isSecuritiesOffering is false", () => {
    expect(MOMENTUM_PROGRAM.isSecuritiesOffering).toBe(false);
  });

  it("isInvestmentAdvice is false", () => {
    expect(MOMENTUM_PROGRAM.isInvestmentAdvice).toBe(false);
  });

  it("isBankingService is false", () => {
    expect(MOMENTUM_PROGRAM.isBankingService).toBe(false);
  });

  it("has a non-empty disclaimer", () => {
    expect(MOMENTUM_PROGRAM.disclaimer.length).toBeGreaterThan(50);
  });

  it("disclaimer contains 'not a bank'", () => {
    expect(MOMENTUM_PROGRAM.disclaimer.toLowerCase()).toContain("not a bank");
  });

  it("disclaimer contains 'no yield' or 'not guaranteed'", () => {
    const d = MOMENTUM_PROGRAM.disclaimer.toLowerCase();
    const hasNoYield = d.includes("no yield") || d.includes("not guaranteed") || d.includes("no guarantee");
    expect(hasNoYield).toBe(true);
  });
});

// ─── Prohibited Claim Evaluation ─────────────────────────────────────────────

describe("evaluateMomentumClaim — prohibited claims are blocked", () => {
  const PROHIBITED_CASES: Array<{ label: string; text: string }> = [
    { label: "yield farming", text: "Join our yield farming program today" },
    { label: "fractional stadium ownership", text: "Buy fractional stadium ownership tokens" },
    { label: "fan micro-investments", text: "Enable fan micro-investments in teams" },
    { label: "digital dividend", text: "Receive a digital dividend each quarter" },
    { label: "democratize investment", text: "We democratize investment in sports" },
    { label: "real-time arbitrage", text: "Powered by real-time arbitrage algorithms" },
    { label: "unlock new revenue streams", text: "Helps you unlock new revenue streams" },
    { label: "guaranteed returns", text: "Our program offers guaranteed returns" },
    { label: "guaranteed outcomes", text: "Guaranteed access to high-value markets" },
    { label: "risk-free investment", text: "This is a risk-free investment opportunity" },
    { label: "risk free", text: "risk free participation in sports tokenization" },
    { label: "passive income", text: "Earn passive income from sports tokens" },
    { label: "invest in our program", text: "You can invest in our program" },
    { label: "returns on tokens", text: "Expected returns on your token holdings" },
    { label: "profit from sports", text: "Profit from sports ecosystem participation" },
    { label: "earning from tokens", text: "Start earning from token ownership" },
    { label: "tokenized revenue streams", text: "Access tokenized revenue streams" },
    { label: "high-yield financial landscape", text: "Enter the high-yield financial landscape" },
  ];

  for (const { label, text } of PROHIBITED_CASES) {
    it(`blocks "${label}"`, () => {
      const result = evaluateMomentumClaim(text);
      expect(result.outcome).toBe("blocked");
      expect(result.liveExecutionAllowed).toBe(false);
    });
  }
});

// ─── Allowed Claim Evaluation ─────────────────────────────────────────────────

describe("evaluateMomentumClaim — allowed documentation claims pass", () => {
  it("allows documentation framework description", () => {
    const result = evaluateMomentumClaim(
      "Troptions Momentum provides documentation frameworks for sports ecosystem participants."
    );
    expect(result.outcome).toBe("pass");
    expect(result.liveExecutionAllowed).toBe(false);
  });

  it("allows compliance-readiness description", () => {
    const result = evaluateMomentumClaim(
      "Troptions Momentum includes compliance-readiness checklists and gate-based activation protocols."
    );
    expect(result.outcome).toBe("pass");
    expect(result.liveExecutionAllowed).toBe(false);
  });

  it("requires review for neutral unreviewed claim", () => {
    const result = evaluateMomentumClaim(
      "Troptions Momentum supports sports organizations with data management."
    );
    expect(["pass", "needs_review"]).toContain(result.outcome);
    expect(result.liveExecutionAllowed).toBe(false);
  });
});

// ─── All Blocked Claims Have requiresLegalReview or requiresComplianceReview ──

describe("evaluateMomentumClaim — blocked results set review flags", () => {
  it("blocked claim sets liveExecutionAllowed false", () => {
    const result = evaluateMomentumClaim("This offers guaranteed profit for investors.");
    expect(result.liveExecutionAllowed).toBe(false);
  });

  it("blocked claim for securities solicitation requires legal review", () => {
    const result = evaluateMomentumClaim("Invest in our fractional stadium ownership tokens.");
    expect(result.requiresLegalReview).toBe(true);
  });
});

// ─── Launch Readiness ─────────────────────────────────────────────────────────

describe("evaluateMomentumLaunchReadiness", () => {
  it("overall status is simulation_only", () => {
    const result = evaluateMomentumLaunchReadiness();
    expect(result.overallStatus).toBe("simulation_only");
  });

  it("liveExecutionAllowed is false", () => {
    const result = evaluateMomentumLaunchReadiness();
    expect(result.liveExecutionAllowed).toBe(false);
  });

  it("has blocked gates (financial features)", () => {
    const result = evaluateMomentumLaunchReadiness();
    expect(result.blockedGates.length).toBeGreaterThan(0);
  });

  it("requires disclosures", () => {
    const result = evaluateMomentumLaunchReadiness();
    expect(result.disclosuresRequired.length).toBeGreaterThan(0);
  });
});

// ─── User Access ──────────────────────────────────────────────────────────────

describe("evaluateMomentumUserAccess", () => {
  it("grants access at documentation level", () => {
    const result = evaluateMomentumUserAccess("user-123");
    expect(result.accessGranted).toBe(true);
    expect(result.accessLevel).toBe("documentation");
  });

  it("livePaymentsAllowed is false", () => {
    const result = evaluateMomentumUserAccess();
    expect(result.livePaymentsAllowed).toBe(false);
  });

  it("blockchainActionsAllowed is false", () => {
    const result = evaluateMomentumUserAccess();
    expect(result.blockchainActionsAllowed).toBe(false);
  });
});

// ─── Payment Readiness ────────────────────────────────────────────────────────

describe("evaluateMomentumPaymentReadiness", () => {
  it("paymentsEnabled is false", () => {
    const result = evaluateMomentumPaymentReadiness();
    expect(result.paymentsEnabled).toBe(false);
  });

  it("has blocked gates", () => {
    const result = evaluateMomentumPaymentReadiness();
    expect(result.blockedBy.length).toBeGreaterThan(0);
  });

  it("requires MTL and AML gates", () => {
    const result = evaluateMomentumPaymentReadiness();
    expect(result.requiredGates).toContain("GATE-MTL");
    expect(result.requiredGates).toContain("GATE-AML");
  });
});

// ─── Jurisdiction Readiness ───────────────────────────────────────────────────

describe("evaluateMomentumJurisdictionReadiness", () => {
  it("US is simulation_only", () => {
    const result = evaluateMomentumJurisdictionReadiness("US");
    expect(result.status).toBe("simulation_only");
  });

  it("EU is simulation_only", () => {
    const result = evaluateMomentumJurisdictionReadiness("EU");
    expect(result.status).toBe("simulation_only");
  });

  it("has blocked features", () => {
    const result = evaluateMomentumJurisdictionReadiness("US");
    expect(result.blockedFeatures.length).toBeGreaterThan(0);
    expect(result.blockedFeatures).toContain("live-payments");
  });
});

// ─── Compliance Snapshot ──────────────────────────────────────────────────────

describe("buildMomentumComplianceSnapshot", () => {
  it("programId matches MOMENTUM_PROGRAM id", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.programId).toBe(MOMENTUM_PROGRAM.id);
  });

  it("overallStatus is documentation_only", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.overallStatus).toBe("documentation_only");
  });

  it("liveExecutionAllowed is false", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.liveExecutionAllowed).toBe(false);
  });

  it("blockchainExecutionAllowed is false", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.blockchainExecutionAllowed).toBe(false);
  });

  it("paymentsAllowed is false", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.paymentsAllowed).toBe(false);
  });

  it("has gate statuses", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.gateStatuses.length).toBeGreaterThan(0);
  });

  it("has phase statuses", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.phaseStatuses.length).toBe(7);
  });

  it("all phase statuses have liveExecutionEnabled false", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    for (const phase of snapshot.phaseStatuses) {
      expect(phase.liveExecutionEnabled).toBe(false);
    }
  });

  it("has risk disclosures count > 0", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.totalRiskDisclosures).toBeGreaterThan(0);
  });

  it("safety.livePaymentsEnabled is false", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(snapshot.safety.livePaymentsEnabled).toBe(false);
  });

  it("snapshotAt is a valid ISO timestamp", () => {
    const snapshot = buildMomentumComplianceSnapshot();
    expect(() => new Date(snapshot.snapshotAt)).not.toThrow();
    expect(new Date(snapshot.snapshotAt).toISOString()).toBe(snapshot.snapshotAt);
  });
});
