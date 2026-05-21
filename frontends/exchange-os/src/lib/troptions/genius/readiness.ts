import type {
  ComplianceGate,
  GeniusOverview,
  MerchantSettlementUseCase,
  PacketSummary,
  ReadinessScore,
  TroptionsGeniusProfile,
} from "@/lib/troptions/genius/types";
import { listBlockingItems } from "@/lib/troptions/genius/gates";

function scoreForLevel(gates: ComplianceGate[], level: "sandbox" | "partner_ready" | "regulator_ready" | "live"): number {
  const applicable = gates.filter((gate) => {
    const order = ["sandbox", "partner_ready", "regulator_ready", "live"];
    return order.indexOf(gate.requiredFor) <= order.indexOf(level);
  });

  if (applicable.length === 0) return 0;
  const approved = applicable.filter((gate) => gate.status === "approved").length;
  return Math.round((approved / applicable.length) * 100);
}

export function calculateReadinessScore(gates: ComplianceGate[]): ReadinessScore {
  return {
    sandboxScore: scoreForLevel(gates, "sandbox"),
    partnerScore: scoreForLevel(gates, "partner_ready"),
    regulatorScore: scoreForLevel(gates, "regulator_ready"),
    liveScore: scoreForLevel(gates, "live"),
    blockingItems: listBlockingItems(gates, "live"),
  };
}

export function classifyGeniusRisk(input: { blockers: string[]; publicChainAllowed: boolean; liveActionRequested: boolean }) {
  if (input.liveActionRequested && input.blockers.length > 0) return "critical" as const;
  if (input.publicChainAllowed && input.blockers.length > 0) return "high" as const;
  if (input.blockers.length > 0) return "medium" as const;
  return "low" as const;
}

export function createRegulatorPacketSummary(profile: TroptionsGeniusProfile, gates: ComplianceGate[]): PacketSummary {
  const readinessScore = calculateReadinessScore(gates);
  const approvedGates = gates.filter((gate) => gate.status === "approved").map((gate) => gate.label);
  const missingGates = gates.filter((gate) => gate.status !== "approved").map((gate) => gate.label);

  return {
    title: `${profile.programName} Regulator Readiness Packet`,
    generatedAt: new Date().toISOString(),
    status: readinessScore.liveScore === 100 ? "regulator_ready" : profile.issuanceStatus,
    readinessScore,
    approvedGates,
    missingGates,
    blockers: readinessScore.blockingItems,
    nextActions: [
      "Collect final legal counsel memo approval.",
      "Record formal board approval.",
      "Refresh reserve attestation and redemption policy evidence.",
    ],
    legalDisclaimer:
      "This packet documents readiness planning only. It does not represent licensure, approval, custody, insurance, or authority to issue live payment stablecoins.",
    liveIssuanceBlockedNotice:
      "Live minting, burning, and redemption remain blocked unless approved regulated issuer, legal, regulator, reserve, AML/KYC, disclosure, and audit controls are fully recorded.",
  };
}

export function getMerchantSettlementMap(): MerchantSettlementUseCase[] {
  return [
    {
      id: "member-payments",
      label: "Member payments",
      description: "Namespace-driven payment routing and sandbox settlement simulation for member disbursements.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "merchant-settlement",
      label: "Merchant settlement",
      description: "Merchant acceptance, settlement visibility, and redemption workflow coordination.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "contractor-payments",
      label: "Contractor payments",
      description: "Approved identity and invoice-linked contractor settlement paths in sandbox mode.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "escrow",
      label: "Escrow",
      description: "Escrow release planning with evidence, documentation, and hold conditions.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "rwa-settlement-support",
      label: "RWA settlement support",
      description: "Payment-rail support for RWA and private-market products without changing securities treatment.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "private-market-payment-rails",
      label: "Private market payment rails",
      description: "Evidence-rich workflow support for accredited and reviewed private-market transactions.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
    {
      id: "cross-border-partner-payments",
      label: "Cross-border partner payments",
      description: "Partner-orchestrated settlement visibility with sanctions and chain-risk review gates.",
      requiresLicensedIssuerBeforeLiveMoneyMovement: true,
    },
  ];
}

export function getGeniusOverview(profile: TroptionsGeniusProfile, gates: ComplianceGate[]): GeniusOverview {
  const overallReadinessScore = calculateReadinessScore(gates);

  return {
    currentMode: profile.issuerMode,
    stablecoinStatus: profile.issuanceStatus,
    tokenizedDepositStatus: "separate_lane_partner_required",
    creditUnionCusoReadiness: overallReadinessScore.partnerScore >= 60 ? "partner_diligence_underway" : "partner_packet_incomplete",
    reserveReadiness: profile.reservePolicyApproved && profile.reserveAttestationCurrent ? "reserve_controls_mapped" : "reserve_controls_incomplete",
    amlKycReadiness: profile.amlSanctionsProgramApproved && profile.kycKybProviderActive ? "mapped_not_live" : "provider_gap_open",
    publicChainReadiness: profile.publicChainAllowed ? "research_and_sandbox_only" : "private_rail_only",
    rwaGuardrailReadiness: profile.consumerDisclosuresApproved ? "guardrails_documented" : "guardrails_need_review",
    overallReadinessScore,
    nextBestActions: [
      "Complete the missing live gate approvals.",
      "Advance partner diligence for credit union, CUSO, and PPSI candidates.",
      "Refresh regulator packet evidence and board materials.",
    ],
    liveIssuanceStatus: profile.liveActionsEnabled ? "enabled" : "blocked",
  };
}