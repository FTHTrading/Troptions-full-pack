import { LEGAL_REVIEW_QUEUE } from "@/content/troptions/legalReviewQueue";

export interface LegalWorkflowItem {
  itemId: string;
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: string;
  assignedCounsel: string | null;
  blockers: string[];
  linkedIds: string[];
}

export const LEGAL_WORKFLOW: LegalWorkflowItem[] = LEGAL_REVIEW_QUEUE.map((item) => {
  const blockers: string[] = [];
  if (!item.assignedCounsel) blockers.push("counsel-unassigned");
  if (!item.filingOrMemo) blockers.push("filing-or-memo-missing");

  return {
    itemId: item.itemId,
    subject: item.subject,
    priority: item.priority,
    status: item.status,
    assignedCounsel: item.assignedCounsel,
    blockers,
    linkedIds: item.linkedIds,
  };
});

export function getPendingLegalWorkflow(): LegalWorkflowItem[] {
  return LEGAL_WORKFLOW.filter((item) => item.status === "pending" || item.status === "in-review");
}
