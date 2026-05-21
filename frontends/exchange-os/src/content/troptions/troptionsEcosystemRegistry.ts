/**
 * Troptions Ecosystem — Sub-Brand & Domain Registry
 *
 * This registry covers all Troptions-affiliated brands, domains, projects, and
 * asset cohorts that form the broader Troptions ecosystem beyond the core
 * institutional operating system.
 *
 * COMPLIANCE NOTICE:
 * This file is informational infrastructure only.
 * Nothing here constitutes a financial offer, investment solicitation, securities
 * issuance, or regulatory approval. All capabilities listed are subject to legal
 * review, licensing, KYC/KYB, AML, custody approval, and board authorization
 * before any live execution may occur.
 */

export type SubBrandStatus = "active" | "draft" | "needs-review" | "planned" | "suspended";
export type IntegrationPriority = "critical" | "high" | "medium" | "low";

export interface TroptionsSubBrand {
  id: string;
  displayName: string;
  domain: string;
  altDomains?: string[];
  category: string;
  purpose: string;
  publicDescription: string;
  systemRole: string;
  assetFolder: string;
  logoCandidates: string[];
  status: SubBrandStatus;
  complianceNotes: string;
  integrationPriority: IntegrationPriority;
  linkedCapabilities: string[];
  nextActions: string[];
}

/**
 * Primary ecosystem entry — the Troptions brand itself.
 */
export const TROPTIONS_ECOSYSTEM_META = {
  name: "Troptions",
  tagline: "Trade anything. Prove everything. Gate the rest.",
  description:
    "Troptions is a trade, transaction, ledger, liquidity, education, media, real estate, energy, and utility ecosystem built on proof-gated institutional operating infrastructure.",
  primaryDomains: [
    "TROPTIONS.ORG",
    "TROPTIONSXCHANGE.IO",
    "TROPTIONSUNITYTOKEN.COM",
    "TROPTIONS-UNIVERSITY.COM",
    "TROPTIONSTelevisionNetwork.Tv",
    "TheRealEstateConnections.com",
    "Green-N-Go.Solar",
    "HOTRCW.COM",
  ],
  systemRole: "Institutional operating infrastructure platform",
  legalNotice:
    "Troptions is not a bank, broker-dealer, exchange, custodian, licensed financial institution, issuer of securities, payment processor, or investment advisor. It is an institutional operating infrastructure platform.",
} as const;

/**
 * All Troptions sub-brands and affiliated ecosystem projects.
 */
export const TROPTIONS_SUB_BRANDS: TroptionsSubBrand[] = [
  {
    id: "troptions-xchange",
    displayName: "Troptions Xchange",
    domain: "TROPTIONSXCHANGE.IO",
    category: "Exchange / Trade Platform",
    purpose:
      "Provide a structured venue layer for Troptions-based barter, value exchange, and trade routing between participants.",
    publicDescription:
      "Troptions Xchange is the trade and exchange coordination layer of the Troptions ecosystem — enabling structured barter, asset routing, and value-exchange workflows between vetted participants.",
    systemRole:
      "Exchange venue routing layer — surfaces trade routes and barter pathways; all execution gated behind compliance and approval review.",
    assetFolder: "public/assets/troptions/xchange",
    logoCandidates: [
      "TROPTIONS NEW LOGO.jfif",
      "TROPTIONS T LOGO BLK.jfif",
      "TROPTIONS T.png",
      "powered by troptions trade make logo.png",
    ],
    status: "draft",
    complianceNotes:
      "Exchange/venue operations require broker-dealer or ATS licensing review in most jurisdictions. All trade routing is simulation-only pending legal sign-off.",
    integrationPriority: "high",
    linkedCapabilities: ["exchange-routes", "trading-simulation", "wallet", "settlement"],
    nextActions: [
      "Confirm domain ownership and DNS status",
      "Legal review: ATS / exchange licensing requirements",
      "Confirm brand assets with Bryan",
      "Define which trade types are simulation vs live-eligible",
    ],
  },
  {
    id: "troptions-unity-token",
    displayName: "Troptions Unity Token",
    domain: "TROPTIONSUNITYTOKEN.COM",
    category: "Token / Digital Asset",
    purpose:
      "Represent ecosystem participation, access, and coordination through a structured token layer aligned with the Troptions governance and value model.",
    publicDescription:
      "Troptions Unity Token (TUT) represents ecosystem coordination and participation access within the Troptions infrastructure — subject to all applicable issuance, compliance, and custody gates.",
    systemRole:
      "Token role and governance coordination layer. Token issuance, distribution, and transfer are fully gated pending legal, compliance, and board approval.",
    assetFolder: "public/assets/troptions/unity-token",
    logoCandidates: ["TROPTIONS T.png", "TROPTIONS NEW LOGO.jfif", "troptons logo white.jpg"],
    status: "draft",
    complianceNotes:
      "Token issuance may constitute a securities offering in many jurisdictions. No token minting, distribution, or sale may occur without completed legal review, securities counsel opinion, and board authorization. All token references in this system are informational only.",
    integrationPriority: "medium",
    linkedCapabilities: ["rwa", "wallet", "x402", "stablecoin-rails"],
    nextActions: [
      "Securities counsel review of TUT structure",
      "Confirm token supply, role, and governance model with Bryan",
      "Determine chain placement (XRPL / EVM / Stellar)",
      "Define access gating vs free-float model",
    ],
  },
  {
    id: "troptions-university",
    displayName: "Troptions University",
    domain: "TROPTIONS-UNIVERSITY.COM",
    category: "Education / Academy",
    purpose:
      "Deliver structured education on Troptions ecosystem participation, barter economics, asset-backed value, real estate, compliance, and institutional operating concepts.",
    publicDescription:
      "Troptions University is the education layer of the Troptions ecosystem — providing courses, certifications, and resources for participants, partners, and operators seeking to understand and engage with the Troptions infrastructure.",
    systemRole:
      "Education and certification module. Connects to the portal tier for member onboarding and compliance awareness training.",
    assetFolder: "public/assets/troptions/university",
    logoCandidates: ["Troptions university.jpg", "TROPTIONS NEW LOGO.jfif"],
    status: "active",
    complianceNotes:
      "Education content must not constitute investment advice, securities promotion, or unlicensed financial guidance. All course content should include appropriate disclaimers.",
    integrationPriority: "high",
    linkedCapabilities: ["client-portal", "onboarding", "kyc"],
    nextActions: [
      "Source current course catalog from Bryan",
      "Define certification tiers and access model",
      "Map to portal onboarding workflow",
      "Review all course content for regulatory language compliance",
    ],
  },
  {
    id: "troptions-tv-network",
    displayName: "Troptions Television Network",
    domain: "TROPTIONSTelevisionNetwork.Tv",
    category: "Media / Broadcasting",
    purpose:
      "Broadcast Troptions ecosystem news, education, partner showcases, and community content through a dedicated media and video network.",
    publicDescription:
      "Troptions Television Network is the media broadcasting arm of the Troptions ecosystem — hosting educational content, ecosystem updates, partner features, and community programming.",
    systemRole:
      "Media and content distribution layer. Integrates with the insights and editorial system. Video and content assets stored in the media asset folder.",
    assetFolder: "public/assets/troptions/media",
    logoCandidates: ["TROPTIONS NEW LOGO.jfif", "Troptions-facebook-Profile.jpg", "back logo.jpg.png"],
    status: "draft",
    complianceNotes:
      "Broadcast content must comply with FCC guidelines and applicable media regulations. Promotional content about Troptions assets must include appropriate financial disclaimers.",
    integrationPriority: "medium",
    linkedCapabilities: ["insights-content", "narration", "ai-search-layer"],
    nextActions: [
      "Gather video assets and broadcast catalog from Bryan",
      "Define content categories and editorial review process",
      "Connect to insights feed",
      "Add media disclaimer template",
    ],
  },
  {
    id: "real-estate-connections",
    displayName: "The Real Estate Connections",
    domain: "TheRealEstateConnections.com",
    category: "Real Estate / RWA",
    purpose:
      "Connect real estate assets, transactions, and opportunities to the Troptions RWA and proof-gated infrastructure layer.",
    publicDescription:
      "The Real Estate Connections is the real-estate vertical of the Troptions ecosystem — providing structured access to RWA intake, property-backed workflows, and institutional real estate coordination through the Troptions operating infrastructure.",
    systemRole:
      "Real estate RWA intake and coordination layer. Connects directly to the RWA operations engine, proof-of-funds workflows, and custody coordination.",
    assetFolder: "public/assets/troptions/real-estate",
    logoCandidates: ["TROPTIONS NEW LOGO.jfif", "powered by troptions trade make logo.png"],
    status: "draft",
    complianceNotes:
      "Real estate brokerage, mortgage, and securities activities are heavily regulated. All real estate RWA onboarding requires legal review, title verification, custody arrangement, and applicable licensing.",
    integrationPriority: "high",
    linkedCapabilities: ["rwa", "pof", "sblc", "custody", "compliance"],
    nextActions: [
      "Map current real estate pipeline to RWA intake form",
      "Confirm property types and jurisdictions",
      "Legal review: real estate brokerage licensing requirements",
      "Connect to proof-of-funds and custody workflows",
    ],
  },
  {
    id: "green-n-go-solar",
    displayName: "Green-N-Go Solar",
    domain: "Green-N-Go.Solar",
    category: "Energy / ESG / Asset",
    purpose:
      "Represent solar and clean energy assets within the Troptions ecosystem — enabling energy-backed RWA, ESG reporting, and green asset coordination.",
    publicDescription:
      "Green-N-Go Solar is the clean energy and ESG vertical of the Troptions ecosystem — connecting solar installations, energy credits, and green asset documentation to the Troptions institutional infrastructure.",
    systemRole:
      "Energy RWA and ESG coordination layer. Solar assets can be registered as RWA, documented through proof workflows, and tracked via the impact reporting module.",
    assetFolder: "public/assets/troptions/solar",
    logoCandidates: ["TROPTIONS NEW LOGO.jfif", "powered by troptions trade make logo.png"],
    status: "draft",
    complianceNotes:
      "Energy asset tokenization and REC (Renewable Energy Certificate) issuance are subject to CFTC, SEC, state utility commission, and EPA guidelines depending on structure.",
    integrationPriority: "medium",
    linkedCapabilities: ["rwa", "public-benefit", "impact-reporting"],
    nextActions: [
      "Inventory solar asset pipeline with Bryan",
      "Define energy asset documentation requirements",
      "Map to RWA intake + impact reporting",
      "Review ESG/REC regulatory structure",
    ],
  },
  {
    id: "hotrcw",
    displayName: "HOTRCW",
    domain: "HOTRCW.COM",
    category: "Utility / Service Platform",
    purpose:
      "Serve as a utility and service coordination vertical within the Troptions ecosystem, supporting operational workflows and service-backed value exchange.",
    publicDescription:
      "HOTRCW is a utility and service coordination platform within the Troptions ecosystem — connecting service-based value, operational workflows, and community commerce to the Troptions infrastructure.",
    systemRole:
      "Service and utility coordination layer. Connects to wallet, exchange routes, and barter workflows for service-backed value exchange.",
    assetFolder: "public/assets/troptions/hotrcw",
    logoCandidates: ["TROPTIONS NEW LOGO.jfif"],
    status: "needs-review",
    complianceNotes:
      "Service platform operations may require money-services business licensing if payments are intermediated. Confirm service model with Bryan before activation.",
    integrationPriority: "low",
    linkedCapabilities: ["exchange-routes", "wallet", "trading-simulation"],
    nextActions: [
      "Confirm HOTRCW service model and scope with Bryan",
      "Define which services connect to Troptions barter/exchange",
      "Review MSB licensing requirements if applicable",
    ],
  },
  {
    id: "troptions-mobile-medical",
    displayName: "Troptions Mobile Medical Units",
    domain: "TROPTIONS.ORG",
    category: "Healthcare / Community Services",
    purpose:
      "Coordinate mobile medical unit deployment, funding, and impact reporting within the Troptions public-benefit and community infrastructure layer.",
    publicDescription:
      "Troptions Mobile Medical Units represent the community health and public-benefit vertical of the Troptions ecosystem — connecting mobile medical services to impact funding, proof-of-deployment documentation, and public-benefit reporting.",
    systemRole:
      "Public-benefit and community services coordination layer. Connects to impact reporting, proof workflows, and public-benefit rail.",
    assetFolder: "public/assets/troptions/mobile-medical",
    logoCandidates: [
      "TROPTIONS MOBILE MEDICAL UNITS.png",
      "TROPTIONS NEW LOGO.jfif",
      "Troptions-facebook-Profile.jpg",
    ],
    status: "active",
    complianceNotes:
      "Mobile medical services are subject to state medical licensing, HIPAA, and public health regulations. Funding coordination through Troptions infrastructure must be documented and comply with applicable nonprofit and charitable giving regulations.",
    integrationPriority: "high",
    linkedCapabilities: ["public-benefit", "impact-reporting", "pof", "funding"],
    nextActions: [
      "Source mobile medical unit documentation and photos from Bryan",
      "Map to public-benefit rail and impact reporting",
      "Define funding route (grants, donations, Troptions-backed)",
      "Prepare HIPAA / medical data compliance policy",
    ],
  },
];

/** Helper — get sub-brand by ID */
export function getTroptionsSubBrand(id: string): TroptionsSubBrand | undefined {
  return TROPTIONS_SUB_BRANDS.find((b) => b.id === id);
}

/** Helper — get sub-brands by category */
export function getTroptionsSubBrandsByCategory(category: string): TroptionsSubBrand[] {
  return TROPTIONS_SUB_BRANDS.filter((b) => b.category === category);
}

/** Helper — get all active sub-brands */
export function getActiveTroptionsSubBrands(): TroptionsSubBrand[] {
  return TROPTIONS_SUB_BRANDS.filter((b) => b.status === "active");
}

/** Helper — get sub-brands by integration priority */
export function getTroptionsSubBrandsByPriority(priority: IntegrationPriority): TroptionsSubBrand[] {
  return TROPTIONS_SUB_BRANDS.filter((b) => b.integrationPriority === priority);
}

/** All known Troptions logo asset file names (to be placed in public/assets/troptions/) */
export const TROPTIONS_LOGO_ASSETS = [
  "TROPTIONS MOBILE MEDICAL UNITS.png",
  "TROPTIONS NEW LOGO.jfif",
  "Troptions-facebook-Profile.jpg",
  "powered by troptions trade make logo.png",
  "TROPTIONS T LOGO BLK.jfif",
  "TROPTIONS T.png",
  "troptons logo white.jpg",
  "back logo.jpg.png",
  "Troptions university.jpg",
] as const;

export type TroptionsLogoAsset = (typeof TROPTIONS_LOGO_ASSETS)[number];
