export type MediaType = "image" | "video";
export type MediaCategory =
  | "brand"
  | "rwa"
  | "gold"
  | "energy"
  | "certificate"
  | "portal"
  | "report"
  | "video";
export type MediaStatus = "approved" | "pending" | "missing";

export type MediaAsset = {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  category: MediaCategory;
  src: string;
  alt: string;
  routeUse: string[];
  complianceNote: string;
  status: MediaStatus;
};

export const MEDIA_REGISTRY: MediaAsset[] = [
  {
    id: "brand-video-a",
    title: "Institutional Brand Story — Part A",
    description: "Primary institutional narrative motion sequence for hero and overview placements.",
    type: "video",
    category: "video",
    src: "/troptions/video/troptions-brand-story-a.mp4",
    alt: "Troptions institutional brand story reel part one",
    routeUse: [
      "/troptions",
      "/troptions-old-money",
      "/troptions-old-money/overview",
    ],
    complianceNote: "Approved for public display. No material representation of returns.",
    status: "approved",
  },
  {
    id: "brand-video-b",
    title: "Institutional Brand Story — Part B",
    description: "Secondary narrative reel for settlement, custody, and governance sections.",
    type: "video",
    category: "video",
    src: "/troptions/video/troptions-brand-story-b.mp4",
    alt: "Troptions institutional brand story reel part two",
    routeUse: [
      "/troptions-old-money/settlement",
      "/troptions-old-money/custody",
      "/troptions-old-money/governance",
    ],
    complianceNote: "Approved for public display. No yield or return representations.",
    status: "approved",
  },
  {
    id: "rwa-vault-logo",
    title: "RWA Vault — Institutional Mark",
    description: "Primary logo mark for the real-world asset vault infrastructure.",
    type: "image",
    category: "rwa",
    src: "/troptions/rwa/rwa-vault-logo.jpg",
    alt: "RWA Vault institutional logo mark",
    routeUse: [
      "/troptions-old-money/rwa",
      "/troptions",
      "/portal/troptions/dashboard",
    ],
    complianceNote: "Approved asset mark. No financial performance claims attached.",
    status: "approved",
  },
  {
    id: "rwa-flow-a",
    title: "Asset-to-Token Flow — Diagram A",
    description: "Process diagram showing asset intake, evidence gathering, and token readiness path.",
    type: "image",
    category: "rwa",
    src: "/troptions/rwa/asset-to-token-flow-a.jpg",
    alt: "Asset to token flow diagram part one showing intake and evidence stages",
    routeUse: ["/troptions-old-money/rwa"],
    complianceNote: "Educational diagram only. Not a commitment of tokenization outcome.",
    status: "approved",
  },
  {
    id: "rwa-flow-b",
    title: "Asset-to-Token Flow — Diagram B",
    description: "Process diagram showing custody verification, proof package, and issuance gating.",
    type: "image",
    category: "rwa",
    src: "/troptions/rwa/asset-to-token-flow-b.jpg",
    alt: "Asset to token flow diagram part two showing custody and issuance gating",
    routeUse: ["/troptions-old-money/rwa"],
    complianceNote: "Educational diagram only. Custody outcomes are jurisdictionally variable.",
    status: "approved",
  },
  {
    id: "gold-digital-twin",
    title: "Gold Digital Twin",
    description: "Visual representation of the serial-numbered gold evidence and digital twin programme.",
    type: "image",
    category: "gold",
    src: "/troptions/gold/gold-digital-twin.jpg",
    alt: "Gold digital twin visualization for institutional reserve evidence",
    routeUse: ["/troptions-old-money/gold", "/troptions"],
    complianceNote: "Approved for reserve evidence section. Does not represent redeemable instrument.",
    status: "approved",
  },
  {
    id: "energy-oil-namespace",
    title: "Oil Namespace — Energy Asset Mark",
    description: "Institutional mark for oil-based real-world asset namespace.",
    type: "image",
    category: "energy",
    src: "/troptions/energy/oil-namespace-logo.jpg",
    alt: "Oil namespace institutional logo for energy real-world asset programme",
    routeUse: ["/troptions-old-money/energy"],
    complianceNote: "Asset category mark only. No production volume or revenue claims attached.",
    status: "approved",
  },
  {
    id: "energy-carbon-namespace",
    title: "Carbon Namespace — Environmental Asset Mark",
    description: "Institutional mark for carbon and environmental asset namespace.",
    type: "image",
    category: "energy",
    src: "/troptions/energy/carbon-namespace-logo.jpg",
    alt: "Carbon namespace institutional logo for environmental asset programme",
    routeUse: ["/troptions-old-money/energy"],
    complianceNote: "Environmental asset mark only. No offset quantity representations.",
    status: "approved",
  },
  {
    id: "certificate-power-genesis",
    title: "Power Genesis Certificate",
    description: "Institutional certificate for the Power Genesis energy production evidence package.",
    type: "image",
    category: "certificate",
    src: "/troptions/certificates/power-genesis-certificate.jpg",
    alt: "Power Genesis institutional certificate for energy production evidence",
    routeUse: [
      "/troptions-old-money/energy",
      "/troptions-old-money/proof",
      "/troptions-old-money/reports",
    ],
    complianceNote: "Certificate facsimile for reference. Actual certificates issued through formal custody channel.",
    status: "approved",
  },
];

export function getMediaByCategory(category: MediaCategory): MediaAsset[] {
  return MEDIA_REGISTRY.filter((m) => m.category === category);
}

export function getMediaByType(type: MediaType): MediaAsset[] {
  return MEDIA_REGISTRY.filter((m) => m.type === type);
}

export function getMediaForRoute(route: string): MediaAsset[] {
  return MEDIA_REGISTRY.filter((m) => m.routeUse.includes(route));
}

export function getApprovedMedia(): MediaAsset[] {
  return MEDIA_REGISTRY.filter((m) => m.status === "approved");
}

export const MEDIA_STATS = {
  total: MEDIA_REGISTRY.length,
  images: MEDIA_REGISTRY.filter((m) => m.type === "image").length,
  videos: MEDIA_REGISTRY.filter((m) => m.type === "video").length,
  approved: MEDIA_REGISTRY.filter((m) => m.status === "approved").length,
  categories: [...new Set(MEDIA_REGISTRY.map((m) => m.category))],
};
