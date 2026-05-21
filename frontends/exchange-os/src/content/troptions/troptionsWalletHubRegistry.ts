export type TroptionsWalletRole =
  | "ISSUER"
  | "DISTRIBUTION"
  | "AMM_POOL"
  | "STELLAR_ISSUER"
  | "STELLAR_DISTRIBUTION"
  | "OPERATOR"
  | "TREASURY"
  | "CLIENT"
  | "ESCROW"
  | "X402"
  | "INTERNAL_LEDGER";

export type TroptionsWalletNetwork =
  | "XRPL"
  | "STELLAR"
  | "INTERNAL"
  | "X402"
  | "CARD"
  | "MESH";

export type TroptionsWalletStatus =
  | "LEDGER_VERIFIED"
  | "REPORTED"
  | "PENDING_VERIFICATION"
  | "READ_ONLY"
  | "SIMULATION_ONLY"
  | "BLOCKED";

export type TroptionsWalletBalance = {
  assetCode: string;
  displayName: string;
  amount: string;
  network: TroptionsWalletNetwork;
  assetClass:
    | "PRIMARY_IOU"
    | "STABLE_VALUE_IOU"
    | "RWA_RECEIPT"
    | "X402_CREDIT"
    | "INTERNAL_CREDIT"
    | "NATIVE"
    | "LP_SHARE";
  status: "VERIFIED" | "REPORTED" | "PENDING" | "SIMULATED";
};

export type TroptionsWalletRecord = {
  id: string;
  displayName: string;
  role: TroptionsWalletRole;
  network: TroptionsWalletNetwork;
  address?: string;
  email?: string;
  ownerName?: string;
  title?: string;
  status: TroptionsWalletStatus;
  chainId?: string;
  assetBalances: TroptionsWalletBalance[];
  explorerLinks?: {
    xrpscan?: string;
    bithomp?: string;
    stellarExpert?: string;
    stellarChain?: string;
  };
  publicDescription: string;
  safetyNotes: string[];
};

export const TROPTIONS_WALLET_HUB_REGISTRY: readonly TroptionsWalletRecord[] = [
  {
    id: "troptions-xrpl-issuer",
    displayName: "TROPTIONS XRPL Issuer",
    role: "ISSUER",
    network: "XRPL",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    status: "LEDGER_VERIFIED",
    chainId: "XRPL-mainnet",
    assetBalances: [
      {
        assetCode: "TROPTIONS",
        displayName: "TROPTIONS Issuer Obligation",
        amount: "99,999,999.97",
        network: "XRPL",
        assetClass: "PRIMARY_IOU",
        status: "VERIFIED",
      },
      {
        assetCode: "XRP",
        displayName: "XRP Reserve",
        amount: "3.0",
        network: "XRPL",
        assetClass: "NATIVE",
        status: "REPORTED",
      },
    ],
    explorerLinks: {
      xrpscan: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
      bithomp: "https://bithomp.com/explorer/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    },
    publicDescription:
      "Master XRPL issuer for TROPTIONS and gateway-issued stable-value rails.",
    safetyNotes: [
      "Issuer is treated as high-control account and should remain cold-signing in production.",
      "No secret material is stored or returned by wallet-hub APIs.",
    ],
  },
  {
    id: "troptions-xrpl-distribution",
    displayName: "TROPTIONS XRPL Distribution",
    role: "DISTRIBUTION",
    network: "XRPL",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    status: "LEDGER_VERIFIED",
    chainId: "XRPL-mainnet",
    assetBalances: [
      {
        assetCode: "TROPTIONS",
        displayName: "TROPTIONS Distribution",
        amount: "99,999,000",
        network: "XRPL",
        assetClass: "PRIMARY_IOU",
        status: "VERIFIED",
      },
      {
        assetCode: "USDT",
        displayName: "USDT Gateway IOU",
        amount: "100,000,000",
        network: "XRPL",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "USDC",
        displayName: "USDC Gateway IOU",
        amount: "175,000,000",
        network: "XRPL",
        assetClass: "STABLE_VALUE_IOU",
        status: "VERIFIED",
      },
      {
        assetCode: "DAI",
        displayName: "DAI Gateway IOU",
        amount: "50,000,000",
        network: "XRPL",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "EURC",
        displayName: "EURC Gateway IOU",
        amount: "50,000,000",
        network: "XRPL",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
    ],
    explorerLinks: {
      xrpscan: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
      bithomp: "https://bithomp.com/explorer/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    },
    publicDescription:
      "Primary XRPL distribution and settlement wallet for TROPTIONS IOU rails.",
    safetyNotes: [
      "Advanced transfers require jurisdiction-specific legal and compliance clearance.",
    ],
  },
  {
    id: "troptions-xrpl-amm-pool",
    displayName: "TROPTIONS XRPL AMM Pool",
    role: "AMM_POOL",
    network: "XRPL",
    address: "rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp",
    status: "LEDGER_VERIFIED",
    chainId: "XRPL-mainnet",
    assetBalances: [
      {
        assetCode: "XRP",
        displayName: "AMM XRP",
        amount: "2.876",
        network: "XRPL",
        assetClass: "NATIVE",
        status: "REPORTED",
      },
      {
        assetCode: "TROPTIONS",
        displayName: "AMM TROPTIONS",
        amount: "348.93",
        network: "XRPL",
        assetClass: "PRIMARY_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "LP",
        displayName: "AMM LP Shares",
        amount: "31,622.78",
        network: "XRPL",
        assetClass: "LP_SHARE",
        status: "REPORTED",
      },
    ],
    explorerLinks: {
      xrpscan: "https://xrpscan.com/account/rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp",
      bithomp: "https://bithomp.com/explorer/rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp",
    },
    publicDescription:
      "Protocol AMM liquidity account used for transparent market discovery and pool activity.",
    safetyNotes: [
      "AMM values are reported and should be re-verified from explorers before live decisions.",
    ],
  },
  {
    id: "troptions-stellar-issuer",
    displayName: "TROPTIONS Stellar Issuer",
    role: "STELLAR_ISSUER",
    network: "STELLAR",
    address: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    status: "REPORTED",
    chainId: "Stellar-public",
    assetBalances: [
      {
        assetCode: "XLM",
        displayName: "Issuer XLM Reserve",
        amount: "5.0",
        network: "STELLAR",
        assetClass: "NATIVE",
        status: "REPORTED",
      },
    ],
    explorerLinks: {
      stellarExpert:
        "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
      stellarChain:
        "https://stellarchain.io/accounts/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    },
    publicDescription:
      "Stellar mirror issuer for TROPTIONS distribution and stable-value mirror rails.",
    safetyNotes: [
      "Status remains reported until independent verification service is connected.",
    ],
  },
  {
    id: "troptions-stellar-distribution",
    displayName: "TROPTIONS Stellar Distribution",
    role: "STELLAR_DISTRIBUTION",
    network: "STELLAR",
    address: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    status: "REPORTED",
    chainId: "Stellar-public",
    assetBalances: [
      {
        assetCode: "XLM",
        displayName: "Stellar Reserve",
        amount: "13.9999",
        network: "STELLAR",
        assetClass: "NATIVE",
        status: "REPORTED",
      },
      {
        assetCode: "USDC",
        displayName: "USDC Mirror",
        amount: "100,000,000",
        network: "STELLAR",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "USDT",
        displayName: "USDT Mirror",
        amount: "100,000,000",
        network: "STELLAR",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "DAI",
        displayName: "DAI Mirror",
        amount: "50,000,000",
        network: "STELLAR",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "EURC",
        displayName: "EURC Mirror",
        amount: "50,000,000",
        network: "STELLAR",
        assetClass: "STABLE_VALUE_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "TROPTIONS",
        displayName: "TROPTIONS Mirror",
        amount: "99,990,000",
        network: "STELLAR",
        assetClass: "PRIMARY_IOU",
        status: "REPORTED",
      },
      {
        assetCode: "LP",
        displayName: "Stellar LP",
        amount: "100",
        network: "STELLAR",
        assetClass: "LP_SHARE",
        status: "REPORTED",
      },
    ],
    explorerLinks: {
      stellarExpert:
        "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      stellarChain:
        "https://stellarchain.io/accounts/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    },
    publicDescription:
      "Stellar distribution and mirror liquidity account for TROPTIONS and stable-value rails.",
    safetyNotes: [
      "USD conversion on explorers may show 0 for some assets when no DEX price feed exists.",
      "Balance amounts are treated as reported until automated verifier confirms each trustline feed.",
    ],
  },
  {
    id: "troptions-operator-profile",
    displayName: "TROPTIONS Operator",
    role: "OPERATOR",
    network: "INTERNAL",
    ownerName: "Kevan Burns",
    title: "Chairman · Principal Operator",
    email: "kevan@unykorn.org",
    status: "READ_ONLY",
    chainId: "internal-ops",
    assetBalances: [
      {
        assetCode: "OPS_SCOPE",
        displayName: "Operator Scope",
        amount: "READ_ONLY",
        network: "INTERNAL",
        assetClass: "INTERNAL_CREDIT",
        status: "SIMULATED",
      },
    ],
    publicDescription:
      "Operator profile for approval-gated execution. Live send is disabled by default.",
    safetyNotes: [
      "Operator profile cannot submit live transfers without compliance, legal, and runtime gates.",
    ],
  },
  {
    id: "troptions-x402-rail",
    displayName: "TROPTIONS x402 / Internal Rail",
    role: "X402",
    network: "X402",
    status: "SIMULATION_ONLY",
    chainId: "7332",
    assetBalances: [
      {
        assetCode: "X402_CREDIT",
        displayName: "x402 Credit",
        amount: "pending",
        network: "X402",
        assetClass: "X402_CREDIT",
        status: "SIMULATED",
      },
      {
        assetCode: "FTH_USD",
        displayName: "FTH USD",
        amount: "reported",
        network: "INTERNAL",
        assetClass: "INTERNAL_CREDIT",
        status: "SIMULATED",
      },
      {
        assetCode: "TROPTIONS_CREDIT",
        displayName: "TROPTIONS Credit",
        amount: "pending",
        network: "X402",
        assetClass: "X402_CREDIT",
        status: "SIMULATED",
      },
    ],
    publicDescription:
      "x402 and internal payment rail snapshot. Maintained as simulation-only until live provider controls are approved.",
    safetyNotes: [
      "No automatic live x402 settlement is enabled.",
      "All x402 and pay/mesh execution remains approval-gated.",
    ],
  },
] as const;
