export const REPO_URL =
  "https://github.com/FTHTrading/Troptions-full-pack";
export const SNP_URL =
  "https://github.com/FTHTrading/sovereign-namespace-protocol";
export const PAGES_URL = "https://fthtrading.github.io/Troptions-full-pack";
const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
export const ON_CHAIN_PROOF_URL = onPages
  ? `${PAGES_URL}/technical/ON_CHAIN_PROOF.html`
  : `${REPO_URL}/blob/main/docs/technical/ON_CHAIN_PROOF.md`;
export const PROOF_URL = ON_CHAIN_PROOF_URL;
export const DOCS_URL = onPages
  ? `${PAGES_URL}/technical`
  : `${REPO_URL}/tree/main/docs`;

export const LIVE_SURFACES = [
  {
    name: "Institutional / Exchange OS hub",
    url: "https://troptions.unykorn.org/troptions",
  },
  {
    name: "TTN sports / WC26",
    url: "https://troptionslive.unykorn.org/sports",
  },
  { name: "Solana token launcher", url: "https://launch.unykorn.org" },
  { name: "FTH Academy", url: "https://fthedu.unykorn.org" },
];

export const FUTURE_DNS = [
  { host: "ai.troptions.org", note: "DONK AI tutor — nginx template only" },
  { host: "ttn.troptions.org", note: "TTN edge — live sports on unykorn.org" },
  { host: "dao.troptions.org", note: "DAO dashboard — run locally or post-DNS" },
];

export const X402_HEALTH = "https://x402.unykorn.org/health";
export const X402_TWIN = "https://twin.unykorn.org";
export const X402_API_DOCS = "https://x402api.unykorn.org";
export const UNYKORN_X402_REPO =
  "https://github.com/FTHTrading/UnyKorn-X402-aws";

export const TIMELINE = [
  {
    year: "2003",
    title: "Macon origins",
    body: "Trade-credit and community-commerce in Macon, Georgia — alternative settlement and local exchange before crypto was mainstream.",
  },
  {
    year: "2004",
    title: "Washington & SEC chapter",
    body: "Regulatory scrutiny and structured response. In-repo materials document compliance posture; external legal characterization requires counsel.",
  },
  {
    year: "Legal cleared",
    title: "Books clean, brand endures",
    body: "Operator narrative: accounts reconciled; TROPTIONS continued building through headlines — brand and community outlasted the news cycle.",
  },
  {
    year: "2010s",
    title: "Digital rails emerge",
    body: "XRPL and Stellar issuance programs, Exchange OS prototypes, and multi-chain treasury topology — predecessor to today's production wallets.",
  },
  {
    year: "2020s",
    title: "Unykorn & open monorepo",
    body: "Troptions-full-pack: Rust L1, SNP, DAO, Academy, TTN, x402 mesh, Genesis World, Solana launcher — public GitHub + live unykorn.org surfaces.",
  },
  {
    year: "2026",
    title: "Sovereign stack verified",
    body: "9.5/10 maturity: Polygon + XRPL + Stellar issued supply user-verified (~874M on ledger). Gap: Cloudflare origin health on select web endpoints.",
  },
];

export const THREE_COLUMNS = [
  {
    title: "Operating Company",
    items: [
      "FTH Trading brand: education, broadcast, exchange surfaces, token launch",
      "22-year continuity — Macon to sovereign infrastructure",
      "Live revenue: Academy tiers, launcher fees, sponsorship pipeline",
      "Eight Genesis brand domains in registry",
    ],
  },
  {
    title: "Sovereign Stack",
    items: [
      "Rust L1: RocksDB, treasury multisig, soulbound, settlement",
      "Sovereign Namespace Protocol (SNP) — 955 roots, Dilithium5, stateless verification",
      "DAO layer with governance API and dashboard",
      "Python/AI backends: Academy, DONK, TTN, DAO service",
      "Multi-chain: Polygon KENNY, XRPL gateway, Solana launcher",
    ],
  },
  {
    title: "Proof & Trust",
    items: [
      "Truth labels: CONFIRMED vs PENDING with proof paths",
      "Domain truth table: LIVE vs Future DNS vs local dev",
      "On-chain refs: KENNY Polygon, XRPL gateway in docs",
      "No kill_switch in repo — honesty over hype",
    ],
  },
];

export const T_LEV8_PAGES = "https://fthtrading.github.io/T-Lev-8-/";
export const AURORA_PAGES = "https://fthtrading.github.io/aurora-site/";
export const TROPTIONS_VERCEL = "https://troptions.vercel.app";
export const TEXCHANGE_REPO = "https://github.com/FTHTrading/TExchange";
export const T_BUILD_REPO = "https://github.com/FTHTrading/T-Build";
export const SOLANA_LAUNCHER_REPO = "https://github.com/FTHTrading/solana-launcher";
export const GENESIS_WORLD_REPO = "https://github.com/FTHTrading/genesis-world";
export const GENESIS_DRUNKS_APP = "https://drunks.app";
export const GENESIS_GSP_API_HEALTH =
  "https://gsp-api.kevanbtc.workers.dev/api/health";
export const VERIFICATION_STATUS_URL = `${PAGES_URL}/technical/VERIFICATION_STATUS.html`;
export const FINAL_ECOSYSTEM_AUDIT_URL = `${PAGES_URL}/technical/FINAL_ECOSYSTEM_AUDIT.html`;
export const ECOSYSTEM_MAP_URL = `${PAGES_URL}/technical/ECOSYSTEM_MAP.html`;
export const XRPL_STELLAR_VERIFICATION_URL = `${PAGES_URL}/technical/XRPL_STELLAR_VERIFICATION.html`;
export const PROOF_FOR_COUNTERPARTIES_URL = `${PAGES_URL}/technical/counterparty/PROOF_FOR_COUNTERPARTIES.html`;

export const MATURITY_SCORE = "9.5";

const dl = onPages ? `${PAGES_URL}/downloads` : "/downloads";

export const DOWNLOAD_ASSETS = [
  {
    title: "Executive summary",
    file: "investor-executive-summary.html",
    href: `${dl}/investor-executive-summary.html`,
    note: "Print → Save as PDF",
  },
  {
    title: "On-chain proof sheet",
    file: "on-chain-proof-sheet.html",
    href: `${dl}/on-chain-proof-sheet.html`,
    note: "Polygon + XRPL + Stellar",
  },
  {
    title: "Infrastructure atlas",
    file: "infrastructure-atlas.html",
    href: `${dl}/infrastructure-atlas.html`,
    note: "Repos, ports, live URLs",
  },
  {
    title: "Opportunity & roadmap",
    file: "opportunity-and-roadmap.html",
    href: `${dl}/opportunity-and-roadmap.html`,
    note: "Pipeline + projections labeled",
  },
];

export type ProofChainCard = {
  chain: string;
  status: "proven";
  summary: string;
  rows: { label: string; value: string; href?: string }[];
};

export const PROOF_WALL: ProofChainCard[] = [
  {
    chain: "Polygon",
    status: "proven",
    summary: "KENNY, EVL, Genesis 9 contracts — PolygonScan verified.",
    rows: [
      {
        label: "KENNY",
        value: "0x93F2…9BD7",
        href: "https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7",
      },
      {
        label: "EVL",
        value: "0xAFe1…fdA3",
        href: "https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3",
      },
      {
        label: "Genesis",
        value: "9 contracts",
        href: `${PAGES_URL}/technical/GENESIS_POLYGON_CONTRACTS.html`,
      },
    ],
  },
  {
    chain: "XRPL",
    status: "proven",
    summary:
      "~474M issued on XRPL leg; AMM live; reserves thin. ~874M cross-chain total.",
    rows: [
      {
        label: "Issuer",
        value: "rJLMST…N3FQ",
        href: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
      },
      {
        label: "Distribution",
        value: "rNX4fa…AyCt",
        href: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
      },
      {
        label: "AMM",
        value: "rBU6ex…niGcp",
        href: "https://xrpscan.com/account/rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp",
      },
      {
        label: "USDC (XRPL)",
        value: "174M issued",
      },
      {
        label: "TROPTIONS (XRPL)",
        value: "~100M issued",
      },
    ],
  },
  {
    chain: "Stellar",
    status: "proven",
    summary: "Mirror issuance on Horizon — issuer GB4FH, distribution GBH4Y.",
    rows: [
      {
        label: "Issuer",
        value: "GB4FH…JGEG4",
        href: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
      },
      {
        label: "Distribution",
        value: "GBH4YY…GGVWC",
        href: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      },
      {
        label: "USDC (Stellar)",
        value: "100M issued",
      },
      {
        label: "Cross-chain USDC",
        value: "274M total",
      },
    ],
  },
];

export type RevenueOpportunity = {
  opportunity: string;
  status: "live" | "pipeline" | "gated" | "projection";
  revenueModel: string;
  tamNote: string;
  clientType: string;
};

export const REVENUE_OPPORTUNITIES: RevenueOpportunity[] = [
  {
    opportunity: "FTH Academy",
    status: "live",
    revenueModel: "$19 / $49 / $149 subscriptions",
    tamNote: "Trading & alt-ed literacy",
    clientType: "Education cohorts",
  },
  {
    opportunity: "Solana launcher SaaS",
    status: "live",
    revenueModel: "Per-launch & mint fees",
    tamNote: "Token launch market",
    clientType: "Launch customers",
  },
  {
    opportunity: "x402 agent commerce",
    status: "live",
    revenueModel: "Metered API · ATP on Apostle",
    tamNote: "AI-to-AI payments",
    clientType: "Agent developers",
  },
  {
    opportunity: "SNP namespaces",
    status: "live",
    revenueModel: "Namespace scarcity / governance",
    tamNote: "Post-quantum identity roots",
    clientType: "Platform integrators",
  },
  {
    opportunity: "Genesis / GSP",
    status: "live",
    revenueModel: "Treasury rails · coordination",
    tamNote: "Capital coordination stack",
    clientType: "Strategic partners",
  },
  {
    opportunity: "WC26 / TTN sports",
    status: "pipeline",
    revenueModel: "$500 – $10K sponsorship tiers",
    tamNote: "Event & broadcast media",
    clientType: "Sports sponsors",
  },
  {
    opportunity: "Exchange desk",
    status: "gated",
    revenueModel: "Spread / IOU desk fees",
    tamNote: "Institutional IOU — not $175M verified fact",
    clientType: "Issuers & liquidity",
  },
  {
    opportunity: "RWA / T-Lev-8",
    status: "pipeline",
    revenueModel: "LEV8 licensing gates",
    tamNote: "Tokenized real assets",
    clientType: "RWA partners",
  },
  {
    opportunity: "Cross-chain issuance utility",
    status: "live",
    revenueModel: "Trust lines · issuance services",
    tamNote: "~874M issued on ledger",
    clientType: "Corporates / funds",
  },
];

export const COMPARABLES = [
  {
    path: "Traditional fintech stack build",
    costTime: "$2–5M · 18+ months",
    advantage:
      "Monorepo + satellites already built; Academy, launcher, mesh, L1 live",
  },
  {
    path: "Token launch only",
    costTime: "$50K–500K · 3–6 months",
    advantage: "Full operating stack — not a single memecoin deploy",
  },
  {
    path: "Identity / namespace SaaS",
    costTime: "Recurring namespace fees",
    advantage: "SNP + cross-chain issuance + x402 agent rails in one stack",
  },
];

export const ECONOMICS = {
  sunk:
    "Years of multi-repo engineering (~7k audit-scope files). Replacement build in the $2–5M fintech band if started from zero today.",
  ongoing:
    "Cloudflare ~$20–200/mo · AWS x402 ~$100–800/mo · PM2 operator host ~$50–300/mo — ranges, not audited books.",
  drivers:
    "PROJECTION — illustrative if clients close: cross-chain issuance utility, x402 metered AI revenue, SNP namespace scarcity.",
};

export const CLIENTS_NEEDED = [
  "Issuers & treasury partners (XRPL/Stellar trust-line programs)",
  "Sports sponsors (WC26 / TTN pipeline)",
  "RWA asset partners (T-Lev-8 gates)",
  "Agent developers (x402 mesh integrators)",
  "Education cohorts (Academy scale)",
];

export const PATH_TO_SKYROCKET = [
  "Fix Cloudflare origin health for twin.unykorn.org and x402api.unykorn.org",
  "Enable troptions.org subdomains (ai, ttn, dao) or standardize investor URLs on unykorn.org",
  "Merge x402 production paths; green T-Build Vitest suite",
  "Top up XRPL production reserves (issuer/AMM thin margin)",
  "Sales motion: close pipeline segments — label booked vs illustrative revenue",
];

export type EcosystemLink = {
  label: string;
  url: string;
};

export type EcosystemCard = {
  name: string;
  category: string;
  detail: string;
  status:
    | "live"
    | "pages"
    | "vercel"
    | "private"
    | "local"
    | "pending"
    | "pipeline"
    | "gated";
  deployUrl?: string;
  deployLabel?: string;
  repoUrl?: string;
  repoLabel?: string;
  links?: EcosystemLink[];
};

export const FTH_ECOSYSTEM_CARDS: EcosystemCard[] = [
  {
    name: "Troptions-full-pack",
    category: "Monorepo · this stack",
    detail:
      "L1 node, Academy, DONK, TTN, DAO, Exchange OS extract, contracts, and this investor site.",
    status: "pages",
    deployUrl: PAGES_URL,
    deployLabel: "Investor site (GitHub Pages)",
    repoUrl: REPO_URL,
  },
  {
    name: "Sovereign Namespace Protocol",
    category: "Constitutional layer",
    detail:
      "Post-quantum namespace roots (955+), Dilithium5 verification — trust primitive for L1 and partner OS.",
    status: "live",
    repoUrl: SNP_URL,
    repoLabel: "SNP spec on GitHub",
  },
  {
    name: "T-Lev-8 deal room",
    category: "RWA · licensing",
    detail: "LEV8-gated deal room and partner RWA licensing surface.",
    status: "pages",
    deployUrl: T_LEV8_PAGES,
    repoUrl: "https://github.com/FTHTrading/T-Lev-8-",
  },
  {
    name: "T-Build TPLOS",
    category: "Partner launch OS",
    detail: "Sandbox for TPLOS partner token launches — feeds launcher and Exchange OS playbooks.",
    status: "local",
    repoUrl: T_BUILD_REPO,
  },
  {
    name: "Troptions Exchange OS",
    category: "Institutional platform",
    detail:
      "Private institutional repo; Vercel preview live. Monorepo carries a synchronized extract under frontends/exchange-os.",
    status: "vercel",
    deployUrl: TROPTIONS_VERCEL,
    repoUrl: "https://github.com/FTHTrading/Troptions",
    repoLabel: "Private GitHub (org members)",
  },
  {
    name: "TExchange",
    category: "Exchange variant",
    detail: "Public sibling repo and deployment lineage for Exchange OS patterns.",
    status: "gated",
    repoUrl: TEXCHANGE_REPO,
  },
  {
    name: "Aurora RWA portal",
    category: "Real-world assets",
    detail: "Aurora storytelling and RWA portal. Custom aurora.unykorn.org DNS not resolving — Pages URL works.",
    status: "pages",
    deployUrl: AURORA_PAGES,
    repoUrl: "https://github.com/FTHTrading/aurora-site",
  },
  {
    name: "Impact ESG portal",
    category: "Impact · ESG",
    detail: "Impact site repo on GitHub; production Pages/DNS needs operator fix before investor claims.",
    status: "pending",
    repoUrl: "https://github.com/FTHTrading/impact-site",
  },
  {
    name: "Solana launcher",
    category: "Launch revenue",
    detail: "SPL and NFT launcher SaaS — mint registry, campaigns, system truth.",
    status: "live",
    deployUrl: "https://launch.unykorn.org",
    repoUrl: SOLANA_LAUNCHER_REPO,
  },
  {
    name: "Genesis World (GSP)",
    category: "Parallel stack · not in monorepo",
    detail:
      "Genesis Sentience Protocol — 12-crate Rust L0, AI agents, 5 rails. Live drunks.app dashboard, gsp-api Worker, Moltbot x402 on Polygon. Nine Polygon contracts + 15 soul-bound NFTs (verify on PolygonScan). Complements SNP / x402 / TROPTIONS L1.",
    status: "live",
    deployUrl: GENESIS_DRUNKS_APP,
    deployLabel: "Live dashboard (drunks.app)",
    repoUrl: GENESIS_WORLD_REPO,
    repoLabel: "GitHub (public)",
    links: [
      { label: "GSP API health", url: GENESIS_GSP_API_HEALTH },
    ],
  },
  {
    name: "Institutional hub",
    category: "Live · Unykorn",
    detail: "Primary TROPTIONS brand and desk narrative on the public edge.",
    status: "live",
    deployUrl: "https://troptions.unykorn.org/troptions",
  },
  {
    name: "Exchange OS edge",
    category: "Live · Unykorn",
    detail: "Control plane, readiness, and institutional routes.",
    status: "live",
    deployUrl: "https://troptionsexchange.unykorn.org/exchange-os",
  },
  {
    name: "Sports & events",
    category: "Live · Unykorn",
    detail: "TTN / WC26 sponsorship and broadcast surfaces.",
    status: "live",
    deployUrl: "https://troptionslive.unykorn.org/sports",
  },
  {
    name: "Education platform",
    category: "Live · Unykorn",
    detail: "FTH Academy subscriptions and curriculum delivery.",
    status: "live",
    deployUrl: "https://fthedu.unykorn.org",
  },
  {
    name: "x402 Payment Mesh (UnyKorn)",
    category: "Live · Apostle Chain ATP · agent commerce",
    detail:
      "Pay-per-request for AI agents — not API keys. HTTP 402 challenges, ATP settlement on Apostle Chain (7332), TxEnvelope and X-Payment-Proof. Production mesh on AWS + Cloudflare; Troptions-full-pack ships a lightweight :4020 sidecar that can proxy upstream.",
    status: "live",
    deployUrl: X402_TWIN,
    deployLabel: "Live demo (digital twin)",
    repoUrl: UNYKORN_X402_REPO,
    repoLabel: "GitHub (public)",
    links: [
      { label: "Public health", url: X402_HEALTH },
      { label: "API docs", url: X402_API_DOCS },
    ],
  },
  {
    name: "troptions.org DNS",
    category: "Not deployed",
    detail: "ai.troptions.org, ttn.troptions.org, dao.troptions.org — templates only until DNS enabled.",
    status: "pending",
  },
];

export const REVENUE_PILLARS = [
  {
    name: "FTH Academy",
    status: "live" as const,
    detail: "$19 / $49 / $149 subscription tiers",
    url: "https://fthedu.unykorn.org",
  },
  {
    name: "Solana launcher",
    status: "live" as const,
    detail: "Mint registry, campaigns, launch fees",
    url: "https://launch.unykorn.org",
  },
  {
    name: "TTN / WC26 sports",
    status: "pipeline" as const,
    detail: "$500 / $2.5K / $10K sponsorship tiers — not booked revenue",
    url: "https://troptionslive.unykorn.org/sports",
  },
  {
    name: "Exchange / desk",
    status: "gated" as const,
    detail: "XRPL desk figures = operator attestation until proofs verified",
    url: "https://troptions.unykorn.org/troptions",
  },
  {
    name: "Polygon community (KENNY / EVL)",
    status: "live" as const,
    detail: "Mainnet addresses in proof docs",
  },
  {
    name: "T-Lev-8 RWA deal room",
    status: "live" as const,
    detail: "Partner licensing surface",
    url: "https://fthtrading.github.io/T-Lev-8-/",
  },
  {
    name: "x402 Payment Mesh",
    status: "live" as const,
    detail:
      "Production facilitator on UnyKorn-X402-aws (AWS). Monorepo sidecar on :4020 for local/staged proxy — not the same stack.",
    url: X402_HEALTH,
  },
  {
    name: "Sovereign Namespace Protocol (SNP)",
    status: "live" as const,
    detail:
      "Constitutional namespace layer — 955 roots, Dilithium5, stateless verification. Root trust primitive of the FTH/UnyKorn stack.",
    url: SNP_URL,
  },
];

export const BUILT_ITEMS = [
  "11 Rust L1 crates + integration tests (~28 cargo tests)",
  "13 pytest (backend + DAO)",
  "RocksDB persistence, treasury multisig, signed submit tests",
  "TLS nginx templates, API-key auth, DAO↔L1 reads",
  "Live unykorn.org surfaces (hub, sports, launcher, academy, x402 health)",
  "KENNY + EVL Polygon — PolygonScan verified (2026-05-21)",
  "Genesis-world 9 Polygon contracts + drunks.app live",
  "XRPL + Stellar issued supply verified — ~874M on ledger (not market cap)",
  "AMM pool live on XRPL; cross-chain USDC 274M issued total",
];

export const GAP_ITEMS = [
  "Cloudflare origin health — twin.unykorn.org / x402api (522/timeouts)",
  "Public TLS on troptions.org hostnames (ai, ttn, dao)",
  "Fraud proofs — design only (Q4 2026 target)",
  "Single-node Sovereign Sequencer (not BFT multi-validator)",
  "T-Build Vitest suite — run after npm ci",
  "XRPL production XRP reserves thin — operational but needs top-up",
];

export const ANTHEM_TRACKS = [
  {
    file: "troptions-theme-primary.mp3",
    title: "Official TROPTIONS song",
    meaning: "Main brand anthem — primary Mainframe Explode mix",
  },
  {
    file: "troptions-theme-alt.mp3",
    title: "Alternate studio mix",
    meaning: "Second pass from the same session — alternate energy",
  },
  {
    file: "troptions-anthem-mainframe-152254.mp3",
    title: "Latest master cut",
    meaning: "Latest Mainframe Explode master from studio session",
  },
  {
    file: "troptions-anthem-22-years.mp3",
    title: "22 years narrative mix",
    meaning: "Timeline narrative — 22 years deep in the bridge",
  },
  {
    file: "troptions-anthem-151853.mp3",
    title: "Session edit",
    meaning: "Earlier timing export from the same recording session",
  },
];

export const QUICKSTART_STEPS = [
  "git clone https://github.com/FTHTrading/Troptions-full-pack.git",
  "cd Troptions-full-pack",
  "cp .env.example .env  # fill locally — never commit",
  ".\\scripts\\quickstart.ps1",
  "pm2 start ecosystem.config.js  # optional full stack",
];
