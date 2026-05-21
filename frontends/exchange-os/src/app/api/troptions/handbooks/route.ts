import { NextResponse } from "next/server";
import { getHandbookSummaries } from "@/lib/troptions/pdfHandbookRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    handbooks: getHandbookSummaries(),
    disclosure:
      "These handbooks are for informational purposes only and do not constitute legal, financial, or investment advice.",
  });
}
