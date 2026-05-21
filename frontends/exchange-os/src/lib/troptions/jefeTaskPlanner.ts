export function createJefeTaskPlan(input: { objective: string; routedAgent?: string }) {
  return {
    taskId: `jefe-plan-${Date.now()}`,
    objective: input.objective,
    mode: "simulation",
    routedAgent: input.routedAgent ?? "jefe",
    plan: [
      "Collect current status and blockers",
      "Route dry-run checks to specialist agents",
      "Draft remediation checklist",
      "Request human approval for sensitive steps",
    ],
    requiredApprovals: ["Operator review"],
    blockedActions: ["approve", "sign", "trade", "settle", "transfer-funds"],
  };
}
