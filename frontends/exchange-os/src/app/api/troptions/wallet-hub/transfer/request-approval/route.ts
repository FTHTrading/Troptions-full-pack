import { NextResponse } from "next/server";

function hasSecretFields(input: unknown): boolean {
  const text = JSON.stringify(input ?? {});
  return /(seed|privateKey|mnemonic|secretKey)/i.test(text);
}

export async function POST(request: Request) {
  let body: { transferIntentId?: string; requestedBy?: string; note?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (hasSecretFields(body)) {
    return NextResponse.json(
      { ok: false, error: "Secret fields are not accepted by wallet-hub APIs." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    approvalRequestId: `apr-${Date.now()}`,
    transferIntentId: body.transferIntentId ?? null,
    status: "COMPLIANCE_REVIEW",
    nextSteps: [
      "Compliance reviewer validates source and destination parties.",
      "Legal reviewer confirms route eligibility and jurisdiction constraints.",
      "Operator confirms runtime controls and explicit send authorization.",
    ],
  });
}
