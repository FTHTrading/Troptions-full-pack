/**
 * TROPTIONS Infrastructure — Namespace Management
 */

import type { TroptionsNamespace, NamespaceStatus } from "./types";

export const VALID_NAMESPACE_TRANSITIONS: Record<NamespaceStatus, NamespaceStatus[]> = {
  draft: ["provisioning", "archived"],
  provisioning: ["configured", "draft"],
  configured: ["ready_for_review", "provisioning"],
  ready_for_review: ["approved_for_launch", "configured"],
  approved_for_launch: ["live", "ready_for_review"],
  live: ["suspended", "archived"],
  suspended: ["live", "archived"],
  archived: [],
};

export function isValidNamespaceTransition(
  from: NamespaceStatus,
  to: NamespaceStatus
): boolean {
  return VALID_NAMESPACE_TRANSITIONS[from].includes(to);
}

export function canGoLive(ns: TroptionsNamespace): { allowed: boolean; blockers: string[] } {
  const blockers: string[] = [];
  if (ns.complianceStatus !== "approved") {
    blockers.push("Compliance review not approved.");
  }
  if (!ns.billingPackage) {
    blockers.push("No billing package selected.");
  }
  if (ns.enabledModules.length === 0) {
    blockers.push("No modules enabled.");
  }
  if (ns.deploymentTargetIds.length === 0) {
    blockers.push("No deployment target configured.");
  }
  return { allowed: blockers.length === 0, blockers };
}

export function getNamespaceReadinessScore(ns: TroptionsNamespace): number {
  let score = 0;
  if (ns.slug) score += 10;
  if (ns.displayName) score += 10;
  if (ns.clientName) score += 10;
  if (ns.billingPackage) score += 15;
  if (ns.complianceStatus === "approved") score += 20;
  if (ns.enabledModules.length > 0) score += 15;
  if (ns.deploymentTargetIds.length > 0) score += 10;
  if (ns.adapterIds.length > 0) score += 10;
  return Math.min(score, 100);
}

export function getNamespaceStatusColor(status: NamespaceStatus): string {
  const map: Record<NamespaceStatus, string> = {
    draft: "text-slate-400 bg-slate-800/60 border-slate-600/50",
    provisioning: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    configured: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    ready_for_review: "text-purple-300 bg-purple-900/60 border-purple-700/50",
    approved_for_launch: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
    live: "text-green-300 bg-green-900/60 border-green-700/50",
    suspended: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    archived: "text-gray-500 bg-gray-900/40 border-gray-700/30",
  };
  return map[status];
}
