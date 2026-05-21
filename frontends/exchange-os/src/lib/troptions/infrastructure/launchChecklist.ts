/**
 * TROPTIONS Infrastructure — Launch Checklist
 */

import type { TroptionsLaunchChecklist, TroptionsLaunchChecklistItem } from "./types";
import { randomUUID } from "crypto";

const DEFAULT_CHECKLIST_ITEMS: Omit<TroptionsLaunchChecklistItem, "status" | "notes">[] = [
  { key: "main_pages_ready", label: "Main Pages Ready", requiredForLaunch: true },
  { key: "modules_configured", label: "Modules Configured", requiredForLaunch: true },
  { key: "adapters_reviewed", label: "Adapters Reviewed", requiredForLaunch: true },
  { key: "compliance_notices", label: "Compliance Notices Present", requiredForLaunch: true },
  { key: "pricing_contract", label: "Pricing & Contract Reviewed", requiredForLaunch: true },
  { key: "payment_readiness", label: "Payment Readiness Reviewed", requiredForLaunch: true },
  { key: "deployment_target", label: "Deployment Target Reviewed", requiredForLaunch: true },
  { key: "domain_reviewed", label: "Domain Reviewed", requiredForLaunch: true },
  { key: "admin_access", label: "Admin Access Reviewed", requiredForLaunch: true },
  { key: "launch_approval", label: "Launch Approval Recorded", requiredForLaunch: true },
];

export function generateLaunchChecklist(namespaceId: string): TroptionsLaunchChecklist {
  const now = new Date().toISOString();
  const items: TroptionsLaunchChecklistItem[] = DEFAULT_CHECKLIST_ITEMS.map((item) => ({
    ...item,
    status: "pending",
    notes: "",
  }));
  return {
    id: `lc-${randomUUID()}`,
    namespaceId,
    items,
    overallStatus: "not_started",
    approvedBy: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function getLaunchBlockers(checklist: TroptionsLaunchChecklist): string[] {
  return checklist.items
    .filter((i) => i.requiredForLaunch && i.status !== "complete" && i.status !== "not_applicable")
    .map((i) => `${i.label}: ${i.status}`);
}

export function isChecklistComplete(checklist: TroptionsLaunchChecklist): boolean {
  return getLaunchBlockers(checklist).length === 0;
}
