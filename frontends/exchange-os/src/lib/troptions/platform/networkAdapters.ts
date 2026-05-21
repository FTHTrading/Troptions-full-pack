/**
 * TROPTIONS Platform — Network Adapter Types
 */

import type { NetworkType, NetworkEnvironment, AdapterReadinessStatus } from "./types";

export interface TroptionsNetworkAdapter {
  adapterId: string;
  networkName: string;
  networkType: NetworkType;
  supportedCapabilities: string[];
  requiredCredentials: string[];
  supportedEnvironments: NetworkEnvironment[];
  readinessStatus: AdapterReadinessStatus;
  isConfigured: boolean;
  complianceNotes: string[];
  auditNotes: string;
  executionEnabled: false; // always false until real credentials are configured
  notes: string;
}

export function createNetworkAdapterShell(
  params: Omit<TroptionsNetworkAdapter, "executionEnabled">
): TroptionsNetworkAdapter {
  return { ...params, executionEnabled: false };
}

export function evaluateAdapterReadiness(
  adapter: TroptionsNetworkAdapter
): { ready: boolean; blockers: string[] } {
  const blockers: string[] = [];
  if (!adapter.isConfigured) {
    blockers.push("Adapter not configured — credentials required.");
  }
  if (adapter.readinessStatus === "disabled") {
    blockers.push("Adapter is disabled.");
  }
  if (adapter.readinessStatus === "design_only") {
    blockers.push("Adapter is design-only — not yet implemented.");
  }
  if (adapter.readinessStatus === "credentials_required") {
    blockers.push(
      `Credentials required: ${adapter.requiredCredentials.join(", ")}`
    );
  }
  return { ready: blockers.length === 0, blockers };
}
