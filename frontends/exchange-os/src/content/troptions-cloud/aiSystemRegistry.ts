/**
 * Troptions Cloud — AI System Registry
 *
 * Defines AI agent system templates available in the Troptions AI System Builder.
 *
 * SAFETY INVARIANTS:
 *   simulationOnly: true
 *   liveExecutionEnabled: false
 *   externalApiCallsEnabled: false
 *   requiresControlHubApproval: true
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type TroptionsAiDeploymentStatus =
  | "template"
  | "configured"
  | "pending_approval"
  | "approved"
  | "active"
  | "paused"
  | "archived";

export interface TroptionsAiSystemTool {
  id: string;
  name: string;
  description: string;
  inputType: string;
  outputType: string;
  requiresApproval: boolean;
}

export interface TroptionsKnowledgeSource {
  id: string;
  name: string;
  type: "document" | "proof_vault" | "registry" | "external_url" | "manual_upload";
  description: string;
  requiresComplianceReview: boolean;
}

export interface TroptionsAiSystemPolicy {
  id: string;
  name: string;
  rule: string;
  enforcedAt: "input" | "output" | "both";
}

export interface TroptionsAiSystem {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  category: string;
  deploymentStatus: TroptionsAiDeploymentStatus;
  tools: TroptionsAiSystemTool[];
  knowledgeSources: TroptionsKnowledgeSource[];
  policies: TroptionsAiSystemPolicy[];
  /** SAFETY */
  simulationOnly: true;
  liveExecutionEnabled: false;
  externalApiCallsEnabled: false;
  requiresControlHubApproval: true;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock Records ─────────────────────────────────────────────────────────────

export const TROPTIONS_AI_SYSTEMS: TroptionsAiSystem[] = [
  {
    id: "ai-sys-001",
    slug: "troptions-creator-assistant",
    displayName: "Troptions Creator Assistant",
    description: "AI assistant for TTN creators — helps with content planning, script outlines, and submission drafts.",
    category: "Content Creation",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Script Outline Generator", description: "Generates video/podcast script outlines.", inputType: "topic", outputType: "outline", requiresApproval: false },
      { id: "t2", name: "Blog Draft Writer", description: "Drafts blog posts from topic + notes.", inputType: "notes", outputType: "draft", requiresApproval: false },
    ],
    knowledgeSources: [
      { id: "ks1", name: "TTN Style Guide", type: "document", description: "TTN editorial and brand guidelines.", requiresComplianceReview: false },
    ],
    policies: [
      { id: "p1", name: "No financial advice", rule: "System must not generate content that constitutes financial or investment advice.", enforcedAt: "output" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-002",
    slug: "troptions-media-producer",
    displayName: "Troptions Media Producer",
    description: "AI system for managing media production workflow — episode planning, show notes, and publishing checklists.",
    category: "Media Production",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Episode Planner", description: "Plans podcast/video episode structure.", inputType: "topic", outputType: "episode_plan", requiresApproval: false },
      { id: "t2", name: "Show Notes Writer", description: "Generates show notes from transcript or outline.", inputType: "transcript", outputType: "show_notes", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "No PHI", rule: "System must not process, store, or generate personal health information.", enforcedAt: "both" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-003",
    slug: "troptions-podcast-producer",
    displayName: "Troptions Podcast Producer",
    description: "AI system specialized for podcast production — episode briefs, guest research outlines, and episode descriptions.",
    category: "Media Production",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Episode Brief Generator", description: "Creates structured episode briefs from topic.", inputType: "topic", outputType: "brief", requiresApproval: false },
      { id: "t2", name: "Episode Description Writer", description: "Writes SEO-friendly episode descriptions.", inputType: "brief", outputType: "description", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "No financial advice", rule: "Must not generate financial or investment advice.", enforcedAt: "output" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-004",
    slug: "troptions-blog-seo-agent",
    displayName: "Troptions Blog SEO Agent",
    description: "AI system for generating SEO-optimized blog content for Troptions properties.",
    category: "Content Creation",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "SEO Title Generator", description: "Generates SEO-optimized titles.", inputType: "topic", outputType: "titles", requiresApproval: false },
      { id: "t2", name: "Meta Description Writer", description: "Writes meta descriptions from title + outline.", inputType: "outline", outputType: "meta", requiresApproval: false },
      { id: "t3", name: "Blog Section Writer", description: "Writes individual blog sections.", inputType: "section_topic", outputType: "section_content", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-005",
    slug: "troptions-business-support-agent",
    displayName: "Troptions Business Support Agent",
    description: "AI system for business workspace tasks — proposal drafts, executive summaries, and partnership outlines.",
    category: "Business",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Proposal Drafter", description: "Drafts business proposals from brief.", inputType: "brief", outputType: "proposal_draft", requiresApproval: false },
      { id: "t2", name: "Executive Summary Writer", description: "Writes executive summaries.", inputType: "document", outputType: "summary", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "No securities solicitation", rule: "Must not generate content that constitutes securities solicitation or investment offers.", enforcedAt: "output" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-006",
    slug: "troptions-healthcare-admin-assistant",
    displayName: "Troptions Healthcare Admin Assistant",
    description: "AI system for healthcare administrative tasks — scheduling templates, admin document drafts, and education summaries. No diagnosis, treatment, or PHI.",
    category: "Healthcare Admin",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Admin Document Drafter", description: "Drafts administrative healthcare documents.", inputType: "template_type", outputType: "draft", requiresApproval: true },
      { id: "t2", name: "Education Summary Writer", description: "Summarizes healthcare education content.", inputType: "content", outputType: "summary", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "No diagnosis or treatment", rule: "System must not generate diagnoses, treatment recommendations, or clinical guidance.", enforcedAt: "both" },
      { id: "p2", name: "No PHI", rule: "System must not process, store, or generate PHI (protected health information).", enforcedAt: "both" },
      { id: "p3", name: "No emergency guidance", rule: "System must not generate emergency medical guidance.", enforcedAt: "both" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-007",
    slug: "troptions-document-review-agent",
    displayName: "Troptions Document Review Agent",
    description: "AI system for reviewing and summarizing documents — term extraction, checklist generation, and summary drafts.",
    category: "Document Tools",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Document Summarizer", description: "Summarizes uploaded documents.", inputType: "document", outputType: "summary", requiresApproval: false },
      { id: "t2", name: "Term Extractor", description: "Extracts key terms and definitions.", inputType: "document", outputType: "terms_list", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-008",
    slug: "troptions-compliance-checklist-agent",
    displayName: "Troptions Compliance Checklist Agent",
    description: "AI system for generating compliance checklists from regulatory context. Output is informational — not legal advice.",
    category: "Compliance",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Checklist Generator", description: "Generates compliance checklists from regulatory topic.", inputType: "topic", outputType: "checklist", requiresApproval: true },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "Not legal advice", rule: "Output must include a disclaimer that it is not legal advice and requires attorney review.", enforcedAt: "output" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-009",
    slug: "troptions-proof-vault-agent",
    displayName: "Troptions Proof Vault Agent",
    description: "AI system for managing proof vault workflows — IPFS pinning requests, proof record summaries, and rights documentation checklists.",
    category: "Proof Vault",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Proof Record Summarizer", description: "Summarizes proof vault records for review.", inputType: "proof_record", outputType: "summary", requiresApproval: false },
      { id: "t2", name: "Rights Checklist Generator", description: "Generates rights documentation checklists.", inputType: "content_type", outputType: "checklist", requiresApproval: true },
    ],
    knowledgeSources: [
      { id: "ks1", name: "Troptions Proof Registry", type: "registry", description: "Live proof registry data.", requiresComplianceReview: false },
    ],
    policies: [],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-010",
    slug: "troptions-sponsor-sales-agent",
    displayName: "Troptions Sponsor Sales Agent",
    description: "AI system for sponsor outreach — pitch deck drafts, sponsor proposal letters, and package descriptions.",
    category: "Sales & Partnerships",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Sponsor Pitch Writer", description: "Drafts sponsor pitch letters.", inputType: "sponsor_profile", outputType: "pitch", requiresApproval: false },
      { id: "t2", name: "Package Description Writer", description: "Writes sponsorship package descriptions.", inputType: "package_details", outputType: "description", requiresApproval: false },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "No guarantees", rule: "Must not include guarantees of reach, engagement, or ROI.", enforcedAt: "output" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "ai-sys-011",
    slug: "troptions-control-hub-agent",
    displayName: "Troptions Control Hub Agent",
    description: "AI system for Control Hub workflow support — review queue summaries, exception drafts, and audit report generation.",
    category: "Control Hub",
    deploymentStatus: "template",
    tools: [
      { id: "t1", name: "Review Queue Summarizer", description: "Summarizes Control Hub review queue items.", inputType: "queue_items", outputType: "summary", requiresApproval: true },
      { id: "t2", name: "Audit Report Generator", description: "Generates audit report drafts.", inputType: "audit_data", outputType: "report", requiresApproval: true },
    ],
    knowledgeSources: [],
    policies: [
      { id: "p1", name: "Requires human approval", rule: "All Control Hub outputs require human review before any action is taken.", enforcedAt: "both" },
    ],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
    requiresControlHubApproval: true,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAiSystem(slug: string): TroptionsAiSystem | undefined {
  return TROPTIONS_AI_SYSTEMS.find((s) => s.slug === slug);
}

export function getAiSystemById(id: string): TroptionsAiSystem | undefined {
  return TROPTIONS_AI_SYSTEMS.find((s) => s.id === id);
}

export function getAiSystemsByCategory(category: string): TroptionsAiSystem[] {
  return TROPTIONS_AI_SYSTEMS.filter((s) => s.category === category);
}

export const AI_CATEGORIES = [
  "Content Creation",
  "Media Production",
  "Business",
  "Compliance",
  "Document Tools",
  "Healthcare Admin",
  "Proof Vault",
  "Sales & Partnerships",
  "Control Hub",
] as const;
