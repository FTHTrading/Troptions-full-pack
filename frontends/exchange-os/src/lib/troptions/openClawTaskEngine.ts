import { OPENCLAW_TASK_REGISTRY } from "@/content/troptions/openClawTaskRegistry";
import { routeOpenClawAgent } from "@/lib/troptions/openClawAgentRouter";

export function listOpenClawTaskTemplates() {
  return OPENCLAW_TASK_REGISTRY;
}

export function createOpenClawTask(input: { label: string; command?: string }) {
  const routedAgent = routeOpenClawAgent(input.command ?? input.label);
  return {
    taskId: `oc-task-${Date.now()}`,
    label: input.label,
    mode: "simulation" as const,
    routedAgent: routedAgent.id,
    status: "queued" as const,
    blockedActions: ["approve", "sign", "transfer-funds"],
    requiredApprovals: ["Operator review", "Audit trail"],
    nextSteps: ["Review simulation output", "Route to human operator if sensitive"],
    auditHint: "OpenClaw task created in simulation mode.",
  };
}

export function simulateOpenClawTask(input: { label: string; command?: string }) {
  const task = createOpenClawTask(input);
  return {
    ...task,
    status: "simulated" as const,
    summary: `Dry-run complete for ${input.label}`,
  };
}
