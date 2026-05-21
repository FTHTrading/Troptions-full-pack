import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/lib/exchange-os/leads";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, partnerType } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    // Basic email format check — full validation happens in CRM
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "valid email is required" }, { status: 400 });
    }
    if (!partnerType || typeof partnerType !== "string") {
      return NextResponse.json({ error: "partnerType is required" }, { status: 400 });
    }

    const result = await submitLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      partnerType,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      packageInterest: typeof body.packageInterest === "string" ? body.packageInterest : undefined,
      message: typeof body.message === "string" ? body.message.trim() : undefined,
      source: typeof body.source === "string" ? body.source : "exchange-os",
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Lead submission failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, demoMode: result.demoMode });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lead submission failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
