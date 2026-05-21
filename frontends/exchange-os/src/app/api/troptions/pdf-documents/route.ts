import { NextResponse } from "next/server";
import { PDF_DOCUMENT_REGISTRY } from "@/lib/troptions/pdfDocumentRegistry";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    _note: "Technical metadata only. Download PDF links are the primary client interface.",
    count: PDF_DOCUMENT_REGISTRY.length,
    documents: PDF_DOCUMENT_REGISTRY,
  });
}
