import { NextResponse } from "next/server";
import { CLAWD_CAPABILITIES, CLAWD_SYSTEM_PROMPT_CONSTRAINTS } from "@/content/troptions/clawdCapabilities";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ ok: false, error: "Authorization required" }, { status: 401 });
  }
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey) {
    return NextResponse.json({ ok: false, error: "idempotency-key header required" }, { status: 400 });
  }

  let body: { topic?: string; context?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.topic) {
    return NextResponse.json({ ok: false, error: "topic field required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    topic: body.topic,
    constraints: CLAWD_SYSTEM_PROMPT_CONSTRAINTS,
    allowedCapabilities: CLAWD_CAPABILITIES.filter((c) => c.allowed).map((c) => c.id),
    blockedCapabilities: CLAWD_CAPABILITIES.filter((c) => !c.allowed).map((c) => ({ id: c.id, reason: c.description })),
    plan: {
      steps: [
        { step: 1, action: "retrieve", description: "Retrieve relevant entities and knowledge nodes" },
        { step: 2, action: "summarize", description: "Summarize relevant compliance and gate status" },
        { step: 3, action: "draft", description: "Draft response with disclaimer and citations" },
      ],
      note: "Plan simulation only — Clawd agent deployment requires compliance approval.",
    },
  });
}
