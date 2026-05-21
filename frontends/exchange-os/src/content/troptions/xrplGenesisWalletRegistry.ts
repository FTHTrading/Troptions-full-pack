/**
 * XRPL Genesis Wallet Registry
 *
 * Post-compromise wallet structure for the full TROPTIONS entity graph.
 *
 * SECURITY NOTICE:
 * The primary wallet rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 was COMPROMISED.
 * Master key disabled 2026-02-25. ~184M USDT, ~20M GOLD, ~50M EUR drained
 * 2026-03-05. NFTs burned 2026-02-21.
 *
 * This registry defines the intended wallet structure post-compromise.
 * Wallet roles marked "PENDING_FRESH_GENERATION" must be created using
 * a fresh hardware wallet or Xumm before any live operations can begin.
 *
 * SAFETY RULES:
 * - No private keys, seeds, or secrets in this file
 * - All entries are read-only references or pending-generation specs
 * - Live execution requires board authorization + legal sign-off
 */

export type XrplWalletStatus =
  | "active_read_only"
  | "active_trustlines_established"
  | "compromised_do_not_use"
  | "pending_fresh_generation"
  | "pending_model_review"
  | "suspended";

export interface XrplGenesisWalletRecord {
  readonly id: string;
  readonly role: string;
  readonly brandId: string | null;
  readonly address: string;
  readonly status: XrplWalletStatus;
  readonly notes: string;
  readonly requiresLegalClearance: boolean;
  readonly xrplStandard?: "XLS-20" | "XLS-33";
}

export const XRPL_GENESIS_WALLET_REGISTRY: readonly XrplGenesisWalletRecord[] = [
  // ── Active wallets (known good) ──────────────────────────────────────────────
  {
    id: "xrpl-troptions-org-issuer",
    role: "troptions-org-issuer",
    brandId: "troptions-org",
    address: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
    status: "active_read_only",
    notes:
      "TROPTIONS IOU issuer. Active for read/trust-line operations. Currency hex: 54524F5054494F4E530000000000000000000000.",
    requiresLegalClearance: false,
  },
  {
    id: "xrpl-optkas-genesis-treasury",
    role: "optkas-genesis-treasury",
    brandId: "troptions-org",
    address: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
    status: "active_trustlines_established",
    notes:
      "OPTKAS Genesis treasury wallet. Trustlines for OPTKAS and SOVBND established. This is the safe treasury wallet — not the compromised primary.",
    requiresLegalClearance: false,
  },

  // ── Compromised wallet — DO NOT USE ─────────────────────────────────────────
  {
    id: "xrpl-compromised-primary",
    role: "COMPROMISED_DO_NOT_USE",
    brandId: null,
    address: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    status: "compromised_do_not_use",
    notes:
      "COMPROMISED. Master key disabled 2026-02-25. Regular key swapped twice by attacker. ~184M USDT, ~20M GOLD, ~50M EUR drained 2026-03-05. NFTs burned 2026-02-21. Master key disabled — account is effectively frozen under attacker control. Do not send funds or establish trustlines with this address.",
    requiresLegalClearance: false,
  },

  // ── Pending fresh generation ─────────────────────────────────────────────────
  {
    id: "xrpl-troptions-xchange-wallet",
    role: "troptions-xchange-wallet",
    brandId: "troptions-xchange",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "Exchange coordination wallet for TROPTIONSXCHANGE.IO. Must be generated fresh via Xumm or hardware wallet. ATS/exchange licensing review required before live activation.",
    requiresLegalClearance: true,
  },
  {
    id: "xrpl-unity-token-mpt-issuer",
    role: "unity-token-mpt-issuer",
    brandId: "troptions-unity-token",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "XLS-33 MPT issuer for Troptions Unity Token (TUT). Isolated fresh wallet required. Securities counsel review + board authorization required before any MPTIssuanceCreate transaction.",
    requiresLegalClearance: true,
    xrplStandard: "XLS-33",
  },
  {
    id: "xrpl-university-nft-issuer",
    role: "university-nft-issuer",
    brandId: "troptions-university",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "XLS-20 NFT issuer for Troptions University credential certificates. Can be activated after wallet generation — no securities issue.",
    requiresLegalClearance: false,
    xrplStandard: "XLS-20",
  },
  {
    id: "xrpl-tv-network-nft-issuer",
    role: "tv-network-nft-issuer",
    brandId: "troptions-tv-network",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "XLS-20 NFT issuer for Troptions Television Network media access tokens. Requires FCC compliance review for broadcast content.",
    requiresLegalClearance: true,
    xrplStandard: "XLS-20",
  },
  {
    id: "xrpl-real-estate-rwa-issuer",
    role: "real-estate-rwa-issuer",
    brandId: "real-estate-connections",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "XRPL IOU / NFT issuer for TheRealEstateConnections.com RWA receipts. Real estate brokerage + securities review required before activation.",
    requiresLegalClearance: true,
  },
  {
    id: "xrpl-solar-rwa-issuer",
    role: "solar-rwa-issuer",
    brandId: "green-n-go-solar",
    address: "PENDING_FRESH_GENERATION",
    status: "pending_fresh_generation",
    notes:
      "XRPL issuer for Green-N-Go Solar energy RWA receipts and REC NFTs. Energy asset tokenization subject to CFTC/SEC/state utility review.",
    requiresLegalClearance: true,
    xrplStandard: "XLS-20",
  },
  {
    id: "xrpl-hotrcw-service-wallet",
    role: "hotrcw-service-wallet",
    brandId: "hotrcw",
    address: "PENDING_MODEL_REVIEW",
    status: "pending_model_review",
    notes:
      "HOTRCW service model requires confirmation with Bryan before wallet role is defined. MSB licensing review if payments are intermediated.",
    requiresLegalClearance: true,
  },
];

/** Get all active (non-compromised) wallets */
export function getActiveXrplWallets(): XrplGenesisWalletRecord[] {
  return XRPL_GENESIS_WALLET_REGISTRY.filter(
    (w) => w.status === "active_read_only" || w.status === "active_trustlines_established",
  );
}

/** Get all pending-generation wallets — these need to be created before going live */
export function getPendingXrplWallets(): XrplGenesisWalletRecord[] {
  return XRPL_GENESIS_WALLET_REGISTRY.filter(
    (w) => w.status === "pending_fresh_generation" || w.status === "pending_model_review",
  );
}

/** Get the compromised wallet record (for forensics reference only) */
export function getCompromisedXrplWallet(): XrplGenesisWalletRecord | undefined {
  return XRPL_GENESIS_WALLET_REGISTRY.find((w) => w.status === "compromised_do_not_use");
}
