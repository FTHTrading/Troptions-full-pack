import { NextResponse } from "next/server";
import {
  REQUIRED_REVIEWERS,
  REQUIRED_DOCUMENTS,
  COMMITTEE_BLOCKERS,
  ESCALATION_TRIGGERS,
} from "@/data/launchCommitteeControls";


export async function GET() {
  return NextResponse.json({
    data: {
      requiredReviewers: REQUIRED_REVIEWERS,
      requiredDocuments: REQUIRED_DOCUMENTS,
      blockers: COMMITTEE_BLOCKERS,
      escalationTriggers: ESCALATION_TRIGGERS,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — launch committee control schema, no live committee status",
    version: "1.0",
  });
}
