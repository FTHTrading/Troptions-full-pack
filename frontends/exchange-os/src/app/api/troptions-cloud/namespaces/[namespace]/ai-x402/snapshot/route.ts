import { NextResponse } from "next/server";
import { getNamespaceAiX402Snapshot } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  const { namespace } = await params;
  const snapshot = getNamespaceAiX402Snapshot(namespace);

  if (!snapshot) {
    return NextResponse.json(
      { ok: false, error: `Namespace '${namespace}' not found in AI or x402 registry` },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, simulationOnly: true, data: snapshot });
}
