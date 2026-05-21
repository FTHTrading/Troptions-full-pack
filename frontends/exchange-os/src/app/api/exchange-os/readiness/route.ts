import { NextResponse } from "next/server";
import {
  TOKEN_LAUNCH_GATES,
  MAINNET_ACTIVATION_BLOCKERS,
  DUE_DILIGENCE_REQUIREMENTS,
  TECHNICAL_SCALE_REQUIREMENTS,
  SECURITY_REQUIREMENTS,
  MONITORING_REQUIREMENTS,
  PARTNER_CONTROL_REQUIREMENTS
} from "@/data/exchangeOsReadiness";

export async function GET() {
  return NextResponse.json({
    gates: TOKEN_LAUNCH_GATES,
    blockers: MAINNET_ACTIVATION_BLOCKERS,
    requirements: [
      ...DUE_DILIGENCE_REQUIREMENTS,
      ...TECHNICAL_SCALE_REQUIREMENTS,
      ...SECURITY_REQUIREMENTS,
      ...MONITORING_REQUIREMENTS,
      ...PARTNER_CONTROL_REQUIREMENTS
    ],
    statusSummary: {
      gates: TOKEN_LAUNCH_GATES.length,
      blockers: MAINNET_ACTIVATION_BLOCKERS.length
    },
    generatedAt: new Date().toISOString()
  });
}
