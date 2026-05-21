import { NextRequest } from "next/server";
import {
  buildWalletForensicsReport,
  renderWalletForensicsReportHtml,
} from "@/lib/troptions/walletForensicsReportBuilder";
import { guardPostRequest, storeIdempotentResponse } from "@/lib/troptions/walletForensicsApiGuards";

export async function POST(request: NextRequest) {
  const guard = await guardPostRequest(request);
  if (!guard.ok) return guard.response;

  const report = buildWalletForensicsReport();
  const html = renderWalletForensicsReportHtml(report);

  return storeIdempotentResponse(
    request,
    {
      ok: true,
      mode: "read-only-stub",
      report,
      html,
      note: "Forensic report generation only. No transaction submission, signing, or funds movement is possible.",
    },
    200,
  );
}
