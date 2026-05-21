/**
 * TROPTIONS Infrastructure — Adapter Registry
 *
 * Critical rule: execution-capable adapters require production_ready status,
 * configured credentials, and are never auto-executed in simulation.
 */

import type { TroptionsProviderAdapter, AdapterStatus } from "./types";

export function canAdapterExecutePayouts(adapter: TroptionsProviderAdapter): boolean {
  return (
    adapter.supportsExecution === true &&
    adapter.isConfigured === true &&
    adapter.status === "production_ready" &&
    !adapter.sandboxMode
  );
}

export function getAdapterReadinessScore(adapter: TroptionsProviderAdapter): number {
  let score = 0;
  if (adapter.adapterName) score += 10;
  if (adapter.category) score += 10;
  if (adapter.isConfigured) score += 30;
  if (adapter.status === "approved" || adapter.status === "production_ready") score += 30;
  if (!adapter.sandboxMode) score += 20;
  return Math.min(score, 100);
}

export function getMissingCredentials(adapter: TroptionsProviderAdapter): string[] {
  return adapter.credentialsRequired.filter(
    (cred) => !adapter.credentialsPresent.includes(cred)
  );
}

export function getAdapterStatusColor(status: AdapterStatus): string {
  const map: Record<AdapterStatus, string> = {
    not_configured: "text-slate-400 bg-slate-800/60 border-slate-600/50",
    credentials_required: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    sandbox: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    pending_review: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    approved: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
    production_ready: "text-green-300 bg-green-900/60 border-green-700/50",
    disabled: "text-gray-500 bg-gray-900/40 border-gray-700/30",
    error: "text-red-300 bg-red-900/60 border-red-700/50",
  };
  return map[status];
}
