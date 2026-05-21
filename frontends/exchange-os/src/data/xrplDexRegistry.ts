// XRPL DEX Intelligence Registry
// TROPTIONS provides intelligence infrastructure only — not a market maker, exchange operator, or broker.

export type XrplVenueCategory =
  | "native_dex"
  | "amm"
  | "payment_path"
  | "trustline_model"
  | "orderbook"
  | "cross_chain_bridge";

export type XrplVenue = {
  id: string;
  name: string;
  category: XrplVenueCategory;
  description: string;
  troptionsUse: string[];
  riskLevel: "low" | "medium" | "high";
  institutionalUseCase: string;
  whatTroptionsWillNotDo: string[];
  notes: string;
  docsUrl: string | null;
};

export const XRPL_DEX_REGISTRY: XrplVenue[] = [
  {
    id: "xrpl-native-dex",
    name: "XRPL Native DEX (Order Book)",
    category: "native_dex",
    description:
      "The XRPL native on-ledger order book. No smart contracts — offers are ledger objects.",
    troptionsUse: [
      "order_book_depth_display",
      "route_intelligence",
      "best_execution_read",
      "proof_of_market_activity",
    ],
    riskLevel: "low",
    institutionalUseCase:
      "Institutional order book monitoring, liquidity proof, settlement intelligence",
    whatTroptionsWillNotDo: [
      "Submit offers on behalf of users",
      "Hold or control user XRP or tokens",
      "Make markets or provide liquidity",
      "Guarantee fills or execution prices",
    ],
    notes:
      "All XRPL order book reads are non-custodial. Unsigned tx prep only — user wallet signs.",
    docsUrl: "https://xrpl.org/decentralized-exchange.html",
  },
  {
    id: "xrpl-amm",
    name: "XRPL AMM (Automated Market Maker)",
    category: "amm",
    description:
      "XRPL native AMM (XLS-30d). Constant product pools, LP tokens, trading fees, and vote-based fee governance.",
    troptionsUse: [
      "amm_pool_monitoring",
      "lp_depth_display",
      "fee_tier_display",
      "liquidity_readiness_check",
      "pool_address_verification",
    ],
    riskLevel: "medium",
    institutionalUseCase:
      "Liquidity readiness verification, proof of pool existence, LP lock status",
    whatTroptionsWillNotDo: [
      "Deposit LP on behalf of users",
      "Vote on AMM fees on behalf of users",
      "Guarantee AMM liquidity",
      "Operate as AMM liquidity provider",
    ],
    notes: "AMM pool reads are public. Pool creation guided — user wallet signs all transactions.",
    docsUrl: "https://xrpl.org/automated-market-makers.html",
  },
  {
    id: "xrpl-payment-paths",
    name: "XRPL Payment Paths",
    category: "payment_path",
    description:
      "XRPL pathfinding engine. Cross-currency payments auto-routed through order books and AMM pools.",
    troptionsUse: [
      "route_intelligence_display",
      "payment_path_preview",
      "cross_currency_proof",
    ],
    riskLevel: "low",
    institutionalUseCase:
      "Payment route proof, settlement path documentation, cross-currency intelligence",
    whatTroptionsWillNotDo: [
      "Submit payments on behalf of users",
      "Hold funds in escrow or transit",
      "Route funds through TROPTIONS wallets",
    ],
    notes:
      "Path queries are read-only. All payment submissions are user-signed via connected wallet.",
    docsUrl: "https://xrpl.org/paths.html",
  },
  {
    id: "xrpl-trustlines",
    name: "XRPL Trustline Model",
    category: "trustline_model",
    description:
      "XRPL requires trustlines for token holders. Issuers control rippling, freeze, and clawback at the account level.",
    troptionsUse: [
      "trustline_verification",
      "issuer_flag_audit",
      "proof_packet_field",
      "holder_count_monitoring",
    ],
    riskLevel: "medium",
    institutionalUseCase:
      "Issuer authority verification, trustline model documentation, compliance disclosure",
    whatTroptionsWillNotDo: [
      "Set trustlines on behalf of users",
      "Control issuer flags without explicit authorization",
      "Guarantee trustline acceptance",
    ],
    notes:
      "Trustline creation always requires user wallet signature. TROPTIONS provides guided flow only.",
    docsUrl: "https://xrpl.org/trust-lines-and-issuing.html",
  },
  {
    id: "xrpl-orderbook-model",
    name: "XRPL Order Book Intelligence",
    category: "orderbook",
    description:
      "Depth of market, bid/ask spread, volume, and historical offer analysis for any XRPL token pair.",
    troptionsUse: [
      "orderbook_depth_display",
      "spread_monitoring",
      "volume_monitoring",
      "anomalous_volume_alert",
    ],
    riskLevel: "low",
    institutionalUseCase:
      "Market surveillance, institutional liquidity depth display, wash-trade pattern detection",
    whatTroptionsWillNotDo: [
      "Create or cancel offers on behalf of users",
      "Simulate volume or fake depth",
      "Guarantee price or depth accuracy",
    ],
    notes: "All order book data is read from XRPL public nodes. No write access without user wallet.",
    docsUrl: "https://xrpl.org/book-offers.html",
  },
];

export type XrplIssuerProofRequirement = {
  id: string;
  label: string;
  description: string;
  verificationMethod: string;
  required: boolean;
};

export const XRPL_ISSUER_PROOF_REQUIREMENTS: XrplIssuerProofRequirement[] = [
  {
    id: "issuer_address",
    label: "Issuer Account Address",
    description: "XRPL mainnet issuer account (r-address)",
    verificationMethod: "XRPL ledger query — account_info",
    required: true,
  },
  {
    id: "domain_verified",
    label: "Domain Field Verified",
    description: "Account domain field set and xrpl.toml published",
    verificationMethod: "account_info domain field + HTTPS fetch of /.well-known/xrpl.toml",
    required: true,
  },
  {
    id: "issuer_flags",
    label: "Account Flags Documented",
    description: "All account flags disclosed: DefaultRipple, RequireAuth, GlobalFreeze, NoFreeze, DisableMaster",
    verificationMethod: "account_info flags field",
    required: true,
  },
  {
    id: "reserve_funded",
    label: "Reserve Balance",
    description: "Issuer account funded above XRPL reserve requirement",
    verificationMethod: "account_info — xrp_balance",
    required: true,
  },
  {
    id: "master_key_policy",
    label: "Master Key / Signer Policy",
    description: "Master key status (enabled/disabled), regular key or multisig if applicable",
    verificationMethod: "account_info — Flags, signer_lists",
    required: true,
  },
  {
    id: "freeze_clawback_policy",
    label: "Freeze & Clawback Policy Disclosed",
    description: "Holders informed of freeze/clawback risk in token documentation",
    verificationMethod: "Legal memo + account flags check",
    required: true,
  },
  {
    id: "toml_token_entry",
    label: "XRPL.toml Token Entry",
    description: "[[CURRENCIES]] entry for issued token in xrpl.toml",
    verificationMethod: "HTTP GET /.well-known/xrpl.toml — parse CURRENCIES section",
    required: true,
  },
];

export type XrplAmmPoolProof = {
  id: string;
  label: string;
  description: string;
  verificationMethod: string;
  required: boolean;
};

export const XRPL_AMM_POOL_PROOF_REQUIREMENTS: XrplAmmPoolProof[] = [
  {
    id: "amm_account",
    label: "AMM Account Address",
    description: "On-chain XRPL AMM account address (created by AMMCreate transaction)",
    verificationMethod: "amm_info — ledger query",
    required: true,
  },
  {
    id: "amm_asset_pair",
    label: "AMM Trading Pair",
    description: "Both assets (currency + issuer or XRP) in the AMM pool",
    verificationMethod: "amm_info — asset, asset2 fields",
    required: true,
  },
  {
    id: "amm_lp_token",
    label: "LP Token Issuer",
    description: "LP token currency code and issuer address for pool LP shares",
    verificationMethod: "amm_info — lp_token field",
    required: true,
  },
  {
    id: "amm_balance",
    label: "Pool Balances Verified",
    description: "Current pool asset balances confirmed non-zero",
    verificationMethod: "amm_info — amount, amount2 fields",
    required: true,
  },
  {
    id: "amm_fee",
    label: "Trading Fee Rate",
    description: "Current trading fee (in basis points)",
    verificationMethod: "amm_info — trading_fee field",
    required: true,
  },
  {
    id: "amm_lp_locked",
    label: "LP Position Lock Proof",
    description: "Evidence LP creator has locked or time-locked their LP tokens",
    verificationMethod: "Account transaction history + escrow check",
    required: true,
  },
];

export const XRPL_COMPLIANCE_NOTES = [
  "XRPL does not require smart contract audits for basic token issuance, but TROPTIONS requires them for any partner token.",
  "The XRPL freeze and clawback mechanism gives issuers significant control over holder assets. This must be fully disclosed.",
  "DefaultRipple enables multi-hop settlement. This affects counterparty risk and must be documented.",
  "RequireAuth limits who can hold the token. Its on/off status materially affects token distribution.",
  "XRPL mainnet does not currently have an on-chain KYC mechanism. All KYC must be performed off-chain.",
  "TROPTIONS does not operate a licensed XRPL exchange or act as a market maker on XRPL.",
] as const;
