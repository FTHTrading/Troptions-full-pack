import { NextResponse } from "next/server";
import { createKycRecord, submitDocument } from "@/lib/troptions/kycOnboardingEngine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subjectAddress, entityType, documentType, documentName, documentContent, ipfsCid } = body;
    if (!subjectAddress || !documentType || !documentName || !documentContent) {
      return NextResponse.json(
        { ok: false, error: "subjectAddress, documentType, documentName, and documentContent are required" },
        { status: 400 }
      );
    }

    // Create record if not already present (idempotent — caller can pre-create or let this route auto-create)
    const { findKycByAddress } = await import("@/lib/troptions/kycOnboardingEngine");
    let record = findKycByAddress(subjectAddress);
    if (!record) {
      record = createKycRecord({ subjectAddress, entityType: entityType ?? "individual" });
    }

    const result = submitDocument({
      kycId: record.kycId,
      documentType,
      documentName,
      documentContent,
      ipfsCid,
    });

    return NextResponse.json({
      ok: result.success,
      simulationOnly: true,
      kycId: record.kycId,
      documentId: result.documentId,
      sha256Hash: result.sha256Hash,
      disclosure: result.disclosure,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
