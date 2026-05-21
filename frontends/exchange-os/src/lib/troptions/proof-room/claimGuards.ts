/**
 * TROPTIONS Proof Room — Claim Guards
 */

import type { TroptionsPublicClaim, ClaimRiskLevel, PublicUseStatus } from "./types";

export function isClaimSafeForPublicUse(claim: TroptionsPublicClaim): boolean {
  return (
    claim.publicUseStatus === "approved_public" ||
    claim.publicUseStatus === "approved_with_disclaimer"
  );
}

export function isClaimBlocked(claim: TroptionsPublicClaim): boolean {
  return (
    claim.publicUseStatus === "blocked" || claim.claimStatus === "do_not_claim"
  );
}

export function requiresLegalReview(claim: TroptionsPublicClaim): boolean {
  return (
    claim.legalReviewRequired ||
    claim.publicUseStatus === "legal_review_first"
  );
}

export function isHighOrCriticalRisk(riskLevel: ClaimRiskLevel): boolean {
  return riskLevel === "high" || riskLevel === "critical";
}

export function evaluateClaimSafety(
  claim: TroptionsPublicClaim
): { safe: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (isClaimBlocked(claim)) {
    warnings.push(`Claim '${claim.id}' is blocked and must not be used publicly.`);
  }
  if (requiresLegalReview(claim)) {
    warnings.push(`Claim '${claim.id}' requires legal review before public use.`);
  }
  if (claim.providerContractRequired) {
    warnings.push(
      `Claim '${claim.id}' requires a provider contract before making live capability claims.`
    );
  }
  if (isHighOrCriticalRisk(claim.riskLevel)) {
    warnings.push(`Claim '${claim.id}' is ${claim.riskLevel.toUpperCase()} RISK.`);
  }

  return { safe: warnings.length === 0, warnings };
}
