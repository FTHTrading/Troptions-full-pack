import { canRolePerform, type PermissionAction } from "@/content/troptions/permissionRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";

export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
}

export function authorizeAction(role: TroptionsRole, action: PermissionAction): AuthorizationResult {
  if (!canRolePerform(role, action)) {
    return {
      authorized: false,
      reason: `Role ${role} is not permitted to perform ${action}.`,
    };
  }

  return { authorized: true };
}

export function assertAuthorized(role: TroptionsRole, action: PermissionAction): void {
  const result = authorizeAction(role, action);
  if (!result.authorized) {
    throw new Error(`[AuthorizationGuard] ${result.reason}`);
  }
}

export function assertHardGateBypassForbidden(
  role: TroptionsRole,
  gate: "legal" | "custody" | "sanctions" | "prohibited-jurisdiction",
): void {
  if (role === "super-admin") {
    throw new Error(`[HardGateGuard] super-admin cannot bypass ${gate} gate.`);
  }

  if (role === "ai-concierge") {
    throw new Error(`[HardGateGuard] ai-concierge cannot bypass ${gate} gate.`);
  }
}
