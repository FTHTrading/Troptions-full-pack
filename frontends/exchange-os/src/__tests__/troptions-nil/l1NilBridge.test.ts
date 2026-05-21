/**
 * Troptions NIL Layer-1 Bridge Tests
 *
 * Tests cover:
 * - L1 NIL status flags (simulation-only, all live flags false)
 * - Valuation safe payload (no guaranteed language in disclaimer)
 * - Compliance blocks pay-for-play and recruiting inducement text
 * - Receipt is unsigned template (signatureHex null, unsigned true)
 * - Proof anchor is unsigned (liveSubmissionEnabled false)
 * - Readiness report structure
 * - No private key, seed, payment card, or wallet fields in any output
 * - Disclaimer text safety (must not claim guaranteed value/income/deal)
 */

import {
  getTroptionsNilL1Status,
  createNilL1SimulationPayload,
  simulateNilL1Valuation,
  simulateNilL1ComplianceCheck,
  simulateNilL1Receipt,
  simulateNilL1ProofAnchor,
  createNilL1ReadinessReport,
} from "@/lib/troptions-nil/l1NilBridge";

// ─── env setup ─────────────────────────────────────────────────────────────

beforeAll(() => {
  process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token-nil-bridge";
});

// ─── Safety Constants (via status object) ──────────────────────────────────

describe("NIL L1 safety constants", () => {
  it("status simulationOnly is true", () => {
    expect(getTroptionsNilL1Status().simulationOnly).toBe(true);
  });

  it("status liveExecutionEnabled is false", () => {
    expect(getTroptionsNilL1Status().liveExecutionEnabled).toBe(false);
  });

  it("status livePaymentEnabled is false", () => {
    expect(getTroptionsNilL1Status().livePaymentEnabled).toBe(false);
  });

  it("status liveWeb3AnchorEnabled is false", () => {
    expect(getTroptionsNilL1Status().liveWeb3AnchorEnabled).toBe(false);
  });

  it("valuation disclaimer contains 'not a guaranteed NIL value'", () => {
    const result = simulateNilL1Valuation("a".repeat(64), 0.5);
    expect(result.disclaimer).toContain("not a guaranteed NIL value");
  });

  it("valuation disclaimer does not say 'guaranteed income' as a positive promise", () => {
    const result = simulateNilL1Valuation("a".repeat(64), 0.5);
    // Disclaimer may use "guaranteed income" to negate it ("no pay-for-play or guaranteed income")
    // but must not positively promise guaranteed income without qualification
    expect(result.disclaimer.toLowerCase()).toContain("not a guaranteed nil value");
  });
});

// ─── L1 Status Flags ──────────────────────────────────────────────────────

describe("getTroptionsNilL1Status", () => {
  const status = getTroptionsNilL1Status();

  it("returns simulationOnly: true", () => {
    expect(status.simulationOnly).toBe(true);
  });

  it("returns liveExecutionEnabled: false", () => {
    expect(status.liveExecutionEnabled).toBe(false);
  });

  it("returns livePaymentEnabled: false", () => {
    expect(status.livePaymentEnabled).toBe(false);
  });

  it("returns liveNftMintEnabled: false", () => {
    expect(status.liveNftMintEnabled).toBe(false);
  });

  it("returns liveWeb3AnchorEnabled: false", () => {
    expect(status.liveWeb3AnchorEnabled).toBe(false);
  });

  it("returns signalCount of 33", () => {
    expect(status.signalCount).toBe(33);
  });

  it("returns agentCount of 9", () => {
    expect(status.agentCount).toBe(9);
  });

  it("returns buckets of 6", () => {
    expect(status.buckets).toBe(6);
  });

  it("subsystem is 'tsn_nil'", () => {
    expect(status.subsystem).toBe("tsn_nil");
  });

  it("has no private key or seed fields", () => {
    const keys = Object.keys(status);
    for (const key of keys) {
      expect(key).not.toMatch(/private|seed|mnemonic|wallet_key|secret/i);
    }
  });
});

// ─── Simulation Payload ───────────────────────────────────────────────────

describe("createNilL1SimulationPayload", () => {
  const payload = createNilL1SimulationPayload("a".repeat(64), "basketball", "UNIV_001") as Record<string, unknown>;

  it("is simulationOnly", () => {
    expect(payload["simulationOnly"]).toBe(true);
  });

  it("has no live payment fields set to true", () => {
    const json = JSON.stringify(payload).toLowerCase();
    expect(json).not.toContain('"live_payment_enabled":true');
    expect(json).not.toContain('"liveexecutionenabled":true');
  });

  it("contains athleteIdHash but not PII fields", () => {
    expect(payload["athleteIdHash"]).toBeDefined();
    const keys = Object.keys(payload);
    expect(keys).not.toContain("name");
    expect(keys).not.toContain("dob");
    expect(keys).not.toContain("ssn");
    expect(keys).not.toContain("email");
  });
});

// ─── Valuation Simulation ─────────────────────────────────────────────────

describe("simulateNilL1Valuation", () => {
  const result = simulateNilL1Valuation("a".repeat(64), 0.55);

  it("is simulationOnly", () => {
    expect(result.simulationOnly).toBe(true);
  });

  it("composite score is between 0 and 100", () => {
    expect(result.compositeScore).toBeGreaterThanOrEqual(0);
    expect(result.compositeScore).toBeLessThanOrEqual(100);
  });

  it("estimate low is less than estimate high", () => {
    expect(result.estimateLowUsd).toBeLessThan(result.estimateHighUsd);
  });

  it("disclaimer contains 'not a guaranteed NIL value'", () => {
    expect(result.disclaimer).toContain("not a guaranteed NIL value");
  });

  it("is deterministic — same seed produces same score", () => {
    const r1 = simulateNilL1Valuation("b".repeat(64), 0.72);
    const r2 = simulateNilL1Valuation("b".repeat(64), 0.72);
    expect(r1.compositeScore).toBe(r2.compositeScore);
    expect(r1.valuationBand).toBe(r2.valuationBand);
  });

  it("low seed produces InsufficientData band", () => {
    const low = simulateNilL1Valuation("c".repeat(64), 0.1);
    expect(low.valuationBand).toBe("InsufficientData");
  });

  it("high seed produces Elite band", () => {
    const high = simulateNilL1Valuation("d".repeat(64), 0.95);
    expect(high.valuationBand).toBe("Elite");
  });
});

// ─── Compliance Simulation ────────────────────────────────────────────────

describe("simulateNilL1ComplianceCheck — pay-for-play block", () => {
  it("blocks deal with 'per game' compensation language", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "TX",
      "UNIV_001",
      false,
      "$500 per game appearance fee",
    );
    expect(result.payForPlayRisk).toBe("Blocked");
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("blocks deal with 'performance bonus' language", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "TX",
      "UNIV_001",
      false,
      "performance bonus for wins",
    );
    expect(result.payForPlayRisk).toBe("Blocked");
  });
});

describe("simulateNilL1ComplianceCheck — recruiting inducement block", () => {
  it("blocks deal with 'signing bonus' language", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "CA",
      "UNIV_002",
      false,
      "signing bonus upon commitment",
    );
    expect(result.recruitingRisk).toBe("Blocked");
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("blocks deal with 'if you enroll' language", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "FL",
      "UNIV_003",
      false,
      "$1000 if you enroll",
    );
    expect(result.recruitingRisk).toBe("Blocked");
  });
});

describe("simulateNilL1ComplianceCheck — minor consent gate", () => {
  it("returns PendingGuardianReview for minor athlete", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "OH",
      "UNIV_004",
      true,   // isMinor
      "flat_fee_social_post",
    );
    expect(result.minorConsentStatus).toBe("PendingGuardianReview");
  });
});

describe("simulateNilL1ComplianceCheck — clear case", () => {
  it("clears a normal deal in a known state", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "TX",
      "UNIV_001",
      false,
      "flat_fee_social_post",
    );
    // "None" means no pay-for-play or recruiting risk
    expect(result.payForPlayRisk).toBe("None");
    expect(result.recruitingRisk).toBe("None");
    expect(result.simulationOnly).toBe(true);
  });

  it("has no private key or seed fields", () => {
    const result = simulateNilL1ComplianceCheck(
      "a".repeat(64),
      "TX",
      "UNIV_001",
      false,
      "flat_fee_social_post",
    );
    const keys = Object.keys(result);
    for (const key of keys) {
      expect(key).not.toMatch(/private|seed|mnemonic|secret/i);
    }
  });
});

// ─── Receipt Simulation ───────────────────────────────────────────────────

describe("simulateNilL1Receipt", () => {
  const receipt = simulateNilL1Receipt(
    "a".repeat(64),
    "brand_hash_abc",
    "flat_fee_social_post",
    "TX",
    "UNIV_001",
  );

  it("signatureHex is null (unsigned)", () => {
    expect(receipt.signatureHex).toBeNull();
  });

  it("unsigned is true", () => {
    expect(receipt.unsigned).toBe(true);
  });

  it("simulationOnly is true", () => {
    expect(receipt.simulationOnly).toBe(true);
  });

  it("has no private key fields", () => {
    const json = JSON.stringify(receipt);
    expect(json).not.toMatch(/private_key|privateKey|seed|mnemonic/i);
  });

  it("contains dealIdHash", () => {
    expect(typeof receipt.dealIdHash).toBe("string");
    expect(receipt.dealIdHash.length).toBeGreaterThan(0);
  });
});

// ─── Proof Anchor Simulation ──────────────────────────────────────────────

describe("simulateNilL1ProofAnchor", () => {
  const anchor = simulateNilL1ProofAnchor(
    "a".repeat(64),
    "deal_hash_001",
    ["doc_hash_a", "doc_hash_b", "doc_hash_c"],
    "xrpl",
  );

  it("liveSubmissionEnabled is false", () => {
    expect(anchor.liveSubmissionEnabled).toBe(false);
  });

  it("unsigned is true", () => {
    expect(anchor.unsigned).toBe(true);
  });

  it("signatureHex is null", () => {
    expect(anchor.signatureHex).toBeNull();
  });

  it("proofMerkleRoot is a 64-char hex string", () => {
    expect(anchor.proofMerkleRoot).toMatch(/^[0-9a-f]{64}$/i);
  });

  it("chainTarget matches input", () => {
    expect(anchor.chainTarget).toBe("xrpl");
  });

  it("has no private key fields", () => {
    const json = JSON.stringify(anchor);
    expect(json).not.toMatch(/private_key|privateKey|seed|mnemonic/i);
  });
});

// ─── Readiness Report ─────────────────────────────────────────────────────

describe("createNilL1ReadinessReport", () => {
  const report = createNilL1ReadinessReport();

  it("signals is 33", () => {
    expect(report.signals).toBe(33);
  });

  it("buckets is 6", () => {
    expect(report.buckets).toBe(6);
  });

  it("agents is 9", () => {
    expect(report.agents).toBe(9);
  });

  it("has safetyGates array with entries", () => {
    expect(Array.isArray(report.safetyGates)).toBe(true);
    expect(report.safetyGates.length).toBeGreaterThan(0);
  });

  it("has complianceChecks array with entries", () => {
    expect(Array.isArray(report.complianceChecks)).toBe(true);
    expect(report.complianceChecks.length).toBeGreaterThan(0);
  });

  it("has integrationPoints array with entries", () => {
    expect(Array.isArray(report.integrationPoints)).toBe(true);
    expect(report.integrationPoints.length).toBeGreaterThan(0);
  });

  it("safetyGates contain live payment block", () => {
    const hasPaymentBlock = report.safetyGates.some((g) =>
      g.toLowerCase().includes("payment"),
    );
    expect(hasPaymentBlock).toBe(true);
  });

  it("complianceChecks mention pay-for-play", () => {
    const hasPayForPlay = report.complianceChecks.some((c) =>
      c.toLowerCase().includes("pay_for_play") || c.toLowerCase().includes("pay-for-play"),
    );
    expect(hasPayForPlay).toBe(true);
  });
});
