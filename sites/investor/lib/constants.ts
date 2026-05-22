export const REPO_URL =
  "https://github.com/FTHTrading/Troptions-full-pack";
export const SNP_URL =
  "https://github.com/FTHTrading/sovereign-namespace-protocol";
export const PAGES_URL = "https://fthtrading.github.io/Troptions-full-pack";
export const ECOSYSTEM_HUB_URL = `${PAGES_URL}/ecosystem/`;
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
  {
    host: "ai.troptions.org",
    note: "DONK AI tutor — Pages landing until DNS; live Academy on fthedu",
    pagesPath: `${PAGES_URL}/sites/ai/`,
  },
  {
    host: "ttn.troptions.org",
    note: "TTN edge — Pages landing; sports live on troptionslive.unykorn.org",
    pagesPath: `${PAGES_URL}/sites/ttn/`,
  },
  {
    host: "dao.troptions.org",
    note: "DAO — Pages landing redirects to /dao/; operator :8093 local",
    pagesPath: `${PAGES_URL}/sites/dao/`,
  },
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
    body: "9.9/10 maturity: DAO + Polygon + XRPL + Stellar + IPFS anthem user-verified (~874M issued on ledger). Gap: CF origins, TANTHEM mint, troptions.org TLS.",
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
      "Sovereign Namespace Protocol (SNP) — 955 constitutional roots, Dilithium5, stateless verification",
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
export const TANTHEM_NFT_COLLECTION_URL = `${PAGES_URL}/technical/TANTHEM_NFT_COLLECTION.html`;
export const TANTHEM_NFT_GALLERY_URL = onPages
  ? `${PAGES_URL}/nft/`
  : "/nft/";
export const TANTHEM_MINT_DAPP_URL = onPages
  ? `${PAGES_URL}/mint.html`
  : "/mint.html";
export const ANTHEM_IPFS_MANIFEST_CID = "Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7";
export const VALUATION_URL = `${PAGES_URL}/technical/VALUATION_AND_COMPARABLES.html`;
export const SYSTEM_MANIFEST_URL = `${PAGES_URL}/technical/SYSTEM_MANIFEST.html`;
export const TROPTIONS_REVENUE_ENGINE_URL = `${PAGES_URL}/technical/TROPTIONS_REVENUE_ENGINE.html`;
export const MSB_FIAT_RAILS_URL = `${PAGES_URL}/technical/MSB_FIAT_RAILS.html`;
export const DAO_PAGE_URL = `${PAGES_URL}/dao/`;
export const DAO_ARCHITECTURE_URL = `${PAGES_URL}/technical/DAO_ARCHITECTURE.html`;
export const COMMAND_CENTER_URL = onPages
  ? `${PAGES_URL}/command-center/`
  : "/command-center/";
export const TELEGRAM_PAGE_URL = onPages
  ? `${PAGES_URL}/telegram/`
  : "/telegram/";
export const REVENUE_PAGE_URL = onPages
  ? `${PAGES_URL}/revenue/`
  : "/revenue/";
export const SWIFT_PAGE_URL = onPages
  ? `${PAGES_URL}/swift/`
  : "/swift/";
export const OVERVIEW_URL = onPages
  ? `${PAGES_URL}/overview/`
  : "/overview/";
export const PARTNER_BANK_MESH_URL = `${PAGES_URL}/technical/PARTNER_BANK_MESH.html`;
export const BAAS_BATCH_POOLS_URL = `${PAGES_URL}/technical/BAAS_BATCH_POOLS.html`;
export const AGENTIC_RAG_AMM_URL = `${PAGES_URL}/technical/AGENTIC_RAG_AMM.html`;
export const ARBITRAGE_AND_BAAS_URL = `${PAGES_URL}/technical/ARBITRAGE_AND_BAAS.html`;
export const WHAT_YOU_CAN_DO_NOW_URL = `${PAGES_URL}/technical/WHAT_YOU_CAN_DO_NOW.html`;
export const X402_GLOBAL_MESH_URL = `${PAGES_URL}/technical/X402_GLOBAL_MESH.html`;
export const AWS_ACTIVATION_RUNBOOK_URL = `${PAGES_URL}/technical/AWS_ACTIVATION_RUNBOOK.html`;
export const TELEGRAM_OPERATOR_URL = `${PAGES_URL}/technical/TELEGRAM_OPERATOR.html`;
export const OPERATOR_SEED_PARTNER_URL = `${PAGES_URL}/technical/OPERATOR_SEED_AND_PARTNER.html`;

export const MATURITY_SCORE = "9.9";
export const MATURITY_GAP_NOTE =
  "Gap to 10: CF origins (twin/x402api), junior :4099, TANTHEM ledger mint, troptions.org TLS, XRPL reserves.";

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
  {
    title: "Valuation & comparables",
    file: "valuation-and-comparables.html",
    href: `${dl}/valuation-and-comparables.html`,
    note: "PROVEN · PIPELINE · PROJECTION",
  },
  {
    title: "Master pack (all sections)",
    file: "INVESTOR_MASTER.pdf.html",
    href: `${dl}/INVESTOR_MASTER.pdf.html`,
    note: "Single print bundle · May 2026",
  },
];

export const REPLACEMENT_COST = [
  {
    band: "Conservative rebuild",
    range: "$2.6M – $4.8M",
    note: "18–24 months — monorepo + partial satellites",
    label: "PROVEN sunk engineering",
  },
  {
    band: "With DAO hardening",
    range: "$3.5M – $6.5M",
    note: "20–28 months — governance plane included",
    label: "PROVEN + DAO layer",
  },
] as const;

export const VALUATION_PROJECTIONS = [
  {
    scenario: "Base",
    band: "$3M – $5M",
    assumptions: "Academy + launcher scale; modest x402 volume",
  },
  {
    scenario: "Growth",
    band: "$8M – $15M",
    assumptions: "Issuers + WC26 sponsors + SNP integrators (PROJECTION)",
  },
  {
    scenario: "Strategic",
    band: "$20M – $40M",
    assumptions: "RWA gates + agent mesh adoption (PROJECTION)",
  },
] as const;

export const ROCKET_FUEL_WEEKS = [
  {
    week: 1,
    focus: "Edge + hostnames (#1–2)",
    outcome: "CF origins green; troptions.org TLS or documented unykorn.org + Pages standard",
  },
  {
    week: 2,
    focus: "Commerce + reserves (#3, #5)",
    outcome: "x402 production merge (Apostle :7332); XRPL issuer/AMM ~500 XRP top-up",
  },
  {
    week: 3,
    focus: "Partner OS quality (#4)",
    outcome: "T-Build npm ci && npm test green on CI",
  },
  {
    week: 4,
    focus: "Sales motion (#6)",
    outcome: "Booked/LIVE vs pipeline/illustrative labels in CRM + investor copy",
  },
] as const;

export type SkyrocketLabel = "Engineering" | "Ops" | "Sales";

export type SkyrocketStep = {
  title: string;
  detail: string;
  label: SkyrocketLabel;
  bullets?: string[];
};

export const PATH_TO_SKYROCKET: SkyrocketStep[] = [
  {
    title: "Fix Cloudflare origin health",
    detail:
      "twin.unykorn.org, x402api.unykorn.org (522/timeouts); route through Workers/tunnels to live origins",
    label: "Engineering",
  },
  {
    title: "Public hostnames",
    detail:
      "Enable ai.troptions.org, ttn.troptions.org, dao.troptions.org DNS + TLS — or document standard: investor-facing URLs stay on unykorn.org + GitHub Pages until DNS cutover",
    label: "Ops",
  },
  {
    title: "x402 production",
    detail:
      "Merge feature/x402-full-integration production paths; X402_MODE=production, Apostle :7332, point gateway at UnyKorn mesh",
    label: "Engineering",
  },
  {
    title: "T-Build quality",
    detail: "npm ci && npm test in T-Build; green Vitest suite on CI",
    label: "Engineering",
  },
  {
    title: "XRPL reserves",
    detail:
      "Top up issuer rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ and AMM rBU6ex… (~500 XRP each operational account per runbook); thin but operational",
    label: "Ops",
    bullets: [
      `Runbook: ${PAGES_URL}/technical/XRPL_NFT_MINT_RUNBOOK.html`,
      `Verification: ${XRPL_STELLAR_VERIFICATION_URL}`,
    ],
  },
  {
    title: "Sales motion",
    detail: "Close pipeline with honest labels:",
    label: "Sales",
    bullets: [
      "Booked / LIVE: Academy Stripe, launch.unykorn.org, unykorn product URLs, Polygon/XRPL/Stellar proofs",
      "Pipeline / illustrative: MSB rails revenue A–F, WC26 tiers, desk attestation, neobank/BaaS — see TROPTIONS_REVENUE_ENGINE + SYSTEM_MANIFEST (PROJECTION labeled)",
    ],
  },
];

export const COMPETITIVE_PILLARS = [
  {
    id: "snp",
    title: "SNP vs ENS · Unstoppable · Handshake",
    honestTake:
      "ENS wins EVM distribution. SNP wins post-quantum constitutional roots (955) tied to this L1 and partner OS.",
    columns: ["Dimension", "ENS", "Unstoppable", "Handshake", "SNP (Unykorn)"],
    rows: [
      ["Supply", "Millions .eth", "Branded domains", "HNS coins", "955 PQ roots"],
      ["Trust", "Ethereum L1", "Web2 hybrid", "Handshake chain", "Dilithium5 verify"],
      ["Scope", "EVM-primary", "Marketing multi-chain", "HNS only", "Monorepo constitutional layer"],
    ],
  },
  {
    id: "x402",
    title: "x402 vs Coinbase · BNB · Rootstock",
    honestTake:
      "Coinbase wins brand and distribution. Unykorn wins sovereign agent meter + ATP on Apostle — health LIVE, twin pending.",
    columns: ["Dimension", "Coinbase", "BNB", "Rootstock", "Unykorn x402"],
    rows: [
      ["Settlement", "Partner/CEX", "BSC-native", "Bitcoin L2", "Apostle ATP 7332"],
      ["Status", "Major pilots", "Exchange-native", "BTC DeFi", "Health LIVE; twin PENDING"],
      ["Model", "Emerging", "Wallet-centric", "Contract-centric", "Metered AI-to-AI"],
    ],
  },
  {
    id: "l1",
    title: "Unykorn L1 vs ICP · Fleek",
    honestTake:
      "ICP/Fleek win hosted scale. TROPTIONS L1 wins integrated treasury + DAO + SNP in this repo — single-node today.",
    columns: ["Dimension", "ICP", "Fleek", "TROPTIONS L1"],
    rows: [
      ["Architecture", "Subnet cloud", "IPFS hosting", "Rust sequencer + RocksDB"],
      ["Maturity", "Production network", "Production", "PM2 local + code PROVEN"],
      ["Edge", "Chain-as-cloud", "Deploy UX", "Issuance + multisig + governance"],
    ],
  },
  {
    id: "dao",
    title: "DAO vs Aragon · Snapshot · Tally · DAOstack",
    honestTake:
      "Aragon/Snapshot win ecosystem. FTH DAO wins L1-native council + treasury reads — lifts score to 9.8/10.",
    columns: ["Dimension", "Aragon", "Snapshot", "Tally", "FTH DAO"],
    rows: [
      ["Voting", "On-chain orgs", "Off-chain sigs", "Governor UI", "Council + L1 RPC"],
      ["Treasury", "Vault plugins", "External", "Multi-chain UI", "L1 multisig debits"],
      ["Integration", "Generic", "Generic", "Generic", "Native to monorepo"],
    ],
  },
] as const;

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
      "~474M TROPTIONS-issued IOUs on XRPL leg (not Circle native). ~874M cross-chain issued supply — demand proof, not bank reserves.",
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
        label: "USDC IOU (XRPL)",
        value: "174M issued — TROPTIONS gateway, not Circle",
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
        label: "USDC IOU (Stellar)",
        value: "100M issued — TROPTIONS gateway",
      },
      {
        label: "Cross-chain USDC-labeled IOU",
        value: "274M total — not native Circle USDC",
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
    revenueModel: "Spread / IOU desk fees (PIPELINE)",
    tamNote: "Operator desk attestation — not Circle USDC; not $175M verified without bank rails",
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
    revenueModel: "Trust lines · IOU issuance (demand PROVEN)",
    tamNote: "~874M issued IOUs — not market cap or fully-backed reserves",
    clientType: "Corporates / funds",
  },
  {
    opportunity: "MSB fiat rails (A–E fees)",
    status: "pipeline",
    revenueModel: "Issuance/redemption, float, B2B — when omnibus live",
    tamNote: "See SYSTEM_MANIFEST + MSB_FIAT_RAILS · investor /swift/",
    clientType: "Institutional / banks",
  },
  {
    opportunity: "Partner-enabled fiat + BaaS",
    status: "pipeline",
    revenueModel: "Omnibus fees, SWIFT B2B, white-label BaaS — after BIC + nostro",
    tamNote: "Institutional partner rails — PIPELINE until bank wired",
    clientType: "Banks / MSB correspondents",
  },
  {
    opportunity: "TROPTIONS revenue engine (A–F + flywheel)",
    status: "pipeline",
    revenueModel: "18 streams — PROVEN / PIPELINE / PROJECTION labeled",
    tamNote: "Waves 1–3; daily snapshot illustrative only",
    clientType: "Operators / investors",
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
    "Years of multi-repo engineering (~7k audit-scope files). Replacement: $2.6M–$4.8M conservative; $3.5M–$6.5M with DAO hardening.",
  ongoing:
    "Cloudflare ~$20–200/mo · AWS x402 ~$100–800/mo · PM2 operator host ~$50–300/mo — ranges, not audited books.",
  drivers:
    "PROJECTION — illustrative if clients close: cross-chain issuance utility, x402 metered AI revenue, SNP namespace scarcity (955 roots).",
};

export const CLIENTS_NEEDED = [
  "Issuers & treasury partners (XRPL/Stellar trust-line programs)",
  "Sports sponsors (WC26 / TTN pipeline)",
  "RWA asset partners (T-Lev-8 gates)",
  "Agent developers (x402 mesh integrators)",
  "Education cohorts (Academy scale)",
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
    name: "Sovereign DAO",
    category: "Governance · L1-native",
    detail:
      "Soulbound-weighted proposals, timelock, signed RPC on L1 :9944; dao-service :8093 + dashboard. Eight genesis brand issuers — not EVM GovernorBravo as canonical.",
    status: "pages",
    deployUrl: DAO_PAGE_URL,
    deployLabel: "Public DAO page (GitHub Pages)",
    repoUrl: `${REPO_URL}/tree/main/dao`,
    repoLabel: "dao/ in monorepo",
    links: [
      { label: "Architecture doc", url: DAO_ARCHITECTURE_URL },
    ],
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
      "Pay-per-request for AI agents — not API keys. HTTP 402, ATP on Apostle (7332). Production health LIVE at x402.unykorn.org; digital twin at twin.unykorn.org still PENDING (origin flaky). Monorepo :4020 sidecar is not the public mesh.",
    status: "live",
    deployUrl: X402_HEALTH,
    deployLabel: "x402 health (LIVE)",
    repoUrl: UNYKORN_X402_REPO,
    repoLabel: "GitHub (public)",
    links: [
      { label: "Public health", url: X402_HEALTH },
      { label: "API docs", url: X402_API_DOCS },
    ],
  },
  {
    name: "UNYKORN Portfolio",
    category: "Live · Unykorn",
    detail: "System book and portfolio registry (portfolio-unykorn).",
    status: "live",
    deployUrl: "https://portfolio.unykorn.org",
    repoUrl: "https://github.com/kevanbtc/portfolio-unykorn",
    repoLabel: "portfolio-unykorn",
  },
  {
    name: "GoatX (TGOAT)",
    category: "Polygon · Cloudflare tunnel",
    detail:
      "goat.yml tunnel → goat-launch static server :8850. Start node server.js + cloudflared before demos.",
    status: "live",
    deployUrl: "https://goat.unykorn.org",
    deployLabel: "GoatX site",
    repoUrl: "https://github.com/kevanbtc/goat-launch",
    links: [{ label: "Operator landing (Pages)", url: `${PAGES_URL}/sites/goat/` }],
  },
  {
    name: "Junior / Tilden OS",
    category: "AI node · tunnel",
    detail:
      "junior.unykorn.org → :4099; aliases tilden.unykorn.org, jr.unykorn.org. Start junior-tilden + tunnel when 502.",
    status: "pending",
    deployUrl: "https://junior.unykorn.org",
    repoUrl: "https://github.com/kevanbtc/junior-tilden",
    links: [{ label: "Operator landing (Pages)", url: `${PAGES_URL}/sites/junior/` }],
  },
  {
    name: "WhichWay guest OS",
    category: "Live · Cloudflare",
    detail: "WWAI guest operating system — whichway-live Worker.",
    status: "live",
    deployUrl: "https://whichway.live",
  },
  {
    name: "FIFA / WWAI host",
    category: "Live · Cloudflare",
    detail: "fifa-unykorn-router Worker on fifa.unykorn.org.",
    status: "live",
    deployUrl: "https://fifa.unykorn.org",
  },
  {
    name: "troptions.org DNS",
    category: "Pages landings ready",
    detail:
      "ai, ttn, dao — static landings under /sites/* until DNS cutover. Full matrix: ecosystem hub.",
    status: "pages",
    deployUrl: ECOSYSTEM_HUB_URL,
    deployLabel: "Ecosystem status hub",
    links: [
      { label: "ai landing", url: `${PAGES_URL}/sites/ai/` },
      { label: "ttn landing", url: `${PAGES_URL}/sites/ttn/` },
      { label: "dao landing", url: `${PAGES_URL}/sites/dao/` },
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
    detail: "TROPTIONS-issued IOUs — operator desk attestation; not Circle USDC or verified $175M without rails",
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
  "TLS nginx templates, API-key auth, DAO↔L1 reads (9.8/10 with DAO on main)",
  "Live unykorn.org surfaces (hub, sports, launcher, academy, x402 health)",
  "PM2 AI stack — donk :8090, fth :8091, ttn :8092, dao :8093, x402 :4020, popeye :4021",
  "x402_PUBLIC — https://x402.unykorn.org/health CONFIRMED; X402_UPSTREAM → :4020",
  "goat.unykorn.org — GoatX tunnel + :8850 origin (when server + cloudflared running)",
  "L1 anthem collection hash anchored — TROPTIONS_L1_ANCHOR_CONFIRMED.json",
  "IPFS anthem + manifest CIDs — TROPTIONS_IPFS_CIDS.json (counterparty proof)",
  "KENNY + EVL Polygon — PolygonScan verified (2026-05-21)",
  "Genesis-world 9 Polygon contracts + drunks.app live",
  "XRPL + Stellar issued supply verified — ~874M IOUs on ledger (demand proof, not bank reserves)",
  "AMM pool live on XRPL; 274M USDC-labeled IOU issued (TROPTIONS gateway, not Circle native)",
  "T-Build Vitest — 32/32 pass after npm install (GitHub_Audit/T-Build)",
];

export const GAP_ITEMS = [
  "Cloudflare origin — twin.unykorn.org / x402api.unykorn.org (522 — EC2 98.91.89.169 down)",
  "junior.unykorn.org — tunnel live; origin :4099 (junior-tilden) must be started",
  "Public TLS on troptions.org hostnames (ai, ttn, dao)",
  "XRPL TANTHEM 703 mints on ledger — mint DApp LIVE; user sign pending",
  "XRPL production XRP reserves thin — top-up per runbook (~500 XRP each)",
  "T-Build CI gate — wire npm test into GitHub Actions (local: 32/32 pass 2026-05-21)",
  "Workers AI — enable WORKERS_AI_ENABLED=1 when cfut token configured",
];

export type AnthemTrack = {
  file: string;
  title: string;
  meaning: string;
  cid: string;
  featured?: boolean;
  sizeNote?: string;
};

/** IPFS CIDs — see TROPTIONS_IPFS_CIDS.json (repo root). */
export const ANTHEM_TRACKS: AnthemTrack[] = [
  {
    file: "troptions-anthem-elevenlabs-charlie.mp3",
    title: "ElevenLabs Charlie (featured)",
    meaning:
      "AI voice edition — SPECIAL TANTHEM tier; pinned ~154 KB on IPFS",
    cid: "QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV",
    featured: true,
    sizeNote: "~154 KB",
  },
  {
    file: "troptions-theme-primary.mp3",
    title: "Official TROPTIONS song",
    meaning: "Main brand anthem — LEGENDARY tier (5 supply)",
    cid: "QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb",
  },
  {
    file: "troptions-theme-alt.mp3",
    title: "Alternate studio mix",
    meaning: "Second pass from the same session — UNCOMMON tier",
    cid: "QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A",
  },
  {
    file: "troptions-anthem-mainframe-152254.mp3",
    title: "Latest master cut",
    meaning: "Latest Mainframe Explode master — RARE tier",
    cid: "QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def",
  },
  {
    file: "troptions-anthem-22-years.mp3",
    title: "22 years narrative mix",
    meaning: "Timeline narrative — EPIC tier (22 supply)",
    cid: "Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV",
  },
  {
    file: "troptions-anthem-151853.mp3",
    title: "Session edit",
    meaning: "Earlier timing export — COMMON tier (500 supply)",
    cid: "QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj",
  },
];

export const QUICKSTART_STEPS = [
  "git clone https://github.com/FTHTrading/Troptions-full-pack.git",
  "cd Troptions-full-pack",
  "cp .env.example .env  # fill locally — never commit",
  ".\\scripts\\quickstart.ps1",
  "pm2 start ecosystem.config.js  # optional full stack",
];
