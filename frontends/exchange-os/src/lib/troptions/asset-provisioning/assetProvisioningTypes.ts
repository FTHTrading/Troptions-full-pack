/**
 * src/lib/troptions/asset-provisioning/assetProvisioningTypes.ts
 *
 * Type definitions for the Troptions XRPL/Stellar asset provisioning subsystem.
 * Used by the policy engine and (future) Control Hub bridge.
 */

export type ProvisioningChain = "xrpl" | "stellar";

export type ProvisioningOpKind =
  // XRPL
  | "AccountSet"
  | "TrustSet"
  | "Payment"
  | "NFTokenMint"
  | "MPTokenIssuanceCreate"
  | "OfferCreate"
  // Stellar
  | "SetOptions"
  | "ChangeTrust"
  | "SetTrustLineFlags"
  | "ManageSellOffer"
  | "ManageBuyOffer";

export interface ProvisioningOpDescriptor {
  readonly id: string;
  readonly chain: ProvisioningChain;
  readonly kind: ProvisioningOpKind;
  readonly account: string;
  readonly summary: string;
  readonly params: Readonly<Record<string, unknown>>;
  readonly requires?: readonly string[];
}

export type ProvisioningDecisionOutcome =
  | "blocked"
  | "allowed-dry-run"
  | "allowed-plan-only"
  | "allowed-metadata-only"
  | "allowed-with-approval";

export interface ProvisioningApprovalContext {
  readonly controlHubApprovalId?: string;
  readonly legalReviewId?: string;
  readonly custodyReviewId?: string;
  readonly complianceReviewId?: string;
  readonly network?: "testnet" | "mainnet";
  readonly executeFlag?: boolean;
  readonly executeEnvAck?: string;
}

export interface ProvisioningDecision {
  readonly outcome: ProvisioningDecisionOutcome;
  readonly reasons: readonly string[];
  readonly missingApprovals: readonly string[];
}
