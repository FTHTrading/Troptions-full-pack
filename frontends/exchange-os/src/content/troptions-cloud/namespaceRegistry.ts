/**
 * Troptions Cloud — Namespace Registry
 *
 * Defines the data model and mock records for Troptions Cloud namespaces.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   simulationOnly: true
 *   liveExecutionEnabled: false
 *
 * WHAT THIS IS NOT:
 * - Not a legal entity registry
 * - Not a securities or investment access system
 * - Not a token issuance or NFT minting system
 * - Not a live publishing or live financial gateway
 *
 * All namespace operations require compliance and legal review before
 * any live execution can be enabled.
 */

// ─── Namespace Types ──────────────────────────────────────────────────────────

export type TroptionsNamespaceType =
  | "personal"
  | "business"
  | "media"
  | "healthcare"
  | "enterprise"
  | "educational"
  | "community"
  | "partner";

export type TroptionsNamespaceStatus =
  | "active"
  | "pending_review"
  | "suspended"
  | "archived"
  | "onboarding";

export type TroptionsNamespacePlan =
  | "starter"
  | "member"
  | "creator"
  | "professional"
  | "business"
  | "enterprise";

export type TroptionsNamespaceModule =
  | "ai_studio"
  | "ai_system_builder"
  | "media_studio"
  | "proof_vault"
  | "healthcare_workspace"
  | "business_workspace"
  | "web3_identity"
  | "control_hub"
  | "education_library"
  | "defi_simulation"
  | "wallet_scaffold"
  | "opportunity_room"
  | "smart_contract_templates"
  | "audit_log"
  | "team_management";

export type TroptionsNamespaceRole =
  | "owner"
  | "admin"
  | "editor"
  | "creator"
  | "member"
  | "viewer"
  | "compliance_reviewer";

// ─── Access Grant ─────────────────────────────────────────────────────────────

export interface TroptionsAccessGrant {
  id: string;
  grantedTo: string; // userId or memberId
  module: TroptionsNamespaceModule;
  role: TroptionsNamespaceRole;
  grantedAt: string;
  expiresAt?: string;
  grantedBy: string; // userId of granting admin
  requiresControlHubApproval: boolean;
  controlHubApproved: boolean;
  /** SAFETY */
  simulationOnly: true;
  liveExecutionEnabled: false;
}

// ─── Namespace Member ─────────────────────────────────────────────────────────

export interface TroptionsNamespaceMember {
  userId: string;
  displayName: string;
  role: TroptionsNamespaceRole;
  joinedAt: string;
  status: "active" | "pending" | "suspended";
  enabledModules: TroptionsNamespaceModule[];
}

// ─── Namespace ────────────────────────────────────────────────────────────────

export interface TroptionsNamespace {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  type: TroptionsNamespaceType;
  ownerUserId: string;
  status: TroptionsNamespaceStatus;
  plan: TroptionsNamespacePlan;
  enabledModules: TroptionsNamespaceModule[];
  issuedAccessGrants: TroptionsAccessGrant[];
  members: TroptionsNamespaceMember[];

  // Feature flags
  publicProfileEnabled: boolean;
  aiToolsEnabled: boolean;
  aiSystemBuilderEnabled: boolean;
  mediaStudioEnabled: boolean;
  proofVaultEnabled: boolean;
  healthcareWorkspaceEnabled: boolean;
  businessWorkspaceEnabled: boolean;
  web3IdentityEnabled: boolean;
  controlHubRequired: boolean;

  // Membership link
  membershipPlanId: string;
  membershipStatus: "active" | "pending" | "expired" | "suspended";
  duesStatus: "current" | "past_due" | "pending" | "waived";

  createdAt: string;
  updatedAt: string;

  /** SAFETY: always true — no live execution in this phase */
  simulationOnly: true;
  /** SAFETY: always false — no live execution in this phase */
  liveExecutionEnabled: false;
}

// ─── Mock Records ─────────────────────────────────────────────────────────────

export const TROPTIONS_NAMESPACES: TroptionsNamespace[] = [
  {
    id: "ns-001",
    slug: "troptions",
    displayName: "Troptions",
    description: "Core Troptions platform namespace — infrastructure, tooling, and protocol access.",
    type: "enterprise",
    ownerUserId: "user-troptions-admin",
    status: "active",
    plan: "enterprise",
    enabledModules: [
      "ai_studio",
      "ai_system_builder",
      "proof_vault",
      "control_hub",
      "audit_log",
      "team_management",
      "smart_contract_templates",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: true,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: true,
    mediaStudioEnabled: false,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: true,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-enterprise",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-002",
    slug: "troptions-tv",
    displayName: "Troptions TV",
    description: "Troptions Television Network media namespace — channels, content, creator tools.",
    type: "media",
    ownerUserId: "user-ttn-admin",
    status: "active",
    plan: "professional",
    enabledModules: [
      "ai_studio",
      "media_studio",
      "proof_vault",
      "audit_log",
      "team_management",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: true,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-professional",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-003",
    slug: "troptions-media",
    displayName: "Troptions Media",
    description: "Troptions media production, distribution, and content rights workspace.",
    type: "media",
    ownerUserId: "user-media-admin",
    status: "active",
    plan: "business",
    enabledModules: [
      "ai_studio",
      "media_studio",
      "proof_vault",
      "audit_log",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: true,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: false,
    membershipPlanId: "plan-business",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-004",
    slug: "troptions-health",
    displayName: "Troptions Health",
    description: "Troptions Healthcare Workspace — administrative tools, education library, and compliance scaffolding. No clinical decisions.",
    type: "healthcare",
    ownerUserId: "user-health-admin",
    status: "pending_review",
    plan: "enterprise",
    enabledModules: [
      "healthcare_workspace",
      "education_library",
      "audit_log",
      "control_hub",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: false,
    aiToolsEnabled: false,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: true,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-enterprise",
    membershipStatus: "pending",
    duesStatus: "pending",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-005",
    slug: "troptions-business",
    displayName: "Troptions Business",
    description: "Troptions Business Workspace — proposal tools, business document generation, and opportunity room access.",
    type: "business",
    ownerUserId: "user-biz-admin",
    status: "active",
    plan: "business",
    enabledModules: [
      "ai_studio",
      "business_workspace",
      "smart_contract_templates",
      "audit_log",
      "opportunity_room",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: false,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: true,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-business",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-006",
    slug: "troptions-ai",
    displayName: "Troptions AI",
    description: "Troptions AI namespace — AI Studio, AI System Builder, and autonomous agent scaffolding.",
    type: "enterprise",
    ownerUserId: "user-ai-admin",
    status: "active",
    plan: "enterprise",
    enabledModules: [
      "ai_studio",
      "ai_system_builder",
      "control_hub",
      "audit_log",
      "team_management",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: false,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: true,
    mediaStudioEnabled: false,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-enterprise",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-007",
    slug: "troptions-news",
    displayName: "Troptions News",
    description: "Troptions News namespace — newsroom tools, article generation, and editorial workflow.",
    type: "media",
    ownerUserId: "user-news-admin",
    status: "active",
    plan: "creator",
    enabledModules: [
      "ai_studio",
      "media_studio",
      "audit_log",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: true,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: true,
    proofVaultEnabled: false,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: false,
    membershipPlanId: "plan-creator",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-008",
    slug: "troptions-studios",
    displayName: "Troptions Studios",
    description: "Troptions Studios namespace — film, podcast, and video production tools with proof-backed rights management.",
    type: "media",
    ownerUserId: "user-studios-admin",
    status: "active",
    plan: "professional",
    enabledModules: [
      "ai_studio",
      "media_studio",
      "proof_vault",
      "audit_log",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: true,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: false,
    membershipPlanId: "plan-professional",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-009",
    slug: "troptions-proof",
    displayName: "Troptions Proof",
    description: "Troptions Proof Vault namespace — IPFS-backed evidence, document fingerprinting, and proof registry.",
    type: "enterprise",
    ownerUserId: "user-proof-admin",
    status: "active",
    plan: "professional",
    enabledModules: [
      "proof_vault",
      "audit_log",
      "control_hub",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: false,
    aiToolsEnabled: false,
    aiSystemBuilderEnabled: false,
    mediaStudioEnabled: false,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: false,
    web3IdentityEnabled: false,
    controlHubRequired: true,
    membershipPlanId: "plan-professional",
    membershipStatus: "active",
    duesStatus: "current",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "ns-010",
    slug: "troptions-enterprise",
    displayName: "Troptions Enterprise",
    description: "Troptions Enterprise namespace — full-stack access to all modules pending compliance review.",
    type: "enterprise",
    ownerUserId: "user-enterprise-admin",
    status: "pending_review",
    plan: "enterprise",
    enabledModules: [
      "ai_studio",
      "ai_system_builder",
      "media_studio",
      "proof_vault",
      "business_workspace",
      "smart_contract_templates",
      "audit_log",
      "control_hub",
      "team_management",
      "education_library",
      "defi_simulation",
      "wallet_scaffold",
    ],
    issuedAccessGrants: [],
    members: [],
    publicProfileEnabled: false,
    aiToolsEnabled: true,
    aiSystemBuilderEnabled: true,
    mediaStudioEnabled: true,
    proofVaultEnabled: true,
    healthcareWorkspaceEnabled: false,
    businessWorkspaceEnabled: true,
    web3IdentityEnabled: true,
    controlHubRequired: true,
    membershipPlanId: "plan-enterprise",
    membershipStatus: "pending",
    duesStatus: "pending",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getNamespace(slug: string): TroptionsNamespace | undefined {
  return TROPTIONS_NAMESPACES.find((n) => n.slug === slug);
}

export function getNamespaceById(id: string): TroptionsNamespace | undefined {
  return TROPTIONS_NAMESPACES.find((n) => n.id === id);
}

export function getActiveNamespaces(): TroptionsNamespace[] {
  return TROPTIONS_NAMESPACES.filter((n) => n.status === "active");
}

export function getNamespacesByType(type: TroptionsNamespaceType): TroptionsNamespace[] {
  return TROPTIONS_NAMESPACES.filter((n) => n.type === type);
}

export function getNamespacesWithModule(module: TroptionsNamespaceModule): TroptionsNamespace[] {
  return TROPTIONS_NAMESPACES.filter((n) => n.enabledModules.includes(module));
}

export const NAMESPACE_PLAN_LABELS: Record<TroptionsNamespacePlan, string> = {
  starter: "Starter",
  member: "Member",
  creator: "Creator",
  professional: "Professional",
  business: "Business",
  enterprise: "Enterprise",
};

export const NAMESPACE_STATUS_LABELS: Record<TroptionsNamespaceStatus, string> = {
  active: "Active",
  pending_review: "Pending Review",
  suspended: "Suspended",
  archived: "Archived",
  onboarding: "Onboarding",
};

export const NAMESPACE_MODULE_LABELS: Record<TroptionsNamespaceModule, string> = {
  ai_studio: "AI Studio",
  ai_system_builder: "AI System Builder",
  media_studio: "Media Studio",
  proof_vault: "Proof Vault",
  healthcare_workspace: "Healthcare Workspace",
  business_workspace: "Business Workspace",
  web3_identity: "Web3 Identity",
  control_hub: "Control Hub",
  education_library: "Education Library",
  defi_simulation: "DeFi Simulation",
  wallet_scaffold: "Wallet Scaffold",
  opportunity_room: "Opportunity Room",
  smart_contract_templates: "Smart Contract Templates",
  audit_log: "Audit Log",
  team_management: "Team Management",
};
