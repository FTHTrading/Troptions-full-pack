/**
 * TROPTIONS RWA Adapter Readiness Engine
 *
 * Evaluates readiness scores for RWA provider adapters.
 * No adapter may claim production_ready without all gates passing.
 * No adapter may claim execution_confirmed without real provider confirmation.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

import { RwaProviderAdapter, RwaReadinessScore, RwaAdapterRegistry } from "./types";
import { RWA_PROVIDER_ADAPTERS } from "./providers";

// ─── Score Components ──────────────────────────────────────────────────────

/**
 * Evaluate legal readiness for an RWA adapter.
 * Returns 0-100 score. 0 = no legal review started, 100 = fully cleared.
 */
export function evaluateLegalReadiness(adapter: RwaProviderAdapter): {
  score: number;
  blockers: string[];
} {
  const blockers: string[] = [];
  let score = 0;

  if (adapter.hasLegalReview) {
    score += 50;
  } else {
    blockers.push("Legal review not completed");
    if (adapter.requiredLegalReview.length > 0) {
      blockers.push(
        `Required legal reviews: ${adapter.requiredLegalReview.join(", ")}`
      );
    }
  }

  if (adapter.hasComplianceApproval) {
    score += 50;
  } else {
    blockers.push("Compliance approval not granted");
  }

  return { score, blockers };
}

/**
 * Evaluate evidence readiness for an RWA adapter.
 * Returns 0-100 score.
 */
export function evaluateEvidenceReadiness(adapter: RwaProviderAdapter): {
  score: number;
  blockers: string[];
} {
  const blockers: string[] = [];
  const totalRequired = adapter.requiredEvidence.length;

  if (totalRequired === 0) {
    return { score: 100, blockers: [] };
  }

  let score = 0;

  if (adapter.hasProviderContract && adapter.requiredProviderContract) {
    score += 40;
  } else if (adapter.requiredProviderContract) {
    blockers.push("Provider contract not signed");
  }

  if (adapter.hasCredentials && adapter.requiredCredentials.length > 0) {
    score += 30;
  } else if (adapter.requiredCredentials.length > 0) {
    blockers.push(
      `Missing credentials: ${adapter.requiredCredentials.join(", ")}`
    );
  }

  const remainingEvidence = adapter.requiredEvidence.filter(
    (e) => e !== "signed_provider_contract"
  );
  if (remainingEvidence.length === 0) {
    score += 30;
  } else {
    blockers.push(
      `Missing evidence: ${remainingEvidence.slice(0, 3).join(", ")}${remainingEvidence.length > 3 ? " (and more)" : ""}`
    );
  }

  return { score: Math.min(score, 100), blockers };
}

/**
 * Evaluate execution readiness. For TROPTIONS RWA adapters,
 * this is always 0 unless ALL gates are passed.
 */
export function evaluateExecutionReadiness(adapter: RwaProviderAdapter): {
  score: number;
  blockers: string[];
} {
  const blockers: string[] = [];

  // Execution is always disabled by design
  blockers.push("Execution is disabled by design — all RWA adapters require approved provider relationships");

  if (!adapter.hasProviderContract && adapter.requiredProviderContract) {
    blockers.push("Provider contract required and not present");
  }
  if (!adapter.hasCredentials && adapter.requiredCredentials.length > 0) {
    blockers.push("API credentials required and not present");
  }
  if (!adapter.hasLegalReview) {
    blockers.push("Legal review required and not completed");
  }
  if (!adapter.hasComplianceApproval) {
    blockers.push("Compliance approval required and not granted");
  }

  return { score: 0, blockers };
}

/**
 * Full readiness evaluation for an RWA provider adapter.
 */
export function evaluateRwaAdapterReadiness(
  adapter: RwaProviderAdapter
): RwaReadinessScore {
  const legal = evaluateLegalReadiness(adapter);
  const evidence = evaluateEvidenceReadiness(adapter);
  const execution = evaluateExecutionReadiness(adapter);

  const allBlockers = [
    ...legal.blockers,
    ...evidence.blockers,
    ...execution.blockers,
  ];

  const overallScore = Math.round(
    (legal.score * 0.4 + evidence.score * 0.4 + execution.score * 0.2)
  );

  const recommendations: string[] = [];
  if (!adapter.hasLegalReview) {
    recommendations.push("Engage legal counsel for securities and compliance review");
  }
  if (!adapter.hasProviderContract && adapter.requiredProviderContract) {
    recommendations.push(`Contact ${adapter.displayName} to initiate provider agreement`);
  }
  if (!adapter.hasCredentials && adapter.requiredCredentials.length > 0) {
    recommendations.push("Obtain API credentials after provider agreement is signed");
  }
  if (!adapter.hasComplianceApproval) {
    recommendations.push("Complete compliance review and obtain approval before any public claims");
  }

  // Partnership can never be claimed without a signed provider contract
  const canClaimPartnership =
    adapter.hasProviderContract &&
    adapter.hasLegalReview &&
    adapter.hasComplianceApproval;

  // Public reference claim is allowed for reference_only adapters with approved language
  const canClaimPublicly =
    adapter.currentTroptionsStatus !== "blocked" &&
    adapter.allowedPublicLanguage.length > 0;

  return {
    providerId: adapter.providerId,
    overallScore,
    legalScore: legal.score,
    evidenceScore: evidence.score,
    executionScore: execution.score,
    blockers: allBlockers,
    recommendations,
    canClaimPublicly,
    canClaimPartnership,
  };
}

/**
 * Generate a registry-level readiness report for all RWA adapters.
 */
export function generateRwaRegistryReport(): RwaAdapterRegistry {
  const adapters = RWA_PROVIDER_ADAPTERS;

  return {
    adapters,
    totalAdapters: adapters.length,
    referenceOnlyCount: adapters.filter(
      (a) => a.currentTroptionsStatus === "reference_only"
    ).length,
    legalReviewRequiredCount: adapters.filter(
      (a) =>
        a.currentTroptionsStatus === "legal_review_required" ||
        (!a.hasLegalReview && a.requiredLegalReview.length > 0)
    ).length,
    providerContractRequiredCount: adapters.filter(
      (a) => a.requiredProviderContract && !a.hasProviderContract
    ).length,
    productionReadyCount: adapters.filter(
      (a) => a.currentTroptionsStatus === "production_ready"
    ).length,
    blockedCount: adapters.filter(
      (a) => a.currentTroptionsStatus === "blocked"
    ).length,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get all readiness scores for every RWA adapter.
 */
export function getAllRwaReadinessScores(): RwaReadinessScore[] {
  return RWA_PROVIDER_ADAPTERS.map(evaluateRwaAdapterReadiness);
}
