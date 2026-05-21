/**
 * TROPTIONS Exchange Listing Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised reference for exchange listing requirements, token info,
 * trading pairs, DEX market data, and compliance checklist.
 *
 * Covers:
 *   • XRPL DEX / Sologenic / XUMM (auto-listed via trustline)
 *   • Stellar DEX / StellarX / Lobstr (auto-listed via trustline)
 *   • Bitrue (Ripple-focused CEX, XRPL IOU listing)
 *   • Binance
 *   • Coinbase
 *   • Gate.io
 *   • KuCoin
 *
 * All dollar figures and timelines are approximate and subject to change.
 */

// ─── Token Identity ───────────────────────────────────────────────────────────

export const TROPTIONS_TOKEN_INFO = {
  name:                 "TROPTIONS",
  ticker:               "TROP",
  tagline:              "The World's First Trade-Collateralized Digital Asset",
  description:
    "TROPTIONS are trade options — digital assets backed by real-world goods, services, " +
    "and value. Built on XRPL and Stellar, TROPTIONS enables decentralized trade finance, " +
    "tokenized real-world assets (RWA), DEX liquidity, and institutional-grade settlement.",
  website:              "https://troptions.org",
  whitepaper:           "https://troptions.org/whitepaper.pdf",
  twitter:              "https://twitter.com/troptions",
  github:               "https://github.com/UnyKorn",
  logoUrl:              "https://troptions.org/assets/troptions-token-256.png",
  logoUrlLarge:         "https://troptions.org/assets/troptions-token-512.png",
  coingeckoId:          "troptions",           // submit to CoinGecko for tracking
  coinmarketcapId:      null,                  // submit to CMC after listing

  // Supply economics
  maxSupply:            "1,000,000,000",       // 1 billion
  totalSupply:          "1,000,000,000",
  circulatingSupply:    "250,000,000",         // update at launch
  supplyAuditUrl:       "https://troptions.org/troptions-proof-index.json",

  // Network presence
  xrplCurrencyCode:     "TROPTIONS",           // displayed on DEX UIs
  xrplCurrencyHex:      "54524F5054494F4E530000000000000000000000",
  stellarAssetCode:     "TROPTIONS",
  stellarHomeDomain:    "troptions.org",

  // Token economics
  tokenType:            "IOU / Trade Option",
  underlyingAssetType:  "Real-world goods and services",
  isSecurityToken:      false,
  kycRequired:          false,                 // open market, KYC optional for institutional
  legalOpinionRequired: true,
  legalOpinionStatus:   "pending",             // update when obtained
} as const;

// ─── Trading Pairs ────────────────────────────────────────────────────────────

export const TROPTIONS_TRADING_PAIRS = [
  // XRPL DEX pairs
  { base: "TROPTIONS", quote: "XRP",  network: "XRPL",    venue: "XRPL DEX",  priority: 1 },
  { base: "TROPTIONS", quote: "USD",  network: "XRPL",    venue: "XRPL DEX",  priority: 2 },
  { base: "TROPTIONS", quote: "USDT", network: "XRPL",    venue: "XRPL DEX",  priority: 3 },
  { base: "TROPTIONS", quote: "EUR",  network: "XRPL",    venue: "XRPL DEX",  priority: 4 },
  { base: "TROPTIONS", quote: "GOLD", network: "XRPL",    venue: "XRPL DEX",  priority: 5 },

  // Stellar DEX pairs
  { base: "TROPTIONS", quote: "XLM",  network: "Stellar", venue: "Stellar DEX", priority: 1 },
  { base: "TROPTIONS", quote: "USDC", network: "Stellar", venue: "Stellar DEX", priority: 2 },
  { base: "TROPTIONS", quote: "yXLM", network: "Stellar", venue: "Stellar DEX", priority: 3 },

  // CEX target pairs
  { base: "TROP",      quote: "USDT", network: "CEX",     venue: "Bitrue",    priority: 1 },
  { base: "TROP",      quote: "XRP",  network: "CEX",     venue: "Bitrue",    priority: 2 },
  { base: "TROP",      quote: "USDT", network: "CEX",     venue: "Binance",   priority: 1 },
  { base: "TROP",      quote: "BTC",  network: "CEX",     venue: "Binance",   priority: 2 },
  { base: "TROP",      quote: "USD",  network: "CEX",     venue: "Coinbase",  priority: 1 },
  { base: "TROP",      quote: "USDT", network: "CEX",     venue: "Gate.io",   priority: 1 },
  { base: "TROP",      quote: "USDT", network: "CEX",     venue: "KuCoin",    priority: 1 },
] as const;

// ─── Exchange Listing Entries ─────────────────────────────────────────────────

export interface ExchangeListingRequirement {
  id:              string;
  venue:           string;
  type:            "dex" | "cex";
  network:         string;
  tier:            "auto" | "standard" | "premium" | "strategic";
  estimatedCost:   string;
  timelineEstimate: string;
  submissionUrl:   string;
  contactEmail:    string;

  // Checklist of required materials
  requirements: {
    item:     string;
    status:   "ready" | "in-progress" | "pending";
    notes?:   string;
  }[];

  // Technical integration notes
  integrationNotes: string[];

  // Listing status
  status: "not-started" | "in-progress" | "submitted" | "listed" | "rejected";
  notes?:  string;
}

export const EXCHANGE_LISTING_REGISTRY: readonly ExchangeListingRequirement[] = [

  // ── XRPL DEX (Sologenic front-end) ────────────────────────────────────────
  {
    id:               "xrpl-dex-sologenic",
    venue:            "XRPL DEX / Sologenic",
    type:             "dex",
    network:          "XRPL",
    tier:             "auto",
    estimatedCost:    "10 XRP (trustline reserve) + ongoing offer reserves",
    timelineEstimate: "Immediate (trustline auto-listing)",
    submissionUrl:    "https://sologenic.org",
    contactEmail:     "support@sologenic.com",
    requirements: [
      { item: "XRPL issuer wallet funded (10+ XRP)",              status: "pending" },
      { item: "AccountSet DefaultRipple=true on issuer",          status: "pending" },
      { item: "Distributor trustline established",                status: "pending" },
      { item: "Initial token supply issued to distributor",       status: "pending" },
      { item: "DEX market maker offers placed (bid/ask)",         status: "pending" },
      { item: "Sologenic token metadata submitted",               status: "pending", notes: "Submit via https://github.com/sologenic/xrpl-token-list" },
    ],
    integrationNotes: [
      "Tokens appear automatically on Sologenic once a trustline and offer exist.",
      "Submit token metadata (name, logo, description) to the XRPL community token list.",
      "XRPL DEX uses pathfinding — TROPTIONS/XRP and TROPTIONS/USD pairs cover most routes.",
      "Maintain minimum 50,000 TROPTIONS in active bid/ask offers for healthy book depth.",
    ],
    status: "not-started",
  },

  // ── XUMM (now Xaman) ──────────────────────────────────────────────────────
  {
    id:               "xumm-xaman",
    venue:            "XUMM / Xaman Wallet",
    type:             "dex",
    network:          "XRPL",
    tier:             "standard",
    estimatedCost:    "$0–$500 (token metadata only)",
    timelineEstimate: "1–2 weeks",
    submissionUrl:    "https://xumm.community",
    contactEmail:     "listings@xumm.app",
    requirements: [
      { item: "Token live on XRPL mainnet (trustline active)", status: "pending" },
      { item: "Logo PNG 256x256 and 512x512",                  status: "pending" },
      { item: "Short description (300 chars max)",             status: "ready"   },
      { item: "Website with SSL and stellar.toml / XRPL info", status: "pending" },
      { item: "Submit to XUMM community token registry",       status: "pending" },
    ],
    integrationNotes: [
      "XUMM (now Xaman) auto-resolves tokens from the XRPL community list.",
      "Priority listing requires XAPP integration — optional but increases visibility.",
      "Kyc-gated tokens require XUMM KYC verification integration.",
    ],
    status: "not-started",
  },

  // ── Stellar DEX / Lobstr / StellarX ──────────────────────────────────────
  {
    id:               "stellar-dex",
    venue:            "Stellar DEX / Lobstr / StellarX",
    type:             "dex",
    network:          "Stellar",
    tier:             "auto",
    estimatedCost:    "~5 XLM (trustline reserve) + LP deposits",
    timelineEstimate: "Immediate (auto-listing on trustline)",
    submissionUrl:    "https://lobstr.co",
    contactEmail:     "support@lobstr.co",
    requirements: [
      { item: "Stellar issuer funded (5+ XLM)",                  status: "pending" },
      { item: "stellar.toml at troptions.org/.well-known/",      status: "pending" },
      { item: "TROPTIONS asset in CURRENCIES section of toml",   status: "pending" },
      { item: "Distributor trustline and initial issuance",      status: "pending" },
      { item: "TROPTIONS/XLM liquidity pool seeded",             status: "pending" },
      { item: "TROPTIONS/USDC liquidity pool seeded",            status: "pending" },
    ],
    integrationNotes: [
      "Lobstr, StellarX, and SDEX all auto-list tokens with valid stellar.toml.",
      "stellar.toml must be at https://troptions.org/.well-known/stellar.toml with CORS: *",
      "For Lobstr featured listing: submit to https://lobstr.co/listing",
      "Home domain must resolve to troptions.org and toml must match account flags.",
    ],
    status: "not-started",
  },

  // ── Bitrue ─────────────────────────────────────────────────────────────────
  {
    id:               "bitrue",
    venue:            "Bitrue",
    type:             "cex",
    network:          "XRPL",
    tier:             "standard",
    estimatedCost:    "$5,000–$50,000 (listing fee, varies)",
    timelineEstimate: "4–8 weeks",
    submissionUrl:    "https://www.bitrue.com/exchange-web/token/apply.html",
    contactEmail:     "listings@bitrue.com",
    requirements: [
      { item: "Project name, ticker (TROP), logo",               status: "ready"   },
      { item: "Max / total / circulating supply",                status: "ready"   },
      { item: "XRPL issuer address (public)",                    status: "pending" },
      { item: "Whitepaper (PDF)",                                status: "pending", notes: "Draft at troptions.org/whitepaper.pdf" },
      { item: "Website with legal disclaimer",                   status: "pending" },
      { item: "Telegram + Twitter community links",              status: "ready"   },
      { item: "Team KYC (passport + photo)",                     status: "pending" },
      { item: "Market maker commitment (min 48h TROP/XRP depth)", status: "pending" },
      { item: "Smart contract / XRPL issuer audit report",       status: "pending" },
      { item: "Trading volume proof (post-DEX launch)",          status: "pending", notes: "Bitrue requires >$50K 24h DEX volume" },
      { item: "Listing fee payment",                             status: "pending" },
    ],
    integrationNotes: [
      "Bitrue is one of the top XRPL-IOU supporting exchanges — priority target.",
      "Ticker on Bitrue: TROP. Pairs: TROP/USDT, TROP/XRP.",
      "Requires demonstrated XRPL DEX activity before CEX listing approval.",
      "XRPL IOU integration: Bitrue uses their own XRPL hot wallet — coordinate issuer address.",
    ],
    status: "not-started",
  },

  // ── Gate.io ────────────────────────────────────────────────────────────────
  {
    id:               "gate-io",
    venue:            "Gate.io",
    type:             "cex",
    network:          "Any (Bridge preferred)",
    tier:             "standard",
    estimatedCost:    "$10,000–$100,000",
    timelineEstimate: "4–8 weeks",
    submissionUrl:    "https://www.gate.io/token_apply",
    contactEmail:     "listing@gate.io",
    requirements: [
      { item: "Project summary (< 200 words)",    status: "ready"   },
      { item: "Token contract / issuer address",  status: "pending" },
      { item: "Circulating supply at launch",     status: "pending" },
      { item: "Tokenomics breakdown",             status: "pending" },
      { item: "Whitepaper link",                  status: "pending" },
      { item: "CoinGecko / CMC tracking page",    status: "pending" },
      { item: "Community size (Telegram, Twitter)", status: "pending" },
      { item: "Market maker commitment",          status: "pending" },
      { item: "Listing fee",                      status: "pending" },
      { item: "KYB documentation (entity)",       status: "pending" },
    ],
    integrationNotes: [
      "Gate.io accepts multi-chain tokens. XRPL IOU or Stellar asset both viable.",
      "Gate.io Startup listing program available for new projects — lower fees.",
    ],
    status: "not-started",
  },

  // ── KuCoin ─────────────────────────────────────────────────────────────────
  {
    id:               "kucoin",
    venue:            "KuCoin",
    type:             "cex",
    network:          "Multi-chain",
    tier:             "standard",
    estimatedCost:    "$10,000–$150,000",
    timelineEstimate: "6–12 weeks",
    submissionUrl:    "https://www.kucoin.com/listing",
    contactEmail:     "listing@kucoin.com",
    requirements: [
      { item: "Project overview (500 words)",        status: "pending" },
      { item: "Tokenomics doc (vesting, allocation)", status: "pending" },
      { item: "Whitepaper",                          status: "pending" },
      { item: "Audit report from Certik / Hacken",   status: "pending" },
      { item: "CoinGecko + CMC listing",             status: "pending" },
      { item: "6+ months trading history",           status: "pending" },
      { item: "Market maker (KuCoin-approved)",      status: "pending" },
      { item: "Listing fee escrow",                  status: "pending" },
      { item: "Legal opinion letter",                status: "pending" },
      { item: "KYC / KYB for key team members",      status: "pending" },
    ],
    integrationNotes: [
      "KuCoin prefers EVM-compatible chains but lists XRPL-native assets via IOU wrapper.",
      "KuCoin Spotlight launchpad option available for established projects.",
    ],
    status: "not-started",
  },

  // ── Binance ────────────────────────────────────────────────────────────────
  {
    id:               "binance",
    venue:            "Binance",
    type:             "cex",
    network:          "Multi-chain (ERC-20 / BEP-20 preferred for smart chain, or XRPL IOU)",
    tier:             "strategic",
    estimatedCost:    "$100,000–$1,000,000+ (not publicly confirmed; includes market making)",
    timelineEstimate: "3–12 months",
    submissionUrl:    "https://www.binance.com/en/my/coin-apply",
    contactEmail:     "listing@binance.com",
    requirements: [
      { item: "Project description (concise)",               status: "pending" },
      { item: "Official website (SSL, legal disclaimers)",   status: "pending" },
      { item: "Whitepaper (comprehensive)",                  status: "pending" },
      { item: "Tokenomics (max supply, vesting, allocation)", status: "pending" },
      { item: "Audit by Certik, PeckShield, or equiv.",      status: "pending" },
      { item: "CoinGecko + CoinMarketCap tracking",          status: "pending" },
      { item: "≥12 months verifiable trading history",       status: "pending" },
      { item: "Top-20 daily volume proof on any CEX",        status: "pending" },
      { item: "Market making arrangement (Binance-preferred)", status: "pending" },
      { item: "Legal opinion — non-security (US + global)",  status: "pending" },
      { item: "KYB for company + individual KYC for founders", status: "pending" },
      { item: "Proof of project utility / real usage",       status: "pending" },
      { item: "Community: 100K+ active Twitter / Telegram",  status: "pending" },
      { item: "Listing fee deposit (Binance BNB burn scheme)", status: "pending" },
    ],
    integrationNotes: [
      "Binance listing is multi-stage: application → BD review → technical → legal → go-live.",
      "Binance strongly prefers BEP-20 / ERC-20 contracts for smart chain listing.",
      "For XRPL-native IOU: Binance XRPL integration team handles IOU deposits separately.",
      "Binance Launchpad / Launchpool available for established projects with strong community.",
      "Binance DEX (BNB Chain) is separate — can list on BNB Chain DEX independently.",
      "Recommended path: List on XRPL DEX → Gate.io/KuCoin → CoinGecko/CMC → Binance.",
    ],
    status: "not-started",
    notes: "Long-term target. Build DEX volume and community first.",
  },

  // ── Coinbase ───────────────────────────────────────────────────────────────
  {
    id:               "coinbase",
    venue:            "Coinbase",
    type:             "cex",
    network:          "Multi-chain (ERC-20 / Base preferred; XRPL IOU possible)",
    tier:             "strategic",
    estimatedCost:    "$0 (no fee) but requires strong fundamentals",
    timelineEstimate: "6–18 months",
    submissionUrl:    "https://listing.coinbase.com/",
    contactEmail:     "assets@coinbase.com",
    requirements: [
      { item: "Asset listing form submission",                    status: "pending" },
      { item: "Project description (technical + business)",       status: "pending" },
      { item: "Whitepaper",                                       status: "pending" },
      { item: "Smart contract code / XRPL issuer proof",         status: "pending" },
      { item: "Tokenomics (supply schedule, vesting)",            status: "pending" },
      { item: "Security audit by reputable firm",                 status: "pending" },
      { item: "Legal opinion — US non-securities analysis",       status: "pending", notes: "Coinbase is stringent on US securities law compliance" },
      { item: "12+ months trading history",                       status: "pending" },
      { item: "Coinbase custody / institutional-grade custody",   status: "pending" },
      { item: "AML / KYC policy documentation",                   status: "pending" },
      { item: "Proof of utility and real-world adoption",         status: "pending" },
      { item: "Public team with LinkedIn / background check",     status: "pending" },
      { item: "Liquidity threshold: >$1M daily volume preferred", status: "pending" },
    ],
    integrationNotes: [
      "Coinbase requires formal asset review — no listing fee but strict compliance bar.",
      "Must pass Coinbase's digital asset framework: utility, technology, market, compliance.",
      "XRPL IOU listing: Coinbase has XRPL integration but rarely lists non-EVM assets.",
      "Recommended: Deploy a bridged ERC-20 / Base network version for Coinbase compatibility.",
      "Coinbase Venture portfolio companies get priority review — explore CBVC for funding.",
      "Coinbase Advanced (Pro) listing requires institutional-grade custody solution.",
    ],
    status: "not-started",
    notes: "Strategic long-term target. Legal opinion letter is the critical path item.",
  },

  // ── CoinGecko (tracking, not exchange) ────────────────────────────────────
  {
    id:               "coingecko",
    venue:            "CoinGecko",
    type:             "dex",
    network:          "Any",
    tier:             "standard",
    estimatedCost:    "$0",
    timelineEstimate: "1–3 weeks",
    submissionUrl:    "https://www.coingecko.com/en/coins/new",
    contactEmail:     "hello@coingecko.com",
    requirements: [
      { item: "Token live on mainnet (XRPL or Stellar)",        status: "pending" },
      { item: "Token tracked on at least one DEX",              status: "pending" },
      { item: "Logo 200x200 PNG",                               status: "pending" },
      { item: "Project description",                            status: "ready"   },
      { item: "Website, whitepaper, social links",              status: "pending" },
      { item: "Explorer link (XRPL explorer / Stellar Expert)", status: "pending" },
    ],
    integrationNotes: [
      "CoinGecko tracking is prerequisite for most CEX listings.",
      "XRPL tokens: Use bithomp.com or xrpscan.com as explorer.",
      "Stellar tokens: Use stellar.expert as explorer.",
      "List on CoinGecko ASAP — most exchanges require it.",
    ],
    status: "not-started",
  },

  // ── CoinMarketCap ──────────────────────────────────────────────────────────
  {
    id:               "coinmarketcap",
    venue:            "CoinMarketCap",
    type:             "dex",
    network:          "Any",
    tier:             "standard",
    estimatedCost:    "$0",
    timelineEstimate: "2–4 weeks",
    submissionUrl:    "https://coinmarketcap.com/request/",
    contactEmail:     "support@coinmarketcap.com",
    requirements: [
      { item: "Token live on mainnet with active trading",   status: "pending" },
      { item: "Official project GitHub",                     status: "pending" },
      { item: "Contact email verified",                      status: "ready"   },
      { item: "Website, whitepaper",                         status: "pending" },
      { item: "CoinGecko listing (optional but helps)",      status: "pending" },
    ],
    integrationNotes: [
      "CMC is often listed after CoinGecko.",
      "Fast Track listing available for $0–$500 — recommended.",
    ],
    status: "not-started",
  },
] as const;

// ─── Compliance Checklist ─────────────────────────────────────────────────────

export const COMPLIANCE_CHECKLIST = [
  {
    item:   "Non-securities legal opinion (US)",
    status: "pending" as const,
    notes:  "Engage securities law firm for Howey test analysis. Critical for Binance/Coinbase.",
  },
  {
    item:   "Non-securities legal opinion (EU/MiCA)",
    status: "pending" as const,
    notes:  "EU MiCA regulation requires asset classification by Jan 2025.",
  },
  {
    item:   "AML / CFT policy documentation",
    status: "pending" as const,
    notes:  "Required for all CEX listings and VASP registration.",
  },
  {
    item:   "FinCEN MSB registration",
    status: "in-progress" as const,
    notes:  "FinCEN MSB license held by TROPTIONS.ORG.",
  },
  {
    item:   "VASP registration (for EU/UK operations)",
    status: "pending" as const,
  },
  {
    item:   "Smart contract / XRPL issuer audit",
    status: "pending" as const,
    notes:  "Engage Certik, Hacken, or Paladin for XRPL IOU technical audit.",
  },
  {
    item:   "Tokenomics whitepaper",
    status: "pending" as const,
    notes:  "Detail supply, vesting, allocation, use-of-proceeds.",
  },
  {
    item:   "KYB documentation for TROPTIONS.ORG entity",
    status: "in-progress" as const,
  },
  {
    item:   "Brand trademark (TROPTIONS)",
    status: "in-progress" as const,
  },
];

// ─── Summary helper ───────────────────────────────────────────────────────────

export function getListingReadinessSummary() {
  const total    = EXCHANGE_LISTING_REGISTRY.length;
  const listed   = EXCHANGE_LISTING_REGISTRY.filter(e => e.status === "listed").length;
  const submitted = EXCHANGE_LISTING_REGISTRY.filter(e => e.status === "submitted").length;
  const inProgress = EXCHANGE_LISTING_REGISTRY.filter(e => e.status === "in-progress").length;
  const notStarted = EXCHANGE_LISTING_REGISTRY.filter(e => e.status === "not-started").length;

  const autoListings = EXCHANGE_LISTING_REGISTRY.filter(e => e.tier === "auto").length;
  const cexListings  = EXCHANGE_LISTING_REGISTRY.filter(e => e.type === "cex").length;

  return {
    total,
    listed,
    submitted,
    inProgress,
    notStarted,
    autoListings,
    cexListings,
  };
}
