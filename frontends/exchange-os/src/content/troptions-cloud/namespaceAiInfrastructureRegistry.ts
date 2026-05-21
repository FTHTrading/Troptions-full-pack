/**
 * Troptions Cloud — Namespace AI Infrastructure Registry
 *
 * Defines the AI infrastructure profile for every Troptions namespace.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   externalApiCallsEnabled: false  — for ALL namespaces
 *   requiresControlHubApproval: true — for ALL namespaces
 *   executionMode: simulation_only | read_only | approval_required | disabled
 *
 * No live AI API calls, no live model execution, no PHI intake.
 * Healthcare namespace blocks diagnosis, treatment, PHI, and emergency guidance.
 */

import type {
  NamespaceAiInfrastructureProfile,
  NamespaceAiSystemInstance,
  NamespaceKnowledgeVaultProfile,
  NamespaceModelRoutingPolicy,
  NamespaceToolAccessPolicy,
} from "@/lib/troptions-cloud/namespaceAiX402Types";

// ─── Shared policy fragments ──────────────────────────────────────────────────

const STANDARD_BLOCKED_PROVIDERS = [
  "unknown",
  "unverified",
  "shadow",
  "external_unvetted",
];

const STANDARD_MODEL_ROUTING: NamespaceModelRoutingPolicy = {
  allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
  blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
  defaultProvider: "troptions-sovereign",
  requiresApprovalForUnknownProvider: true,
  fallbackBehavior: "block",
};

const STANDARD_TOOL_POLICY: NamespaceToolAccessPolicy = {
  allowedTools: [
    "content_draft",
    "outline_generator",
    "document_summarizer",
    "knowledge_vault_search",
    "proof_packet_generate",
    "web3_readiness_report",
  ],
  blockedTools: [
    "live_trade_execute",
    "live_wallet_transfer",
    "live_payment_charge",
    "phi_intake",
    "diagnosis_engine",
    "treatment_recommendation",
    "emergency_guidance",
  ],
  highRiskTools: [
    "report_export",
    "document_hash",
    "xrpl_route_simulation",
    "stellar_route_simulation",
  ],
  requiresApprovalForHighRisk: true,
  requiresApprovalForUnknownTool: true,
};

const HEALTHCARE_TOOL_POLICY: NamespaceToolAccessPolicy = {
  allowedTools: [
    "document_summarizer",
    "knowledge_vault_search",
    "proof_packet_generate",
    "web3_readiness_report",
  ],
  blockedTools: [
    "live_trade_execute",
    "live_wallet_transfer",
    "live_payment_charge",
    "phi_intake",
    "diagnosis_engine",
    "treatment_recommendation",
    "emergency_guidance",
    "clinical_decision_support",
    "patient_data_processor",
    "medical_imaging_analysis",
  ],
  highRiskTools: ["report_export", "document_hash"],
  requiresApprovalForHighRisk: true,
  requiresApprovalForUnknownTool: true,
};

// ─── Helper to build a standard AI system instance ────────────────────────────

function sys(
  id: string,
  name: string,
  category: string,
  enabled = true,
): NamespaceAiSystemInstance {
  return {
    systemId: id,
    displayName: name,
    category,
    enabled,
    requiresApproval: true,
    executionMode: "simulation_only",
    externalApiCallsEnabled: false,
  };
}

// ─── Helper to build a knowledge vault profile ────────────────────────────────

function vault(
  id: string,
  name: string,
  category: string,
  level: NamespaceKnowledgeVaultProfile["accessLevel"] = "membership_required",
): NamespaceKnowledgeVaultProfile {
  return {
    vaultId: id,
    displayName: name,
    category,
    accessLevel: level,
    queryEnabled: true,
    requiresComplianceReview: false,
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const NAMESPACE_AI_INFRASTRUCTURE_REGISTRY: NamespaceAiInfrastructureProfile[] = [
  // ── troptions (core) ───────────────────────────────────────────────────────
  {
    namespaceId: "troptions",
    displayName: "Troptions Core",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-troptions-creator", "Creator Assistant", "Content"),
      sys("ai-troptions-compliance", "Compliance Reviewer", "Compliance"),
      sys("ai-troptions-xrpl-analyst", "XRPL Route Analyst", "Web3", false),
    ],
    knowledgeVaults: [
      vault("kv-troptions-docs", "Troptions Documentation", "Platform"),
      vault("kv-troptions-web3", "Web3 & XRPL Knowledge", "Web3"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: STANDARD_TOOL_POLICY.allowedTools,
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "local_only",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: STANDARD_TOOL_POLICY,
  },

  // ── troptions-enterprise ──────────────────────────────────────────────────
  {
    namespaceId: "troptions-enterprise",
    displayName: "Troptions Enterprise",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-enterprise-analyst", "Enterprise Analyst", "Business Intelligence"),
      sys("ai-enterprise-contract", "Contract Reviewer", "Legal"),
      sys("ai-enterprise-compliance", "Enterprise Compliance AI", "Compliance"),
      sys("ai-enterprise-workflow", "Workflow Automation AI", "Operations"),
    ],
    knowledgeVaults: [
      vault("kv-enterprise-contracts", "Contract Library", "Legal", "approval_required"),
      vault("kv-enterprise-compliance", "Compliance Repository", "Compliance", "approval_required"),
      vault("kv-enterprise-market", "Market Intelligence Vault", "Business"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "contract_analyzer", "workflow_builder"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "full",
    executionMode: "approval_required",
    modelRoutingPolicy: {
      ...STANDARD_MODEL_ROUTING,
      allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved", "enterprise-verified"],
    },
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "contract_analyzer", "workflow_builder"],
    },
  },

  // ── troptions-health ──────────────────────────────────────────────────────
  {
    namespaceId: "troptions-health",
    displayName: "Troptions Healthcare",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-health-admin", "Healthcare Admin Assistant", "Administrative"),
      sys("ai-health-compliance", "Healthcare Compliance AI", "Compliance"),
      sys("ai-health-billing", "Medical Billing Assistant", "Billing"),
    ],
    knowledgeVaults: [
      vault("kv-health-compliance", "Healthcare Compliance Library", "Compliance", "approval_required"),
      vault("kv-health-billing", "Medical Billing Codes", "Billing", "membership_required"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local"],
    blockedModelProviders: [...STANDARD_BLOCKED_PROVIDERS, "external_llm", "openai_direct", "claude_direct"],
    allowedTools: HEALTHCARE_TOOL_POLICY.allowedTools,
    blockedTools: HEALTHCARE_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: true,
    dataResidencyMode: "local_only",
    auditMode: "full",
    executionMode: "approval_required",
    modelRoutingPolicy: {
      allowedModelProviders: ["troptions-sovereign", "troptions-local"],
      blockedModelProviders: [...STANDARD_BLOCKED_PROVIDERS, "external_llm", "openai_direct", "claude_direct"],
      defaultProvider: "troptions-local",
      requiresApprovalForUnknownProvider: true,
      fallbackBehavior: "block",
    },
    toolAccessPolicy: HEALTHCARE_TOOL_POLICY,
  },

  // ── troptions-media ───────────────────────────────────────────────────────
  {
    namespaceId: "troptions-media",
    displayName: "Troptions Media",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-media-scriptwriter", "Script Writer AI", "Content"),
      sys("ai-media-content-planner", "Content Planner", "Content"),
      sys("ai-media-seo", "SEO Analyzer", "Marketing"),
    ],
    knowledgeVaults: [
      vault("kv-media-content", "Media Content Library", "Content"),
      vault("kv-media-brand", "Brand & Style Guide", "Brand"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "script_writer", "seo_analyzer", "social_content_generator"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "summary",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "script_writer", "seo_analyzer"],
    },
  },

  // ── troptions-business ────────────────────────────────────────────────────
  {
    namespaceId: "troptions-business",
    displayName: "Troptions Business",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-biz-proposal", "Proposal Writer", "Sales"),
      sys("ai-biz-financial", "Financial Analyst AI", "Finance"),
      sys("ai-biz-strategy", "Strategy Advisor", "Strategy"),
    ],
    knowledgeVaults: [
      vault("kv-biz-proposals", "Proposal Templates", "Sales"),
      vault("kv-biz-market", "Market Research Library", "Research"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "proposal_writer", "financial_summary"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "proposal_writer", "financial_summary"],
    },
  },

  // ── troptions-ai ──────────────────────────────────────────────────────────
  {
    namespaceId: "troptions-ai",
    displayName: "Troptions AI Platform",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-platform-builder", "AI System Builder", "Platform"),
      sys("ai-platform-policy", "AI Policy Engine", "Governance"),
      sys("ai-platform-routing", "Model Routing Optimizer", "Infrastructure"),
      sys("ai-platform-audit", "AI Audit Assistant", "Compliance"),
    ],
    knowledgeVaults: [
      vault("kv-ai-models", "Model Catalogue", "Infrastructure"),
      vault("kv-ai-policies", "AI Policy Library", "Governance"),
      vault("kv-ai-benchmarks", "Benchmark Registry", "Research"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved", "troptions-research"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "model_benchmarker", "policy_evaluator", "ai_system_configurator"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "local_only",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: {
      ...STANDARD_MODEL_ROUTING,
      allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved", "troptions-research"],
    },
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "model_benchmarker", "policy_evaluator"],
    },
  },

  // ── troptions-real-estate ─────────────────────────────────────────────────
  {
    namespaceId: "troptions-real-estate",
    displayName: "Troptions Real Estate",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-re-property-analyst", "Property Analyst AI", "Analysis"),
      sys("ai-re-contract-review", "Contract Review AI", "Legal"),
      sys("ai-re-market-research", "Market Research AI", "Research"),
    ],
    knowledgeVaults: [
      vault("kv-re-listings", "Property Listings Vault", "Listings"),
      vault("kv-re-legal", "Real Estate Legal Library", "Legal", "approval_required"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "property_analyzer", "contract_reviewer"],
    blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "investment_advice_engine"],
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "investment_advice_engine"],
    },
  },

  // ── troptions-solar ───────────────────────────────────────────────────────
  {
    namespaceId: "troptions-solar",
    displayName: "Troptions Solar",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-solar-assessment", "Solar Site Assessment AI", "Engineering"),
      sys("ai-solar-financing", "Solar Financing Modeler", "Finance"),
      sys("ai-solar-proposal", "Solar Proposal Writer", "Sales"),
    ],
    knowledgeVaults: [
      vault("kv-solar-specs", "Solar Equipment Specifications", "Engineering"),
      vault("kv-solar-incentives", "Solar Incentives & Credits Library", "Finance"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "energy_calculator", "roi_modeler"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "summary",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "energy_calculator", "roi_modeler"],
    },
  },

  // ── troptions-education ───────────────────────────────────────────────────
  {
    namespaceId: "troptions-education",
    displayName: "Troptions Education",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-edu-curriculum", "Curriculum Builder", "Curriculum"),
      sys("ai-edu-tutor", "Learning Assistant", "Tutoring"),
      sys("ai-edu-assessment", "Assessment Generator", "Assessment"),
    ],
    knowledgeVaults: [
      vault("kv-edu-courses", "Course Content Library", "Curriculum"),
      vault("kv-edu-resources", "Educational Resources", "Learning", "open"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "curriculum_builder", "quiz_generator"],
    blockedTools: STANDARD_TOOL_POLICY.blockedTools,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "regional",
    auditMode: "summary",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "curriculum_builder", "quiz_generator"],
    },
  },

  // ── troptions-xchange ─────────────────────────────────────────────────────
  {
    namespaceId: "troptions-xchange",
    displayName: "Troptions Xchange",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-xchange-route-analyst", "Route Simulation Analyst", "Web3", false),
      sys("ai-xchange-liquidity", "Liquidity Model Advisor", "Finance", false),
    ],
    knowledgeVaults: [
      vault("kv-xchange-xrpl", "XRPL Protocol Documentation", "Web3"),
      vault("kv-xchange-stellar", "Stellar Protocol Documentation", "Web3"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local"],
    blockedModelProviders: [...STANDARD_BLOCKED_PROVIDERS, "external_llm", "openai_direct"],
    allowedTools: ["knowledge_vault_search", "web3_readiness_report", "xrpl_route_simulation", "stellar_route_simulation"],
    blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "live_dex_execution", "live_amm_deposit"],
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "local_only",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: {
      allowedModelProviders: ["troptions-sovereign", "troptions-local"],
      blockedModelProviders: [...STANDARD_BLOCKED_PROVIDERS, "external_llm"],
      defaultProvider: "troptions-local",
      requiresApprovalForUnknownProvider: true,
      fallbackBehavior: "block",
    },
    toolAccessPolicy: {
      allowedTools: ["knowledge_vault_search", "web3_readiness_report", "xrpl_route_simulation", "stellar_route_simulation"],
      blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "live_dex_execution", "live_amm_deposit"],
      highRiskTools: ["xrpl_route_simulation", "stellar_route_simulation"],
      requiresApprovalForHighRisk: true,
      requiresApprovalForUnknownTool: true,
    },
  },

  // ── troptions-web3 ────────────────────────────────────────────────────────
  {
    namespaceId: "troptions-web3",
    displayName: "Troptions Web3",
    aiWorkspaceEnabled: true,
    sovereignAiSystems: [
      sys("ai-web3-smart-contract", "Smart Contract Reviewer", "Web3"),
      sys("ai-web3-wallet-guide", "Wallet Setup Guide AI", "Web3"),
      sys("ai-web3-compliance", "Web3 Compliance AI", "Compliance"),
    ],
    knowledgeVaults: [
      vault("kv-web3-protocols", "Protocol Documentation Vault", "Web3"),
      vault("kv-web3-compliance", "Web3 Compliance Library", "Compliance", "approval_required"),
    ],
    allowedModelProviders: ["troptions-sovereign", "troptions-local", "troptions-approved"],
    blockedModelProviders: STANDARD_BLOCKED_PROVIDERS,
    allowedTools: [...STANDARD_TOOL_POLICY.allowedTools, "smart_contract_reviewer", "web3_readiness_report"],
    blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "live_contract_deploy", "private_key_generator"],
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    healthcareSafetyRequired: false,
    dataResidencyMode: "local_only",
    auditMode: "full",
    executionMode: "simulation_only",
    modelRoutingPolicy: STANDARD_MODEL_ROUTING,
    toolAccessPolicy: {
      ...STANDARD_TOOL_POLICY,
      blockedTools: [...STANDARD_TOOL_POLICY.blockedTools, "live_contract_deploy", "private_key_generator"],
    },
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getNamespaceAiProfile(
  namespaceId: string,
): NamespaceAiInfrastructureProfile | undefined {
  return NAMESPACE_AI_INFRASTRUCTURE_REGISTRY.find(
    (p) => p.namespaceId === namespaceId,
  );
}

export function getAllNamespaceAiProfiles(): NamespaceAiInfrastructureProfile[] {
  return NAMESPACE_AI_INFRASTRUCTURE_REGISTRY;
}

export function getHealthcareNamespaces(): NamespaceAiInfrastructureProfile[] {
  return NAMESPACE_AI_INFRASTRUCTURE_REGISTRY.filter(
    (p) => p.healthcareSafetyRequired,
  );
}
