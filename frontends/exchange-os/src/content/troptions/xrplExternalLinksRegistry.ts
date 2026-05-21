export interface XrplExternalLink {
  readonly id: string;
  readonly label: string;
  readonly category: "official-docs" | "github" | "testnet" | "troptions";
  readonly url: string;
  readonly description: string;
}

export const XRPL_EXTERNAL_LINKS_REGISTRY: readonly XrplExternalLink[] = [
  {
    id: "xrpl-docs",
    label: "XRPL Docs",
    category: "official-docs",
    url: "https://xrpl.org/",
    description: "Official XRP Ledger documentation home for concepts, APIs, and network guidance.",
  },
  {
    id: "xrpl-dex-docs",
    label: "XRPL DEX Docs",
    category: "official-docs",
    url: "https://xrpl.org/docs/concepts/tokens/decentralized-exchange/offers",
    description: "Reference for XRPL Offers, the native DEX order model used for XRP and issued-asset trading.",
  },
  {
    id: "xrpl-amm-docs",
    label: "XRPL AMM Docs",
    category: "official-docs",
    url: "https://xrpl.org/docs/concepts/tokens/decentralized-exchange/automated-market-makers",
    description: "Official AMM overview covering XRPL two-asset pools and LP token mechanics.",
  },
  {
    id: "xrpl-book-offers-docs",
    label: "XRPL book_offers Docs",
    category: "official-docs",
    url: "https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/book_offers",
    description: "Public API method reference for read-only order-book retrieval.",
  },
  {
    id: "xrpl-amm-transaction-docs",
    label: "XRPL AMM Transaction Docs",
    category: "official-docs",
    url: "https://xrpl.org/docs/references/protocol/transactions/types/ammcreate",
    description: "AMMCreate readiness reference for future approval-gated execution flows.",
  },
  {
    id: "xrpl-testnet-faucet",
    label: "XRPL Testnet / Faucet",
    category: "testnet",
    url: "https://xrpl.org/resources/dev-tools/xrp-faucets",
    description: "XRPL testnet funding and environment guidance for dev and unsigned-lab flows.",
  },
  {
    id: "xrpl-js-github",
    label: "xrpl.js GitHub",
    category: "github",
    url: "https://github.com/XRPLF/xrpl.js",
    description: "Official xrpl.js repository for SDK status, security notices, and release tracking.",
  },
  {
    id: "xrpl-js-security-note",
    label: "xrpl.js Security Note",
    category: "official-docs",
    url: "https://xrpl.org/blog/2025/vulnerabilitydisclosurereport-bug-apr2025",
    description: "Supply-chain compromise disclosure affecting xrpl.js 4.2.1-4.2.4 and 2.14.2.",
  },
  {
    id: "troptions-github",
    label: "Troptions GitHub",
    category: "troptions",
    url: "https://github.com/FTHTrading/Troptions",
    description: "Primary source repository for the Troptions platform.",
  },
  {
    id: "troptions-route-map",
    label: "Troptions Route Map",
    category: "troptions",
    url: "/troptions/diligence/source-map",
    description: "Current Troptions public route map and source navigation.",
  },
  {
    id: "troptions-wallet-dashboard",
    label: "Troptions Wallet Dashboard",
    category: "troptions",
    url: "/portal/troptions/wallet/dashboard",
    description: "Client wallet dashboard within the Troptions portal.",
  },
  {
    id: "troptions-admin-xrpl-control",
    label: "Troptions Admin XRPL Control",
    category: "troptions",
    url: "/admin/troptions/xrpl-platform",
    description: "Admin XRPL readiness, monitoring, and audit control surface.",
  },
];