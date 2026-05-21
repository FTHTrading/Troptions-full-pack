// TROPTIONS Market Monitoring Requirements
// All active partner tokens are subject to ongoing monitoring.
// TROPTIONS monitoring is read-only — it cannot freeze, pause, or modify on-chain state.

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type AlertCategory =
  | "liquidity"
  | "authority"
  | "volume"
  | "compliance"
  | "oracle"
  | "incident"
  | "wallet";

export type MonitoringAlert = {
  id: string;
  category: AlertCategory;
  name: string;
  description: string;
  triggerCondition: string;
  severity: AlertSeverity;
  response: string;
  escalation: string | null;
  chain: "solana" | "xrpl" | "all";
};

export const MONITORING_ALERTS: MonitoringAlert[] = [
  {
    id: "lp_removal_large",
    category: "liquidity",
    name: "Large LP Removal",
    description: "Sudden removal of >20% of pool liquidity",
    triggerCondition: "Pool balance decreases by >20% in a single block or ledger",
    severity: "critical",
    response: "Alert partner operator immediately. Display warning to UI users.",
    escalation: "Compliance Officer if partner cannot be reached in 30 minutes",
    chain: "all",
  },
  {
    id: "lp_full_removal",
    category: "liquidity",
    name: "Full LP Removal / Rug Risk",
    description: "Pool liquidity drops to near-zero",
    triggerCondition: "Pool balance below 5% of initial seeded amount",
    severity: "critical",
    response: "Immediately display rug-risk warning. Alert all committee members. Suspend UI display.",
    escalation: "Executive Sponsor — immediate",
    chain: "all",
  },
  {
    id: "mint_authority_change",
    category: "authority",
    name: "Mint Authority Change",
    description: "Mint authority wallet changes on a partner token",
    triggerCondition: "Token metadata or on-chain authority field changes for mint authority",
    severity: "critical",
    response: "Alert Technical Lead and Compliance Officer. Suspend proof packet.",
    escalation: "Executive Sponsor within 1 hour",
    chain: "solana",
  },
  {
    id: "freeze_authority_change",
    category: "authority",
    name: "Freeze Authority Change",
    description: "Freeze authority changes on a partner token",
    triggerCondition: "Token freeze authority field changes (previously null or set to address)",
    severity: "high",
    response: "Alert Technical Lead. Review proof packet accuracy.",
    escalation: "Compliance Officer if not explained within 24 hours",
    chain: "solana",
  },
  {
    id: "xrpl_issuer_flag_change",
    category: "authority",
    name: "XRPL Issuer Flag Change",
    description: "XRPL issuer account flag changes (DefaultRipple, RequireAuth, GlobalFreeze, NoFreeze, DisableMaster)",
    triggerCondition: "account_info Flags value changes from baseline",
    severity: "critical",
    response: "Alert immediately. Flag change without disclosure is a proof packet violation.",
    escalation: "Legal Counsel + Compliance Officer — immediate",
    chain: "xrpl",
  },
  {
    id: "whale_transfer_large",
    category: "wallet",
    name: "Large Whale Transfer",
    description: "Transfer of >5% of token supply in a single transaction",
    triggerCondition: "Single wallet transfer exceeds 5% of total supply",
    severity: "high",
    response: "Log event. Alert partner operator. Review for wash-like pattern.",
    escalation: null,
    chain: "all",
  },
  {
    id: "wash_like_pattern",
    category: "compliance",
    name: "Wash-Like Trading Pattern",
    description: "Volume pattern consistent with wash trading: same wallets buying and selling, circular flows",
    triggerCondition: "Circular transfer between ≤3 wallets accounts for >30% of volume in 24h",
    severity: "critical",
    response: "Alert Compliance Officer. Suspend proof packet 'verified' label. Initiate investigation.",
    escalation: "Executive Sponsor + Legal Counsel — same day",
    chain: "all",
  },
  {
    id: "lp_wallet_movement",
    category: "liquidity",
    name: "LP Wallet Movement",
    description: "LP wallet transfers tokens or changes position outside of normal protocol actions",
    triggerCondition: "LP wallet initiates transfer not through pool remove/add protocol instructions",
    severity: "high",
    response: "Alert partner operator and Technical Lead. Verify LP lock status.",
    escalation: "Compliance Officer if LP lock violated",
    chain: "all",
  },
  {
    id: "oracle_deviation",
    category: "oracle",
    name: "Oracle Price Deviation",
    description: "Token price deviates >30% from oracle or reference price in under 5 minutes",
    triggerCondition: "On-chain pool price vs oracle reference diverges by >30% in 5-minute window",
    severity: "high",
    response: "Display price warning in UI. Alert partner operator. Check for manipulation.",
    escalation: null,
    chain: "all",
  },
  {
    id: "volume_spike_anomalous",
    category: "volume",
    name: "Anomalous Volume Spike",
    description: "Volume increases >10x 24h average in under 1 hour",
    triggerCondition: "Hourly volume exceeds 10x rolling 24h average",
    severity: "medium",
    response: "Log event. Alert partner operator. Review for manipulation signals.",
    escalation: "Compliance Officer if pattern continues for >2 hours",
    chain: "all",
  },
  {
    id: "security_incident",
    category: "incident",
    name: "Security Incident",
    description: "Any suspected unauthorized access, key compromise, or exploit",
    triggerCondition: "Security monitoring alert, partner report, or anomalous admin action",
    severity: "critical",
    response: "Activate incident response runbook immediately. Alert all committee members.",
    escalation: "Executive Sponsor + Legal Counsel — immediate",
    chain: "all",
  },
];

export type MonitoringDataSource = {
  id: string;
  name: string;
  chain: "solana" | "xrpl" | "all";
  dataType: string;
  updateFrequency: string;
  custodial: false;
  notes: string;
};

export const MONITORING_DATA_SOURCES: MonitoringDataSource[] = [
  {
    id: "helius_das",
    name: "Helius DAS API",
    chain: "solana",
    dataType: "Token metadata, account ownership, program events",
    updateFrequency: "Real-time (WebSocket) + polling",
    custodial: false,
    notes: "Primary Solana indexer for token and NFT data",
  },
  {
    id: "helius_rpc",
    name: "Helius RPC",
    chain: "solana",
    dataType: "Account state, transactions, program logs",
    updateFrequency: "Real-time",
    custodial: false,
    notes: "Primary Solana RPC with enhanced methods",
  },
  {
    id: "xrpl_wss",
    name: "XRPL WebSocket (wss://)",
    chain: "xrpl",
    dataType: "Ledger events, account transactions, order book updates",
    updateFrequency: "Real-time per ledger (~3-4 seconds)",
    custodial: false,
    notes: "Native XRPL public WebSocket subscription",
  },
  {
    id: "xrpl_clio",
    name: "XRPL Clio Node",
    chain: "xrpl",
    dataType: "Historical ledger data, account history",
    updateFrequency: "On-demand query",
    custodial: false,
    notes: "XRPL.org Clio history server for historical queries",
  },
  {
    id: "jupiter_price",
    name: "Jupiter Price API",
    chain: "solana",
    dataType: "Best-execution token prices across Solana DEXs",
    updateFrequency: "Real-time",
    custodial: false,
    notes: "Read-only price intelligence — no trades submitted",
  },
  {
    id: "pyth_oracle",
    name: "Pyth Network Oracle",
    chain: "solana",
    dataType: "On-chain price feeds for reference price comparison",
    updateFrequency: "Real-time (per slot)",
    custodial: false,
    notes: "Used for oracle deviation alerting",
  },
];

export const INCIDENT_RESPONSE_RUNBOOK_STEPS = [
  {
    step: 1,
    action: "DETECT — Monitoring alert fires or human reports incident",
    owner: "System / On-call operator",
    timeLimit: "T+0",
  },
  {
    step: 2,
    action: "TRIAGE — Classify severity (Critical/High/Medium). Activate appropriate escalation path.",
    owner: "On-call operator",
    timeLimit: "T+15 minutes",
  },
  {
    step: 3,
    action: "NOTIFY — Alert all required committee members per escalation path",
    owner: "On-call operator",
    timeLimit: "T+30 minutes",
  },
  {
    step: 4,
    action: "CONTAIN — Suspend affected UI display, labels, and proof packets if warranted",
    owner: "Technical Lead",
    timeLimit: "T+1 hour",
  },
  {
    step: 5,
    action: "INVESTIGATE — On-chain forensics, monitoring log review, partner contact",
    owner: "Technical Lead + Compliance Officer",
    timeLimit: "T+4 hours",
  },
  {
    step: 6,
    action: "REPORT — Preliminary incident report to Executive Sponsor and Legal Counsel",
    owner: "Compliance Officer",
    timeLimit: "T+8 hours",
  },
  {
    step: 7,
    action: "RESOLVE — Remediation actions agreed. Proof packet status updated.",
    owner: "Committee consensus",
    timeLimit: "Case-by-case",
  },
  {
    step: 8,
    action: "DOCUMENT — Post-incident review written. Audit log updated. Partner notified.",
    owner: "Compliance Officer",
    timeLimit: "Within 72 hours of resolution",
  },
] as const;
