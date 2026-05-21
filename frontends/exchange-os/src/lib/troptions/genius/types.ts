export type IssuerMode =
  | "research_only"
  | "sandbox_simulation"
  | "partnered_ppsi"
  | "licensed_ppsi";

export type IssuanceStatus =
  | "not_started"
  | "blocked_missing_legal"
  | "blocked_missing_regulator_approval"
  | "blocked_missing_reserve_policy"
  | "blocked_missing_reserve_attestation"
  | "blocked_missing_aml_sanctions_program"
  | "blocked_missing_kyc_kyb_provider"
  | "blocked_missing_redemption_policy"
  | "blocked_missing_board_approval"
  | "sandbox_ready"
  | "partner_ready"
  | "regulator_ready"
  | "live_enabled";

export type StablecoinAction =
  | "simulate_mint"
  | "simulate_burn"
  | "simulate_transfer"
  | "simulate_redemption_request"
  | "create_readiness_packet"
  | "create_partner_packet"
  | "create_regulator_packet"
  | "live_mint"
  | "live_burn"
  | "live_redemption";

export type GateStatus = "missing" | "draft" | "review" | "approved" | "expired" | "blocked";

export type GateRequirementLevel = "sandbox" | "partner_ready" | "regulator_ready" | "live";

export type RiskRating = "low" | "medium" | "high" | "critical";

export type NamespaceType =
  | "member"
  | "merchant"
  | "institution"
  | "cuso"
  | "credit_union"
  | "ppsi"
  | "reserve_custodian"
  | "auditor"
  | "legal"
  | "regulator";

export type ApprovalStatus = "missing" | "candidate" | "diligence" | "approved";

export interface TroptionsGeniusProfile {
  programName: string;
  issuerMode: IssuerMode;
  issuanceStatus: IssuanceStatus;
  jurisdiction: string;
  creditUnionPartnerName?: string;
  cusoPartnerName?: string;
  ppsiPartnerName?: string;
  reserveCustodianName?: string;
  kycKybProviderName?: string;
  amlProviderName?: string;
  chainNetworksAllowed: string[];
  publicChainAllowed: boolean;
  liveActionsEnabled: boolean;
  legalCounselMemoApproved: boolean;
  regulatorApprovalRecorded: boolean;
  boardApprovalRecorded: boolean;
  reservePolicyApproved: boolean;
  reserveAttestationCurrent: boolean;
  redemptionPolicyApproved: boolean;
  amlSanctionsProgramApproved: boolean;
  kycKybProviderActive: boolean;
  incidentResponsePlanApproved: boolean;
  consumerDisclosuresApproved: boolean;
  chainRiskReviewApproved: boolean;
  smartContractAuditApproved: boolean;
}

export interface ComplianceGate {
  id: string;
  label: string;
  status: GateStatus;
  requiredFor: GateRequirementLevel;
  evidenceUri?: string;
  owner?: string;
  lastReviewedAt?: string;
}

export interface ReadinessScore {
  sandboxScore: number;
  partnerScore: number;
  regulatorScore: number;
  liveScore: number;
  blockingItems: string[];
}

export interface Decision {
  allowed: boolean;
  status: string;
  reasons: string[];
  requiredNextSteps: string[];
  riskRating: RiskRating;
}

export interface PacketSummary {
  title: string;
  generatedAt: string;
  status: string;
  readinessScore: ReadinessScore;
  approvedGates: string[];
  missingGates: string[];
  blockers: string[];
  nextActions: string[];
  legalDisclaimer: string;
  liveIssuanceBlockedNotice: string;
}

export interface NamespaceRecord {
  namespaceId: string;
  displayName: string;
  namespaceType: NamespaceType;
  kycStatus: "mock_approved" | "pending" | "missing";
  kybStatus: "mock_approved" | "pending" | "missing";
  sanctionsStatus: "clear" | "review" | "blocked";
  walletStatus: "sandbox_enabled" | "pending" | "blocked";
  settlementStatus: "simulation_only" | "partner_gated" | "live_locked";
  allowedActions: StablecoinAction[];
  blockedActions: StablecoinAction[];
  evidenceLinks: string[];
}

export interface PartnerRecord {
  id: string;
  category:
    | "credit_union_partner"
    | "cuso_partner"
    | "ppsi_partner"
    | "reserve_custodian"
    | "kyc_kyb_provider"
    | "aml_sanctions_provider"
    | "chain_analytics_provider"
    | "legal_counsel"
    | "audit_attestation_provider"
    | "cybersecurity_provider";
  name: string;
  readiness: ApprovalStatus;
  summary: string;
  allowedForResearch: true;
  allowedForSandbox: true;
  allowedForLive: false;
}

export interface SimulatedLedgerEvent {
  eventId: string;
  tokenSymbol: "TROP-USD-SIM";
  amount: string;
  from: string;
  to: string;
  status: "simulated_only";
  legalNotice: string;
}

export interface SimulatedRedemptionEvent {
  redemptionId: string;
  memberNamespace: string;
  amount: string;
  status: "simulated_only";
  blockedLiveReason: string;
}

export interface MerchantSettlementUseCase {
  id: string;
  label: string;
  description: string;
  requiresLicensedIssuerBeforeLiveMoneyMovement: true;
}

export interface GeniusOverview {
  currentMode: IssuerMode;
  stablecoinStatus: IssuanceStatus;
  tokenizedDepositStatus: "separate_lane_partner_required" | "not_started";
  creditUnionCusoReadiness: string;
  reserveReadiness: string;
  amlKycReadiness: string;
  publicChainReadiness: string;
  rwaGuardrailReadiness: string;
  overallReadinessScore: ReadinessScore;
  nextBestActions: string[];
  liveIssuanceStatus: "blocked" | "enabled";
}