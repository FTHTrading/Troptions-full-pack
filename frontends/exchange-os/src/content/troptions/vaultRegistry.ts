/**
 * Troptions Vault Registry
 * Reserve, collateral, and redemption vaults with multi-sig access controls.
 */

export type VaultType = "reserve" | "collateral" | "redemption" | "custody";
export type VaultStatus = "evaluation" | "agreement-pending" | "agreement-active" | "operational" | "suspended";

export interface VaultEntry {
  vaultId: string;
  name: string;
  type: VaultType;
  custodian: string;
  linkedAssets: string[];
  insuranceCoverage: string | null;
  multiSigConfig: string;
  withdrawalPolicy: string;
  status: VaultStatus;
  nextAction: string;
}

export const VAULT_REGISTRY: VaultEntry[] = [
  {
    vaultId: "VAULT-GOLD-001",
    name: "Gold Reserve Vault",
    type: "reserve",
    custodian: "TBD — Brink's or Loomis preferred",
    linkedAssets: ["ASSET-TGOLD-001"],
    insuranceCoverage: null,
    multiSigConfig: "3-of-5 key holders required for withdrawal",
    withdrawalPolicy: "Board resolution required for withdrawals exceeding 5% of vault value.",
    status: "evaluation",
    nextAction: "Select vault custodian. Execute custody agreement. Obtain insurance certificate.",
  },
  {
    vaultId: "VAULT-STABLE-001",
    name: "Stablecoin Settlement Reserve",
    type: "reserve",
    custodian: "Circle — USDC on-chain reserve",
    linkedAssets: ["SU-USDC-001", "SU-EURC-001"],
    insuranceCoverage: "Circle reserve backed per their disclosure",
    multiSigConfig: "2-of-3 for operational draws",
    withdrawalPolicy: "Automated via Circle API for settlement operations. Board approval for manual withdrawals above threshold.",
    status: "evaluation",
    nextAction: "Open Circle Business Account. Configure reserve wallet.",
  },
  {
    vaultId: "VAULT-TROP-COLLAT-001",
    name: "Troptions Collateral Vault",
    type: "collateral",
    custodian: "TBD — Fireblocks preferred",
    linkedAssets: ["ASSET-TPAY-001", "ASSET-XTROP-001"],
    insuranceCoverage: null,
    multiSigConfig: "3-of-5 board-approved key holders",
    withdrawalPolicy: "Collateral releases require legal counsel confirmation and board approval.",
    status: "evaluation",
    nextAction: "Execute Fireblocks custody agreement. Configure multi-sig.",
  },
  {
    vaultId: "VAULT-REDEMPT-001",
    name: "Redemption Reserve Vault",
    type: "redemption",
    custodian: "TBD — Anchorage Digital preferred for institutional",
    linkedAssets: ["ASSET-TGOLD-001", "ASSET-TUNITY-001"],
    insuranceCoverage: null,
    multiSigConfig: "2-of-3 for redemption processing, 4-of-5 for vault transfers",
    withdrawalPolicy: "Redemption requests processed per disclosed redemption policy. Policy not yet published.",
    status: "evaluation",
    nextAction: "Define and publish redemption policy. Execute custody agreement.",
  },
];

export function assertVaultOperational(vault: VaultEntry): void {
  if (vault.status !== "operational") {
    throw new Error(
      `[VaultGuard] Vault "${vault.name}" is not operational. Current status: "${vault.status}". Complete agreement and configuration before routing assets.`,
    );
  }
}
