/**
 * TROPTIONS RWA Adapter Claim Guards
 *
 * Guards and evaluators for RWA public claims.
 * Blocks unsafe claims. Suggests safe alternatives.
 *
 * Critical rules enforced here:
 * 1. Partnership claims require signed provider contract evidence.
 * 2. Asset backing claims require custody, title, appraisal, audit, and legal evidence.
 * 3. production_ready requires provider contract, credentials, legal review, and compliance.
 * 4. execution_confirmed requires real provider confirmation — never from mock data.
 * 5. No custody claims without custody documents.
 * 6. No FTH / FTHX / FTHG / Future Tech Holdings in RWA copy.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

import { RwaProviderAdapter, RwaClaimEvaluation } from "./types";

// ─── Unsafe Phrase Patterns ────────────────────────────────────────────────

const PARTNERSHIP_PHRASES = [
  "partnered with",
  "official partner",
  "in partnership with",
  "strategic partner",
  "integrated with",
  "powered by",
  "affiliated with",
];

const ASSET_BACKING_PHRASES = [
  "backed by",
  "asset-backed",
  "collateralized by",
  "secured by real assets",
  "holds assets",
  "custody of",
  "custodian for",
  "title holder",
];

const EXECUTION_PHRASES = [
  "live execution",
  "real-time settlement",
  "instant transfer",
  "moves money",
  "sends payments via",
  "processes transactions with",
];

const REGULATORY_PHRASES = [
  "sec registered",
  "sec approved",
  "licensed bank",
  "licensed payroll",
  "fdic insured",
  "finra member",
  "money transmitter",
  "registered transfer agent",
];

const FTH_PHRASES = [
  "fth",
  "fthx",
  "fthg",
  "future tech holdings",
];

// ─── Claim Evaluators ──────────────────────────────────────────────────────

/**
 * Check whether a claim text implies an unsafe partnership without contract.
 */
export function blockUnsafeRwaClaim(claimText: string): RwaClaimEvaluation {
  const lower = claimText.toLowerCase();

  // FTH brand safety check
  for (const phrase of FTH_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        claimText,
        isSafe: false,
        riskLevel: "critical",
        reason: `FTH brand reference detected ("${phrase}"). TROPTIONS does not reference FTH, FTHX, FTHG, or Future Tech Holdings in RWA adapter copy.`,
        saferAlternative: "Remove all FTH brand references. Use TROPTIONS-only language.",
      };
    }
  }

  // Partnership claim without contract
  for (const phrase of PARTNERSHIP_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        claimText,
        isSafe: false,
        riskLevel: "blocked",
        reason: `Implied partnership detected ("${phrase}"). TROPTIONS does not claim official partnerships without signed provider contracts.`,
        saferAlternative:
          "TROPTIONS is designed with provider-neutral adapter readiness for this category of infrastructure. Approved provider relationships require signed contracts.",
      };
    }
  }

  // Asset backing claim
  for (const phrase of ASSET_BACKING_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        claimText,
        isSafe: false,
        riskLevel: "critical",
        reason: `Asset backing claim detected ("${phrase}"). TROPTIONS does not claim custody, asset backing, or collateralization without title, custody, appraisal, audit, and legal evidence.`,
        saferAlternative:
          "TROPTIONS maintains an evidence registry for asset documentation review. Asset backing claims require title, custody, appraisal, audit records, and legal opinion.",
      };
    }
  }

  // Live execution claim
  for (const phrase of EXECUTION_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        claimText,
        isSafe: false,
        riskLevel: "blocked",
        reason: `Live execution claim detected ("${phrase}"). All TROPTIONS RWA adapters have executionEnabled: false. Live execution requires approved provider relationship, credentials, legal review, and compliance approval.`,
        saferAlternative:
          "TROPTIONS is designed for execution readiness. Live execution requires approved provider adapters, credentials, compliance review, and real provider confirmation.",
      };
    }
  }

  // Regulatory status false claim
  for (const phrase of REGULATORY_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        claimText,
        isSafe: false,
        riskLevel: "critical",
        reason: `False regulatory claim detected ("${phrase}"). TROPTIONS is not a registered investment adviser, broker-dealer, bank, transfer agent, or money transmitter.`,
        saferAlternative:
          "TROPTIONS is a provider-neutral operating platform. Regulatory licensing, registration, and compliance requirements apply to provider adapters, not TROPTIONS itself.",
      };
    }
  }

  return {
    claimText,
    isSafe: true,
    riskLevel: "safe",
    reason: "No unsafe patterns detected.",
    saferAlternative: null,
  };
}

/**
 * Suggest safe public language for an RWA adapter.
 */
export function suggestSafeRwaClaim(adapter: RwaProviderAdapter): string {
  return adapter.allowedPublicLanguage;
}

/**
 * Check if an adapter can claim production readiness.
 * All four gates must pass.
 */
export function canClaimProductionReady(adapter: RwaProviderAdapter): {
  allowed: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];

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

  return {
    allowed: blockers.length === 0,
    blockers,
  };
}

/**
 * Assert that an adapter is not claiming execution without all gates.
 * Throws if unsafe.
 */
export function assertNoFakeRwaExecution(adapter: RwaProviderAdapter): void {
  if (adapter.currentTroptionsStatus === "production_ready") {
    const { allowed, blockers } = canClaimProductionReady(adapter);
    if (!allowed) {
      throw new Error(
        `RWA Adapter "${adapter.displayName}" claims production_ready but is missing: ${blockers.join("; ")}`
      );
    }
  }
}

/**
 * Evaluate claim safety for multiple claims in batch.
 */
export function evaluateClaimBatch(claims: string[]): RwaClaimEvaluation[] {
  return claims.map(blockUnsafeRwaClaim);
}

/**
 * Check all blocked public language for an adapter.
 */
export function getBlockedLanguageForAdapter(
  adapter: RwaProviderAdapter
): string[] {
  return adapter.blockedPublicLanguage;
}

/**
 * Verify no FTH references exist in any provider record.
 */
export function assertNoFthInAdapters(
  adapters: RwaProviderAdapter[]
): { clean: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const adapter of adapters) {
    const text = JSON.stringify(adapter).toLowerCase();
    for (const phrase of FTH_PHRASES) {
      if (text.includes(phrase)) {
        violations.push(`${adapter.providerId}: FTH reference detected ("${phrase}")`);
      }
    }
  }

  return { clean: violations.length === 0, violations };
}
