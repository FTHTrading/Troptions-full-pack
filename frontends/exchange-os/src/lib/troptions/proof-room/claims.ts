/**
 * TROPTIONS Proof Room — Claims Register
 */

import type { TroptionsPublicClaim } from "./types";

export function getMockPublicClaims(): TroptionsPublicClaim[] {
  return [
    {
      id: "claim-001",
      claimText: "TROPTIONS is a legitimate utility token with merchant adoption history.",
      plainEnglishVersion: "TROPTIONS can be used by merchants as a form of exchange.",
      claimCategory: "core_identity",
      claimStatus: "partially_verified",
      evidenceStatus: "partially_verified",
      publicUseStatus: "approved_with_disclaimer",
      riskLevel: "low",
      requiredEvidence: ["merchant_adoption_records", "exchange_listing_history"],
      attachedEvidenceIds: [],
      legalReviewRequired: false,
      providerContractRequired: false,
      allowedCopy:
        "TROPTIONS is a utility-based digital asset with a history of merchant adoption.",
      blockedCopy: "TROPTIONS is a licensed currency or guaranteed store of value.",
      notes: "Core identity claim. Approved with standard utility disclaimer.",
    },
    {
      id: "claim-002",
      claimText: "TROPTIONS Infrastructure Control Plane has been software-build verified.",
      plainEnglishVersion:
        "The TROPTIONS software platform has been built and passes technical verification.",
      claimCategory: "software_capability",
      claimStatus: "software_build_verified",
      evidenceStatus: "verified",
      publicUseStatus: "approved_public",
      riskLevel: "low",
      requiredEvidence: ["build_report", "jest_test_report"],
      attachedEvidenceIds: ["ev-build-001"],
      legalReviewRequired: false,
      providerContractRequired: false,
      allowedCopy:
        "The TROPTIONS Infrastructure Control Plane has passed software build and test verification.",
      blockedCopy:
        "TROPTIONS infrastructure is live, production, or handles real money today.",
      notes: "Build verified claim. Safe for public use.",
    },
    {
      id: "claim-003",
      claimText: "TROPTIONS PayOps supports payout management workflows.",
      plainEnglishVersion:
        "TROPTIONS has a software payout management module that manages payee records, batches, and approvals.",
      claimCategory: "software_capability",
      claimStatus: "software_build_verified",
      evidenceStatus: "verified",
      publicUseStatus: "approved_with_disclaimer",
      riskLevel: "low",
      requiredEvidence: ["payops_build_report"],
      attachedEvidenceIds: ["ev-build-002"],
      legalReviewRequired: false,
      providerContractRequired: true,
      allowedCopy:
        "TROPTIONS includes a PayOps module for payout management. Live execution requires a production-ready payment provider.",
      blockedCopy:
        "TROPTIONS PayOps executes live payouts today without a provider contract.",
      notes:
        "Claim is safe with software-build qualifier and provider-contract disclaimer.",
    },
    {
      id: "claim-004",
      claimText: "TROPTIONS supports stablecoin payout rails.",
      plainEnglishVersion:
        "TROPTIONS platform architecture supports stablecoin payment rails when a provider is configured.",
      claimCategory: "payment_readiness",
      claimStatus: "future_ready_not_live",
      evidenceStatus: "missing",
      publicUseStatus: "internal_only",
      riskLevel: "high",
      requiredEvidence: [
        "stablecoin_provider_agreement",
        "compliance_approval",
        "live_test_receipts",
      ],
      attachedEvidenceIds: [],
      legalReviewRequired: true,
      providerContractRequired: true,
      allowedCopy:
        "TROPTIONS architecture is designed to support stablecoin payment rails pending provider agreement and compliance review.",
      blockedCopy:
        "TROPTIONS supports live stablecoin payments today.",
      notes:
        "HIGH RISK if stated as current. Must be future-ready language only. Internal only until provider agreement exists.",
    },
    {
      id: "claim-005",
      claimText: "TROPTIONS has $175M in USDC backing.",
      plainEnglishVersion: "TROPTIONS claims a large USDC treasury.",
      claimCategory: "treasury",
      claimStatus: "do_not_claim",
      evidenceStatus: "needs_review",
      publicUseStatus: "legal_review_first",
      riskLevel: "critical",
      requiredEvidence: [
        "bank_statement_with_independent_attestation",
        "legal_opinion_on_treasury_claim",
      ],
      attachedEvidenceIds: [],
      legalReviewRequired: true,
      providerContractRequired: false,
      allowedCopy:
        "DO NOT CLAIM: requires independent attestation and legal review before public use.",
      blockedCopy:
        "TROPTIONS is backed by $175M USDC or any specific dollar figure without independent verification.",
      notes:
        "CRITICAL RISK claim. Do not use publicly until independent attestation and legal opinion are on file.",
    },
  ];
}

export function getApprovedClaims(claims: TroptionsPublicClaim[]): TroptionsPublicClaim[] {
  return claims.filter(
    (c) =>
      c.publicUseStatus === "approved_public" ||
      c.publicUseStatus === "approved_with_disclaimer"
  );
}

export function getBlockedClaims(claims: TroptionsPublicClaim[]): TroptionsPublicClaim[] {
  return claims.filter(
    (c) =>
      c.publicUseStatus === "blocked" || c.claimStatus === "do_not_claim"
  );
}

export function getHighRiskClaims(claims: TroptionsPublicClaim[]): TroptionsPublicClaim[] {
  return claims.filter(
    (c) => c.riskLevel === "high" || c.riskLevel === "critical"
  );
}
