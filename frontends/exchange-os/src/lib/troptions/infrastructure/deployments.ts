/**
 * TROPTIONS Infrastructure — Deployments
 */

import type { DeploymentStatus, TroptionsDeploymentRecord } from "./types";

export const DEPLOYMENT_CAPABLE_STATUSES: DeploymentStatus[] = [
  "build_passed",
  "deploy_pending",
  "deployed",
  "live",
];

export function isDeploymentReady(record: TroptionsDeploymentRecord): boolean {
  return (
    record.status !== "credentials_required" &&
    record.status !== "failed" &&
    record.status !== "not_started"
  );
}

export function getDeploymentStatusColor(status: DeploymentStatus): string {
  const map: Record<DeploymentStatus, string> = {
    not_started: "text-slate-400 bg-slate-800/60 border-slate-600/50",
    planned: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    credentials_required: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    build_pending: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    build_passed: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
    deploy_pending: "text-purple-300 bg-purple-900/60 border-purple-700/50",
    deployed: "text-teal-300 bg-teal-900/60 border-teal-700/50",
    failed: "text-red-300 bg-red-900/60 border-red-700/50",
    domain_pending: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    live: "text-green-300 bg-green-900/60 border-green-700/50",
  };
  return map[status];
}

export function evaluateDeploymentReadiness(record: TroptionsDeploymentRecord): {
  ready: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];
  if (record.status === "credentials_required") {
    blockers.push("Deployment credentials not configured.");
  }
  if (record.status === "failed" && record.errorMessage) {
    blockers.push(`Last deployment failed: ${record.errorMessage}`);
  }
  if (!record.deploymentUrl && record.status === "live") {
    blockers.push("Deployment URL missing despite live status.");
  }
  return { ready: blockers.length === 0, blockers };
}
