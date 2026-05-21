import { NextResponse } from "next/server";
import { createPofRequest } from "@/lib/troptions/revenue-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const missing: string[] = [];
    if (!body.name)         missing.push("name");
    if (!body.email)        missing.push("email");
    if (!body.amount)       missing.push("amount");
    if (!body.sourceOfFunds) missing.push("sourceOfFunds");
    if (!body.purpose)      missing.push("purpose");
    if (!body.consentGiven) missing.push("consentGiven");
    if (missing.length) {
      return NextResponse.json({ ok: false, error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const record = createPofRequest({
      name:           String(body.name),
      email:          String(body.email),
      phone:          body.phone     ? String(body.phone)     : undefined,
      company:        body.company   ? String(body.company)   : undefined,
      entityType:     body.entityType ? String(body.entityType) : "individual",
      amount:         String(body.amount),
      currency:       body.currency   ? String(body.currency) : "USD",
      sourceOfFunds:  String(body.sourceOfFunds),
      purpose:        String(body.purpose),
      jurisdiction:   body.jurisdiction ? String(body.jurisdiction) : undefined,
      bankName:       body.bankName     ? String(body.bankName)     : undefined,
      transactionType: body.transactionType ? String(body.transactionType) : "deal_funding",
      timeline:       body.timeline     ? String(body.timeline)    : undefined,
      notes:          body.notes        ? String(body.notes)       : undefined,
      consentGiven:   Boolean(body.consentGiven),
    });

    return NextResponse.json({ ok: true, pofId: record.id, status: record.status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
