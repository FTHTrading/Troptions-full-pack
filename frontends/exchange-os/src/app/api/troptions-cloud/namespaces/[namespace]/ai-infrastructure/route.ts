import { NextResponse } from "next/server";
import { getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  const { namespace } = await params;
  const profile = getNamespaceAiProfile(namespace);

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: `Namespace '${namespace}' not found` },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, simulationOnly: true, data: profile });
}
