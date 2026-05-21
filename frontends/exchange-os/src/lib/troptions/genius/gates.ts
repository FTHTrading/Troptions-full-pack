import type {
  ComplianceGate,
  Decision,
  GateRequirementLevel,
  IssuerMode,
  NamespaceRecord,
  StablecoinAction,
  TroptionsGeniusProfile,
} from "@/lib/troptions/genius/types";

const LIVE_ACTIONS: StablecoinAction[] = ["live_mint", "live_burn", "live_redemption"];

const LIVE_PROFILE_REQUIREMENTS: Array<keyof TroptionsGeniusProfile> = [
  "legalCounselMemoApproved",
  "regulatorApprovalRecorded",
  "boardApprovalRecorded",
  "reservePolicyApproved",
  "reserveAttestationCurrent",
  "redemptionPolicyApproved",
  "amlSanctionsProgramApproved",
  "kycKybProviderActive",
  "incidentResponsePlanApproved",
  "consumerDisclosuresApproved",
  "chainRiskReviewApproved",
  "smartContractAuditApproved",
];

const LIVE_GATE_IDS = [
  "legal-counsel-memo",
  "board-approval",
  "regulator-approval",
  "reserve-policy",
  "reserve-attestation",
  "redemption-policy",
  "aml-bsa-policy",
  "sanctions-policy",
  "kyc-kyb-provider",
  "chain-analytics-provider",
  "smart-contract-audit",
  "incident-response-plan",
  "consumer-disclosures",
];

const PARTNER_OR_LICENSED: IssuerMode[] = ["partnered_ppsi", "licensed_ppsi"];

function gateSatisfiesRequirement(gate: ComplianceGate, level: GateRequirementLevel): boolean {
  const ordered: GateRequirementLevel[] = ["sandbox", "partner_ready", "regulator_ready", "live"];
  return ordered.indexOf(gate.requiredFor) <= ordered.indexOf(level);
}

export function listBlockingItems(gates: ComplianceGate[], requestedStatus: GateRequirementLevel): string[] {
  return gates
    .filter((gate) => gateSatisfiesRequirement(gate, requestedStatus))
    .filter((gate) => gate.status !== "approved")
    .map((gate) => `${gate.label} (${gate.status})`);
}

export function evaluateNamespaceSettlement(namespace: NamespaceRecord, profile: TroptionsGeniusProfile): Decision {
  const reasons: string[] = [];
  const requiredNextSteps: string[] = [];

  if (![namespace.kycStatus, namespace.kybStatus].includes("mock_approved")) {
    reasons.push("Namespace identity controls are not mock-approved for sandbox activity.");
    requiredNextSteps.push("Mock-approve KYC and KYB before settlement simulation.");
  }

  if (namespace.sanctionsStatus !== "clear") {
    reasons.push("Namespace sanctions status is not clear.");
    requiredNextSteps.push("Resolve sanctions review before any settlement path.");
  }

  return {
    allowed: reasons.length === 0,
    status: reasons.length === 0 ? "sandbox_ready" : "blocked",
    reasons,
    requiredNextSteps,
    riskRating: reasons.length === 0 ? "low" : "high",
  };
}

export function evaluateStablecoinAction(
  profile: TroptionsGeniusProfile,
  gates: ComplianceGate[],
  action: StablecoinAction,
  namespace?: NamespaceRecord,
): Decision {
  const reasons: string[] = [];
  const requiredNextSteps: string[] = [];

  if (LIVE_ACTIONS.includes(action)) {
    if (!PARTNER_OR_LICENSED.includes(profile.issuerMode)) {
      reasons.push("Live stablecoin actions require either a licensed PPSI or an approved partnered PPSI structure.");
    }

    const missingProfileFlags = LIVE_PROFILE_REQUIREMENTS.filter((field) => !profile[field]);
    if (missingProfileFlags.length > 0) {
      reasons.push(`Required live approvals are missing: ${missingProfileFlags.join(", ")}.`);
      requiredNextSteps.push("Complete all live approval flags before requesting live activation.");
    }

    const gateBlockers = listBlockingItems(gates.filter((gate) => LIVE_GATE_IDS.includes(gate.id)), "live");
    if (gateBlockers.length > 0) {
      reasons.push(`Live gate blockers remain: ${gateBlockers.join("; ")}.`);
      requiredNextSteps.push("Move all live-required gates to approved status.");
    }
  }

  if (!LIVE_ACTIONS.includes(action)) {
    const sandboxBlockers = listBlockingItems(gates, "sandbox");
    if (["simulate_mint", "simulate_burn", "simulate_transfer", "simulate_redemption_request"].includes(action) && sandboxBlockers.length > 0) {
      reasons.push(`Sandbox readiness is incomplete: ${sandboxBlockers.join("; ")}.`);
      requiredNextSteps.push("Approve all sandbox-required gates before running simulations.");
    }
  }

  if (namespace) {
    const namespaceDecision = evaluateNamespaceSettlement(namespace, profile);
    if (!namespaceDecision.allowed) {
      reasons.push(...namespaceDecision.reasons);
      requiredNextSteps.push(...namespaceDecision.requiredNextSteps);
    }
  }

  if (LIVE_ACTIONS.includes(action) && profile.publicChainAllowed && !profile.chainRiskReviewApproved) {
    reasons.push("Public chain use does not bypass chain risk review and smart contract audit requirements.");
  }

  if (reasons.length === 0) {
    return {
      allowed: true,
      status: LIVE_ACTIONS.includes(action) ? "live_enabled" : "sandbox_ready",
      reasons: [LIVE_ACTIONS.includes(action) ? "All live requirements are approved." : "Sandbox-only action approved."],
      requiredNextSteps: [],
      riskRating: LIVE_ACTIONS.includes(action) ? "medium" : "low",
    };
  }

  return {
    allowed: false,
    status: LIVE_ACTIONS.includes(action) ? "blocked_live" : "blocked_sandbox",
    reasons,
    requiredNextSteps: Array.from(new Set(requiredNextSteps)),
    riskRating: LIVE_ACTIONS.includes(action) ? "critical" : "high",
  };
}