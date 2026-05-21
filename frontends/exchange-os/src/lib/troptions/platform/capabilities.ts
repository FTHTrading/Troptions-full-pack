/**
 * TROPTIONS Platform — Capability Registry
 */

import type { PlatformCapabilityRecord, CapabilityType, CapabilityStatus } from "./types";

export const PLATFORM_CAPABILITIES: PlatformCapabilityRecord[] = [
  {
    id: "cap-namespace-registry",
    capabilityType: "namespace_registry",
    displayName: "Namespace Registry",
    description: "Create and manage TROPTIONS client namespaces.",
    status: "production_ready",
    modules: ["infrastructure"],
    adapterCategories: [],
    limitations: [],
    nextSteps: [],
    softwareRoute: "/admin/infrastructure/namespaces",
    apiRoute: "/api/troptions/infrastructure/namespaces",
  },
  {
    id: "cap-audit-trail",
    capabilityType: "audit_trail",
    displayName: "Audit Trail",
    description: "Immutable audit events for all infrastructure and PayOps actions.",
    status: "production_ready",
    modules: ["infrastructure", "payops"],
    adapterCategories: [],
    limitations: [],
    nextSteps: [],
    softwareRoute: "/admin/infrastructure/audit",
    apiRoute: "/api/troptions/infrastructure/audit",
  },
  {
    id: "cap-payment-readiness",
    capabilityType: "payment_readiness",
    displayName: "Payment Readiness",
    description: "Manage payment readiness workflows and manual invoice tracking.",
    status: "manual_only",
    modules: ["payops"],
    adapterCategories: ["payment", "bank"],
    limitations: [
      "Live payment execution requires production-ready provider adapter.",
      "Manual-only until credentials configured.",
    ],
    nextSteps: ["Configure payment provider adapter credentials."],
    softwareRoute: "/troptions-cloud/[namespace]/payops",
    apiRoute: "/api/troptions/payops/payout-batches",
  },
  {
    id: "cap-payout-batching",
    capabilityType: "payout_batching",
    displayName: "Payout Batching",
    description: "Create and manage payout batches with approval gates.",
    status: "manual_only",
    modules: ["payops"],
    adapterCategories: ["payment", "payroll", "bank"],
    limitations: [
      "Execution requires production_ready adapter.",
      "approved_not_executed status is enforced until real adapter confirms.",
    ],
    nextSteps: ["Obtain and configure payroll/payment partner credentials."],
    softwareRoute: "/troptions-cloud/[namespace]/payops/batches",
    apiRoute: "/api/troptions/payops/payout-batches",
  },
  {
    id: "cap-receipt-generation",
    capabilityType: "receipt_generation",
    displayName: "Receipt Generation",
    description: "Generate receipt packets for approved payouts.",
    status: "mock_only",
    modules: ["payops"],
    adapterCategories: ["accounting"],
    limitations: ["Receipt PDFs require storage adapter."],
    nextSteps: ["Configure accounting adapter."],
    softwareRoute: "/troptions-cloud/[namespace]/payops/receipts",
    apiRoute: "/api/troptions/payops/receipts",
  },
  {
    id: "cap-compliance-check",
    capabilityType: "compliance_check",
    displayName: "Compliance Check",
    description: "KYC/AML compliance gate for payees and batches.",
    status: "mock_only",
    modules: ["payops", "infrastructure"],
    adapterCategories: ["compliance"],
    limitations: ["Real KYC/AML checks require external compliance adapter."],
    nextSteps: ["Configure compliance/KYC adapter with credentials."],
    softwareRoute: "/troptions-cloud/[namespace]/payops/compliance",
    apiRoute: "/api/troptions/payops/compliance",
  },
  {
    id: "cap-deployment-readiness",
    capabilityType: "deployment_readiness",
    displayName: "Deployment Readiness",
    description: "Track deployment readiness and generate deployment plans.",
    status: "mock_only",
    modules: ["infrastructure"],
    adapterCategories: ["deployment", "domain_dns"],
    limitations: ["Actual deployment requires deployment provider credentials."],
    nextSteps: ["Configure deployment provider adapter."],
    softwareRoute: "/admin/infrastructure/deployments",
    apiRoute: "/api/troptions/infrastructure/deployments",
  },
  {
    id: "cap-wallet-reference",
    capabilityType: "wallet_reference",
    displayName: "Wallet Reference",
    description: "Reference wallet addresses for payout and receipt tracking.",
    status: "credentials_required",
    modules: ["payops"],
    adapterCategories: ["wallet"],
    limitations: ["Live wallet interaction requires wallet provider credentials."],
    nextSteps: ["Configure wallet provider adapter."],
    softwareRoute: null,
    apiRoute: null,
  },
  {
    id: "cap-stablecoin-reference",
    capabilityType: "stablecoin_reference",
    displayName: "Stablecoin Reference",
    description: "Reference stablecoin rails for payout plans.",
    status: "credentials_required",
    modules: ["payops"],
    adapterCategories: ["stablecoin"],
    limitations: [
      "Live stablecoin execution requires provider credentials and compliance approval.",
    ],
    nextSteps: [
      "Obtain stablecoin provider agreement.",
      "Configure stablecoin adapter with credentials.",
    ],
    softwareRoute: null,
    apiRoute: null,
  },
  {
    id: "cap-bridge-readiness",
    capabilityType: "bridge_readiness",
    displayName: "Bridge Readiness",
    description: "Cross-network bridge readiness planning.",
    status: "design_only",
    modules: [],
    adapterCategories: ["wallet", "stablecoin"],
    limitations: ["No bridge active. Design-only planning."],
    nextSteps: ["Legal review required before bridge activation."],
    softwareRoute: null,
    apiRoute: null,
  },
  {
    id: "cap-proof-of-funds",
    capabilityType: "proof_of_funds_reference",
    displayName: "Proof of Funds Reference",
    description: "Documentation and verification reference for proof-of-funds.",
    status: "manual_only",
    modules: ["trust_audit"],
    adapterCategories: ["compliance"],
    limitations: ["Proof of funds documents must be generated and attached manually."],
    nextSteps: ["Attach evidence records to proof room."],
    softwareRoute: "/admin/proof-room/evidence",
    apiRoute: "/api/troptions/proof-room/evidence",
  },
];

export function getPlatformCapabilities(): PlatformCapabilityRecord[] {
  return PLATFORM_CAPABILITIES;
}

export function getCapabilityByType(
  type: CapabilityType
): PlatformCapabilityRecord | undefined {
  return PLATFORM_CAPABILITIES.find((c) => c.capabilityType === type);
}

export function getCapabilitiesByStatus(
  status: CapabilityStatus
): PlatformCapabilityRecord[] {
  return PLATFORM_CAPABILITIES.filter((c) => c.status === status);
}

export function getCapabilityStatusColor(status: CapabilityStatus): string {
  const map: Record<CapabilityStatus, string> = {
    design_only: "text-slate-400 bg-slate-800/60 border-slate-600/50",
    mock_only: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    manual_only: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    credentials_required: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    sandbox_ready: "text-teal-300 bg-teal-900/60 border-teal-700/50",
    production_ready: "text-green-300 bg-green-900/60 border-green-700/50",
    blocked: "text-red-300 bg-red-900/60 border-red-700/50",
  };
  return map[status];
}
