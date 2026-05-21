import { NextResponse } from "next/server";
import { getNamespaceX402Profile } from "@/content/troptions-cloud/namespaceX402Registry";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  const { namespace } = await params;
  const profile = getNamespaceX402Profile(namespace);

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: `Namespace '${namespace}' not found` },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, simulationOnly: true, data: profile });
}
