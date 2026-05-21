import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { CUSTODY_REGISTRY } from "@/content/troptions/custodyRegistry";

export interface CustodyWorkflowItem {
  assetId: string;
  assetName: string;
  custodyStatus: string;
  providerStatus: string;
  custodianApproval: boolean;
  blockers: string[];
}

function hasActiveCustodian(): boolean {
  return CUSTODY_REGISTRY.some((provider) => provider.status === "active" && provider.agreementStatus === "active");
}

export const CUSTODY_WORKFLOW: CustodyWorkflowItem[] = ASSET_REGISTRY.map((asset) => {
  const blockers: string[] = [];
  const activeCustodian = hasActiveCustodian();

  if (asset.custodyStatus !== "approved") blockers.push("asset-custody-status-not-approved");
  if (!activeCustodian) blockers.push("no-active-custodian-agreement");
  if (asset.boardApprovalStatus !== "approved") blockers.push("board-custody-approval-pending");

  return {
    assetId: asset.assetId,
    assetName: asset.assetName,
    custodyStatus: asset.custodyStatus,
    providerStatus: activeCustodian ? "active" : "evaluation",
    custodianApproval: blockers.length === 0,
    blockers,
  };
});

export function getPendingCustodyReviews(): CustodyWorkflowItem[] {
  return CUSTODY_WORKFLOW.filter((item) => !item.custodianApproval);
}

export function getCustodyWorkflowByAsset(assetId: string): CustodyWorkflowItem | undefined {
  return CUSTODY_WORKFLOW.find((item) => item.assetId === assetId);
}
