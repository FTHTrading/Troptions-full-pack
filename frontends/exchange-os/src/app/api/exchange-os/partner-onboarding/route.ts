import { NextResponse } from "next/server";
import {
  PARTNER_ONBOARDING_PIPELINE,
  PARTNER_ONBOARDING_WHAT_TROPTIONS_PROVIDES,
  PARTNER_ONBOARDING_WHAT_TROPTIONS_REFUSES,
} from "@/data/partnerOnboarding";


export async function GET() {
  return NextResponse.json({
    data: {
      pipeline: PARTNER_ONBOARDING_PIPELINE,
      provides: PARTNER_ONBOARDING_WHAT_TROPTIONS_PROVIDES,
      refuses: PARTNER_ONBOARDING_WHAT_TROPTIONS_REFUSES,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — partner onboarding pipeline schema, no live partner data",
    version: "1.0",
  });
}
