/**
 * Troptions Cloud — Membership Registry
 *
 * Defines membership tiers, plans, access grants, and access restrictions.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   simulationOnly: true
 *   liveExecutionEnabled: false
 *   liveTradingEnabled: false
 *   liveInvestmentAccessEnabled: false
 *   legalReviewRequiredForOpportunities: true
 *
 * WHAT MEMBERSHIP IS NOT:
 * - Not a securities offering
 * - Not an investment vehicle
 * - Not a guarantee of returns, yield, or profit
 * - Not a guarantee of private-market or opportunity access
 * - Not an ownership stake in any asset
 *
 * Membership dues unlock platform tool access only.
 * Any opportunity room access requires legal eligibility review.
 * All financial and investment features require compliance clearance.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type TroptionsMembershipTier =
  | "visitor"
  | "registered"
  | "member"
  | "creator"
  | "business"
  | "professional"
  | "enterprise"
  | "compliance_review"
  | "restricted";

export type TroptionsMembershipStatus =
  | "active"
  | "pending"
  | "suspended"
  | "expired"
  | "cancelled"
  | "under_review";

export type TroptionsDuesStatus =
  | "current"
  | "past_due"
  | "pending"
  | "waived"
  | "refunded";

// ─── Perks ────────────────────────────────────────────────────────────────────

export interface TroptionsMembershipPerk {
  id: string;
  label: string;
  description: string;
  module?: string;
  requiresComplianceReview: boolean;
  requiresLegalEligibility: boolean;
}

// ─── Access Restriction ───────────────────────────────────────────────────────

export interface TroptionsAccessRestriction {
  module: string;
  reason: string;
  requiresControlHubApproval: boolean;
  legalReviewRequired: boolean;
}

// ─── Access Grant ─────────────────────────────────────────────────────────────

export interface TroptionsMembershipAccessGrant {
  id: string;
  memberId: string;
  grantedModules: string[];
  restrictedModules: TroptionsAccessRestriction[];
  issuedAt: string;
  expiresAt?: string;
  controlHubApproved: boolean;
  /** SAFETY */
  simulationOnly: true;
  liveExecutionEnabled: false;
}

// ─── Membership Plan ──────────────────────────────────────────────────────────

export interface TroptionsMembershipPlan {
  id: string;
  slug: string;
  tier: TroptionsMembershipTier;
  displayName: string;
  description: string;
  monthlyDues: number | null; // null = contact for pricing
  annualDues: number | null;
  currency: "USD";
  perks: TroptionsMembershipPerk[];
  restrictions: TroptionsAccessRestriction[];

  // Module access flags
  namespacesAllowed: number; // -1 = unlimited
  aiStudioEnabled: boolean;
  aiSystemBuilderEnabled: boolean;
  mediaStudioEnabled: boolean;
  proofVaultEnabled: boolean;
  healthcareWorkspaceEnabled: boolean;
  businessWorkspaceEnabled: boolean;
  educationLibraryEnabled: boolean;
  defiSimulationEnabled: boolean;
  walletScaffoldEnabled: boolean;
  opportunityRoomApplicationEnabled: boolean;
  smartContractTemplatesEnabled: boolean;
  controlHubReviewQueueEnabled: boolean;

  // Safety invariants
  /** SAFETY: always true */
  simulationOnly: true;
  /** SAFETY: always false */
  liveExecutionEnabled: false;
  /** SAFETY: always false */
  liveTradingEnabled: false;
  /** SAFETY: always false */
  liveInvestmentAccessEnabled: false;
  /** Opportunity room requires eligibility review — always true */
  legalReviewRequiredForOpportunities: true;
}

// ─── Mock Plans ───────────────────────────────────────────────────────────────

export const TROPTIONS_MEMBERSHIP_PLANS: TroptionsMembershipPlan[] = [
  {
    id: "plan-visitor",
    slug: "visitor",
    tier: "visitor",
    displayName: "Visitor",
    description: "Public read-only access to Troptions platform information and educational content.",
    monthlyDues: 0,
    annualDues: 0,
    currency: "USD",
    perks: [
      {
        id: "perk-visitor-1",
        label: "Public content access",
        description: "Access to public Troptions pages, news, and educational materials.",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
    ],
    restrictions: [
      {
        module: "ai_studio",
        reason: "AI Studio requires member registration.",
        requiresControlHubApproval: false,
        legalReviewRequired: false,
      },
    ],
    namespacesAllowed: 0,
    aiStudioEnabled: false,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    educationLibraryEnabled: true,
    defiSimulationEnabled: false,
    walletScaffoldEnabled: false,
    opportunityRoomApplicationEnabled: false,
    smartContractTemplatesEnabled: false,
    controlHubReviewQueueEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-registered",
    slug: "registered",
    tier: "registered",
    displayName: "Registered",
    description: "Registered user with access to basic platform tools and one personal namespace.",
    monthlyDues: 0,
    annualDues: 0,
    currency: "USD",
    perks: [
      {
        id: "perk-reg-1",
        label: "Personal namespace",
        description: "One personal Troptions Cloud namespace.",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-reg-2",
        label: "Education library access",
        description: "Access to Troptions education and research materials.",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
    ],
    restrictions: [],
    namespacesAllowed: 1,
    aiStudioEnabled: false,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    educationLibraryEnabled: true,
    defiSimulationEnabled: false,
    walletScaffoldEnabled: false,
    opportunityRoomApplicationEnabled: false,
    smartContractTemplatesEnabled: false,
    controlHubReviewQueueEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-member",
    slug: "member",
    tier: "member",
    displayName: "Member",
    description: "Active Troptions member with AI Studio access, proof vault, and one namespace.",
    monthlyDues: 49,
    annualDues: 499,
    currency: "USD",
    perks: [
      {
        id: "perk-mem-1",
        label: "Troptions AI Studio",
        description: "Access to AI writing, content, and document tools.",
        module: "ai_studio",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-mem-2",
        label: "Proof Vault access",
        description: "IPFS-backed document fingerprinting and proof registry.",
        module: "proof_vault",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-mem-3",
        label: "Education library",
        description: "Full access to Troptions research and education materials.",
        module: "education_library",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
    ],
    restrictions: [],
    namespacesAllowed: 1,
    aiStudioEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    educationLibraryEnabled: true,
    defiSimulationEnabled: false,
    walletScaffoldEnabled: false,
    opportunityRoomApplicationEnabled: false,
    smartContractTemplatesEnabled: false,
    controlHubReviewQueueEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-creator",
    slug: "creator",
    tier: "creator",
    displayName: "Creator",
    description: "Troptions Creator plan — AI Studio, Media Studio, Proof Vault, and creator tools.",
    monthlyDues: 99,
    annualDues: 999,
    currency: "USD",
    perks: [
      {
        id: "perk-cre-1",
        label: "Troptions AI Studio",
        description: "Full AI writing and content generation toolkit.",
        module: "ai_studio",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-cre-2",
        label: "Media Studio",
        description: "Media production workflow tools for TTN creators.",
        module: "media_studio",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-cre-3",
        label: "Proof Vault",
        description: "IPFS document fingerprinting and rights evidence tools.",
        module: "proof_vault",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-cre-4",
        label: "Smart contract templates",
        description: "Access to Troptions smart contract template library for review.",
        module: "smart_contract_templates",
        requiresComplianceReview: true,
        requiresLegalEligibility: true,
      },
    ],
    restrictions: [],
    namespacesAllowed: 2,
    aiStudioEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    educationLibraryEnabled: true,
    defiSimulationEnabled: false,
    walletScaffoldEnabled: false,
    opportunityRoomApplicationEnabled: false,
    smartContractTemplatesEnabled: true,
    controlHubReviewQueueEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-business",
    slug: "business",
    tier: "business",
    displayName: "Business",
    description: "Troptions Business plan — AI tools, business workspace, opportunity room application access, and 3 namespaces.",
    monthlyDues: 249,
    annualDues: 2499,
    currency: "USD",
    perks: [
      {
        id: "perk-biz-1",
        label: "AI Studio",
        description: "Full AI writing, proposal, and content toolkit.",
        module: "ai_studio",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-biz-2",
        label: "Business Workspace",
        description: "Proposal builder, business document tools, and workflow scaffolding.",
        module: "business_workspace",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-biz-3",
        label: "Opportunity Room application",
        description: "Submit an application to join the Troptions Opportunity Room. Access subject to legal eligibility review.",
        module: "opportunity_room",
        requiresComplianceReview: true,
        requiresLegalEligibility: true,
      },
      {
        id: "perk-biz-4",
        label: "DeFi simulation lab",
        description: "Simulation-only DeFi workflow modeling tools. No live trading or investment execution.",
        module: "defi_simulation",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-biz-5",
        label: "Smart contract templates",
        description: "Template library for review. Legal/compliance clearance required before deployment.",
        module: "smart_contract_templates",
        requiresComplianceReview: true,
        requiresLegalEligibility: true,
      },
    ],
    restrictions: [
      {
        module: "opportunity_room",
        reason: "Opportunity Room access requires individual legal eligibility review. Membership does not guarantee access.",
        requiresControlHubApproval: true,
        legalReviewRequired: true,
      },
    ],
    namespacesAllowed: 3,
    aiStudioEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: true,
    educationLibraryEnabled: true,
    defiSimulationEnabled: true,
    walletScaffoldEnabled: false,
    opportunityRoomApplicationEnabled: true,
    smartContractTemplatesEnabled: true,
    controlHubReviewQueueEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-professional",
    slug: "professional",
    tier: "professional",
    displayName: "Professional",
    description: "Troptions Professional plan — AI System Builder, all workspaces, wallet scaffold preview, and 5 namespaces.",
    monthlyDues: 499,
    annualDues: 4999,
    currency: "USD",
    perks: [
      {
        id: "perk-pro-1",
        label: "AI System Builder",
        description: "Build and manage AI agent systems with Control Hub approval workflow.",
        module: "ai_system_builder",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-pro-2",
        label: "Wallet scaffold preview",
        description: "Preview Troptions wallet architecture. No live wallets or token issuance.",
        module: "wallet_scaffold",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-pro-3",
        label: "Control Hub review queue",
        description: "Submit items for Troptions Control Hub compliance review.",
        module: "control_hub",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-pro-4",
        label: "Opportunity Room application",
        description: "Submit an application for Opportunity Room. Access subject to legal eligibility review.",
        module: "opportunity_room",
        requiresComplianceReview: true,
        requiresLegalEligibility: true,
      },
    ],
    restrictions: [
      {
        module: "opportunity_room",
        reason: "Opportunity Room access requires individual legal eligibility review. Membership does not guarantee access.",
        requiresControlHubApproval: true,
        legalReviewRequired: true,
      },
    ],
    namespacesAllowed: 5,
    aiStudioEnabled: true,
    aiSystemBuilderEnabled: true,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: true,
    educationLibraryEnabled: true,
    defiSimulationEnabled: true,
    walletScaffoldEnabled: true,
    opportunityRoomApplicationEnabled: true,
    smartContractTemplatesEnabled: true,
    controlHubReviewQueueEnabled: true,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
  {
    id: "plan-enterprise",
    slug: "enterprise",
    tier: "enterprise",
    displayName: "Enterprise",
    description: "Troptions Enterprise plan — full module access, unlimited namespaces, dedicated Control Hub path, and compliance review queue.",
    monthlyDues: null,
    annualDues: null,
    currency: "USD",
    perks: [
      {
        id: "perk-ent-1",
        label: "Unlimited namespaces",
        description: "Create and manage unlimited Troptions Cloud namespaces.",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-ent-2",
        label: "All modules",
        description: "Access to all enabled Troptions Cloud modules subject to compliance review.",
        requiresComplianceReview: true,
        requiresLegalEligibility: false,
      },
      {
        id: "perk-ent-3",
        label: "Healthcare Workspace",
        description: "Administrative and educational tools only. Requires BAA and compliance clearance.",
        module: "healthcare_workspace",
        requiresComplianceReview: true,
        requiresLegalEligibility: true,
      },
      {
        id: "perk-ent-4",
        label: "Dedicated Control Hub path",
        description: "Direct access to Troptions Control Hub for enterprise compliance review.",
        module: "control_hub",
        requiresComplianceReview: false,
        requiresLegalEligibility: false,
      },
    ],
    restrictions: [
      {
        module: "healthcare_workspace",
        reason: "Healthcare Workspace requires BAA execution, HIPAA compliance review, and Control Hub approval before any clinical-adjacent use.",
        requiresControlHubApproval: true,
        legalReviewRequired: true,
      },
      {
        module: "opportunity_room",
        reason: "Opportunity Room access requires individual legal eligibility review regardless of tier.",
        requiresControlHubApproval: true,
        legalReviewRequired: true,
      },
    ],
    namespacesAllowed: -1,
    aiStudioEnabled: true,
    aiSystemBuilderEnabled: true,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: true,
    businessWorkspaceEnabled: true,
    educationLibraryEnabled: true,
    defiSimulationEnabled: true,
    walletScaffoldEnabled: true,
    opportunityRoomApplicationEnabled: true,
    smartContractTemplatesEnabled: true,
    controlHubReviewQueueEnabled: true,
    simulationOnly: true,
    liveExecutionEnabled: false,
    liveTradingEnabled: false,
    liveInvestmentAccessEnabled: false,
    legalReviewRequiredForOpportunities: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMembershipPlan(id: string): TroptionsMembershipPlan | undefined {
  return TROPTIONS_MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export function getMembershipPlanBySlug(slug: string): TroptionsMembershipPlan | undefined {
  return TROPTIONS_MEMBERSHIP_PLANS.find((p) => p.slug === slug);
}

export function getMembershipPlanByTier(tier: TroptionsMembershipTier): TroptionsMembershipPlan | undefined {
  return TROPTIONS_MEMBERSHIP_PLANS.find((p) => p.tier === tier);
}

export const MEMBERSHIP_TIER_LABELS: Record<TroptionsMembershipTier, string> = {
  visitor: "Visitor",
  registered: "Registered",
  member: "Member",
  creator: "Creator",
  business: "Business",
  professional: "Professional",
  enterprise: "Enterprise",
  compliance_review: "Compliance Review",
  restricted: "Restricted",
};

export const DUES_STATUS_LABELS: Record<TroptionsDuesStatus, string> = {
  current: "Current",
  past_due: "Past Due",
  pending: "Pending",
  waived: "Waived",
  refunded: "Refunded",
};
