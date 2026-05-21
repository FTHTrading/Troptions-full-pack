import { JEFE_BLOCKED_ACTIONS, JEFE_REQUIRED_APPROVALS } from "@/content/troptions/jefePolicyRegistry";

const BLOCKED_INTENT_PATTERNS: Array<{ action: string; pattern: RegExp }> = [
  { action: "approve-users", pattern: /approve\s+users?/i },
  { action: "approve-kyc", pattern: /approve\s+kyc/i },
  { action: "approve-kyb", pattern: /approve\s+kyb/i },
  { action: "approve-pof", pattern: /approve\s+pof/i },
  { action: "approve-sblc", pattern: /approve\s+sblc/i },
  { action: "approve-rwa", pattern: /approve\s+rwa/i },
  { action: "approve-x402-production-payments", pattern: /approve\s+x402|enable\s+live\s+x402/i },
  { action: "approve-live-trading", pattern: /approve\s+live\s+trading|enable\s+live\s+trading/i },
  { action: "sign-transaction", pattern: /sign\s+transaction|sign\s+tx/i },
  { action: "move-funds", pattern: /move\s+funds|transfer\s+funds/i },
  { action: "send-funds", pattern: /send\s+funds?/i },
  { action: "submit-transactions", pattern: /submit\s+(xrpl|stellar|solana|tron|evm|transaction)/i },
  { action: "enable-live-xrpl-mainnet", pattern: /enable\s+live\s+xrpl|xrpl\s+mainnet\s+execution/i },
  { action: "expose-secrets", pattern: /show\s+secrets?|print\s+(env\s+)?token|env\s+vars?|print\s+env|secrets?/i },
  { action: "bypass-compliance", pattern: /bypass\s+compliance/i },
  { action: "bypass-sanctions", pattern: /bypass\s+sanctions?/i },
  { action: "bypass-board-approvals", pattern: /bypass\s+board\s+approvals?/i },
  { action: "deploy-production-directly", pattern: /deploy\s+production/i },
];

export function isJefeBlockedAction(action: string) {
  return JEFE_BLOCKED_ACTIONS.includes(action as (typeof JEFE_BLOCKED_ACTIONS)[number]);
}

export function guardJefeAction(action: string) {
  if (isJefeBlockedAction(action)) {
    return {
      allowed: false,
      blockedActions: JEFE_BLOCKED_ACTIONS,
      requiredApprovals: JEFE_REQUIRED_APPROVALS,
      reason: `Blocked by Jefe policy: ${action}`,
    };
  }

  return {
    allowed: true,
    blockedActions: JEFE_BLOCKED_ACTIONS,
    requiredApprovals: JEFE_REQUIRED_APPROVALS,
    reason: "Allowed in simulation-safe mode",
  };
}

export function detectJefeBlockedIntent(input: string): string | null {
  for (const rule of BLOCKED_INTENT_PATTERNS) {
    if (rule.pattern.test(input)) {
      return rule.action;
    }
  }

  return null;
}
