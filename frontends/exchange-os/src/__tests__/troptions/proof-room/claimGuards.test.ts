/**
 * Tests for TROPTIONS Proof Room — Claim Guards
 */

import {
  isClaimSafeForPublicUse,
  isClaimBlocked,
  requiresLegalReview,
  evaluateClaimSafety,
} from "@/lib/troptions/proof-room/claimGuards";
import { getMockPublicClaims } from "@/lib/troptions/proof-room/claims";

describe("isClaimSafeForPublicUse", () => {
  it("returns true for approved_public", () => {
    const claim = getMockPublicClaims().find((c) => c.publicUseStatus === "approved_public");
    expect(claim).toBeDefined();
    expect(isClaimSafeForPublicUse(claim!)).toBe(true);
  });

  it("returns true for approved_with_disclaimer", () => {
    const claim = getMockPublicClaims().find(
      (c) => c.publicUseStatus === "approved_with_disclaimer"
    );
    expect(claim).toBeDefined();
    expect(isClaimSafeForPublicUse(claim!)).toBe(true);
  });

  it("returns false for legal_review_first", () => {
    const claim = getMockPublicClaims().find(
      (c) => c.publicUseStatus === "legal_review_first"
    );
    expect(claim).toBeDefined();
    expect(isClaimSafeForPublicUse(claim!)).toBe(false);
  });
});

describe("isClaimBlocked", () => {
  it("returns true for do_not_claim", () => {
    const claim = getMockPublicClaims().find((c) => c.claimStatus === "do_not_claim");
    expect(claim).toBeDefined();
    expect(isClaimBlocked(claim!)).toBe(true);
  });

  it("returns false for software_build_verified", () => {
    const claim = getMockPublicClaims().find(
      (c) => c.claimStatus === "software_build_verified"
    );
    expect(claim).toBeDefined();
    expect(isClaimBlocked(claim!)).toBe(false);
  });
});

describe("requiresLegalReview", () => {
  it("returns true for claim requiring legal review", () => {
    const claim = getMockPublicClaims().find((c) => c.legalReviewRequired);
    expect(claim).toBeDefined();
    expect(requiresLegalReview(claim!)).toBe(true);
  });

  it("returns false for claim not requiring legal review", () => {
    const claim = getMockPublicClaims().find(
      (c) => !c.legalReviewRequired && c.publicUseStatus === "approved_public"
    );
    expect(claim).toBeDefined();
    expect(requiresLegalReview(claim!)).toBe(false);
  });
});

describe("evaluateClaimSafety", () => {
  it("returns safe=true for an approved_public claim", () => {
    const claim = getMockPublicClaims().find((c) => c.publicUseStatus === "approved_public");
    expect(claim).toBeDefined();
    const result = evaluateClaimSafety(claim!);
    expect(result.safe).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it("returns safe=false with warnings for a critical risk claim", () => {
    const claim = getMockPublicClaims().find((c) => c.riskLevel === "critical");
    expect(claim).toBeDefined();
    const result = evaluateClaimSafety(claim!);
    expect(result.safe).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("returns a warning for do_not_claim status", () => {
    const claim = getMockPublicClaims().find((c) => c.claimStatus === "do_not_claim");
    expect(claim).toBeDefined();
    const result = evaluateClaimSafety(claim!);
    expect(result.safe).toBe(false);
  });
});

describe("getMockPublicClaims — no FTH references", () => {
  it("contains no FTH/FTHX/FTHG references", () => {
    const claims = getMockPublicClaims();
    for (const claim of claims) {
      expect(claim.claimText).not.toContain("FTH");
      expect(claim.claimText).not.toContain("FTHX");
      expect(claim.allowedCopy).not.toContain("FTH");
      expect(claim.allowedCopy).not.toContain("FTHX");
    }
  });
});
