import { NextRequest, NextResponse } from "next/server";
import { createCisRequest, listCisRequests, getCisSummary } from "@/lib/troptions/revenue-db";
import { getCurrentUser } from "@/lib/auth/current-user";

// ─── POST /api/troptions/cis-requests ─────────────────────────────────────────
// Public — accepts CIS (Client Identification Statement) submissions
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "";
  const consentGiven = body.consentGiven === true;

  if (!name) return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }
  if (!purpose) return NextResponse.json({ error: "Purpose of engagement is required" }, { status: 400 });
  if (!consentGiven) {
    return NextResponse.json({ error: "Consent to collect identification information is required" }, { status: 400 });
  }

  try {
    const cis = createCisRequest({
      name,
      email,
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      entityType: typeof body.entityType === "string" ? body.entityType : "individual",
      jurisdiction: typeof body.jurisdiction === "string" ? body.jurisdiction.trim() : undefined,
      purpose,
      transactionType: typeof body.transactionType === "string" ? body.transactionType.trim() : undefined,
      estimatedAmount: typeof body.estimatedAmount === "string" ? body.estimatedAmount.trim() : undefined,
      consentGiven,
    });

    return NextResponse.json(
      {
        success: true,
        id: cis.id,
        downloadUrl: "/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf",
        message:
          "Your CIS package request has been received. The TROPTIONS compliance team will be in touch within 2 business days. Download your CIS template below.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[cis-requests POST]", err);
    return NextResponse.json({ error: "Failed to save CIS request. Please try again." }, { status: 500 });
  }
}

// ─── GET /api/troptions/cis-requests ──────────────────────────────────────────
// Admin-only
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const requests = listCisRequests(limit, offset);
    const summary = getCisSummary();
    return NextResponse.json({ requests, summary });
  } catch (err) {
    console.error("[cis-requests GET]", err);
    return NextResponse.json({ error: "Failed to load CIS requests" }, { status: 500 });
  }
}
