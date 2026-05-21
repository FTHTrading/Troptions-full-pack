import { NextResponse } from "next/server";
import {
  EXCHANGE_OS_OPERATING_PRINCIPLES,
  EXCHANGE_OS_RISK_LEVELS,
  EXCHANGE_OS_PUBLIC_CLAIM_RULES,
  EXCHANGE_OS_VOLUME_READINESS,
} from "@/data/exchangeOsOperatingModel";


export async function GET() {
  return NextResponse.json({
    data: {
      operatingPrinciples: EXCHANGE_OS_OPERATING_PRINCIPLES,
      riskLevels: EXCHANGE_OS_RISK_LEVELS,
      publicClaimRules: EXCHANGE_OS_PUBLIC_CLAIM_RULES,
      volumeReadiness: EXCHANGE_OS_VOLUME_READINESS,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — TROPTIONS is infrastructure only, not an exchange operator, custodian, or broker/dealer",
    version: "1.0",
  });
}
