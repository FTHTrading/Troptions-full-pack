/**
 * Troptions Sovereign AI — Registry
 *
 * Defines the data model and mock records for Troptions Sovereign AI Systems.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   simulationOnly: true as const
 *   liveExecutionEnabled: false as const
 *   externalApiCallsEnabled: false as const
 *   requiresControlHubApproval: true as const
 *
 * WHAT THIS IS NOT:
 * - Not a live AI execution system
 * - Not a medical diagnosis or treatment system
 * - Not a financial advice or investment system
 * - Not a legal services platform
 *
 * All AI system activations require Control Hub approval before any
 * live execution can be enabled.
 */

// ─── Vertical Types ───────────────────────────────────────────────────────────

export type TroptionsSovereignAiVertical =
  | "healthcare_admin"
  | "media_creator"
  | "business_growth"
  | "real_estate_diligence"
  | "legal_admin"
  | "education"
  | "contractor_ops"
  | "compliance"
  | "private_research"
  | "customer_support"
  | "sales"
  | "document_review";

// ─── Status Types ─────────────────────────────────────────────────────────────

export type TroptionsSovereignAiStatus =
  | "draft"
  | "simulation"
  | "pending_review"
  | "approved_for_internal_use"
  | "blocked"
  | "archived";

// ─── Deployment Mode ──────────────────────────────────────────────────────────

export type TroptionsSovereignAiDeploymentMode =
  | "troptions_hosted"
  | "client_hosted_placeholder"
  | "hybrid_placeholder"
  | "local_model_placeholder";

// ─── Risk Level ───────────────────────────────────────────────────────────────

export type TroptionsSovereignAiRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "restricted";

// ─── Capability ───────────────────────────────────────────────────────────────

export interface TroptionsSovereignAiCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresApproval: boolean;
  simulationOnly: true;
}

// ─── Policy ───────────────────────────────────────────────────────────────────

export interface TroptionsSovereignAiPolicy {
  id: string;
  name: string;
  rule: string;
  enforcementLevel: "advisory" | "required" | "blocking";
  appliesTo: TroptionsSovereignAiVertical[];
}

// ─── Knowledge Source ─────────────────────────────────────────────────────────

export interface TroptionsSovereignAiKnowledgeSource {
  id: string;
  label: string;
  sourceType: string;
  sensitivity: string;
  notes: string;
}

// ─── Tool ─────────────────────────────────────────────────────────────────────

export interface TroptionsSovereignAiTool {
  id: string;
  name: string;
  description: string;
  allowed: boolean;
  requiresApproval: boolean;
  simulationOnly: true;
}

// ─── AI System ────────────────────────────────────────────────────────────────

export interface TroptionsSovereignAiSystem {
  id: string;
  namespaceId: string;
  clientDisplayName: string;
  systemName: string;
  description: string;
  vertical: TroptionsSovereignAiVertical;
  templateId: string;
  capabilities: TroptionsSovereignAiCapability[];
  knowledgeSources: TroptionsSovereignAiKnowledgeSource[];
  enabledTools: TroptionsSovereignAiTool[];
  policies: TroptionsSovereignAiPolicy[];
  deploymentMode: TroptionsSovereignAiDeploymentMode;
  status: TroptionsSovereignAiStatus;
  riskLevel: TroptionsSovereignAiRiskLevel;
  requiresControlHubApproval: true;
  requiresDataReview: true;
  requiresLegalReviewForSensitiveUse: true;
  externalApiCallsEnabled: false;
  liveAutomationEnabled: false;
  simulationOnly: true;
  liveExecutionEnabled: false;
  createdAt: string;
  updatedAt: string;
}

// ─── AI Template ─────────────────────────────────────────────────────────────

export interface TroptionsSovereignAiTemplate {
  id: string;
  name: string;
  vertical: TroptionsSovereignAiVertical;
  description: string;
  useCases: string[];
  allowedTools: string[];
  blockedTools: string[];
  requiredApprovals: string[];
  safetyNotes: string[];
  onboardingQuestions: string[];
  recommendedKnowledgeSources: string[];
  outputTypes: string[];
  riskLevel: TroptionsSovereignAiRiskLevel;
  simulationOnly: true;
  liveExecutionEnabled: false;
}

// ─── Global AI Policies ──────────────────────────────────────────────────────

export const SOVEREIGN_AI_GLOBAL_POLICIES: TroptionsSovereignAiPolicy[] = [
  {
    id: "pol-global-001",
    name: "No Live Execution",
    rule: "All AI system activations are simulation-only until explicitly approved by the Control Hub.",
    enforcementLevel: "blocking",
    appliesTo: [
      "healthcare_admin", "media_creator", "business_growth", "real_estate_diligence",
      "legal_admin", "education", "contractor_ops", "compliance", "private_research",
      "customer_support", "sales", "document_review",
    ],
  },
  {
    id: "pol-global-002",
    name: "No External API Calls",
    rule: "External API calls to third-party AI providers are disabled by default. Activation requires Control Hub approval.",
    enforcementLevel: "blocking",
    appliesTo: [
      "healthcare_admin", "media_creator", "business_growth", "real_estate_diligence",
      "legal_admin", "education", "contractor_ops", "compliance", "private_research",
      "customer_support", "sales", "document_review",
    ],
  },
  {
    id: "pol-global-003",
    name: "No Medical Diagnosis or Treatment",
    rule: "AI systems in any vertical must not generate, infer, or simulate medical diagnoses, treatment plans, or clinical recommendations.",
    enforcementLevel: "blocking",
    appliesTo: ["healthcare_admin"],
  },
  {
    id: "pol-global-004",
    name: "No PHI Storage",
    rule: "No protected health information (PHI) may be stored, processed, or transmitted in this scaffold.",
    enforcementLevel: "blocking",
    appliesTo: ["healthcare_admin"],
  },
  {
    id: "pol-global-005",
    name: "No Financial Yield Promises",
    rule: "AI systems must not promise, project, or imply investment returns, yields, or financial performance.",
    enforcementLevel: "blocking",
    appliesTo: ["business_growth", "sales", "real_estate_diligence"],
  },
  {
    id: "pol-global-006",
    name: "Control Hub Approval Required",
    rule: "All AI system activations, model route changes, and tool permission changes require Control Hub approval.",
    enforcementLevel: "blocking",
    appliesTo: [
      "healthcare_admin", "media_creator", "business_growth", "real_estate_diligence",
      "legal_admin", "education", "contractor_ops", "compliance", "private_research",
      "customer_support", "sales", "document_review",
    ],
  },
  {
    id: "pol-global-007",
    name: "No Legal Advice",
    rule: "AI systems in legal_admin vertical must not generate legal advice, legal opinions, or attorney-client communications.",
    enforcementLevel: "blocking",
    appliesTo: ["legal_admin"],
  },
  {
    id: "pol-global-008",
    name: "No Emergency Guidance",
    rule: "AI systems must not provide emergency medical, legal, or safety guidance. Users must be directed to appropriate emergency services.",
    enforcementLevel: "blocking",
    appliesTo: ["healthcare_admin", "legal_admin"],
  },
];

// ─── AI Templates ─────────────────────────────────────────────────────────────

export const SOVEREIGN_AI_TEMPLATES: TroptionsSovereignAiTemplate[] = [
  {
    id: "tmpl-001",
    name: "Troptions Healthcare Admin AI",
    vertical: "healthcare_admin",
    description: "Administrative AI system for healthcare offices and clinics. Handles scheduling, intake forms, FAQ responses, and document organization. Does not provide clinical, diagnostic, or treatment guidance.",
    useCases: [
      "Patient intake FAQ answers",
      "Appointment scheduling support",
      "Document checklist generation",
      "Administrative form summaries",
      "Office policy explanations",
    ],
    allowedTools: ["document_qa", "faq_lookup", "form_summary", "checklist_builder", "policy_viewer"],
    blockedTools: ["medical_diagnosis", "treatment_planner", "prescription_helper", "phi_reader", "clinical_decision_support"],
    requiredApprovals: [
      "Control Hub approval",
      "Healthcare compliance review",
      "BAA agreement before production use",
      "Legal review for any PHI adjacency",
    ],
    safetyNotes: [
      "Must not provide medical diagnosis or clinical recommendations.",
      "Must not process, store, or generate PHI (protected health information).",
      "Must not provide emergency medical guidance.",
      "Must display disclaimer on all outputs: 'This AI does not provide medical advice.'",
      "BAA (Business Associate Agreement) required before production deployment.",
    ],
    onboardingQuestions: [
      "What administrative tasks does your clinic or office need help with?",
      "What documents or policies should the AI know?",
      "Which staff roles will access the AI system?",
      "Do any workflows involve PHI? (If yes, this phase is blocked until compliance review.)",
      "What output formats do you need (summaries, checklists, FAQs)?",
    ],
    recommendedKnowledgeSources: [
      "Office procedure manuals",
      "Patient FAQ documents (non-PHI)",
      "Scheduling policy documents",
      "Administrative forms and templates",
      "Office compliance policies",
    ],
    outputTypes: ["Text summary", "Checklist", "FAQ response", "Form template", "Policy explanation"],
    riskLevel: "high",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-002",
    name: "Troptions Media Producer AI",
    vertical: "media_creator",
    description: "AI workspace for media producers, content creators, podcasters, and studios. Supports scripts, channel planning, episode outlines, blog posts, social copy, and approval workflows.",
    useCases: [
      "Script writing and outlines",
      "Episode and series planning",
      "Blog post drafting",
      "Social media copy",
      "Content calendar generation",
      "Creator approval workflows",
    ],
    allowedTools: ["script_writer", "outline_builder", "blog_drafter", "social_copy", "content_calendar", "approval_workflow"],
    blockedTools: ["phi_reader", "financial_advice", "legal_advice", "medical_diagnosis"],
    requiredApprovals: ["Control Hub approval", "Content policy review"],
    safetyNotes: [
      "Must not publish content without client review and approval.",
      "Must not generate content that makes medical, legal, or financial claims.",
      "All outputs are drafts subject to human review.",
    ],
    onboardingQuestions: [
      "What type of content does your business produce (video, podcast, blog, social)?",
      "What is your brand voice and tone?",
      "What topics and subjects should the AI cover?",
      "What topics should the AI never cover?",
      "What is your content approval process?",
    ],
    recommendedKnowledgeSources: [
      "Brand style guide",
      "Previous scripts and outlines",
      "Content calendar history",
      "Media policy documents",
      "Audience persona notes",
    ],
    outputTypes: ["Script draft", "Episode outline", "Blog post draft", "Social copy", "Content calendar"],
    riskLevel: "low",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-003",
    name: "Troptions Business Growth AI",
    vertical: "business_growth",
    description: "AI workspace for business development, sales support, and operational growth. Supports proposals, campaign planning, and customer communication drafts.",
    useCases: [
      "Proposal and pitch drafting",
      "Sales script templates",
      "Email campaign outlines",
      "Business FAQ responses",
      "Client communication drafts",
    ],
    allowedTools: ["proposal_builder", "pitch_writer", "email_drafter", "faq_builder", "campaign_planner"],
    blockedTools: ["investment_advisor", "financial_returns_calculator", "securities_router", "phi_reader", "legal_advice"],
    requiredApprovals: [
      "Control Hub approval",
      "Business compliance review for any regulated industry content",
    ],
    safetyNotes: [
      "Must not promise, project, or imply investment returns or financial yields.",
      "Must not provide securities or investment advice.",
      "All business proposals are drafts subject to human review.",
    ],
    onboardingQuestions: [
      "What does your business do and who are your customers?",
      "What growth challenges do you need AI support with?",
      "What documents, proposals, or templates should the AI know?",
      "What should the AI never say or promise?",
      "What communication formats do you need?",
    ],
    recommendedKnowledgeSources: [
      "Product and service descriptions",
      "Proposal and pitch templates",
      "Business policy documents",
      "Sales playbook",
      "FAQ documents",
    ],
    outputTypes: ["Proposal draft", "Pitch outline", "Email draft", "FAQ response", "Campaign plan"],
    riskLevel: "medium",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-004",
    name: "Troptions Real Estate Diligence AI",
    vertical: "real_estate_diligence",
    description: "Document and checklist AI for real estate due diligence, evidence organization, and funding packet preparation. Does not provide investment advice or appraisals.",
    useCases: [
      "Document checklist generation",
      "Evidence packet organization",
      "Due diligence workflow tracking",
      "Property information summaries",
      "Funding packet outline support",
    ],
    allowedTools: ["checklist_builder", "document_organizer", "evidence_tracker", "summary_writer", "workflow_tracker"],
    blockedTools: ["appraisal_tool", "investment_advisor", "financial_returns_calculator", "mortgage_calculator", "legal_advice"],
    requiredApprovals: [
      "Control Hub approval",
      "Legal review for any contract or regulated document workflow",
    ],
    safetyNotes: [
      "Must not provide real estate appraisals or valuations.",
      "Must not provide investment advice or project returns.",
      "Must not generate binding legal documents.",
      "All outputs are organizational aids, not legal or financial advice.",
    ],
    onboardingQuestions: [
      "What types of properties or assets does your business work with?",
      "What documents do you need to organize and review?",
      "What are the key diligence steps in your workflow?",
      "Do any workflows involve regulated financial instruments?",
      "What output formats do you need?",
    ],
    recommendedKnowledgeSources: [
      "Due diligence checklists",
      "Property information sheets",
      "Evidence registry templates",
      "Funding packet outlines",
      "Process documentation",
    ],
    outputTypes: ["Checklist", "Document summary", "Workflow tracker", "Evidence record", "Packet outline"],
    riskLevel: "medium",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-005",
    name: "Troptions Legal Admin AI",
    vertical: "legal_admin",
    description: "Administrative AI for legal offices and intake workflows. Handles intake sorting, document summaries, compliance checklists, and administrative drafts. Does not provide legal advice.",
    useCases: [
      "Client intake form processing",
      "Document sorting and categorization",
      "Summary drafts for review",
      "Compliance checklist generation",
      "Administrative correspondence drafts",
    ],
    allowedTools: ["intake_sorter", "document_summarizer", "checklist_builder", "compliance_checker", "draft_writer"],
    blockedTools: ["legal_advice_generator", "court_filing_tool", "attorney_client_communicator", "phi_reader", "contract_signer"],
    requiredApprovals: [
      "Control Hub approval",
      "Legal compliance review",
      "Attorney oversight for any output review before use",
    ],
    safetyNotes: [
      "Must not generate legal advice, legal opinions, or attorney-client communications.",
      "Must not provide emergency legal guidance.",
      "All outputs are administrative drafts requiring attorney review.",
      "Must display disclaimer: 'This AI does not provide legal advice.'",
    ],
    onboardingQuestions: [
      "What types of legal matters does your office handle?",
      "What administrative documents does the AI need to know?",
      "What intake or intake-adjacent workflows does the AI support?",
      "Which staff roles will access the AI system?",
      "What outputs do you need (summaries, checklists, drafts)?",
    ],
    recommendedKnowledgeSources: [
      "Office procedure manuals",
      "Intake form templates",
      "Administrative policy documents",
      "Non-privileged compliance checklists",
      "General FAQ documents",
    ],
    outputTypes: ["Intake summary", "Checklist", "Administrative draft", "Compliance list", "Document category"],
    riskLevel: "high",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-006",
    name: "Troptions Education AI",
    vertical: "education",
    description: "AI tutoring and content creation system for educators, trainers, and learning programs. Supports study plans, course outlines, quizzes, and educational content.",
    useCases: [
      "Study plan generation",
      "Course outline creation",
      "Quiz and assessment drafts",
      "Lesson summary notes",
      "Learning resource organization",
    ],
    allowedTools: ["study_planner", "course_outliner", "quiz_builder", "lesson_summarizer", "resource_organizer"],
    blockedTools: ["grade_override", "credential_issuer", "phi_reader", "financial_advice", "medical_diagnosis"],
    requiredApprovals: ["Control Hub approval"],
    safetyNotes: [
      "Must not issue or simulate official educational credentials.",
      "Must not store personal academic records without compliance review.",
      "All curriculum outputs are drafts subject to educator review.",
    ],
    onboardingQuestions: [
      "What subjects or topics does your program cover?",
      "What learning level or audience does the AI serve?",
      "What course materials and documents should the AI know?",
      "What types of outputs do you need (quizzes, plans, outlines)?",
      "Are there topics the AI should never address?",
    ],
    recommendedKnowledgeSources: [
      "Curriculum documents",
      "Learning objective outlines",
      "Course syllabi",
      "Resource lists",
      "Assessment frameworks",
    ],
    outputTypes: ["Study plan", "Course outline", "Quiz draft", "Lesson summary", "Resource list"],
    riskLevel: "low",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-007",
    name: "Troptions Contractor Operations AI",
    vertical: "contractor_ops",
    description: "Operations AI for contractors and field service businesses. Supports job checklists, quote templates, project updates, and customer messages.",
    useCases: [
      "Job checklist creation",
      "Quote template generation",
      "Project status update drafts",
      "Customer message templates",
      "Work order summaries",
    ],
    allowedTools: ["checklist_builder", "quote_builder", "status_updater", "message_drafter", "work_order_summarizer"],
    blockedTools: ["financial_advice", "legal_contracts", "phi_reader", "permit_issuer", "insurance_adjuster"],
    requiredApprovals: ["Control Hub approval"],
    safetyNotes: [
      "Must not generate binding contracts without legal review.",
      "Must not promise insurance coverage or regulatory compliance.",
      "All quote outputs are estimates requiring human review.",
    ],
    onboardingQuestions: [
      "What type of contractor or service work does your business do?",
      "What job types and services do you offer?",
      "What documents or templates does the AI need to know?",
      "What outputs do you need (quotes, checklists, messages)?",
      "What should the AI never say to customers?",
    ],
    recommendedKnowledgeSources: [
      "Service catalog",
      "Pricing guidelines",
      "Job checklist templates",
      "Customer communication templates",
      "Work order forms",
    ],
    outputTypes: ["Job checklist", "Quote draft", "Status update", "Customer message", "Work order summary"],
    riskLevel: "low",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-008",
    name: "Troptions Compliance AI",
    vertical: "compliance",
    description: "Compliance support AI for policy review, audit preparation, and regulatory checklist generation. Does not provide legal or regulatory certification.",
    useCases: [
      "Policy review assistance",
      "Audit preparation checklists",
      "Regulatory requirement summaries",
      "Risk flag identification",
      "Compliance documentation support",
    ],
    allowedTools: ["policy_reviewer", "checklist_builder", "risk_flagger", "summary_writer", "document_organizer"],
    blockedTools: ["legal_certification", "regulatory_filing", "phi_reader", "financial_advice", "legal_advice"],
    requiredApprovals: [
      "Control Hub approval",
      "Legal review for any regulatory filing adjacency",
    ],
    safetyNotes: [
      "Must not issue regulatory certifications or compliance guarantees.",
      "Must not provide legal advice or regulatory opinions.",
      "All outputs are support tools requiring qualified review.",
    ],
    onboardingQuestions: [
      "What regulatory frameworks or standards apply to your business?",
      "What compliance documents should the AI know?",
      "What audit processes does the AI need to support?",
      "What risk areas are most important for your business?",
      "What outputs do you need (checklists, summaries, risk lists)?",
    ],
    recommendedKnowledgeSources: [
      "Internal compliance policies",
      "Regulatory summary documents",
      "Audit preparation checklists",
      "Risk register templates",
      "Industry standard references",
    ],
    outputTypes: ["Compliance checklist", "Risk flag summary", "Policy review notes", "Audit prep guide", "Document summary"],
    riskLevel: "high",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-009",
    name: "Troptions Customer Support AI",
    vertical: "customer_support",
    description: "Customer support AI for handling FAQs, ticket categorization, and response drafts. Supports team efficiency and consistent support quality.",
    useCases: [
      "FAQ answer generation",
      "Support ticket categorization",
      "Response draft creation",
      "Knowledge base search support",
      "Escalation flag identification",
    ],
    allowedTools: ["faq_responder", "ticket_categorizer", "response_drafter", "kb_search", "escalation_flagger"],
    blockedTools: ["financial_advice", "medical_advice", "legal_advice", "phi_reader", "payment_processor"],
    requiredApprovals: ["Control Hub approval"],
    safetyNotes: [
      "Must not provide medical, legal, or financial advice.",
      "Must not process payment information.",
      "All customer-facing outputs require human review before sending.",
    ],
    onboardingQuestions: [
      "What products or services does your team support?",
      "What are the most common customer questions?",
      "What knowledge base or FAQ documents should the AI know?",
      "What ticket categories does your team use?",
      "What should the AI never tell a customer?",
    ],
    recommendedKnowledgeSources: [
      "Product documentation",
      "FAQ and help center articles",
      "Support ticket categories",
      "Escalation policy documents",
      "Response template library",
    ],
    outputTypes: ["FAQ response", "Ticket category", "Response draft", "Escalation flag", "KB article summary"],
    riskLevel: "low",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-010",
    name: "Troptions Sales AI",
    vertical: "sales",
    description: "Sales enablement AI for pipeline support, outreach drafts, proposal generation, and team coaching. Does not promise investment returns or financial outcomes.",
    useCases: [
      "Outreach email drafts",
      "Proposal and pitch creation",
      "Sales script templates",
      "Pipeline status summaries",
      "Sales coaching note generation",
    ],
    allowedTools: ["email_drafter", "proposal_builder", "script_writer", "pipeline_summarizer", "coaching_notes"],
    blockedTools: ["investment_advisor", "securities_router", "financial_returns_calculator", "phi_reader", "legal_advice"],
    requiredApprovals: ["Control Hub approval"],
    safetyNotes: [
      "Must not promise investment returns, yields, or financial performance.",
      "Must not provide securities or investment advice.",
      "All outreach drafts are subject to human review before sending.",
    ],
    onboardingQuestions: [
      "What does your team sell and to whom?",
      "What sales materials should the AI know?",
      "What is your outreach and follow-up process?",
      "What outputs do you need (emails, proposals, scripts)?",
      "What should the AI never promise a prospect?",
    ],
    recommendedKnowledgeSources: [
      "Product and service descriptions",
      "Sales playbook",
      "Proposal and pitch templates",
      "ICP (ideal customer profile) documents",
      "Competitive positioning notes",
    ],
    outputTypes: ["Outreach email", "Proposal draft", "Sales script", "Pipeline summary", "Coaching note"],
    riskLevel: "medium",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-011",
    name: "Troptions Document Review AI",
    vertical: "document_review",
    description: "Document analysis and review support AI for categorization, summarization, and checklist generation. Does not make binding decisions or legal assessments.",
    useCases: [
      "Document categorization",
      "Summary generation",
      "Key clause identification",
      "Checklist mapping",
      "Document gap analysis",
    ],
    allowedTools: ["document_categorizer", "summarizer", "clause_finder", "checklist_mapper", "gap_analyzer"],
    blockedTools: ["contract_signer", "legal_advice", "financial_advice", "phi_reader", "notarization_tool"],
    requiredApprovals: ["Control Hub approval", "Legal review for sensitive document types"],
    safetyNotes: [
      "Must not make binding legal or financial decisions.",
      "Must not process PHI or confidential PII beyond what is permitted.",
      "All outputs are review aids subject to qualified human review.",
    ],
    onboardingQuestions: [
      "What types of documents does your team review?",
      "What document categories are most important to your workflow?",
      "What specific clauses or terms does the AI need to identify?",
      "Are any documents legally sensitive or regulated?",
      "What output formats do you need (summaries, checklists, flags)?",
    ],
    recommendedKnowledgeSources: [
      "Document taxonomy",
      "Review checklist templates",
      "Key clause reference guides",
      "Process documentation",
      "Gap analysis frameworks",
    ],
    outputTypes: ["Document summary", "Category label", "Clause list", "Gap analysis", "Checklist"],
    riskLevel: "medium",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
  {
    id: "tmpl-012",
    name: "Troptions Private Research AI",
    vertical: "private_research",
    description: "Private research and analysis support AI for organizing notes, synthesizing sources, and generating structured research outputs. Not a live data system.",
    useCases: [
      "Research note organization",
      "Source synthesis and summary",
      "Structured report generation",
      "Research question refinement",
      "Evidence mapping",
    ],
    allowedTools: ["note_organizer", "source_synthesizer", "report_builder", "question_refiner", "evidence_mapper"],
    blockedTools: ["live_data_fetcher", "phi_reader", "financial_advice", "legal_advice", "medical_diagnosis"],
    requiredApprovals: ["Control Hub approval"],
    safetyNotes: [
      "Must not access live external data sources without explicit approval.",
      "Must not store or process classified, confidential, or regulated data in this scaffold.",
      "All research outputs are drafts subject to researcher review.",
    ],
    onboardingQuestions: [
      "What research topics does this system support?",
      "What source materials and notes should the AI know?",
      "What output formats do you need (reports, summaries, outlines)?",
      "Are any research areas regulated or legally sensitive?",
      "Who will review and validate research outputs?",
    ],
    recommendedKnowledgeSources: [
      "Research notes and documents",
      "Source bibliographies",
      "Topic outlines",
      "Previous research reports",
      "Reference frameworks",
    ],
    outputTypes: ["Research summary", "Source synthesis", "Structured report", "Evidence map", "Question list"],
    riskLevel: "medium",
    simulationOnly: true,
    liveExecutionEnabled: false,
  },
];

// ─── Mock AI Systems ───────────────────────────────────────────────────────────

export const SOVEREIGN_AI_SYSTEMS: TroptionsSovereignAiSystem[] = [
  {
    id: "sys-001",
    namespaceId: "ns-001",
    clientDisplayName: "Troptions",
    systemName: "Troptions Media Producer AI",
    description: "Media and content creation AI for the Troptions namespace. Supports scripts, episode outlines, blog drafts, and content calendar planning.",
    vertical: "media_creator",
    templateId: "tmpl-002",
    capabilities: [
      { id: "cap-001", name: "Script Writing", description: "Draft scripts for video, audio, and presentations.", enabled: true, requiresApproval: false, simulationOnly: true },
      { id: "cap-002", name: "Content Calendar", description: "Build content calendars and publishing schedules.", enabled: true, requiresApproval: false, simulationOnly: true },
      { id: "cap-003", name: "Blog Drafting", description: "Draft long-form blog posts and articles.", enabled: true, requiresApproval: true, simulationOnly: true },
    ],
    knowledgeSources: [
      { id: "ks-001", label: "Troptions Brand Guide", sourceType: "document", sensitivity: "internal", notes: "Brand voice and style reference" },
      { id: "ks-002", label: "Troptions Media FAQ", sourceType: "faq", sensitivity: "public", notes: "Frequently asked questions about Troptions media" },
    ],
    enabledTools: [
      { id: "tool-001", name: "Script Writer", description: "Generates script drafts.", allowed: true, requiresApproval: false, simulationOnly: true },
      { id: "tool-002", name: "Outline Builder", description: "Builds episode and series outlines.", allowed: true, requiresApproval: false, simulationOnly: true },
    ],
    policies: SOVEREIGN_AI_GLOBAL_POLICIES.filter((p) =>
      p.appliesTo.includes("media_creator") || p.enforcementLevel === "blocking"
    ),
    deploymentMode: "troptions_hosted",
    status: "simulation",
    riskLevel: "low",
    requiresControlHubApproval: true,
    requiresDataReview: true,
    requiresLegalReviewForSensitiveUse: true,
    externalApiCallsEnabled: false,
    liveAutomationEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "sys-002",
    namespaceId: "ns-002",
    clientDisplayName: "Troptions TV",
    systemName: "Troptions TV Content AI",
    description: "Content planning and script AI for Troptions TV productions. Supports episode planning, channel strategy, and audience content mapping.",
    vertical: "media_creator",
    templateId: "tmpl-002",
    capabilities: [
      { id: "cap-004", name: "Episode Planner", description: "Plan episode structure and narrative arcs.", enabled: true, requiresApproval: false, simulationOnly: true },
      { id: "cap-005", name: "Channel Strategy", description: "Draft channel positioning and content strategy.", enabled: true, requiresApproval: true, simulationOnly: true },
    ],
    knowledgeSources: [
      { id: "ks-003", label: "Troptions TV Show Library", sourceType: "media_metadata", sensitivity: "internal", notes: "Show catalog and metadata" },
      { id: "ks-004", label: "Troptions TV Brand Guide", sourceType: "document", sensitivity: "internal", notes: "TV brand and format guide" },
    ],
    enabledTools: [
      { id: "tool-003", name: "Episode Outliner", description: "Generates episode outlines.", allowed: true, requiresApproval: false, simulationOnly: true },
      { id: "tool-004", name: "Social Copy", description: "Generates social media copy for episodes.", allowed: true, requiresApproval: false, simulationOnly: true },
    ],
    policies: SOVEREIGN_AI_GLOBAL_POLICIES.filter((p) =>
      p.appliesTo.includes("media_creator") || p.enforcementLevel === "blocking"
    ),
    deploymentMode: "troptions_hosted",
    status: "simulation",
    riskLevel: "low",
    requiresControlHubApproval: true,
    requiresDataReview: true,
    requiresLegalReviewForSensitiveUse: true,
    externalApiCallsEnabled: false,
    liveAutomationEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "sys-003",
    namespaceId: "ns-005",
    clientDisplayName: "Troptions Business",
    systemName: "Troptions Business Growth AI",
    description: "Business development and sales support AI for the Troptions Business namespace. Supports proposals, outreach, and FAQ responses.",
    vertical: "business_growth",
    templateId: "tmpl-003",
    capabilities: [
      { id: "cap-006", name: "Proposal Builder", description: "Drafts business proposals and pitches.", enabled: true, requiresApproval: false, simulationOnly: true },
      { id: "cap-007", name: "Email Drafter", description: "Drafts outreach and follow-up emails.", enabled: true, requiresApproval: false, simulationOnly: true },
    ],
    knowledgeSources: [
      { id: "ks-005", label: "Troptions Business Services", sourceType: "document", sensitivity: "internal", notes: "Service descriptions and pricing" },
      { id: "ks-006", label: "Troptions Business FAQ", sourceType: "faq", sensitivity: "public", notes: "Business FAQ" },
    ],
    enabledTools: [
      { id: "tool-005", name: "Proposal Builder", description: "Drafts proposals.", allowed: true, requiresApproval: false, simulationOnly: true },
      { id: "tool-006", name: "Campaign Planner", description: "Plans marketing campaigns.", allowed: true, requiresApproval: true, simulationOnly: true },
    ],
    policies: SOVEREIGN_AI_GLOBAL_POLICIES.filter((p) =>
      p.appliesTo.includes("business_growth") || p.enforcementLevel === "blocking"
    ),
    deploymentMode: "troptions_hosted",
    status: "simulation",
    riskLevel: "medium",
    requiresControlHubApproval: true,
    requiresDataReview: true,
    requiresLegalReviewForSensitiveUse: true,
    externalApiCallsEnabled: false,
    liveAutomationEnabled: false,
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getAiTemplate(templateId: string): TroptionsSovereignAiTemplate | undefined {
  return SOVEREIGN_AI_TEMPLATES.find((t) => t.id === templateId);
}

export function getAiSystemsByNamespace(namespaceId: string): TroptionsSovereignAiSystem[] {
  return SOVEREIGN_AI_SYSTEMS.filter((s) => s.namespaceId === namespaceId);
}

export function getVerticalLabel(vertical: TroptionsSovereignAiVertical): string {
  const labels: Record<TroptionsSovereignAiVertical, string> = {
    healthcare_admin: "Healthcare Admin",
    media_creator: "Media & Creator",
    business_growth: "Business Growth",
    real_estate_diligence: "Real Estate Diligence",
    legal_admin: "Legal Admin",
    education: "Education",
    contractor_ops: "Contractor Operations",
    compliance: "Compliance",
    private_research: "Private Research",
    customer_support: "Customer Support",
    sales: "Sales",
    document_review: "Document Review",
  };
  return labels[vertical] ?? vertical.replace(/_/g, " ");
}

export function getRiskLevelLabel(level: TroptionsSovereignAiRiskLevel): string {
  const labels: Record<TroptionsSovereignAiRiskLevel, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    restricted: "Restricted",
  };
  return labels[level];
}
