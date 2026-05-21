import type { ApplicationClockInput, ApplicationClockResult } from "@/lib/troptions-genius-yield/types";

function addDays(date: string, days: number): string {
  const value = new Date(date);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
}

export function calculatePPSIApplicationClock(application: ApplicationClockInput): ApplicationClockResult {
  const completenessDeadline = application.dateSubmitted ? addDays(application.dateSubmitted, 30) : null;
  const decisionDeadline = application.substantiallyCompleteDate ? addDays(application.substantiallyCompleteDate, 120) : null;
  const readinessToFile = application.missingDocuments.length === 0;

  return {
    timeline: [
      { type: "ppsi_application_30_day_completeness_notice", date: completenessDeadline },
      { type: "ppsi_application_120_day_decision", date: decisionDeadline },
      { type: "regulator_packet_refresh", date: application.substantiallyCompleteDate ?? null },
    ],
    currentStatus: readinessToFile ? "substantially_complete_ready" : "missing_documents",
    nextDeadline: completenessDeadline,
    riskWarnings: [
      ...(application.missingDocuments.length > 0 ? ["Application cannot be treated as substantially complete while documents are missing."] : []),
      ...(application.materialChangeResetRisk ? ["Material changes may reset review timing or require packet refresh."] : []),
    ],
    readinessToFile,
  };
}