import { JEFE_BLOCKED_ACTIONS, JEFE_REQUIRED_APPROVALS } from "@/content/troptions/jefePolicyRegistry";

export function getJefeNextSteps() {
  return [
    "Review blocked actions and approval requirements",
    "Run specialist readiness checks in simulation mode",
    "Draft remediation checklist for operator review",
    "Request human approvals before any sensitive workflow",
  ];
}

export function buildJefePostEnvelope<T extends Record<string, unknown>>(
  auditHint: string,
  data: T,
) {
  return {
    ok: true,
    simulationOnly: true,
    ...data,
    blockedActions: JEFE_BLOCKED_ACTIONS,
    requiredApprovals: JEFE_REQUIRED_APPROVALS,
    nextSteps: getJefeNextSteps(),
    auditHint,
  };
}
