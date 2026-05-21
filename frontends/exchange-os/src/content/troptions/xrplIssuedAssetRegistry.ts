export interface XrplIssuedAssetRecord {
  readonly id: string;
  readonly symbol: string;
  readonly displayName: string;
  readonly assetType: "claim-receipt" | "settlement" | "evidence-marker" | "regulated-asset";
  readonly issuerModel: string;
  readonly issuerAddress?: string;
  readonly freezeEnabled: boolean;
  readonly clawbackEnabled: boolean;
  readonly trustlineRequired: boolean;
  readonly onChainStatus: "issued" | "pending" | "draft";
  readonly supply?: string;
  readonly rwaDescription: string;
  readonly logoPath?: string;
}

// ── TROPTIONS Gateway Issuer Address (XRPL mainnet, live 2026-04-28) ─────────
const GATEWAY_ISSUER = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";

export const XRPL_ISSUED_ASSET_REGISTRY: readonly XrplIssuedAssetRecord[] = [
  // ── TROPTIONS — primary platform token (ISSUED on mainnet) ──────────────────
  {
    id: "asset-troptions",
    symbol: "TROPTIONS",
    displayName: "TROPTIONS Native Token",
    assetType: "regulated-asset",
    issuerModel: "XRPL IOU — Authorized Trustline",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "issued",
    supply: "100,000,000",
    rwaDescription: "Commercial trade instrument backed by documented barter agreements, real property positions, and the TROPTIONS platform asset reserve. Represents fractional claims on real-world assets including real estate, equipment, solar energy infrastructure, and mobile medical assets. Issued 100M on XRPL mainnet 2026-04-28 via TROPTIONS Gateway.",
    logoPath: "/assets/troptions/logos/troptions-iou-logo.svg",
  },

  // ── Legacy asset receipts ────────────────────────────────────────────────────
  {
    id: "asset-legacy",
    symbol: "LEGACY",
    displayName: "Legacy Asset Receipt",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Legacy TROPTIONS issuance receipt representing historical deal positions and prior platform asset claims subject to legacy governance terms.",
  },
  {
    id: "asset-sovbnd",
    symbol: "SOVBND",
    displayName: "Sovereign Bond Receipt",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Sovereign bond-style settlement instrument. Represents a structured private claim backed by documented asset positions. Not a government-issued bond.",
  },
  {
    id: "asset-imperia",
    symbol: "IMPERIA",
    displayName: "Imperial Asset Claim",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Imperial-grade asset claim receipt. Represents high-value structured trade positions with priority settlement rights under TROPTIONS Gateway governance.",
  },
  {
    id: "asset-gemvlt",
    symbol: "GEMVLT",
    displayName: "Gem Vault Receipt",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Gem vault custody receipt. Represents a documented claim on precious or semi-precious stones held in vault custody with independent appraisal and insurance coverage.",
  },
  {
    id: "asset-terravl",
    symbol: "TERRAVL",
    displayName: "Land Value Receipt",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Real property land value receipt. Represents a documented fractional claim on real estate or land assets with title/deed chain-of-custody backing.",
  },
  {
    id: "asset-petro",
    symbol: "PETRO",
    displayName: "Petroleum Commodity Receipt",
    assetType: "claim-receipt",
    issuerModel: "XRPL IOU",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: true,
    clawbackEnabled: false,
    trustlineRequired: true,
    onChainStatus: "draft",
    rwaDescription: "Petroleum commodity claim receipt. Represents a documented position in petroleum or energy commodity assets held or contracted by the TROPTIONS Gateway.",
  },
  {
    id: "asset-attest",
    symbol: "ATTEST",
    displayName: "Attestation Evidence Marker",
    assetType: "evidence-marker",
    issuerModel: "XLS-20 proof marker",
    issuerAddress: GATEWAY_ISSUER,
    freezeEnabled: false,
    clawbackEnabled: false,
    trustlineRequired: false,
    onChainStatus: "draft",
    rwaDescription: "Cryptographic attestation evidence marker. On-chain proof-of-fact token anchoring document hashes, deal confirmations, or compliance certifications to the XRPL ledger. Not a value claim.",
  },
];