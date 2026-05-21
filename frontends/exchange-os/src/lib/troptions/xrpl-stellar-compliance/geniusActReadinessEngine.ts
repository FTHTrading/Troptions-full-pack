/**
 * GENIUS Act Stablecoin Readiness Engine
 *
 * Evaluates readiness for compliance with the GENIUS Act framework for
 * permitted payment stablecoin issuers in the United States.
 *
 * IMPORTANT DISCLAIMERS:
 * - This engine produces READINESS EVALUATIONS only — simulation_only
 * - Passing all checks does NOT constitute regulatory approval or GENIUS Act compliance
 * - No live stablecoin issuance is permitted without regulatory approval
 * - "GENIUS Act approved" cannot be claimed without actual regulatory approval
 * - Legal counsel review is required before any production operation
 */

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface GeniusActReadinessInput {
  readonly issuerEntityName?: string;
  readonly issuerJurisdiction?: string;

  // Chartering pathway
  readonly hasPermittedIssuerStatus?: boolean;
  readonly charteringPathway?: "federal_bank_charter" | "state_bank_charter" | "federal_trust_charter" | "insured_depository" | "none" | "unknown";

  // Reserve requirements
  readonly reservePolicyDocumented?: boolean;
  readonly reserveComposition?: "us_treasury" | "central_bank_deposits" | "repo_agreements" | "mixed" | "unknown";
  readonly reserveAuditOrAttestationPolicy?: boolean;
  readonly monthlyAttestationProcess?: boolean;

  // Redemption
  readonly redemptionAtParPolicy?: boolean;
  readonly redemptionProcessDocumented?: boolean;
  readonly redemptionProhibitedConditionsDefined?: boolean;

  // AML/BSA
  readonly amlProgramDocumented?: boolean;
  readonly bsaProgramCompliance?: boolean;
  readonly amlOfficerAppointed?: boolean;

  // Sanctions
  readonly sanctionsProgramDocumented?: boolean;
  readonly ofacScreeningProcess?: boolean;

  // Disclosures
  readonly monthlyReserveDisclosureProcess?: boolean;
  readonly publicDisclosureReady?: boolean;
  readonly riskDisclosureComplete?: boolean;

  // Legal review
  readonly legalCounselReviewed?: boolean;
}

// ─── Output Types ─────────────────────────────────────────────────────────────

export type GeniusActDecision =
  | "approved_not_executed"   // All checks pass — simulation only, not live
  | "needs_legal_review"      // Some checks pass but legal review required
  | "blocked";                // Required checks failed

export type GeniusActRequirementStatus = "met" | "not_met" | "unknown" | "requires_legal_review";

export interface GeniusActRequirementEvaluation {
  readonly requirement: string;
  readonly status: GeniusActRequirementStatus;
  readonly description: string;
  readonly blockingIfMissing: boolean;
}

export interface GeniusActReadinessReport {
  readonly reportType: "genius_act_stablecoin_readiness";
  readonly executionMode: "simulation_only";
  readonly liveIssuanceAllowed: false;
  readonly generatedAt: string;
  readonly decision: GeniusActDecision;
  readonly disclaimer: string;
  readonly requirements: readonly GeniusActRequirementEvaluation[];
  readonly blockedReasons: readonly string[];
  readonly legalReviewItems: readonly string[];
  readonly pendingEvidenceItems: readonly string[];
  readonly recommendedNextActions: readonly string[];
}

// ─── Evaluation Engine ────────────────────────────────────────────────────────

export function evaluateGeniusActReadiness(input: GeniusActReadinessInput): GeniusActReadinessReport {
  const requirements: GeniusActRequirementEvaluation[] = [];
  const blockedReasons: string[] = [];
  const legalReviewItems: string[] = [];
  const pendingEvidenceItems: string[] = [];
  const recommendedNextActions: string[] = [];

  // 1. Permitted issuer status
  const issuerStatus = evaluateRequirement(
    "Permitted Issuer Status",
    input.hasPermittedIssuerStatus,
    "GENIUS Act requires issuer to be a permitted payment stablecoin issuer: federal/state charter, insured depository, or approved entity.",
    true
  );
  requirements.push(issuerStatus);
  if (issuerStatus.status !== "met") {
    blockedReasons.push("No permitted issuer status — cannot issue payment stablecoin under GENIUS Act");
    recommendedNextActions.push("Determine chartering pathway (federal bank charter, state bank charter, federal trust charter, or insured depository)");
  }

  // 2. Chartering pathway
  const charteringEval: GeniusActRequirementEvaluation = {
    requirement: "Chartering Pathway",
    status: input.charteringPathway && input.charteringPathway !== "none" && input.charteringPathway !== "unknown"
      ? "requires_legal_review"
      : "not_met",
    description: "GENIUS Act requires issuer to hold a federal bank charter, state bank charter, federal trust charter, or be an insured depository institution. Pathway selection requires legal counsel.",
    blockingIfMissing: true,
  };
  requirements.push(charteringEval);
  if (charteringEval.status === "not_met") {
    blockedReasons.push("No chartering pathway established");
    pendingEvidenceItems.push("Chartering pathway legal opinion");
  } else {
    legalReviewItems.push("Chartering pathway regulatory review");
  }

  // 3. Reserve policy
  const reservePolicy = evaluateRequirement(
    "1:1 Reserve Backing Policy",
    input.reservePolicyDocumented,
    "GENIUS Act requires payment stablecoin to be backed 1:1 by eligible high-quality liquid assets (US Treasuries, central bank deposits, etc.).",
    true
  );
  requirements.push(reservePolicy);
  if (reservePolicy.status !== "met") {
    blockedReasons.push("Reserve policy not documented");
    pendingEvidenceItems.push("Reserve policy documentation and eligible asset composition");
  }

  // 4. Reserve composition
  const reserveComp: GeniusActRequirementEvaluation = {
    requirement: "Reserve Asset Composition",
    status: input.reserveComposition === "us_treasury" || input.reserveComposition === "central_bank_deposits" || input.reserveComposition === "repo_agreements"
      ? "requires_legal_review"
      : input.reserveComposition === "mixed"
        ? "requires_legal_review"
        : "not_met",
    description: "GENIUS Act specifies eligible reserve assets: US Treasuries with ≤93-day maturity, central bank reserves, repo backed by same. Mixed composition requires legal analysis of eligible/ineligible allocation.",
    blockingIfMissing: true,
  };
  requirements.push(reserveComp);
  if (reserveComp.status === "not_met") {
    blockedReasons.push("Reserve asset composition not defined or not eligible");
    pendingEvidenceItems.push("Reserve composition documentation per GENIUS Act eligible asset schedule");
  } else {
    legalReviewItems.push("Reserve asset composition legal review");
  }

  // 5. Monthly attestation
  const monthlyAttest = evaluateRequirement(
    "Monthly Reserve Attestation",
    input.monthlyAttestationProcess,
    "GENIUS Act requires monthly attestation of reserve backing by independent auditor or examination authority.",
    true
  );
  requirements.push(monthlyAttest);
  if (monthlyAttest.status !== "met") {
    blockedReasons.push("Monthly attestation process not established");
    pendingEvidenceItems.push("Attestation process documentation and auditor appointment");
  }

  // 6. Redemption at par
  const redemptionPar = evaluateRequirement(
    "Redemption at Par Policy",
    input.redemptionAtParPolicy,
    "GENIUS Act requires permitted issuer to redeem payment stablecoin at par (face value) on demand.",
    true
  );
  requirements.push(redemptionPar);
  if (redemptionPar.status !== "met") {
    blockedReasons.push("Redemption at par policy not documented");
    pendingEvidenceItems.push("Redemption policy documentation committing to at-par redemption");
  }

  // 7. Redemption process
  const redemptionProcess = evaluateRequirement(
    "Redemption Process Documentation",
    input.redemptionProcessDocumented,
    "Redemption process must be documented including timing, fees (if any), and prohibited conditions.",
    false
  );
  requirements.push(redemptionProcess);
  if (redemptionProcess.status !== "met") {
    legalReviewItems.push("Redemption process legal review and documentation");
  }

  // 8. AML/BSA program
  const amlProgram = evaluateRequirement(
    "AML/BSA Program",
    input.amlProgramDocumented && input.bsaProgramCompliance,
    "GENIUS Act requires a full AML/BSA compliance program including policies, procedures, monitoring, and SAR filing.",
    true
  );
  requirements.push(amlProgram);
  if (amlProgram.status !== "met") {
    blockedReasons.push("AML/BSA program not documented");
    pendingEvidenceItems.push("AML/BSA program documentation, officer appointment, and compliance manual");
  }

  // 9. AML Officer
  const amlOfficer = evaluateRequirement(
    "AML Officer Appointed",
    input.amlOfficerAppointed,
    "GENIUS Act requires a designated AML/Compliance Officer.",
    false
  );
  requirements.push(amlOfficer);
  if (amlOfficer.status !== "met") {
    legalReviewItems.push("AML officer appointment and qualification documentation");
  }

  // 10. Sanctions program
  const sanctionsProgram = evaluateRequirement(
    "Sanctions Compliance Program",
    input.sanctionsProgramDocumented && input.ofacScreeningProcess,
    "GENIUS Act requires robust sanctions compliance including OFAC screening.",
    true
  );
  requirements.push(sanctionsProgram);
  if (sanctionsProgram.status !== "met") {
    blockedReasons.push("Sanctions compliance program not documented");
    pendingEvidenceItems.push("Sanctions compliance program documentation and OFAC screening system specification");
  }

  // 11. Public disclosure
  const publicDisclosure = evaluateRequirement(
    "Monthly Reserve Disclosure",
    input.monthlyReserveDisclosureProcess && input.publicDisclosureReady,
    "GENIUS Act requires monthly public disclosure of reserve composition and attestation results.",
    false
  );
  requirements.push(publicDisclosure);
  if (publicDisclosure.status !== "met") {
    legalReviewItems.push("Monthly disclosure format legal review");
    pendingEvidenceItems.push("Monthly reserve disclosure process documentation");
  }

  // 12. Legal counsel
  const legalReview = evaluateRequirement(
    "Legal Counsel Review",
    input.legalCounselReviewed,
    "Legal counsel review of GENIUS Act compliance posture is required before any stablecoin issuance.",
    true
  );
  requirements.push(legalReview);
  if (legalReview.status !== "met") {
    blockedReasons.push("Legal counsel review not complete");
    legalReviewItems.push("Full GENIUS Act compliance legal opinion from qualified US counsel");
    recommendedNextActions.push("Engage qualified US regulatory counsel specializing in fintech and payment stablecoin regulation");
  }

  // Determine overall decision
  let decision: GeniusActDecision;
  if (blockedReasons.length > 0) {
    decision = "blocked";
  } else if (legalReviewItems.length > 0) {
    decision = "needs_legal_review";
  } else {
    decision = "approved_not_executed"; // All gates pass — still simulation only
  }

  if (recommendedNextActions.length === 0) {
    recommendedNextActions.push(
      "Maintain simulation-only posture pending regulatory approval",
      "Submit for Control Hub governance review"
    );
  }

  return {
    reportType: "genius_act_stablecoin_readiness",
    executionMode: "simulation_only",
    liveIssuanceAllowed: false,
    generatedAt: new Date().toISOString(),
    decision,
    disclaimer:
      "This report evaluates GENIUS Act stablecoin readiness posture only. " +
      "Passing all readiness checks does NOT constitute regulatory approval or legal GENIUS Act compliance. " +
      "Actual permitted payment stablecoin issuance requires regulatory approval from the OCC, Federal Reserve, " +
      "or state banking authority as applicable. " +
      "No live stablecoin issuance is permitted without regulatory approval. " +
      "Legal counsel review is required. This is a simulation-only evaluation.",
    requirements,
    blockedReasons,
    legalReviewItems,
    pendingEvidenceItems,
    recommendedNextActions,
  };
}

// ─── Default Simulation (no evidence provided) ────────────────────────────────

export function createGeniusActReadinessReport(): GeniusActReadinessReport {
  return evaluateGeniusActReadiness({});
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function evaluateRequirement(
  requirement: string,
  condition: boolean | undefined,
  description: string,
  blockingIfMissing: boolean
): GeniusActRequirementEvaluation {
  let status: GeniusActRequirementStatus;
  if (condition === true) {
    status = "requires_legal_review";
  } else if (condition === false) {
    status = "not_met";
  } else {
    status = "unknown";
  }
  return { requirement, status, description, blockingIfMissing };
}
