import { PROOF_REGISTRY, getProofWorkflowStatus } from "@/content/troptions/proofRegistry";

export interface ProofWorkflowItem {
  proofId: string;
  label: string;
  currentStage: string;
  nextStage: string;
  status: "ready" | "blocked";
  missingEvidence: string[];
}

export const PROOF_WORKFLOW: ProofWorkflowItem[] = PROOF_REGISTRY.map((proof) => {
  const workflow = getProofWorkflowStatus(proof);
  return {
    proofId: proof.proofId,
    label: proof.label,
    currentStage: workflow.currentStage,
    nextStage: workflow.nextStage,
    status: workflow.blockers.length > 0 ? "blocked" : "ready",
    missingEvidence: workflow.blockers,
  };
});

export function getIncompleteProofPackages(): ProofWorkflowItem[] {
  return PROOF_WORKFLOW.filter((item) => item.status === "blocked");
}

export function getProofPackageStatus(proofId: string): ProofWorkflowItem | undefined {
  return PROOF_WORKFLOW.find((item) => item.proofId === proofId);
}
