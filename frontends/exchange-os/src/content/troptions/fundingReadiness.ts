import { FUNDING_ROUTE_REGISTRY } from "@/content/troptions/fundingRouteRegistry";

export interface FundingReadinessItem {
  subjectId: string;
  routeId: string;
  name: string;
  legalApproval: boolean;
  boardApproval: boolean;
  status: "ready" | "blocked";
  blockers: string[];
}

export const FUNDING_READINESS: FundingReadinessItem[] = FUNDING_ROUTE_REGISTRY.map((route) => {
  const blockers: string[] = [];
  const legalApproval = route.legalStatus === "approved";
  const boardApproval = route.boardApprovalStatus === "approved";

  if (!legalApproval) blockers.push("legal-approval-missing");
  if (!boardApproval) blockers.push("board-approval-missing");

  return {
    subjectId: route.routeId,
    routeId: route.routeId,
    name: route.name,
    legalApproval,
    boardApproval,
    status: blockers.length > 0 ? "blocked" : "ready",
    blockers,
  };
});

export function isFundingRouteReady(routeId: string): boolean {
  return FUNDING_READINESS.some((route) => route.routeId === routeId && route.status === "ready");
}

export function getBlockedFundingRoutes(): FundingReadinessItem[] {
  return FUNDING_READINESS.filter((route) => route.status === "blocked");
}
