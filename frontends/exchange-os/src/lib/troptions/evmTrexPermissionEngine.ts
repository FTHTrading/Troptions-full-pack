import { EVM_TREX_PERMISSION_GATES } from "@/content/troptions/evmTrexRegistry";

export interface TrexEligibilityRequest {
  investorId: string;
  jurisdiction: string;
  assetClass: string;
}

export function getTrexGateSummary() {
  return {
    gates: EVM_TREX_PERMISSION_GATES,
    mode: "readiness-only" as const,
  };
}

export function simulateTrexEligibility(request: TrexEligibilityRequest) {
  const unmet = EVM_TREX_PERMISSION_GATES.filter((gate) => gate.required).map((gate) => gate.gate);
  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: ["Permissioned asset issuance is not enabled", "Legal and provider approvals required"],
    eligibility: {
      investorId: request.investorId,
      jurisdiction: request.jurisdiction,
      assetClass: request.assetClass,
      unmetGates: unmet,
    },
  };
}
