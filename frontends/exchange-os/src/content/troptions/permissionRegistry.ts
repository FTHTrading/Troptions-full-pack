import type { TroptionsRole } from "@/content/troptions/roleRegistry";

export type PermissionAction =
  | "read-status"
  | "read-audit-log"
  | "read-proof-packages"
  | "request-approval"
  | "approve-legal"
  | "approve-custody"
  | "approve-compliance"
  | "approve-proof"
  | "approve-board"
  | "approve-funding"
  | "approve-issuance"
  | "approve-settlement"
  | "approve-disclosure"
  | "approve-emergency-override"
  | "reject-approval"
  | "transition-workflow"
  | "resolve-exception"
  | "acknowledge-alert"
  | "prepare-treasury-action"
  | "prepare-settlement"
  | "append-audit-log"
  | "view-permissions";

export type RolePermissionMap = Record<TroptionsRole, PermissionAction[]>;

export const ROLE_PERMISSIONS: RolePermissionMap = {
  "super-admin": [
    "read-status",
    "read-audit-log",
    "read-proof-packages",
    "request-approval",
    "transition-workflow",
    "resolve-exception",
    "acknowledge-alert",
    "append-audit-log",
    "view-permissions",
  ],
  "compliance-officer": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "approve-compliance",
    "reject-approval",
    "transition-workflow",
    "resolve-exception",
    "acknowledge-alert",
    "append-audit-log",
    "view-permissions",
  ],
  "legal-reviewer": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "approve-legal",
    "reject-approval",
    "transition-workflow",
    "append-audit-log",
    "view-permissions",
  ],
  "custody-officer": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "approve-custody",
    "reject-approval",
    "transition-workflow",
    "append-audit-log",
    "view-permissions",
  ],
  "board-member": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "approve-board",
    "reject-approval",
    "transition-workflow",
    "append-audit-log",
    "view-permissions",
  ],
  "proof-reviewer": [
    "read-status",
    "read-audit-log",
    "read-proof-packages",
    "request-approval",
    "approve-proof",
    "reject-approval",
    "transition-workflow",
    "append-audit-log",
  ],
  "treasury-operator": [
    "read-status",
    "read-audit-log",
    "prepare-treasury-action",
    "request-approval",
    "append-audit-log",
  ],
  "settlement-operator": [
    "read-status",
    "read-audit-log",
    "prepare-settlement",
    "request-approval",
    "append-audit-log",
  ],
  "issuer-admin": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "transition-workflow",
    "append-audit-log",
  ],
  "investor-support": [
    "read-status",
    "read-audit-log",
    "request-approval",
    "acknowledge-alert",
  ],
  auditor: ["read-status", "read-audit-log", "read-proof-packages"],
  viewer: ["read-status"],
  "ai-concierge": ["read-status"],
};

export function canRolePerform(role: TroptionsRole, action: PermissionAction): boolean {
  return ROLE_PERMISSIONS[role].includes(action);
}
