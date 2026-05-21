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
    name: "x402 facilitator (main branch)",
    status: "gated" as const,
    detail: "Code on main; production LOCAL_ONLY. Public health on UnyKorn AWS",
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
  "x402 on main: LOCAL_ONLY; Apostle AWS on feature branch",
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
