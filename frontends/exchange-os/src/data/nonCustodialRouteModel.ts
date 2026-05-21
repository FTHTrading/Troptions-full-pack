// Non-Custodial Route Architecture
// TROPTIONS never holds, signs, or submits transactions on behalf of users.
// All transaction construction is unsigned. User wallet provides signature.

export type RouteStepStatus = "active" | "pending" | "completed" | "blocked" | "user_action";

export type RouteStep = {
  id: string;
  step: number;
  title: string;
  description: string;
  actor: "user" | "troptions_os" | "chain" | "wallet";
  custodial: false;
  status: RouteStepStatus;
  notes: string;
};

export const NON_CUSTODIAL_ROUTE_FLOW: RouteStep[] = [
  {
    id: "wallet_connect",
    step: 1,
    title: "Wallet Connect",
    description: "User connects their wallet (Phantom, XUMM, Metamask, etc.) to the TROPTIONS OS interface.",
    actor: "user",
    custodial: false,
    status: "active",
    notes: "TROPTIONS OS never requests private keys. Connection is view-only until user signs.",
  },
  {
    id: "user_intent",
    step: 2,
    title: "User Intent",
    description: "User specifies trade parameters: token pair, amount, slippage tolerance, and target venue.",
    actor: "user",
    custodial: false,
    status: "active",
    notes: "No funds move at this step. Intent is read-only.",
  },
  {
    id: "quote_request",
    step: 3,
    title: "Quote Request",
    description: "TROPTIONS OS queries DEX aggregators and/or on-chain pools for current quotes.",
    actor: "troptions_os",
    custodial: false,
    status: "active",
    notes: "Read-only API calls. No transaction submitted. Data is indicative only.",
  },
  {
    id: "route_comparison",
    step: 4,
    title: "Route Comparison",
    description: "Available routes displayed to user: price, fees, slippage, DEX venue, and estimated output.",
    actor: "troptions_os",
    custodial: false,
    status: "active",
    notes: "TROPTIONS displays options. User selects preferred route.",
  },
  {
    id: "unsigned_tx_prep",
    step: 5,
    title: "Unsigned Transaction Preparation",
    description: "TROPTIONS OS constructs the transaction object (swap, offer, payment) unsigned.",
    actor: "troptions_os",
    custodial: false,
    status: "active",
    notes: "TROPTIONS never holds a signing key. Transaction is a pure data structure at this point.",
  },
  {
    id: "wallet_review",
    step: 6,
    title: "Wallet Review",
    description: "User's connected wallet presents the transaction for review: amounts, fees, and counterparty.",
    actor: "wallet",
    custodial: false,
    status: "user_action",
    notes: "User sees full transaction details in their own wallet. TROPTIONS cannot override this.",
  },
  {
    id: "wallet_signature",
    step: 7,
    title: "Wallet Signature",
    description: "User approves and signs the transaction with their private key inside their wallet.",
    actor: "user",
    custodial: false,
    status: "user_action",
    notes: "Private key never leaves user's wallet. TROPTIONS OS never sees the signature key.",
  },
  {
    id: "chain_submission",
    step: 8,
    title: "Chain Submission",
    description: "Signed transaction is broadcast to the blockchain (XRPL, Solana, or EVM).",
    actor: "chain",
    custodial: false,
    status: "pending",
    notes: "Submission may happen via wallet provider or user-authorized RPC. TROPTIONS may relay if authorized.",
  },
  {
    id: "confirmation",
    step: 9,
    title: "On-Chain Confirmation",
    description: "Transaction is confirmed in a block/ledger. TROPTIONS OS reads and displays the result.",
    actor: "chain",
    custodial: false,
    status: "pending",
    notes: "Confirmation data is pulled from public RPC. No custody occurs at confirmation.",
  },
  {
    id: "proof_event",
    step: 10,
    title: "Proof Event",
    description: "TROPTIONS OS logs an immutable proof event: tx hash, timestamp, venue, route, and wallet addresses.",
    actor: "troptions_os",
    custodial: false,
    status: "pending",
    notes: "Proof events are non-custodial audit records. No funds or keys involved.",
  },
  {
    id: "monitoring",
    step: 11,
    title: "Monitoring",
    description: "Post-trade monitoring: liquidity levels, authority changes, whale movement, and price deviation.",
    actor: "troptions_os",
    custodial: false,
    status: "active",
    notes: "All monitoring is read-only from public chain data.",
  },
  {
    id: "alerting",
    step: 12,
    title: "Alerting",
    description: "Anomalies trigger alerts to partner operators: LP removal, authority change, wash-like patterns.",
    actor: "troptions_os",
    custodial: false,
    status: "active",
    notes: "Alerts are informational only. TROPTIONS cannot freeze, pause, or modify on-chain state.",
  },
];

export type ChainRouteModel = {
  chain: string;
  walletStandard: string;
  signatureMethod: string;
  rpcProvider: string;
  aggregator: string | null;
  proofEventModel: string;
  custodial: false;
};

export const CHAIN_ROUTE_MODELS: ChainRouteModel[] = [
  {
    chain: "Solana",
    walletStandard: "Wallet Adapter (Phantom, Backpack, Solflare, etc.)",
    signatureMethod: "Ed25519 — user wallet signs locally",
    rpcProvider: "Helius primary, Triton/QuickNode fallback",
    aggregator: "Jupiter Aggregator API (read-only quotes)",
    proofEventModel: "Solana tx hash + slot + program logs",
    custodial: false,
  },
  {
    chain: "XRPL",
    walletStandard: "XUMM / xrpl.js wallet interface",
    signatureMethod: "Ed25519 or secp256k1 — user wallet signs",
    rpcProvider: "XRPL.org wss, Clio node",
    aggregator: null,
    proofEventModel: "XRPL tx hash + ledger index + meta",
    custodial: false,
  },
  {
    chain: "EVM (placeholder)",
    walletStandard: "MetaMask / WalletConnect",
    signatureMethod: "secp256k1 ECDSA — user wallet signs",
    rpcProvider: "Infura / Alchemy / Cloudflare ETH",
    aggregator: "0x / 1inch read-only quotes (future)",
    proofEventModel: "EVM tx hash + block number",
    custodial: false,
  },
  {
    chain: "x402 / Apostle",
    walletStandard: "Apostle Chain SDK (future)",
    signatureMethod: "Ed25519 SovereignKeyring",
    rpcProvider: "Apostle Chain RPC",
    aggregator: null,
    proofEventModel: "x402 receipt + ATP settlement hash",
    custodial: false,
  },
];

export const NON_CUSTODIAL_GUARANTEES = [
  "TROPTIONS OS never requests or stores private keys.",
  "TROPTIONS OS never submits unsigned transactions on behalf of users.",
  "TROPTIONS OS never holds token balances in TROPTIONS-controlled wallets.",
  "TROPTIONS OS never executes trades without user-initiated wallet signature.",
  "TROPTIONS OS never routes funds through TROPTIONS treasury wallets.",
  "All DEX integration is read-only quote and route display until user signs.",
] as const;
