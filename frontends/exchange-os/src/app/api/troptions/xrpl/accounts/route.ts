import { listXrplAccounts } from "@/lib/troptions/xrplLedgerEngine";
import { NextResponse, guardPortalRead } from "@/lib/troptions/portalApiGuards";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  return NextResponse.json({ ok: true, accounts: listXrplAccounts(), simulationOnly: true });
}
