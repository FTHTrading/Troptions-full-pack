import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { FUNDING_ROUTE_REGISTRY } from "@/content/troptions/fundingRouteRegistry";

export interface BoardApprovalItem {
  subjectId: string;
  subjectType: "asset" | "funding-route";
  name: string;
  boardApprovalStatus: string;
  status: "approved" | "pending" | "blocked";
  blockers: string[];
}

const assetItems: BoardApprovalItem[] = ASSET_REGISTRY.map((asset) => ({
  subjectId: asset.assetId,
  subjectType: "asset",
  name: asset.assetName,
  boardApprovalStatus: asset.boardApprovalStatus,
  status: asset.boardApprovalStatus === "approved" ? "approved" : "pending",
  blockers: asset.boardApprovalStatus === "approved" ? [] : ["board-approval-missing"],
}));

const routeItems: BoardApprovalItem[] = FUNDING_ROUTE_REGISTRY.map((route) => ({
  subjectId: route.routeId,
  subjectType: "funding-route",
  name: route.name,
  boardApprovalStatus: route.boardApprovalStatus,
  status: route.boardApprovalStatus === "approved" ? "approved" : "pending",
  blockers: route.boardApprovalStatus === "approved" ? [] : ["board-approval-missing"],
}));

export const BOARD_APPROVAL_WORKFLOW: BoardApprovalItem[] = [...assetItems, ...routeItems];

export function getPendingBoardApprovals(): BoardApprovalItem[] {
  return BOARD_APPROVAL_WORKFLOW.filter((item) => item.status !== "approved");
}

export function isBoardApproved(subjectId: string): boolean {
  return BOARD_APPROVAL_WORKFLOW.some(
    (item) => item.subjectId === subjectId && item.boardApprovalStatus === "approved",
  );
}
