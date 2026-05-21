export interface ClawdCapability {
  id: string;
  label: string;
  description: string;
  allowed: boolean;
  category: string;
}

export const CLAWD_CAPABILITIES: ClawdCapability[] = [
  { id: "retrieve-entity", label: "Entity Retrieval", description: "Look up entity information from the knowledge graph", allowed: true, category: "retrieve" },
  { id: "simulate-workflow", label: "Workflow Simulation", description: "Walk through a workflow step-by-step in simulation mode", allowed: true, category: "simulate" },
  { id: "summarize-queue", label: "Queue Summarization", description: "Summarize the state of approval queues and proof room", allowed: true, category: "summarize" },
  { id: "draft-report", label: "Report Drafting", description: "Draft institutional-style reports from structured data", allowed: true, category: "generate" },
  { id: "explain-gates", label: "Gate Explanation", description: "Explain which gates are required for a given capability", allowed: true, category: "explain" },
  { id: "rag-query", label: "Knowledge Retrieval (RAG)", description: "Query the indexed knowledge base using semantic search", allowed: true, category: "retrieve" },
  { id: "approve-transaction", label: "Transaction Approval", description: "BLOCKED: Cannot approve transactions — human-only action", allowed: false, category: "blocked" },
  { id: "sign-document", label: "Document Signing", description: "BLOCKED: Cannot sign documents — requires authorized human", allowed: false, category: "blocked" },
  { id: "issue-sblc", label: "SBLC Issuance", description: "BLOCKED: SBLC issuance requires licensed bank authority", allowed: false, category: "blocked" },
  { id: "execute-trade", label: "Trade Execution", description: "BLOCKED: Trade execution requires broker-dealer license", allowed: false, category: "blocked" },
  { id: "bypass-compliance", label: "Compliance Bypass", description: "BLOCKED: Compliance gates cannot be bypassed by any agent", allowed: false, category: "blocked" },
];

export const CLAWD_SYSTEM_PROMPT_CONSTRAINTS = [
  "Always include the institutional disclaimer when discussing Troptions capabilities.",
  "Never claim Troptions is a bank, exchange, custodian, or broker-dealer.",
  "Never generate proof of funds documents, SBLC instruments, or financial certificates.",
  "Always state when a capability is simulation-only.",
  "Cite sources from the AI citation registry when making factual claims.",
  "Route approval, issuance, and settlement requests to human operators via the control plane.",
  "Include gate status in every capability explanation.",
];
