import { NextResponse } from "next/server";
import { createSignatureCollection, recordSignature } from "@/lib/troptions/contractSignatureEngine";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agreementType, documentContent, documentName, transactionId, signatories, signatoryAddress, collectionId } = body;

    // Two modes:
    // 1. Create a new collection + sign immediately (signatories + signatoryAddress provided)
    // 2. Add a signature to an existing collection (collectionId + signatoryAddress)

    if (collectionId && signatoryAddress) {
      // Mode 2: sign existing
      const result = recordSignature({ collectionId, signatoryAddress });
      return NextResponse.json({ ok: result.success, ...result });
    }

    if (!agreementType || !documentContent || !documentName || !signatories) {
      return NextResponse.json(
        { ok: false, error: "agreementType, documentContent, documentName, and signatories are required" },
        { status: 400 }
      );
    }

    const documentHash = createHash("sha256").update(documentContent as string).digest("hex");
    const collection = createSignatureCollection({
      agreementType,
      documentHash,
      documentName,
      transactionId,
      signatoryAddresses: signatories,
    });

    // If caller also wants to sign immediately as signatoryAddress
    if (signatoryAddress) {
      recordSignature({ collectionId: collection.collectionId, signatoryAddress });
    }

    return NextResponse.json({
      ok: true,
      simulationOnly: true,
      collection,
      disclosure: collection.disclosureStatement,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
