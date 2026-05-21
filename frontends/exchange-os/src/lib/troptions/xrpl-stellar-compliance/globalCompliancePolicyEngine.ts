/**
 * Global Compliance Policy Engine
 *
 * Unified compliance decision engine for XRPL/Stellar operations.
 * Enforces prohibited claims, jurisdiction blocks, KYC blocks,
 * and unsafe public language detection.
 *
 * BLOCK RULES:
 * - Unknown jurisdiction → block production
 * - Unknown KYC/KYB → block production
 * - "fully compliant globally" claim → blocked
 * - "ISO 20022 coin/certified" claim → blocked
 * - "GENIUS Act approved" without evidence → blocked
 * - "guaranteed liquidity/yield/profit" claim → blocked
 * - Live mainnet execution → blocked
 * - No legal review → blocked
 */

// ─── Input Types ──────────────────────────────────────────────────────────────

export type KycStatus = "verified" | "pending" | "failed" | "not_started" | "unknown";
export type KybStatus = "verified" | "pending" | "failed" | "not_started" | "unknown";
export type SanctionsStatus = "clear" | "hit" | "pending_review" | "not_screened" | "unknown";
export type JurisdictionStatus = "allowed" | "restricted_enhanced_dd" | "prohibited" | "unknown";

export interface GlobalComplianceInput {
  readonly operationId: string;
  readonly operationType: string;
  readonly chain: "XRPL" | "Stellar" | "Both" | "Other";
  readonly jurisdictionCode?: string;
  readonly jurisdictionStatus?: JurisdictionStatus;
  readonly kycStatus?: KycStatus;
  readonly kybStatus?: KybStatus;
  readonly sanctionsStatus?: SanctionsStatus;
  readonly legalReviewComplete?: boolean;
  readonly publicClaimText?: string;
  readonly requestsLiveExecution?: boolean;
  readonly requestsMainnetTransaction?: boolean;
}

// ─── Output Types ─────────────────────────────────────────────────────────────

export type GlobalComplianceDecision = "allowed_simulation_only" | "needs_review" | "blocked";

export interface BlockedReason {
  readonly code: string;
  readonly message: string;
  readonly severity: "critical" | "high" | "medium";
}

export interface GlobalComplianceResult {
  readonly operationId: string;
  readonly operationType: string;
  readonly decision: GlobalComplianceDecision;
  readonly executionMode: "simulation_only" | "blocked";
  readonly liveExecutionAllowed: false;
  readonly blockedReasons: readonly BlockedReason[];
  readonly requiredEvidence: readonly string[];
  readonly requiredApprovals: readonly string[];
  readonly prohibitedClaimsDetected: readonly string[];
  readonly evaluatedAt: string;
  readonly disclaimer: string;
}

// ─── Prohibited Claims ────────────────────────────────────────────────────────

export const PROHIBITED_PUBLIC_CLAIMS: readonly { pattern: string; reason: string }[] = [
  { pattern: "fully compliant globally", reason: "No operation is globally compliant without jurisdiction-by-jurisdiction legal review." },
  { pattern: "globally compliant", reason: "No operation is globally compliant without jurisdiction-by-jurisdiction legal review." },
  { pattern: "iso 20022 coin", reason: "XRPL/Stellar tokens cannot be described as 'ISO 20022 coins' — this is a message format standard." },
  { pattern: "iso 20022 certified", reason: "No blockchain token is ISO 20022 certified. ISO 20022 is a message format standard, not a token certification." },
  { pattern: "iso 20022 compliant token", reason: "Tokens cannot be ISO 20022 compliant — ISO 20022 describes financial institution message formats." },
  { pattern: "genius act approved", reason: "Cannot claim GENIUS Act approval without actual regulatory approval from OCC, Federal Reserve, or state banking authority." },
  { pattern: "genius act compliant", reason: "Cannot claim GENIUS Act compliance without regulatory review and approval." },
  { pattern: "guaranteed liquidity", reason: "Liquidity cannot be guaranteed. This claim creates consumer harm risk." },
  { pattern: "guaranteed yield", reason: "Yield cannot be guaranteed. This claim creates securities and consumer protection risk." },
  { pattern: "guaranteed profit", reason: "Profits cannot be guaranteed. This claim creates securities and consumer protection risk." },
  { pattern: "risk free", reason: "No virtual asset investment is risk-free. This claim creates consumer harm risk." },
  { pattern: "risk-free", reason: "No virtual asset investment is risk-free. This claim creates consumer harm risk." },
  { pattern: "fully regulated", reason: "Regulatory status varies by jurisdiction and product. Cannot claim 'fully regulated' without specificity." },
  { pattern: "approved by regulators", reason: "Cannot claim regulatory approval without specific regulatory order or license documentation." },
  { pattern: "sec approved", reason: "Cannot claim SEC approval without actual SEC registration, exemption, or no-action letter." },
  { pattern: "fca approved", reason: "Cannot claim FCA approval without actual FCA authorization." },
  { pattern: "mas approved", reason: "Cannot claim MAS approval without actual MAS license." },
] as const;

// ─── Policy Engine ────────────────────────────────────────────────────────────

export function evaluateGlobalCompliance(input: GlobalComplianceInput): GlobalComplianceResult {
  const blockedReasons: BlockedReason[] = [];
  const requiredEvidence: string[] = [];
  const requiredApprovals: string[] = [];
  const prohibitedClaimsDetected: string[] = [];

  // 1. Live execution block — always
  if (input.requestsLiveExecution === true || input.requestsMainnetTransaction === true) {
    blockedReasons.push({
      code: "LIVE_EXECUTION_BLOCKED",
      message: "Live mainnet execution is disabled. All operations run in simulation_only or read_only mode.",
      severity: "critical",
    });
    requiredApprovals.push("Control Hub Governance Board — live execution approval");
    requiredApprovals.push("Compliance Counsel — mainnet operation approval");
    requiredApprovals.push("Legal Counsel — jurisdiction-specific authorization");
  }

  // 2. Jurisdiction block
  if (!input.jurisdictionCode || !input.jurisdictionStatus || input.jurisdictionStatus === "unknown") {
    blockedReasons.push({
      code: "UNKNOWN_JURISDICTION",
      message: "Jurisdiction is unknown or not specified. Production operations require jurisdiction-specific legal analysis.",
      severity: "critical",
    });
    requiredEvidence.push("Jurisdiction identification and legal status determination");
    requiredApprovals.push("Compliance Counsel — jurisdiction analysis");
  }
  if (input.jurisdictionStatus === "prohibited") {
    blockedReasons.push({
      code: "PROHIBITED_JURISDICTION",
      message: `Jurisdiction ${input.jurisdictionCode ?? "unknown"} is on the prohibited list. Operations are blocked for this jurisdiction.`,
      severity: "critical",
    });
    requiredApprovals.push("Senior Legal Counsel — prohibited jurisdiction override");
  }

  // 3. KYC/KYB block
  if (!input.kycStatus || input.kycStatus === "unknown" || input.kycStatus === "not_started") {
    blockedReasons.push({
      code: "UNKNOWN_KYC_STATUS",
      message: "KYC status is unknown or not started. Production operations require verified customer identity.",
      severity: "critical",
    });
    requiredEvidence.push("KYC verification documentation");
  }
  if (input.kycStatus === "failed") {
    blockedReasons.push({
      code: "KYC_FAILED",
      message: "KYC verification failed. Operations are blocked until KYC is resolved.",
      severity: "critical",
    });
  }
  if (!input.kybStatus || input.kybStatus === "unknown" || input.kybStatus === "not_started") {
    blockedReasons.push({
      code: "UNKNOWN_KYB_STATUS",
      message: "KYB status is unknown or not started. Entity operations require verified business identity.",
      severity: "high",
    });
    requiredEvidence.push("KYB verification documentation");
  }

  // 4. Sanctions block
  if (!input.sanctionsStatus || input.sanctionsStatus === "unknown" || input.sanctionsStatus === "not_screened") {
    blockedReasons.push({
      code: "UNSCREENED_SANCTIONS",
      message: "Sanctions screening has not been completed. All parties must be screened before operations.",
      severity: "critical",
    });
    requiredEvidence.push("Sanctions screening documentation");
  }
  if (input.sanctionsStatus === "hit") {
    blockedReasons.push({
      code: "SANCTIONS_HIT",
      message: "Sanctions screening returned a match. Operations are blocked pending OFAC/compliance escalation.",
      severity: "critical",
    });
    requiredApprovals.push("OFAC Compliance Officer — sanctions hit review");
  }

  // 5. Legal review block
  if (!input.legalReviewComplete) {
    blockedReasons.push({
      code: "NO_LEGAL_REVIEW",
      message: "Legal review has not been completed. Production operations require legal counsel sign-off.",
      severity: "critical",
    });
    requiredApprovals.push("Legal Counsel — compliance review");
  }

  // 6. Prohibited claims detection
  if (input.publicClaimText) {
    const claimLower = input.publicClaimText.toLowerCase();
    for (const prohibited of PROHIBITED_PUBLIC_CLAIMS) {
      if (claimLower.includes(prohibited.pattern)) {
        prohibitedClaimsDetected.push(`"${prohibited.pattern}" — ${prohibited.reason}`);
      }
    }
    if (prohibitedClaimsDetected.length > 0) {
      blockedReasons.push({
        code: "PROHIBITED_CLAIM_DETECTED",
        message: `Prohibited public claim(s) detected: ${prohibitedClaimsDetected.join("; ")}`,
        severity: "critical",
      });
      requiredApprovals.push("Legal Counsel — public claim review and correction");
    }
  }

  // Determine decision
  const decision: GlobalComplianceDecision = blockedReasons.length > 0 ? "blocked" : "allowed_simulation_only";
  const executionMode = decision === "blocked" ? "blocked" : "simulation_only";

  return {
    operationId: input.operationId,
    operationType: input.operationType,
    decision,
    executionMode,
    liveExecutionAllowed: false,
    blockedReasons,
    requiredEvidence,
    requiredApprovals,
    prohibitedClaimsDetected,
    evaluatedAt: new Date().toISOString(),
    disclaimer:
      "This compliance evaluation is simulation-only and does not constitute legal advice. " +
      "Passing all compliance checks does not authorize live operations. " +
      "Legal counsel review is required before any production deployment. " +
      "Jurisdiction-specific licensing may be required for virtual asset services.",
  };
}

// ─── Claim Reviewer ────────────────────────────────────────────────────────────

export interface PublicClaimReviewResult {
  readonly claimText: string;
  readonly isAllowed: boolean;
  readonly prohibitedPhrases: readonly string[];
  readonly correctionSuggestion: string;
  readonly reviewedAt: string;
}

export function reviewPublicClaim(claimText: string): PublicClaimReviewResult {
  const claimLower = claimText.toLowerCase();
  const prohibitedPhrases: string[] = [];

  for (const prohibited of PROHIBITED_PUBLIC_CLAIMS) {
    if (claimLower.includes(prohibited.pattern)) {
      prohibitedPhrases.push(`"${prohibited.pattern}" — ${prohibited.reason}`);
    }
  }

  const isAllowed = prohibitedPhrases.length === 0;

  let correctionSuggestion = "";
  if (!isAllowed) {
    correctionSuggestion =
      "Replace prohibited claims with accurate readiness language: " +
      "'ISO 20022 message compatibility readiness', " +
      "'GENIUS Act readiness evaluation', " +
      "'jurisdiction-aware compliance controls', " +
      "'legal review required before production'. " +
      "Remove any guarantee, approval, or global compliance claims.";
  }

  return {
    claimText,
    isAllowed,
    prohibitedPhrases,
    correctionSuggestion,
    reviewedAt: new Date().toISOString(),
  };
}
