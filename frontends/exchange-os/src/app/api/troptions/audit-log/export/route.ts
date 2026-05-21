import { NextResponse } from "next/server";
import { createSignedAuditExport } from "@/lib/troptions/auditExport";
import { guardControlPlaneRequest } from "@/lib/troptions/requestGuards";
import { getActiveAuditSigningKey } from "@/lib/troptions/keyManagement";

export async function GET(request: Request) {
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "read-audit-log",
      writeAction: false,
      requireIdempotency: false,
    });
    if (guarded instanceof NextResponse) return guarded;

    const signingKey = getActiveAuditSigningKey();
    if (!signingKey) {
      return NextResponse.json(
        { ok: false, error: "No audit signing key is configured." },
        { status: 503 },
      );
    }

    const signedExport = createSignedAuditExport(signingKey.secret, signingKey.kid);
    return NextResponse.json({ ok: true, ...signedExport });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
