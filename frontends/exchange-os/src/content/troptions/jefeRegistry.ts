import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";
import { JEFE_DASHBOARD_REGISTRY } from "@/content/troptions/jefeDashboardRegistry";
import { JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";

export const JEFE_REGISTRY = {
  id: "jefe-fast-operator",
  label: "Jefe Fast Operator",
  role: "Dashboard command-layer dispatcher",
  mode: "simulation-safe",
  quickCommands: JEFE_COMMAND_REGISTRY,
  dashboard: JEFE_DASHBOARD_REGISTRY,
  blockedActions: JEFE_BLOCKED_ACTIONS,
} as const;
