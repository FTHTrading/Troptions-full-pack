// TROPTIONS Exchange OS Operating Model
// This system is infrastructure only — not an exchange operator, custodian, or broker/dealer.

export const EXCHANGE_OS_OPERATING_PRINCIPLES = [
  {
    id: "non-custodial",
    title: "Non-Custodial Only",
    description:
      "TROPTIONS never holds, controls, or accesses user assets. All transactions are user-signed.",
  },
  {
    id: "proof-first",
    title: "Proof-First Listings",
    description:
      "No token may be listed without a complete proof packet: legal, KYC/AML, wallet authority, audit, and launch committee approval.",
  },
  {
    id: "no-fake-volume",
    title: "No Fake Volume",
    description:
      "TROPTIONS does not generate, simulate, wash-trade, or misrepresent trading volume.",
  },
  {
    id: "no-market-manipulation",
    title: "No Market Manipulation",
    description:
      "TROPTIONS does not provide tools, APIs, or services that enable wash trading, layering, spoofing, or other manipulative practices.",
  },
  {
    id: "no-listing-claims",
    title: "No Public Listing Claims Without Agreements",
    description:
      "TROPTIONS does not imply, suggest, or guarantee listings on any DEX, exchange, or platform without a signed agreement and proof packet.",
  },
  {
    id: "legal-required",
    title: "Legal Review Required",
    description:
      "Every token launch requires legal memo review. Howey test analysis required for all utility token claims.",
  },
  {
    id: "launch-committee",
    title: "Launch Committee Required",
    description:
      "Every token launch must receive GO from the TROPTIONS launch committee before any public claim is made.",
  },
  {
    id: "wallet-authority",
    title: "Wallet Authority Transparency Required",
    description:
      "Mint authority, freeze authority, update authority, and treasury wallet must be disclosed, verified, and documented.",
  },
  {
    id: "monitoring",
    title: "Monitoring Required",
    description:
      "All active tokens on the TROPTIONS Exchange OS must be subject to ongoing monitoring for authority changes, whale activity, LP movement, and anomalous volume.",
  },
] as const;

export type ExchangeRiskLevel =
  | "demo"
  | "sandbox"
  | "gated"
  | "pilot"
  | "mainnet_ready"
  | "suspended"
  | "blocked";

export const EXCHANGE_OS_RISK_LEVELS: {
  level: ExchangeRiskLevel;
  description: string;
  publicClaimsAllowed: string[];
}[] = [
  {
    level: "demo",
    description: "Static demonstration data only. No real tokens, no real wallets.",
    publicClaimsAllowed: ["Demo", "For Illustration Only"],
  },
  {
    level: "sandbox",
    description: "Devnet/testnet integration. Real code, no real value.",
    publicClaimsAllowed: ["Testnet", "Devnet", "Sandbox"],
  },
  {
    level: "gated",
    description: "Mainnet integration behind access control. Invite-only pilot.",
    publicClaimsAllowed: ["Gated Access", "Pilot Partner"],
  },
  {
    level: "pilot",
    description: "Limited mainnet launch with enhanced monitoring.",
    publicClaimsAllowed: ["Pilot Live", "Limited Launch"],
  },
  {
    level: "mainnet_ready",
    description: "Full proof packet, legal memo, KYC/AML, launch committee GO.",
    publicClaimsAllowed: ["Live", "Verified", "Mainnet"],
  },
  {
    level: "suspended",
    description: "Active investigation or incident. Display suspended.",
    publicClaimsAllowed: ["Under Review"],
  },
  {
    level: "blocked",
    description: "Permanently removed. Legal/compliance action.",
    publicClaimsAllowed: [],
  },
];

export const EXCHANGE_OS_PUBLIC_CLAIM_RULES = [
  {
    claim: "verified",
    requires: ["proof_packet_complete", "legal_memo", "launch_committee_go"],
  },
  {
    claim: "live",
    requires: ["mainnet_tx_confirmed", "proof_packet_complete", "monitoring_active"],
  },
  { claim: "mainnet", requires: ["mainnet_tx_confirmed", "rpc_confirmed"] },
  {
    claim: "exchange_connected",
    requires: ["dex_pool_confirmed", "pool_address_on_chain"],
  },
  {
    claim: "liquidity_active",
    requires: ["lp_wallet_confirmed", "pool_balance_above_zero", "lp_locked"],
  },
  {
    claim: "proof_packet_generated",
    requires: ["all_required_fields_present", "issuer_wallet_verified"],
  },
  {
    claim: "launch_approved",
    requires: ["launch_committee_go", "legal_memo", "kyc_aml_complete"],
  },
] as const;

export const EXCHANGE_OS_VOLUME_READINESS = {
  required: [
    {
      id: "postgres",
      name: "PostgreSQL Production DB",
      status: "required",
      notes: "Replace SQLite for production scale",
    },
    {
      id: "redis",
      name: "Redis Cache",
      status: "required",
      notes: "Session, queue, rate limiting",
    },
    {
      id: "queue",
      name: "BullMQ or Queue System",
      status: "required",
      notes: "Async proof packet generation, monitoring",
    },
    {
      id: "multi-rpc",
      name: "Multi-RPC Failover",
      status: "required",
      notes: "Helius primary + Triton/QuickNode fallback",
    },
    {
      id: "xrpl-indexer",
      name: "XRPL Indexer",
      status: "required",
      notes: "Clio or XRPL.org Data API",
    },
    {
      id: "solana-indexer",
      name: "Solana Indexer",
      status: "required",
      notes: "Helius DAS or similar",
    },
    {
      id: "websocket",
      name: "WebSocket Market Streams",
      status: "required",
      notes: "Real-time price/volume/LP monitoring",
    },
    {
      id: "object-storage",
      name: "Object Storage",
      status: "required",
      notes: "Cloudflare R2 or S3 for proof packets",
    },
    {
      id: "monitoring",
      name: "Sentry + Observability",
      status: "required",
      notes: "Error tracking, performance, alerts",
    },
    {
      id: "waf",
      name: "Cloudflare WAF/DDoS",
      status: "in_place",
      notes: "Already on Cloudflare network",
    },
    {
      id: "audit-logs",
      name: "Audit Log Retention",
      status: "required",
      notes: "Immutable audit trail for all admin actions",
    },
    {
      id: "incident-plan",
      name: "Incident Response Plan",
      status: "required",
      notes: "Defined runbook for security/compliance events",
    },
  ],
} as const;
