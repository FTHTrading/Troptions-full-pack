/**
 * TROPTIONS Infrastructure — Health Checks
 */

import type { TroptionsInfrastructureHealthCheck } from "./types";

export type HealthStatus = "healthy" | "degraded" | "error" | "unknown";

export function getOverallHealth(
  checks: TroptionsInfrastructureHealthCheck[]
): HealthStatus {
  if (checks.some((c) => c.status === "error")) return "error";
  if (checks.some((c) => c.status === "degraded")) return "degraded";
  if (checks.every((c) => c.status === "healthy")) return "healthy";
  return "unknown";
}

export function getHealthStatusColor(status: HealthStatus): string {
  const map: Record<HealthStatus, string> = {
    healthy: "text-green-300 bg-green-900/60 border-green-700/50",
    degraded: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    error: "text-red-300 bg-red-900/60 border-red-700/50",
    unknown: "text-slate-400 bg-slate-800/60 border-slate-600/50",
  };
  return map[status];
}
