import {
  CLAIM_REGISTRY,
  assertClaimCanPublish,
  getCriticalClaims,
  getHighRiskClaims,
  getClaimsMissingEvidence,
  getBlockedClaims,
  assertNoCriticalBannedTerms,
  TroptionsClaim,
} from "@/content/troptions/claimRegistry";

describe("claimGuards — high-risk / critical claims cannot publish without evidence", () => {
  it("getClaimsMissingEvidence returns only claims with missingEvidence.length > 0", () => {
    const missing = getClaimsMissingEvidence();
    for (const claim of missing) {
      expect(claim.missingEvidence.length).toBeGreaterThan(0);
    }
  });

  it("getCriticalClaims returns only CRITICAL severity claims", () => {
    const critical = getCriticalClaims();
    for (const claim of critical) {
      expect(claim.riskLevel).toBe("CRITICAL");
    }
  });

  it("getHighRiskClaims returns only HIGH or CRITICAL severity", () => {
    const high = getHighRiskClaims();
    for (const claim of high) {
      expect(["HIGH", "CRITICAL"]).toContain(claim.riskLevel);
    }
  });

  it("assertClaimCanPublish throws on blocked claims", () => {
    const blocked = getBlockedClaims();
    for (const claim of blocked) {
      expect(() => assertClaimCanPublish(claim)).toThrow();
    }
  });

  it("every CRITICAL claim without proofProvided must not have publishStatus approved-public", () => {
    const critical = getCriticalClaims();
    for (const claim of critical) {
      if (!claim.proofProvided) {
        expect(claim.publishStatus).not.toBe("approved-public");
      }
    }
  });

  it("claims with missingEvidence must not be approved-public", () => {
    const missing = getClaimsMissingEvidence();
    for (const claim of missing) {
      expect(claim.publishStatus).not.toBe("approved-public");
    }
  });

  it("claims requiring legal review must not be approved-public without legal sign-off", () => {
    const needsLegal = CLAIM_REGISTRY.filter(
      (c) =>
        c.proofRequired.includes("legal-opinion") ||
        c.proofRequired.includes("legal-classification-memo") ||
        c.proofRequired.includes("securities-counsel-memo"),
    );
    for (const claim of needsLegal) {
      if (!claim.proofProvided) {
        expect(claim.publishStatus).not.toBe("approved-public");
      }
    }
  });

  it("no claim registered with claimType 'reserve' should be approved-public if missing reserve proof", () => {
    const reserveClaims = CLAIM_REGISTRY.filter((c) => c.claimType === "reserve");
    for (const claim of reserveClaims) {
      if (claim.missingEvidence.some((e) => e.toLowerCase().includes("reserve"))) {
        expect(claim.publishStatus).not.toBe("approved-public");
      }
    }
  });

  it("no claim with 'merchant' claimType should be approved-public if provider agreement missing", () => {
    const merchantClaims = CLAIM_REGISTRY.filter((c) => c.claimType === "merchant-acceptance");
    for (const claim of merchantClaims) {
      const missingProvider = claim.missingEvidence.some(
        (e) => e.toLowerCase().includes("givbux") || e.toLowerCase().includes("provider"),
      );
      if (missingProvider) {
        expect(claim.publishStatus).not.toBe("approved-public");
      }
    }
  });
});

describe("assertNoCriticalBannedTerms — prohibited terms trigger on CRITICAL claims", () => {
  it("throws on 'gold-backed' — a real CRITICAL prohibited term", () => {
    expect(() => assertNoCriticalBannedTerms("This token is gold-backed and secure")).toThrow();
  });

  it("throws on 'guaranteed APY' — staking prohibited term", () => {
    expect(() => assertNoCriticalBannedTerms("Earn a guaranteed APY by staking today")).toThrow();
  });

  it("throws on 'price appreciation' — investment contract language", () => {
    expect(() => assertNoCriticalBannedTerms("Expect price appreciation as demand grows")).toThrow();
  });

  it("does not throw on neutral barter utility language", () => {
    expect(() => assertNoCriticalBannedTerms("Troptions is a barter utility token")).not.toThrow();
  });
});
