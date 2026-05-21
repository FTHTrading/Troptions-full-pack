/**
 * XRPL NFT Genesis Registry
 *
 * Defines XLS-20 NFT collection specifications for all 8 TROPTIONS brand entities.
 *
 * IMPORTANT — PRIOR NFT STATE:
 * All previously minted NFTs on the TROPTIONS ecosystem were BURNED during
 * the compromise event (2026-02-21). The forensics registry (xrplNftForensicsRegistry.ts)
 * confirms zero remaining NFTs from the prior issuance.
 *
 * This file defines the post-compromise re-issuance specifications.
 * No NFTs have been minted from these definitions.
 *
 * SAFETY RULES:
 * - All entries are executionMode: "specification_only"
 * - Minting requires fresh wallet generation per collection
 * - Collections with requiresLegalClearance: true need counsel sign-off before any mint
 */

export type NftCollectionStatus =
  | "specification_only"
  | "pending_wallet_generation"
  | "pending_legal_clearance"
  | "pending_model_review"
  | "testnet_ready"
  | "live";

export interface XrplNftCollectionSpec {
  readonly id: string;
  readonly brandId: string;
  readonly name: string;
  readonly description: string;
  readonly purpose: string;
  readonly xls_standard: "XLS-20";
  /** Transfer fee in basis points (0–50000, where 50000 = 50%) */
  readonly transfer_fee_basis_pts: number;
  /** tfTransferable flag — can holders trade with each other */
  readonly transferable: boolean;
  /** tfBurnable flag — can issuer revoke/burn */
  readonly burnable: boolean;
  /** tfOnlyXRP — restricts payments to XRP only (false = any currency) */
  readonly only_xrp: boolean;
  readonly max_supply: number | null;
  readonly issuer_wallet_role: string;
  readonly issuer_address: string;
  readonly uri_prefix: string | null;
  readonly metadata_standard: "XRPL-NFT-v1" | "OpenSea" | "custom";
  readonly status: NftCollectionStatus;
  readonly requiresLegalClearance: boolean;
  readonly complianceNotes: string;
  readonly activationSteps: readonly string[];
  readonly priorState: string;
  readonly executionMode: "specification_only";
  readonly simulationOnly: boolean;
}

export const XRPL_NFT_GENESIS_REGISTRY: readonly XrplNftCollectionSpec[] = [
  {
    id: "nft-troptions-org-institutional-credential",
    brandId: "troptions-org",
    name: "TROPTIONS.ORG Institutional Credential",
    description:
      "Verifiable institutional credential NFT issued by TROPTIONS.ORG to vetted participants who have completed KYC/KYB and onboarding requirements.",
    purpose: "Proof-of-identity and access credential for institutional participants.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "university-nft-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: null,
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_wallet_generation",
    requiresLegalClearance: false,
    complianceNotes:
      "Credential NFT — not a financial instrument. Non-transferable, so no secondary market concerns. KYC gate ensures legitimate issuance.",
    activationSteps: [
      "1. Generate fresh XRPL wallet for TROPTIONS.ORG credential issuer",
      "2. Configure NFToken issuer account settings (set DefaultRipple=false, requireAuth if KYC-gated)",
      "3. Test NFTokenMint on testnet",
      "4. Build mint trigger in portal onboarding flow",
      "5. Activate on mainnet after testnet validation",
    ],
    priorState:
      "Previously minted and issued. All prior NFTs were BURNED during the compromise event on 2026-02-21.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-troptions-xchange-member",
    brandId: "troptions-xchange",
    name: "Troptions Xchange Member NFT",
    description:
      "Exchange membership credential for verified participants in Troptions Xchange trade workflows.",
    purpose: "Access control and membership proof for TROPTIONSXCHANGE.IO participants.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "troptions-xchange-wallet",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: null,
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_legal_clearance",
    requiresLegalClearance: true,
    complianceNotes:
      "Exchange membership credentials require ATS / exchange licensing review before issuance. Membership NFT must not confer equity or financial rights.",
    activationSteps: [
      "1. Complete ATS/exchange licensing review",
      "2. Generate fresh exchange wallet",
      "3. Define membership tiers and criteria",
      "4. Test NFTokenMint on testnet",
      "5. Activate after legal sign-off",
    ],
    priorState: "Never minted — new collection for post-compromise genesis.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-troptions-university-completion-cert",
    brandId: "troptions-university",
    name: "Troptions University Completion Certificate",
    description:
      "Non-transferable course completion and certification credential for Troptions University graduates.",
    purpose: "Verifiable academic credential for completed Troptions University courses.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: false,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "university-nft-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: "ipfs://",
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_wallet_generation",
    requiresLegalClearance: false,
    complianceNotes:
      "Educational credential — not a financial instrument. Course content must not constitute investment advice. Non-transferable, non-burnable: permanent record of completion.",
    activationSteps: [
      "1. Generate university NFT issuer wallet",
      "2. Define IPFS metadata schema for course certificates",
      "3. Build auto-mint trigger on course completion in portal",
      "4. Test on testnet — verify non-transferable and non-burnable flags",
      "5. Activate on mainnet",
    ],
    priorState: "Never minted — new collection.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-troptions-tv-premium-access",
    brandId: "troptions-tv-network",
    name: "Troptions TV Premium Access NFT",
    description:
      "Transferable media access credential for Troptions Television Network premium content.",
    purpose: "Content access pass for premium Troptions TV programming. Tradeable on XRPL DEX.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 250, // 2.5% creator royalty on secondary sales
    transferable: true,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "tv-network-nft-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: "ipfs://",
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_legal_clearance",
    requiresLegalClearance: true,
    complianceNotes:
      "Broadcast content must comply with FCC guidelines. Media access NFT with transfer fee — review whether royalty structure creates securities characteristics. Promotional content must include financial disclaimers.",
    activationSteps: [
      "1. FCC and media compliance review",
      "2. Generate TV network NFT wallet",
      "3. Define content tier metadata",
      "4. Test on XRPL testnet including DEX listing",
      "5. Activate after legal review",
    ],
    priorState: "Never minted — new collection.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-real-estate-proof-of-interest",
    brandId: "real-estate-connections",
    name: "Real Estate Proof-of-Interest NFT",
    description:
      "Non-transferable proof-of-interest token for verified real estate opportunities in the Troptions RWA pipeline.",
    purpose:
      "Documents verified participant interest in a specific real estate RWA intake — not a property right or security.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "real-estate-rwa-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: "ipfs://",
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_legal_clearance",
    requiresLegalClearance: true,
    complianceNotes:
      "Real estate NFT structure requires real estate brokerage review. 'Proof-of-interest' must be clearly non-binding and non-equitable to avoid securities characterization. Title verification, custody arrangement, and applicable licensing required.",
    activationSteps: [
      "1. Real estate legal review — confirm non-binding structure",
      "2. Title verification process defined",
      "3. Generate real estate RWA issuer wallet",
      "4. Define IPFS metadata schema per property",
      "5. Test on testnet — verify burnable flag works for interest withdrawal",
      "6. Activate after counsel sign-off",
    ],
    priorState: "Never minted — new collection.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-green-n-go-solar-rec",
    brandId: "green-n-go-solar",
    name: "Green-N-Go Solar REC NFT",
    description:
      "Renewable Energy Certificate (REC) credential NFT for solar installations registered in the Troptions ecosystem.",
    purpose:
      "Digital proof of renewable energy generation, usable for ESG reporting and offset documentation.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: true,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "solar-rwa-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: "ipfs://",
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_legal_clearance",
    requiresLegalClearance: true,
    complianceNotes:
      "Energy asset tokenization and REC issuance subject to CFTC, SEC, state utility commission, and EPA guidelines depending on structure. REC transfer must comply with applicable renewable portfolio standards.",
    activationSteps: [
      "1. CFTC/SEC/state utility commission review of REC NFT structure",
      "2. Define installation documentation requirements",
      "3. Generate solar RWA issuer wallet",
      "4. Build installation registry and IPFS metadata pipeline",
      "5. Test burn-on-retirement workflow (RECs are retired when used for offset)",
      "6. Activate after legal sign-off",
    ],
    priorState: "Never minted — new collection.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-hotrcw-service-credential",
    brandId: "hotrcw",
    name: "HOTRCW Service Credential NFT",
    description:
      "Service platform access and credential NFT for verified HOTRCW participants.",
    purpose: "Access credential for the HOTRCW utility and service coordination platform.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: true,
    only_xrp: false,
    max_supply: null,
    issuer_wallet_role: "hotrcw-service-wallet",
    issuer_address: "PENDING_MODEL_REVIEW",
    uri_prefix: null,
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_model_review",
    requiresLegalClearance: true,
    complianceNotes:
      "HOTRCW service model requires confirmation with Bryan before NFT structure is defined. MSB licensing review if NFT confers payment intermediation rights.",
    activationSteps: [
      "1. Confirm HOTRCW service model and scope with Bryan",
      "2. Legal review of service credential structure",
      "3. Generate HOTRCW wallet after model confirmation",
      "4. Define access tiers and metadata",
      "5. Test and activate after legal sign-off",
    ],
    priorState: "Never minted — new collection. Model under review.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
  {
    id: "nft-troptions-unity-token-genesis-founding",
    brandId: "troptions-unity-token",
    name: "Troptions Unity Token Genesis Founding Credential NFT",
    description:
      "Genesis-epoch founding credential for original TUT holders. Non-transferable, non-burnable — permanent founding record.",
    purpose:
      "Permanent on-chain proof of founding participation in the Troptions Unity Token genesis issuance.",
    xls_standard: "XLS-20",
    transfer_fee_basis_pts: 0,
    transferable: false,
    burnable: false,
    only_xrp: false,
    max_supply: 1000,
    issuer_wallet_role: "unity-token-mpt-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    uri_prefix: "ipfs://",
    metadata_standard: "XRPL-NFT-v1",
    status: "pending_legal_clearance",
    requiresLegalClearance: true,
    complianceNotes:
      "Genesis founding credential NFT tied to TUT distribution — securities counsel review is MANDATORY before any mint. Non-transferable, capped at 1,000 = founding participant class. Must not confer equity, profit-sharing, or voting rights without Howey test analysis.",
    activationSteps: [
      "1. Securities counsel Howey test analysis for genesis founding credential structure",
      "2. Board authorization for founding participant class definition",
      "3. Generate fresh MPT issuer wallet (same issuer as TUT MPT)",
      "4. Define metadata: participant name, wallet, date, allocation amount",
      "5. Test on XRPL testnet — verify non-transferable AND non-burnable flags",
      "6. Submit TUT MPTIssuanceCreate FIRST, then mint genesis founding credential NFTs to founding holders",
    ],
    priorState: "Never minted — genesis collection. Strictly limited to 1,000 tokens.",
    executionMode: "specification_only",
    simulationOnly: true,
  },
];

/** Returns collection spec by brand ID */
export function getNftCollectionByBrand(brandId: string): XrplNftCollectionSpec | undefined {
  return XRPL_NFT_GENESIS_REGISTRY.find((c) => c.brandId === brandId);
}

/** Returns all collections that can be activated without legal clearance */
export function getNftCollectionsReadyToActivate(): XrplNftCollectionSpec[] {
  return XRPL_NFT_GENESIS_REGISTRY.filter(
    (c) => !c.requiresLegalClearance && c.status === "pending_wallet_generation",
  );
}

/** Returns collections that require legal clearance before activation */
export function getNftCollectionsPendingLegal(): XrplNftCollectionSpec[] {
  return XRPL_NFT_GENESIS_REGISTRY.filter((c) => c.requiresLegalClearance);
}
