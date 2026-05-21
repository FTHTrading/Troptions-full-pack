import { NextResponse } from "next/server";
import { createRwaRequest } from "@/lib/troptions/revenue-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const missing: string[] = [];
    if (!body.name)             missing.push("name");
    if (!body.email)            missing.push("email");
    if (!body.assetClass)       missing.push("assetClass");
    if (!body.assetDescription) missing.push("assetDescription");
    if (!body.estimatedValue)   missing.push("estimatedValue");
    if (!body.jurisdiction)     missing.push("jurisdiction");
    if (!body.purpose)          missing.push("purpose");
    if (!body.consentGiven)     missing.push("consentGiven");
    if (missing.length) {
      return NextResponse.json({ ok: false, error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const record = createRwaRequest({
      name:             String(body.name),
      email:            String(body.email),
      phone:            body.phone    ? String(body.phone)    : undefined,
      company:          body.company  ? String(body.company)  : undefined,
      entityType:       body.entityType ? String(body.entityType) : "individual",
      assetClass:       String(body.assetClass),
      assetDescription: String(body.assetDescription),
      estimatedValue:   String(body.estimatedValue),
      jurisdiction:     String(body.jurisdiction),
      custodyPreference: body.custodyPreference ? String(body.custodyPreference) : "troptions_custodian",
      hasExistingDocs:  Boolean(body.hasExistingDocs),
      docTypes:         body.docTypes ? String(body.docTypes) : undefined,
      settlementChain:  body.settlementChain ? String(body.settlementChain) : "xrpl",
      purpose:          String(body.purpose),
      timeline:         body.timeline ? String(body.timeline) : undefined,
      notes:            body.notes    ? String(body.notes)    : undefined,
      consentGiven:     Boolean(body.consentGiven),
    });

    return NextResponse.json({ ok: true, rwaId: record.id, status: record.status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
