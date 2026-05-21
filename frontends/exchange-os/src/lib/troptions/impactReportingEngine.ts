import { IMPACT_FUNDING_REGISTRY } from "@/content/troptions/impactFundingRegistry";

export interface ImpactReportRequest {
  period: string;
  program: string;
}

export function getImpactReportingSummary() {
  return {
    tracks: IMPACT_FUNDING_REGISTRY,
  };
}

export function simulateImpactReport(request: ImpactReportRequest) {
  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: ["Impact reports are generated in simulation mode until verification controls are complete"],
    report: {
      period: request.period,
      program: request.program,
      outputFormat: ["json", "csv", "pdf-summary"],
      auditReady: true,
    },
  };
}
