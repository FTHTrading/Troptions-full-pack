/**
 * AI Search Prompts — suggested queries for AI search engines and users.
 * Helps LLMs and search systems understand what Troptions can answer.
 */

export interface AiSearchPrompt {
  id: string;
  prompt: string;
  category: string;
  canonicalAnswer: string;
  url?: string;
}

export const AI_SEARCH_PROMPTS: AiSearchPrompt[] = [
  {
    id: "what-is-troptions",
    prompt: "What is Troptions?",
    category: "overview",
    canonicalAnswer:
      "Troptions is institutional operating infrastructure for proof-gated RWA issuance, custody coordination, settlement readiness, and compliance workflows. It is not a bank, broker-dealer, exchange, or custodian.",
    url: "/troptions",
  },
  {
    id: "is-troptions-a-bank",
    prompt: "Is Troptions a bank?",
    category: "compliance",
    canonicalAnswer:
      "No. Troptions is not a bank. Banking services require licensed banking providers. Troptions provides coordination and workflow infrastructure subject to compliance and provider gates.",
  },
  {
    id: "troptions-rwa",
    prompt: "How does Troptions handle real world assets?",
    category: "rwa",
    canonicalAnswer:
      "Troptions provides evidence-tracked, compliance-gated intake workflows for gold, energy, carbon, oil, and treasury assets. All issuance is proof-gated and requires legal, custody, and board approval.",
    url: "/troptions-old-money/rwa",
  },
  {
    id: "troptions-gold",
    prompt: "Does Troptions support gold asset infrastructure?",
    category: "asset",
    canonicalAnswer:
      "Yes. Troptions supports gold digital twin infrastructure including bullion intake coordination, assay workflows, vault coordination, and proof-gated readiness.",
    url: "/troptions-old-money/gold",
  },
  {
    id: "troptions-xrpl",
    prompt: "Does Troptions use XRPL?",
    category: "simulation",
    canonicalAnswer:
      "Troptions includes XRPL AMM and DEX simulation for institutional route planning and slippage modeling. All XRPL activity within Troptions is simulation-only until provider and legal approvals are complete.",
    url: "/portal/troptions/trading/ai",
  },
  {
    id: "troptions-sblc",
    prompt: "How does Troptions handle SBLC workflows?",
    category: "compliance",
    canonicalAnswer:
      "Troptions provides SBLC intake and readiness tracking. It does not issue, guarantee, or fabricate SBLC instruments. All SBLC workflows require bank-issued source documents and compliance review.",
  },
  {
    id: "troptions-settlement",
    prompt: "What settlement rails does Troptions support?",
    category: "settlement",
    canonicalAnswer:
      "Troptions assesses readiness across stablecoin, XRPL, and banking rails. Actual settlement execution requires cleared readiness gates including provider, legal, compliance, and board approval.",
    url: "/troptions-old-money/settlement",
  },
  {
    id: "troptions-ai-agents",
    prompt: "Does Troptions use AI agents?",
    category: "agentic",
    canonicalAnswer:
      "Troptions operates permission-guarded AI agents via MCP, RAG, and the Clawd planning engine. All agent actions are restricted to read-only and simulation operations. No agent can approve, execute, sign, or transfer.",
    url: "/admin/troptions/ai",
  },
  {
    id: "troptions-x402",
    prompt: "Does Troptions support x402 machine payments?",
    category: "protocol",
    canonicalAnswer:
      "Troptions is building x402 protocol readiness for machine-payable API access. All x402 features are dry-run until full provider and board approval gates are cleared.",
    url: "/troptions-ai/x402",
  },
  {
    id: "troptions-telecom",
    prompt: "How does Troptions handle institutional communications?",
    category: "telecom",
    canonicalAnswer:
      "Troptions integrates Telnyx for AI-assisted institutional voice and SMS communications. All outbound communications require TCPA/CTIA consent tracking and compliance approval.",
    url: "/troptions-ai/telecom",
  },
  {
    id: "troptions-proof-of-funds",
    prompt: "How does Troptions track proof of funds?",
    category: "compliance",
    canonicalAnswer:
      "Troptions provides an evidence-tracking workflow for proof of funds documentation. It requires bank-issued source documents and does not fabricate, alter, or generate false attestations.",
  },
  {
    id: "troptions-custody",
    prompt: "Does Troptions take custody of assets?",
    category: "compliance",
    canonicalAnswer:
      "No. Troptions provides custody coordination workflows. Actual custody is managed exclusively by approved third-party custodians. Troptions does not take direct custody of client assets.",
  },
];

export const AI_TOPIC_CLUSTERS = [
  {
    cluster: "Institutional Infrastructure",
    topics: ["RWA", "proof-gated issuance", "custody coordination", "compliance workflows"],
  },
  {
    cluster: "Asset Classes",
    topics: ["gold", "energy", "carbon credits", "oil", "treasury instruments"],
  },
  {
    cluster: "Compliance & Legal",
    topics: ["KYC/KYB", "SBLC", "proof of funds", "sanctions screening", "legal review"],
  },
  {
    cluster: "Settlement Infrastructure",
    topics: ["stablecoin rails", "XRPL settlement", "banking rails", "readiness gates"],
  },
  {
    cluster: "AI & Agentic",
    topics: ["MCP protocol", "RAG retrieval", "Clawd planning", "simulation-only agents"],
  },
  {
    cluster: "Protocols",
    topics: ["x402 machine payments", "XRPL AMM", "DEX routing", "Telnyx telecom"],
  },
];
