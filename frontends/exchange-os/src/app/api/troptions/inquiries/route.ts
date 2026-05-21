import { NextRequest, NextResponse } from "next/server";
import { createInquiry, listInquiries, getInquirySummary } from "@/lib/troptions/revenue-db";
import type { BudgetRange, ServiceCategory } from "@/lib/troptions/revenue";
import { getCurrentUser } from "@/lib/auth/current-user";

// ─── POST /api/troptions/inquiries ────────────────────────────────────────────
// Public — accepts new client inquiry submissions
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Required field validation
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const consentGiven = body.consentGiven === true;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });
  if (!consentGiven) {
    return NextResponse.json({ error: "Consent is required to submit an inquiry" }, { status: 400 });
  }

  try {
    const inquiry = createInquiry({
      name,
      email,
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      website: typeof body.website === "string" ? body.website.trim() : undefined,
      budgetRange: (body.budgetRange as BudgetRange) || "not_specified",
      serviceInterest: (body.serviceInterest as ServiceCategory) || "not_sure",
      timeline: typeof body.timeline === "string" ? body.timeline.trim() : undefined,
      message,
      consentGiven,
    });

    return NextResponse.json(
      {
        success: true,
        id: inquiry.id,
        message: "Your inquiry has been received. The TROPTIONS team will be in touch within 1 business day.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[inquiries POST]", err);
    return NextResponse.json({ error: "Failed to save inquiry. Please try again." }, { status: 500 });
  }
}

// ─── GET /api/troptions/inquiries ─────────────────────────────────────────────
// Admin-only — returns inquiry list with summary
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const inquiries = listInquiries(limit, offset);
    const summary = getInquirySummary();

    return NextResponse.json({ inquiries, summary });
  } catch (err) {
    console.error("[inquiries GET]", err);
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}
