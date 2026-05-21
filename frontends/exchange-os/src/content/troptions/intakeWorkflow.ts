import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";

export type IntakeStageStatus = "not-started" | "in-progress" | "ready" | "blocked";

export interface AssetIntakeItem {
  assetId: string;
  assetName: string;
  owner: string;
  jurisdiction: string;
  status: IntakeStageStatus;
  requiredInputs: string[];
  exitCriteria: string[];
  blockers: string[];
  nextAction: string;
}

export const ASSET_INTAKE_WORKFLOW: AssetIntakeItem[] = ASSET_REGISTRY.map((asset) => {
  const blockers: string[] = [];

  if (!asset.jurisdiction || asset.jurisdiction.toLowerCase().includes("subject to review")) {
    blockers.push("jurisdiction-review-pending");
  }
  if (asset.documentsRequired.length === 0) {
    blockers.push("documents-required-not-defined");
  }
  if (asset.legalStatus !== "approved") {
    blockers.push("legal-intake-not-cleared");
  }

  return {
    assetId: asset.assetId,
    assetName: asset.assetName,
    owner: asset.owner,
    jurisdiction: asset.jurisdiction,
    status: blockers.length > 0 ? "blocked" : "ready",
    requiredInputs: ["asset-profile", "issuer-entity", "jurisdiction-scope", "document-checklist"],
    exitCriteria: ["asset-profile-validated", "document-checklist-complete"],
    blockers,
    nextAction: asset.nextAction,
  };
});

export function getAssetsInIntake(): AssetIntakeItem[] {
  return ASSET_INTAKE_WORKFLOW.filter((item) => item.status === "in-progress" || item.status === "blocked");
}
