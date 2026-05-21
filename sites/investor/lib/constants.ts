export const REPO_URL =
  "https://github.com/FTHTrading/Troptions-full-pack";
export const SNP_URL =
  "https://github.com/FTHTrading/sovereign-namespace-protocol";
export const PAGES_URL = "https://fthtrading.github.io/Troptions-full-pack";
const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
export const PROOF_URL = onPages
  ? `${PAGES_URL}/technical/proof`
  : `${REPO_URL}/tree/main/docs/proof`;
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
    body: "Trade-credit and community-commerce concept in Macon, Georgia — alternative settlement before crypto was mainstream.",
  },
  {
    year: "2004+",
    title: "Washington & SEC chapter",
    body: "Regulatory attention and structured response. Materials in-repo document compliance posture; counsel review required for external legal characterization.",
  },
  {
    year: "Legal",
    title: "Books clean, brand endures",
    body: "Operator narrative: every dime accounted for, no charges dropped — TROPTIONS continued building through headlines and doubt.",
  },
  {
    year: "Today",
    title: "Operating company + sovereign stack",
    body: "Academy, TTN, Exchange OS, launcher, and Troptions-full-pack L1/DAO — live on unykorn.org; troptions.org subdomains when DNS enables.",
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
export const ECOSYSTEM_MAP_URL = `${PAGES_URL}/technical/ECOSYSTEM_MAP.html`;

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
  "Live unykorn.org surfaces (hub, sports, launcher, academy)",
  "KENNY Polygon mainnet + XRPL gateway documented",
];

export const GAP_ITEMS = [
  "Public TLS on troptions.org hostnames (DNS + certbot pending)",
  "Fraud proofs — design only (Q4 2026 target)",
  "ai.troptions.org / ttn / dao troptions DNS — Future DNS",
  "twin.unykorn.org / x402api — probe when origin slow (522/timeouts possible)",
  "Single-node Sovereign Sequencer (not BFT multi-validator)",
  "Exchange desk $175M — attestation only, not verified fact",
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
