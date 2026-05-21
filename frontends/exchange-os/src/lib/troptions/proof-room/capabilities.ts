/**
 * TROPTIONS Proof Room — Capability Records
 */

import type { TroptionsCapabilityRecord } from "./types";

export function getMockCapabilityRecords(): TroptionsCapabilityRecord[] {
  return [
    {
      id: "proofcap-001",
      capabilityName: "Infrastructure Control Plane",
      capabilityCategory: "infrastructure",
      currentStatus: "build_verified",
      proofLevel: "build_report",
      softwareRoute: "/admin/infrastructure",
      apiRoute: "/api/troptions/infrastructure/namespaces",
      evidenceIds: ["ev-build-001"],
      limitations: [
        "Live namespace provisioning requires deployment provider configuration.",
      ],
      nextSteps: ["Configure deployment provider adapter."],
      canBeClaimedPublicly: true,
    },
    {
      id: "proofcap-002",
      capabilityName: "PayOps Module",
      capabilityCategory: "payments",
      currentStatus: "build_verified",
      proofLevel: "build_report",
      softwareRoute: "/troptions-cloud/[namespace]/payops",
      apiRoute: "/api/troptions/payops/payout-batches",
      evidenceIds: ["ev-build-002"],
      limitations: [
        "Live payout execution requires production-ready payment provider adapter.",
        "Mock-only until provider credentials are configured.",
      ],
      nextSteps: [
        "Obtain payment provider agreement.",
        "Configure payment adapter with credentials.",
      ],
      canBeClaimedPublicly: true,
    },
    {
      id: "proofcap-003",
      capabilityName: "Stablecoin Payment Rails",
      capabilityCategory: "payments",
      currentStatus: "future_ready_not_live",
      proofLevel: "admin_dashboard",
      softwareRoute: null,
      apiRoute: null,
      evidenceIds: [],
      limitations: [
        "No live stablecoin execution today.",
        "Requires stablecoin provider agreement.",
        "Requires compliance approval.",
      ],
      nextSteps: [
        "Obtain provider agreement.",
        "Compliance review.",
        "Configure adapter credentials.",
      ],
      canBeClaimedPublicly: false,
    },
  ];
}
