import { NextResponse } from "next/server";
import {
  MONITORING_ALERTS,
  MONITORING_DATA_SOURCES,
  INCIDENT_RESPONSE_RUNBOOK_STEPS,
} from "@/data/marketMonitoringRequirements";


export async function GET() {
  return NextResponse.json({
    data: {
      alerts: MONITORING_ALERTS,
      dataSources: MONITORING_DATA_SOURCES,
      incidentRunbook: INCIDENT_RESPONSE_RUNBOOK_STEPS,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — monitoring alert schema, no live on-chain data",
    version: "1.0",
  });
}
