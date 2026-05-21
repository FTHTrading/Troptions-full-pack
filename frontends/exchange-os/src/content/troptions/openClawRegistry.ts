import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { OPENCLAW_BLOCKED_ACTIONS } from "@/content/troptions/openClawPolicyRegistry";
import { OPENCLAW_TASK_REGISTRY } from "@/content/troptions/openClawTaskRegistry";
import { OPENCLAW_TOOL_REGISTRY } from "@/content/troptions/openClawToolRegistry";

export const OPENCLAW_REGISTRY = {
  id: "openclaw-command-center",
  label: "OpenClaw Agent Command Center",
  mode: "simulation-first",
  complianceModel: "approval-gated",
  auditModel: "audit-logged",
  humanReviewRequired: true,
  blockedActions: OPENCLAW_BLOCKED_ACTIONS,
  dashboardMetrics: {
    agentsDiscovered: OPENCLAW_AGENT_REGISTRY.length,
    agentsOnline: OPENCLAW_AGENT_REGISTRY.filter((agent) => agent.status === "online").length,
    toolsRegistered: OPENCLAW_TOOL_REGISTRY.length,
    pendingApprovalRequests: OPENCLAW_TASK_REGISTRY.filter((task) => task.approvalRequired).length,
  },
} as const;
