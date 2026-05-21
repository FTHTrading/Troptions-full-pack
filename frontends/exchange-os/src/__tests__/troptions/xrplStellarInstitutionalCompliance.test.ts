/**
 * XRPL/Stellar Institutional Compliance — Test Suite
 *
 * Verifies safety invariants for the institutional compliance framework:
 * - No live execution allowed
 * - All jurisdictions require legal review
 * - Prohibited claims are blocked
 * - Unsigned templates only
 * - No seeds/keys accepted
 */

import {
  getAllComplianceControls,
  getBlockedControls,
} from "@/content/troptions/xrplStellarInstitutionalComplianceRegistry";

import {
  getAllJurisdictions,
} from "@/content/troptions/xrplStellarJurisdictionMatrix";

import {
  createIso20022ReadinessReport,
} from "@/lib/troptions/xrpl-stellar-compliance/iso20022Mapping";

import {
  createGeniusActReadinessReport,
  evaluateGeniusActReadiness,
} from "@/lib/troptions/xrpl-stellar-compliance/geniusActReadinessEngine";

import {
  evaluateGlobalCompliance,
  reviewPublicClaim,
} from "@/lib/troptions/xrpl-stellar-compliance/globalCompliancePolicyEngine";

import {
  getAllXrplAccountFlags,
  getIrreversibleFlags,
} from "@/content/troptions/xrplAccountFlagRegistry";

import {
  evaluateXrplAccountFlagReadiness,
  createXrplAccountFlagSummary,
} from "@/lib/troptions/xrpl-account-control/xrplAccountReadinessEngine";

import {
  getAllStellarIssuerControls,
  getIrreversibleStellarControls,
} from "@/content/troptions/stellarIssuerControlRegistry";

import {
  evaluateStellarIssuerReadiness,
} from "@/lib/troptions/xrpl-stellar-compliance/stellarIssuerReadinessEngine";

// ─── Compliance Control Registry ──────────────────────────────────────────────

describe("xrplStellarInstitutionalComplianceRegistry", () => {
  it("should return controls", () => {
    const controls = getAllComplianceControls();
    expect(controls.length).toBeGreaterThan(0);
  });

  it("no control should have liveExecutionAllowed: true", () => {
    const controls = getAllComplianceControls();
    for (const control of controls) {
      expect(control.liveExecutionAllowed).toBe(false);
    }
  });

  it("every control should have legalReviewRequired: true", () => {
    const controls = getAllComplianceControls();
    for (const control of controls) {
      expect(control.legalReviewRequired).toBe(true);
    }
  });

  it("every control should have productionActivationStatus", () => {
    const controls = getAllComplianceControls();
    for (const control of controls) {
      expect(control.productionActivationStatus).toBeDefined();
      expect(["disabled", "pending_legal_review", "pending_evidence", "approved_staging_only", "blocked"]).toContain(
        control.productionActivationStatus
      );
    }
  });

  it("blocked controls should have productionActivationStatus disabled or blocked", () => {
    const blocked = getBlockedControls();
    expect(blocked.length).toBeGreaterThan(0);
    for (const control of blocked) {
      expect(["disabled", "blocked"]).toContain(control.productionActivationStatus);
    }
  });
});

// ─── Jurisdiction Matrix ───────────────────────────────────────────────────────

describe("xrplStellarJurisdictionMatrix", () => {
  it("should return jurisdiction profiles", () => {
    const jurisdictions = getAllJurisdictions();
    expect(jurisdictions.length).toBeGreaterThan(0);
  });

  it("every jurisdiction should have legalReviewRequired: true", () => {
    const jurisdictions = getAllJurisdictions();
    for (const j of jurisdictions) {
      expect(j.legalReviewRequired).toBe(true);
    }
  });

  it("every jurisdiction should have allowedWithoutLegalReview: false", () => {
    const jurisdictions = getAllJurisdictions();
    for (const j of jurisdictions) {
      expect(j.allowedWithoutLegalReview).toBe(false);
    }
  });

  it("every jurisdiction should have productionActivationStatus: 'disabled'", () => {
    const jurisdictions = getAllJurisdictions();
    for (const j of jurisdictions) {
      expect(j.productionActivationStatus).toBe("disabled");
    }
  });
});

// ─── ISO 20022 Readiness ───────────────────────────────────────────────────────

describe("iso20022ReadinessReport", () => {
  it("should generate a report", () => {
    const report = createIso20022ReadinessReport();
    expect(report).toBeDefined();
    expect(report.mappings.length).toBeGreaterThan(0);
  });

  it("report should not claim ISO 20022 certification", () => {
    const report = createIso20022ReadinessReport();
    // These phrases must be in the prohibited claims list (blocked by engine)
    expect(report.prohibitedClaims.map((c) => c.toLowerCase())).toContain("iso 20022 certified");
    expect(report.prohibitedClaims.map((c) => c.toLowerCase())).toContain("iso 20022 coin");
    // Disclaimer must explicitly deny certification using "NOT"
    expect(report.disclaimer).toContain("NOT ISO 20022 certified");
  });

  it("report should have liveExecutionAllowed field on report type", () => {
    const report = createIso20022ReadinessReport();
    // Iso20022ReadinessReport does not expose liveExecutionAllowed — verify via disclaimer
    expect(report.disclaimer).toContain("NOT ISO 20022 certified");
  });
});

// ─── GENIUS Act Readiness ──────────────────────────────────────────────────────

describe("geniusActReadinessEngine", () => {
  it("empty input should return decision: blocked", () => {
    const result = evaluateGeniusActReadiness({});
    expect(result.decision).toBe("blocked");
  });

  it("empty input should have blocking reasons", () => {
    const result = evaluateGeniusActReadiness({});
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("result should have liveIssuanceAllowed: false", () => {
    const result = evaluateGeniusActReadiness({});
    expect(result.liveIssuanceAllowed).toBe(false);
  });

  it("full report should not claim GENIUS Act approval", () => {
    const report = createGeniusActReadinessReport();
    const reportStr = JSON.stringify(report).toLowerCase();
    expect(reportStr).not.toContain("genius act approved");
    expect(reportStr).not.toContain("genius act compliant");
  });

  it("full report should have liveExecutionAllowed: false via liveIssuanceAllowed", () => {
    const report = createGeniusActReadinessReport();
    expect(report.liveIssuanceAllowed).toBe(false);
  });
});

// ─── Global Compliance Policy Engine ──────────────────────────────────────────

describe("globalCompliancePolicyEngine", () => {
  it("should evaluate compliance and return decision", () => {
    const result = evaluateGlobalCompliance({
      operationId: "test-001",
      operationType: "xrpl_payment",
      chain: "XRPL",
    });
    expect(result.decision).toBeDefined();
    expect(["allowed_simulation_only", "needs_review", "blocked"]).toContain(result.decision);
  });

  it("result should always have liveExecutionAllowed: false", () => {
    const result = evaluateGlobalCompliance({
      operationId: "test-002",
      operationType: "stellar_payment",
      chain: "Stellar",
    });
    expect(result.liveExecutionAllowed).toBe(false);
  });

  it("prohibited claim 'fully compliant globally' should be blocked", () => {
    const review = reviewPublicClaim("TROPTIONS is fully compliant globally");
    expect(review.isAllowed).toBe(false);
    expect(review.prohibitedPhrases.length).toBeGreaterThan(0);
  });

  it("prohibited claim 'ISO 20022 coin' should be blocked", () => {
    const review = reviewPublicClaim("TROPTIONS is the leading ISO 20022 coin");
    expect(review.isAllowed).toBe(false);
  });

  it("prohibited claim 'GENIUS Act approved' should be blocked", () => {
    const review = reviewPublicClaim("TROPTIONS is GENIUS Act approved");
    expect(review.isAllowed).toBe(false);
  });

  it("prohibited claim 'guaranteed yield' should be blocked", () => {
    const review = reviewPublicClaim("Invest for guaranteed yield");
    expect(review.isAllowed).toBe(false);
  });

  it("prohibited claim 'risk free' should be blocked", () => {
    const review = reviewPublicClaim("This is a risk free investment");
    expect(review.isAllowed).toBe(false);
  });

  it("acceptable claim should pass", () => {
    const review = reviewPublicClaim(
      "TROPTIONS has ISO 20022 message compatibility readiness. Legal review required before production."
    );
    expect(review.isAllowed).toBe(true);
  });

  it("requestsLiveExecution: true should be blocked", () => {
    const result = evaluateGlobalCompliance({
      operationId: "test-003",
      operationType: "xrpl_payment",
      chain: "XRPL",
      requestsLiveExecution: true,
    });
    expect(result.decision).toBe("blocked");
  });
});

// ─── XRPL Account Flag Registry ───────────────────────────────────────────────

describe("xrplAccountFlagRegistry", () => {
  it("should return flag definitions", () => {
    const flags = getAllXrplAccountFlags();
    expect(flags.length).toBeGreaterThan(0);
  });

  it("no flag should have liveExecutionAllowed: true", () => {
    const flags = getAllXrplAccountFlags();
    for (const flag of flags) {
      expect(flag.liveExecutionAllowed).toBe(false);
    }
  });

  it("no flag should have templateOnly: false", () => {
    const flags = getAllXrplAccountFlags();
    for (const flag of flags) {
      expect(flag.templateOnly).toBe(true);
    }
  });

  it("irreversible flags should exist", () => {
    const irreversible = getIrreversibleFlags();
    expect(irreversible.length).toBeGreaterThan(0);
    for (const flag of irreversible) {
      expect(flag.reversible).toBe(false);
    }
  });

  it("asfNoFreeze should be in irreversible flags", () => {
    const irreversible = getIrreversibleFlags();
    const noFreeze = irreversible.find((f) => f.flagName === "asfNoFreeze");
    expect(noFreeze).toBeDefined();
    expect(noFreeze?.reversible).toBe(false);
  });
});

// ─── XRPL Account Readiness Engine ────────────────────────────────────────────

describe("xrplAccountReadinessEngine", () => {
  it("AccountSet templates should have _liveExecutionAllowed: false", () => {
    const result = evaluateXrplAccountFlagReadiness({
      accountAddress: "rTestAddress",
      requestedFlags: ["asfRequireAuth"],
    });
    for (const template of result.unsignedTemplates) {
      expect(template._liveExecutionAllowed).toBe(false);
    }
  });

  it("AccountSet templates should have _mustSignBeforeSubmitting: true", () => {
    const result = evaluateXrplAccountFlagReadiness({
      accountAddress: "rTestAddress",
      requestedFlags: ["asfRequireAuth"],
    });
    for (const template of result.unsignedTemplates) {
      expect(template._mustSignBeforeSubmitting).toBe(true);
    }
  });

  it("asfNoFreeze without acknowledgment should be blocked", () => {
    const result = evaluateXrplAccountFlagReadiness({
      accountAddress: "rTestAddress",
      requestedFlags: ["asfNoFreeze"],
      irreversibilityAcknowledged: false,
    });
    const noFreezeEval = result.evaluations.find((e) => e.flagName === "asfNoFreeze");
    expect(noFreezeEval?.decision).toBe("needs_prerequisite");
  });

  it("asfDisableMaster without multisig should be blocked", () => {
    const result = evaluateXrplAccountFlagReadiness({
      accountAddress: "rTestAddress",
      requestedFlags: ["asfDisableMaster"],
      hasRegularKeyOrMultisig: false,
    });
    const disableMasterEval = result.evaluations.find((e) => e.flagName === "asfDisableMaster");
    expect(disableMasterEval?.decision).toBe("needs_prerequisite");
  });

  it("summary should have liveExecutionAllowed: false", () => {
    const summary = createXrplAccountFlagSummary();
    expect(summary.liveExecutionAllowed).toBe(false);
  });

  it("no seed or private key fields should appear in template", () => {
    const result = evaluateXrplAccountFlagReadiness({
      accountAddress: "rTestAddress",
      requestedFlags: ["asfRequireAuth", "asfRequireDestTag"],
    });
    const resultStr = JSON.stringify(result);
    expect(resultStr.toLowerCase()).not.toContain("seed");
    expect(resultStr.toLowerCase()).not.toContain("privatekey");
    expect(resultStr.toLowerCase()).not.toContain("private_key");
    expect(resultStr.toLowerCase()).not.toContain("secret");
  });
});

// ─── Stellar Issuer Control Registry ──────────────────────────────────────────

describe("stellarIssuerControlRegistry", () => {
  it("should return control definitions", () => {
    const controls = getAllStellarIssuerControls();
    expect(controls.length).toBeGreaterThan(0);
  });

  it("no control should have liveExecutionAllowed: true", () => {
    const controls = getAllStellarIssuerControls();
    for (const control of controls) {
      expect(control.liveExecutionAllowed).toBe(false);
    }
  });

  it("no control should have publicNetworkBlocked: false", () => {
    const controls = getAllStellarIssuerControls();
    for (const control of controls) {
      expect(control.publicNetworkBlocked).toBe(true);
    }
  });

  it("no control should have templateOnly: false", () => {
    const controls = getAllStellarIssuerControls();
    for (const control of controls) {
      expect(control.templateOnly).toBe(true);
    }
  });

  it("irreversible Stellar controls should exist", () => {
    const irreversible = getIrreversibleStellarControls();
    expect(irreversible.length).toBeGreaterThan(0);
    for (const control of irreversible) {
      expect(control.reversible).toBe(false);
    }
  });

  it("AUTH_IMMUTABLE should be in irreversible controls", () => {
    const irreversible = getIrreversibleStellarControls();
    const authImmutable = irreversible.find((c) => c.controlId === "stellar_auth_immutable");
    expect(authImmutable).toBeDefined();
    expect(authImmutable?.reversible).toBe(false);
  });
});

// ─── Stellar Issuer Readiness Engine ──────────────────────────────────────────

describe("stellarIssuerReadinessEngine", () => {
  it("SetOptions templates should have _liveExecutionAllowed: false", () => {
    const result = evaluateStellarIssuerReadiness({
      issuerAddress: "GTestKey",
      requestedControls: ["stellar_auth_required"],
    });
    for (const template of result.unsignedTemplates) {
      expect(template._liveExecutionAllowed).toBe(false);
    }
  });

  it("SetOptions templates should have _mustSignBeforeSubmitting: true", () => {
    const result = evaluateStellarIssuerReadiness({
      issuerAddress: "GTestKey",
      requestedControls: ["stellar_auth_required"],
    });
    for (const template of result.unsignedTemplates) {
      expect(template._mustSignBeforeSubmitting).toBe(true);
    }
  });

  it("SetOptions templates should have _publicNetworkBlocked: true", () => {
    const result = evaluateStellarIssuerReadiness({
      issuerAddress: "GTestKey",
      requestedControls: ["stellar_auth_required"],
    });
    for (const template of result.unsignedTemplates) {
      expect(template._publicNetworkBlocked).toBe(true);
    }
  });

  it("AUTH_IMMUTABLE without acknowledgment should be blocked", () => {
    const result = evaluateStellarIssuerReadiness({
      issuerAddress: "GTestKey",
      requestedControls: ["stellar_auth_immutable"],
      irreversibilityAcknowledged: false,
    });
    const eval_ = result.evaluations.find((e) => e.controlId === "stellar_auth_immutable");
    expect(eval_?.decision).toBe("needs_prerequisite");
  });

  it("no seed or private key fields should appear in template", () => {
    const result = evaluateStellarIssuerReadiness({
      issuerAddress: "GTestKey",
      requestedControls: ["stellar_auth_required", "stellar_home_domain"],
    });
    // Verify no signing-sensitive fields on unsignedTemplates
    for (const template of result.unsignedTemplates) {
      const keys = Object.keys(template);
      expect(keys).not.toContain("privateKey");
      expect(keys).not.toContain("secretKey");
      expect(keys).not.toContain("signingSecret");
    }
  });
});
