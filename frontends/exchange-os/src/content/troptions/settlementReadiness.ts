import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";

export interface SettlementReadinessItem {
  subjectId: string;
  assetId: string;
  assetName: string;
  custodyApproved: boolean;
  proofApproved: boolean;
  legalApproved: boolean;
  settlementScore: number;
  status: "ready" | "blocked";
  blockers: string[];
}

function toScore(approved: boolean): number {
  return approved ? 100 : 40;
}

export const SETTLEMENT_READINESS: SettlementReadinessItem[] = ASSET_REGISTRY.map((asset) => {
  const custodyApproved = asset.custodyStatus === "approved";
  const proofApproved = asset.proofStatus === "approved";
  const legalApproved = asset.legalStatus === "approved";
  const settlementScore = Math.round((toScore(custodyApproved) + toScore(proofApproved) + toScore(legalApproved)) / 3);
  const blockers: string[] = [];

  if (!custodyApproved) blockers.push("custody-not-approved");
  if (!proofApproved) blockers.push("proof-not-approved");
  if (!legalApproved) blockers.push("legal-not-approved");
  if (settlementScore < 80) blockers.push("settlement-score-below-threshold");

  return {
    subjectId: asset.assetId,
    assetId: asset.assetId,
    assetName: asset.assetName,
    custodyApproved,
    proofApproved,
    legalApproved,
    settlementScore,
    status: blockers.length === 0 ? "ready" : "blocked",
    blockers,
  };
});

export function getBlockedSettlementItems(): SettlementReadinessItem[] {
  return SETTLEMENT_READINESS.filter((item) => item.status === "blocked");
}
