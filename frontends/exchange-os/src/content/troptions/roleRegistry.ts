export type TroptionsRole =
  | "super-admin"
  | "compliance-officer"
  | "legal-reviewer"
  | "custody-officer"
  | "board-member"
  | "proof-reviewer"
  | "treasury-operator"
  | "settlement-operator"
  | "issuer-admin"
  | "investor-support"
  | "auditor"
  | "viewer"
  | "ai-concierge";

export interface RoleDefinition {
  roleId: TroptionsRole;
  displayName: string;
  description: string;
  systemLevel: "system" | "governance" | "operational" | "read-only";
}

export const ROLE_REGISTRY: RoleDefinition[] = [
  {
    roleId: "super-admin",
    displayName: "Super Admin",
    description: "Global administrative operator without authority to bypass hard legal/custody/sanctions gates.",
    systemLevel: "system",
  },
  {
    roleId: "compliance-officer",
    displayName: "Compliance Officer",
    description: "Approves KYC/KYB, sanctions, and compliance controls.",
    systemLevel: "governance",
  },
  {
    roleId: "legal-reviewer",
    displayName: "Legal Reviewer",
    description: "Approves legal reviews and legal approval gates.",
    systemLevel: "governance",
  },
  {
    roleId: "custody-officer",
    displayName: "Custody Officer",
    description: "Approves custody controls and custody readiness.",
    systemLevel: "governance",
  },
  {
    roleId: "board-member",
    displayName: "Board Member",
    description: "Approves board packages and governance releases.",
    systemLevel: "governance",
  },
  {
    roleId: "proof-reviewer",
    displayName: "Proof Reviewer",
    description: "Approves proof package readiness and evidence checks.",
    systemLevel: "operational",
  },
  {
    roleId: "treasury-operator",
    displayName: "Treasury Operator",
    description: "Prepares treasury actions without legal/custody approval authority.",
    systemLevel: "operational",
  },
  {
    roleId: "settlement-operator",
    displayName: "Settlement Operator",
    description: "Prepares settlement operations only when readiness gates pass.",
    systemLevel: "operational",
  },
  {
    roleId: "issuer-admin",
    displayName: "Issuer Admin",
    description: "Prepares issuance workflow artifacts and requests approvals.",
    systemLevel: "operational",
  },
  {
    roleId: "investor-support",
    displayName: "Investor Support",
    description: "Handles investor readiness support workflows without approval authority.",
    systemLevel: "operational",
  },
  {
    roleId: "auditor",
    displayName: "Auditor",
    description: "Read-only access to audit logs and proof packages.",
    systemLevel: "read-only",
  },
  {
    roleId: "viewer",
    displayName: "Viewer",
    description: "Read-only access to dashboard and workflow status.",
    systemLevel: "read-only",
  },
  {
    roleId: "ai-concierge",
    displayName: "AI Concierge",
    description: "Read-only assistant role that can explain status and next steps.",
    systemLevel: "read-only",
  },
];

export function isKnownRole(role: string): role is TroptionsRole {
  return ROLE_REGISTRY.some((item) => item.roleId === role);
}
