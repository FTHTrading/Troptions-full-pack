import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNamespaceAiX402Snapshot } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";
import NamespaceAiX402Panel from "@/components/troptions-cloud/NamespaceAiX402Panel";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return {
    title: `Usage — ${namespace} | Troptions Cloud`,
    description: `AI and x402 usage simulation for ${namespace}`,
  };
}

export default async function NamespaceUsagePage({ params }: Props) {
  const { namespace } = await params;
  const snapshot = getNamespaceAiX402Snapshot(namespace);

  if (!snapshot) notFound();

  return (
    <div className="min-h-screen bg-[#080C14] px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="mb-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-yellow-900/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-500">
              Simulation Only
            </span>
            <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold text-[#C9A84C] uppercase tracking-widest">
              {snapshot.controlHubPersistenceStatus}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Usage Overview</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">{namespace}</p>
          <p className="mt-2 text-sm text-gray-400">
            Combined AI and x402 usage snapshot with safety status, infrastructure summary,
            and usage metering policy for this namespace.
          </p>
        </div>

        {/* Full AI + x402 panel */}
        <NamespaceAiX402Panel snapshot={snapshot} />
      </div>
    </div>
  );
}
