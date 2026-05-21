// TROPTIONS Exchange OS Readiness Data

export type ReadinessItem = {
  id: string;
  title: string;
  description: string;
  status: "required" | "blocked" | "ready" | "gated" | "verified" | "demo";
  severity: "low" | "medium" | "high" | "critical";
};

export const TROPTIONS_IS: ReadinessItem[] = [
  { id: "launch-control", title: "Launch-Control System", description: "Institutional launch-control and compliance infrastructure.", status: "verified", severity: "high" },
  { id: "compliance-gate", title: "Compliance Gate", description: "Compliance workflow for token launches.", status: "verified", severity: "high" },
  { id: "proof-packet", title: "Proof Packet Generator", description: "Generates proof packets for issuers and tokens.", status: "ready", severity: "high" },
  { id: "wallet-verifier", title: "Wallet Authority Verifier", description: "Verifies issuer and wallet authority.", status: "ready", severity: "high" },
  { id: "non-custodial", title: "Non-Custodial Prep", description: "Prepares non-custodial transactions for DEX/chain rails.", status: "ready", severity: "high" },
  { id: "route-intel", title: "Route Intelligence", description: "XRPL + Solana route intelligence and monitoring.", status: "demo", severity: "medium" }
];

export const TROPTIONS_IS_NOT: ReadinessItem[] = [
  { id: "broker", title: "Broker/Dealer", description: "TROPTIONS is not a broker or dealer.", status: "gated", severity: "critical" },
  { id: "market-maker", title: "Market Maker", description: "TROPTIONS does not make markets.", status: "gated", severity: "critical" },
  { id: "custodian", title: "Custodian", description: "TROPTIONS does not custody assets.", status: "gated", severity: "critical" },
  { id: "underwriter", title: "Underwriter", description: "TROPTIONS is not an underwriter.", status: "gated", severity: "critical" },
  { id: "investment-adviser", title: "Investment Adviser", description: "TROPTIONS does not provide investment advice.", status: "gated", severity: "critical" },
  { id: "token-promoter", title: "Token Promoter", description: "TROPTIONS does not promote tokens.", status: "gated", severity: "critical" }
];

export const TOKEN_LAUNCH_GATES: ReadinessItem[] = [
  { id: "mou", title: "Signed MOU", description: "Memorandum of Understanding signed.", status: "required", severity: "high" },
  { id: "entity-verification", title: "Entity Verification", description: "Entity documents and verification complete.", status: "required", severity: "high" },
  { id: "legal-memo", title: "Legal Memo", description: "Legal memo provided and reviewed.", status: "required", severity: "high" },
  { id: "kyc-aml", title: "KYC/AML Provider", description: "KYC/AML provider engaged and verified.", status: "required", severity: "high" },
  { id: "wallet-matrix", title: "Wallet Authority Matrix", description: "Wallet authority matrix documented.", status: "required", severity: "high" },
  { id: "tokenomics", title: "Tokenomics Review", description: "Tokenomics reviewed and approved.", status: "required", severity: "high" },
  { id: "liquidity-plan", title: "Liquidity Plan", description: "Liquidity plan documented.", status: "required", severity: "high" },
  { id: "marketing-review", title: "Marketing Review", description: "Marketing reviewed and approved.", status: "required", severity: "medium" },
  { id: "audit", title: "Smart-Contract Audit", description: "Smart-contract audit plan in place.", status: "required", severity: "high" },
  { id: "proof-packet", title: "Proof Packet", description: "Proof packet generated.", status: "gated", severity: "high" },
  { id: "committee", title: "Launch Committee Approval", description: "Launch committee GO/NO-GO decision.", status: "gated", severity: "critical" }
];

export const DUE_DILIGENCE_REQUIREMENTS: ReadinessItem[] = [
  { id: "mou", title: "Signed MOU", description: "MOU signed by all parties.", status: "required", severity: "high" },
  { id: "entity-docs", title: "Entity Documents", description: "Entity documents provided.", status: "required", severity: "high" },
  { id: "signers", title: "Authorized Signers", description: "List of authorized signers.", status: "required", severity: "high" },
  { id: "cap-table", title: "Cap Table", description: "Cap table disclosed.", status: "required", severity: "medium" },
  { id: "wallet-matrix", title: "Wallet Authority Matrix", description: "Wallet authority matrix provided.", status: "required", severity: "high" },
  { id: "tokenomics", title: "Tokenomics", description: "Tokenomics disclosed.", status: "required", severity: "high" },
  { id: "legal-memo", title: "Legal Memo", description: "Legal memo provided.", status: "required", severity: "high" },
  { id: "kyc-aml", title: "KYC/AML Provider", description: "KYC/AML provider engaged.", status: "required", severity: "high" },
  { id: "audit-plan", title: "Smart-Contract Audit Plan", description: "Audit plan documented.", status: "required", severity: "high" },
  { id: "marketing", title: "Marketing Review", description: "Marketing reviewed.", status: "required", severity: "medium" },
  { id: "liquidity-agreement", title: "Exchange/Liquidity Agreements", description: "Written agreements in place.", status: "required", severity: "high" },
  { id: "litigation", title: "Litigation Disclosures", description: "Litigation disclosures provided.", status: "required", severity: "medium" },
  { id: "prior-projects", title: "Prior Token Project History", description: "Prior token project history disclosed.", status: "required", severity: "medium" },
  { id: "custody-policy", title: "Treasury/Wallet Custody Policy", description: "Custody policy documented.", status: "required", severity: "high" },
  { id: "committee", title: "Launch Committee Approval", description: "Launch committee approval documented.", status: "gated", severity: "critical" }
];

export const TECHNICAL_SCALE_REQUIREMENTS: ReadinessItem[] = [
  { id: "postgresql", title: "PostgreSQL", description: "Production-grade PostgreSQL database.", status: "ready", severity: "high" },
  { id: "redis", title: "Redis", description: "Production-grade Redis cache.", status: "ready", severity: "high" },
  { id: "queue", title: "Queue System", description: "Queue system for async jobs.", status: "ready", severity: "high" },
  { id: "object-storage", title: "Object Storage", description: "Object storage for files and proofs.", status: "ready", severity: "medium" },
  { id: "multi-rpc", title: "Multi-RPC Failover", description: "Multi-RPC failover for chain access.", status: "demo", severity: "medium" },
  { id: "xrpl-indexer", title: "XRPL Indexer", description: "XRPL indexer for monitoring.", status: "demo", severity: "medium" },
  { id: "solana-indexer", title: "Solana Indexer", description: "Solana indexer for monitoring.", status: "demo", severity: "medium" },
  { id: "websockets", title: "Websocket Streams", description: "Websocket streams for real-time data.", status: "ready", severity: "medium" },
  { id: "observability", title: "Observability", description: "Observability and monitoring stack.", status: "ready", severity: "high" },
  { id: "waf", title: "WAF/DDoS Protection", description: "Web Application Firewall and DDoS protection.", status: "ready", severity: "high" },
  { id: "alerts", title: "Alert Engine", description: "Alert engine for incidents.", status: "ready", severity: "high" },
  { id: "incident-response", title: "Incident Response", description: "Incident response plan.", status: "ready", severity: "high" }
];

export const SECURITY_REQUIREMENTS: ReadinessItem[] = [
  { id: "legal", title: "Legal Review", description: "Legal review for all launches.", status: "required", severity: "high" },
  { id: "kyc-aml", title: "KYC/AML", description: "KYC/AML provider required.", status: "required", severity: "high" },
  { id: "wallet-verification", title: "Wallet Authority Verification", description: "Wallet authority must be verified.", status: "required", severity: "high" },
  { id: "audit", title: "Smart-Contract Audit", description: "Audit required for all contracts.", status: "required", severity: "high" },
  { id: "committee", title: "Launch Committee Approval", description: "Committee approval required.", status: "gated", severity: "critical" }
];

export const MONITORING_REQUIREMENTS: ReadinessItem[] = [
  { id: "monitoring", title: "Monitoring Stack", description: "Monitoring stack for all flows.", status: "ready", severity: "high" },
  { id: "alerts", title: "Alert Engine", description: "Alert engine for monitoring.", status: "ready", severity: "high" },
  { id: "incident-response", title: "Incident Response", description: "Incident response plan in place.", status: "ready", severity: "high" }
];

export const MAINNET_ACTIVATION_BLOCKERS: ReadinessItem[] = [
  { id: "no-legal-memo", title: "No Legal Memo", description: "Legal memo missing.", status: "blocked", severity: "critical" },
  { id: "no-kyc-aml", title: "No KYC/AML Provider", description: "KYC/AML provider missing.", status: "blocked", severity: "critical" },
  { id: "no-audit", title: "No Smart-Contract Audit", description: "Smart-contract audit missing.", status: "blocked", severity: "critical" },
  { id: "no-wallet-verification", title: "No Wallet Authority Verification", description: "Wallet authority verification missing.", status: "blocked", severity: "critical" },
  { id: "no-liquidity-proof", title: "No Liquidity Proof", description: "Liquidity proof missing.", status: "blocked", severity: "critical" },
  { id: "no-liquidity-agreement", title: "No Signed Exchange/Liquidity Agreement", description: "Signed agreement missing.", status: "blocked", severity: "critical" },
  { id: "no-marketing", title: "No Marketing Approval", description: "Marketing approval missing.", status: "blocked", severity: "critical" },
  { id: "no-committee", title: "No Launch Committee GO Decision", description: "Launch committee GO decision missing.", status: "blocked", severity: "critical" }
];

export const PARTNER_CONTROL_REQUIREMENTS: ReadinessItem[] = [
  { id: "written-authority", title: "Written Authority Required", description: "All actions require written authority.", status: "required", severity: "high" },
  { id: "no-solo-wallet", title: "No Solo Wallet Control", description: "No unsupervised wallet control allowed.", status: "required", severity: "high" },
  { id: "multisig", title: "Multisig Required", description: "Multisig required for treasury/LP wallets.", status: "required", severity: "high" },
  { id: "no-public-claims", title: "No Unsupervised Public Claims", description: "No public exchange/liquidity claims without approval.", status: "required", severity: "high" },
  { id: "no-promises", title: "No Exchange/Volume Promises", description: "No liquidity or volume promises allowed.", status: "required", severity: "high" },
  { id: "disclosures", title: "Due-Diligence Disclosures Required", description: "All disclosures must be provided.", status: "required", severity: "high" },
  { id: "committee", title: "Launch Committee Final Approval", description: "Launch committee must approve all launches.", status: "gated", severity: "critical" }
];
