import { PUBLIC_BENEFIT_REGISTRY, PUBLIC_BENEFIT_RAIL_STATEMENT } from "@/content/troptions/publicBenefitRegistry";

export interface PublicBenefitIntakeRequest {
  organizationName: string;
  programType: string;
  contactEmail: string;
}

export function getPublicBenefitRailSummary() {
  return {
    statement: PUBLIC_BENEFIT_RAIL_STATEMENT,
    controls: PUBLIC_BENEFIT_REGISTRY,
  };
}

export function simulatePublicBenefitIntake(request: PublicBenefitIntakeRequest) {
  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: [
      "Verified organization review required",
      "Compliance approval required",
      "No live disbursement without approvals",
    ],
    intake: {
      organizationName: request.organizationName,
      programType: request.programType,
      contactEmail: request.contactEmail,
      routing: "verification-queue",
    },
  };
}
