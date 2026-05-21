import type { NamespaceRecord, StablecoinAction, TroptionsGeniusProfile } from "@/lib/troptions/genius/types";
import { evaluateStablecoinAction } from "@/lib/troptions/genius/gates";

export function canNamespaceReceiveSimulation(
  namespace: NamespaceRecord,
  profile: TroptionsGeniusProfile,
  gates: Parameters<typeof evaluateStablecoinAction>[1],
): boolean {
  if (namespace.kycStatus !== "mock_approved") return false;
  if (["merchant", "institution", "cuso", "credit_union", "ppsi", "reserve_custodian"].includes(namespace.namespaceType) && namespace.kybStatus !== "mock_approved") {
    return false;
  }

  return evaluateStablecoinAction(profile, gates, "simulate_mint", namespace).allowed;
}

export function getNamespaceAllowedActions(
  namespace: NamespaceRecord,
  profile: TroptionsGeniusProfile,
  gates: Parameters<typeof evaluateStablecoinAction>[1],
  actions: StablecoinAction[],
): { allowedActions: StablecoinAction[]; blockedActions: StablecoinAction[] } {
  const allowedActions: StablecoinAction[] = [];
  const blockedActions: StablecoinAction[] = [];

  for (const action of actions) {
    const decision = evaluateStablecoinAction(profile, gates, action, namespace);
    if (decision.allowed) {
      allowedActions.push(action);
    } else {
      blockedActions.push(action);
    }
  }

  return { allowedActions, blockedActions };
}