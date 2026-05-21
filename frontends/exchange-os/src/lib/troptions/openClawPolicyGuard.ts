import {
  OPENCLAW_ALLOWED_ACTIONS,
  OPENCLAW_BLOCKED_ACTIONS,
  OPENCLAW_REQUIRED_APPROVALS,
} from "@/content/troptions/openClawPolicyRegistry";

export function isOpenClawBlockedAction(action: string) {
  return OPENCLAW_BLOCKED_ACTIONS.includes(action as (typeof OPENCLAW_BLOCKED_ACTIONS)[number]);
}

export function guardOpenClawAction(action: string) {
  if (isOpenClawBlockedAction(action)) {
    return {
      allowed: false,
      approvalRequired: true,
      blockedActions: OPENCLAW_BLOCKED_ACTIONS,
      requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
      reason: `Blocked by policy: ${action}`,
    };
  }

  const isAllowed = OPENCLAW_ALLOWED_ACTIONS.includes(action as (typeof OPENCLAW_ALLOWED_ACTIONS)[number]);
  return {
    allowed: isAllowed,
    approvalRequired: !isAllowed,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    reason: isAllowed ? "Allowed in simulation mode" : `Unknown action requires operator review: ${action}`,
  };
}
