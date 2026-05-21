/**
 * TROPTIONS Infrastructure — Modules
 */

import type { ModuleStatus } from "./types";

export function getModuleStatusColor(status: ModuleStatus): string {
  const map: Record<ModuleStatus, string> = {
    not_enabled: "text-slate-500 bg-slate-900/40 border-slate-700/30",
    enabled: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    configured: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
    needs_credentials: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    needs_review: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    ready: "text-teal-300 bg-teal-900/60 border-teal-700/50",
    live: "text-green-300 bg-green-900/60 border-green-700/50",
    disabled: "text-gray-500 bg-gray-900/40 border-gray-700/30",
  };
  return map[status];
}

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  not_enabled: "Not Enabled",
  enabled: "Enabled",
  configured: "Configured",
  needs_credentials: "Credentials Required",
  needs_review: "Needs Review",
  ready: "Ready",
  live: "Live",
  disabled: "Disabled",
};

export function isModuleReadyForLaunch(status: ModuleStatus): boolean {
  return status === "ready" || status === "live";
}
