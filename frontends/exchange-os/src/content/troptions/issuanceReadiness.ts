import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";

export interface IssuanceReadinessItem {
  subjectId: string;
  assetId: string;
  assetName: string;
  legalApproved: boolean;
  custodyApproved: boolean;
  proofApproved: boolean;
  status: "ready" | "blocked";
  blockers: string[];
}

export const ISSUANCE_READINESS: IssuanceReadinessItem[] = ASSET_REGISTRY.map((asset) => {
  const legalApproved = asset.legalStatus === "approved";
  const custodyApproved = asset.custodyStatus === "approved";
  const proofApproved = asset.proofStatus === "approved";
  const blockers: string[] = [];

  if (!legalApproved) blockers.push("legal-not-approved");
  if (!custodyApproved) blockers.push("custody-not-approved");
  if (!proofApproved) blockers.push("proof-not-approved");

  return {
    subjectId: asset.assetId,
    assetId: asset.assetId,
    assetName: asset.assetName,
    legalApproved,
    custodyApproved,
    proofApproved,
    status: blockers.length === 0 ? "ready" : "blocked",
    blockers,
  };
});

export function getBlockedIssuanceItems(): IssuanceReadinessItem[] {
  return ISSUANCE_READINESS.filter((item) => item.status === "blocked");
}
