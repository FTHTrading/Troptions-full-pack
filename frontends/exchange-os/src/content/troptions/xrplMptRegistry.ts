/**
 * XRPL MPT (Multi-Purpose Token) Registry
 *
 * Defines XLS-33 Multi-Purpose Token specifications for the TROPTIONS ecosystem.
 *
 * COMPLIANCE NOTICE:
 * MPT issuance requires XLS-33 support to be enabled on XRPL mainnet (Amendment vote).
 * Token issuance may constitute a securities offering in many jurisdictions.
 * No MPTIssuanceCreate transaction may be submitted without:
 *   - Securities counsel opinion
 *   - Board authorization
 *   - Legal entity KYB verified
 *   - Fresh isolated issuer wallet generated
 *   - XLS-33 Amendment active on mainnet
 *
 * All entries here are informational specifications only.
 * executionMode: "specification_only" — nothing is live.
 */

export interface XrplMptDefinition {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly brandId: string;
  readonly xls_standard: "XLS-33";
  /**
   * Maximum supply in base units (integer string to avoid JS precision loss).
   * 1 TUT = 1_000_000 base units (asset_scale = 6)
   */
  readonly max_amount: string;
  /** Decimal places (XRPL MPT asset_scale field) */
  readonly asset_scale: number;
  /** Transfer fee in basis points (0 = no fee) */
  readonly transfer_fee_basis_pts: number;
  readonly flags: readonly MptFlag[];
  readonly issuer_wallet_role: string;
  readonly issuer_address: string;
  readonly status: MptStatus;
  readonly complianceGates: readonly string[];
  readonly activationSteps: readonly string[];
  readonly executionMode: "specification_only";
  readonly simulationOnly: boolean;
}

export type MptFlag =
  | "lsfMPTCanTransfer"  // Holders can transfer to one another
  | "lsfMPTCanTrade"     // Can be offered/traded on XRPL DEX
  | "lsfMPTRequireAuth"  // Issuer must authorize each holder (KYC gate)
  | "lsfMPTCanEscrow"    // Allowed in escrow transactions
  | "lsfMPTCanLock";     // Issuer can lock/freeze holder balances

export type MptStatus =
  | "specification_only"
  | "pending_amendment_activation"
  | "pending_legal_clearance"
  | "pending_fresh_wallet"
  | "testnet_only"
  | "live";

export const XRPL_MPT_REGISTRY: readonly XrplMptDefinition[] = [
  {
    id: "mpt-troptions-unity-token",
    symbol: "TUT",
    name: "Troptions Unity Token",
    brandId: "troptions-unity-token",
    xls_standard: "XLS-33",
    max_amount: "1000000000000000", // 1,000,000,000 TUT × 10^6 base units
    asset_scale: 6,
    transfer_fee_basis_pts: 0,
    flags: ["lsfMPTCanTransfer", "lsfMPTCanTrade"],
    issuer_wallet_role: "unity-token-mpt-issuer",
    issuer_address: "PENDING_FRESH_GENERATION",
    status: "pending_legal_clearance",
    complianceGates: [
      "Securities counsel review of TUT structure (may be a security depending on offering method)",
      "Board authorization from FTH Trading / Bryan Stone",
      "Fresh isolated XRPL wallet generated for MPT issuance (NOT the compromised or existing wallets)",
      "XLS-33 Amendment must be active on XRPL mainnet (verify: xrpl.org/amendments)",
      "KYC/KYB verification plan for initial holders",
      "Token economics model confirmed (supply, distribution, lockup, vesting)",
      "Distribution plan: private placement vs public offering — determines licensing requirements",
    ],
    activationSteps: [
      "1. Verify XLS-33 Amendment is active on XRPL mainnet",
      "2. Generate fresh Xumm/hardware wallet for MPT issuer role",
      "3. Fund issuer wallet with minimum XRP reserve (check current MPTIssuanceCreate cost)",
      "4. Obtain securities counsel opinion — go/no-go for issuance structure",
      "5. Board authorization sign-off",
      "6. Submit MPTIssuanceCreate on XRPL testnet first",
      "7. Test holder authorization, transfer, and DEX listing on testnet",
      "8. Submit MPTIssuanceCreate on mainnet after successful testnet validation",
      "9. Distribute TUT per approved distribution plan",
    ],
    executionMode: "specification_only",
    simulationOnly: true,
  },
];

/** Returns MPT definition by symbol */
export function getMptBySymbol(symbol: string): XrplMptDefinition | undefined {
  return XRPL_MPT_REGISTRY.find((m) => m.symbol === symbol);
}

/** Returns MPT definitions that are ready for testnet (all gates cleared except mainnet) */
export function getMptsReadyForTestnet(): XrplMptDefinition[] {
  return XRPL_MPT_REGISTRY.filter((m) => m.status === "testnet_only");
}
