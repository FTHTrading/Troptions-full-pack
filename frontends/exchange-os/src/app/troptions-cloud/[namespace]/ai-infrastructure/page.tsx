import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import NamespaceAiInfrastructureCard from "@/components/troptions-cloud/NamespaceAiInfrastructureCard";
import NamespaceModelRoutingPanel from "@/components/troptions-cloud/NamespaceModelRoutingPanel";
import NamespaceKnowledgeVaultAccessPanel from "@/components/troptions-cloud/NamespaceKnowledgeVaultAccessPanel";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return {
    title: `AI Infrastructure — ${namespace} | Troptions Cloud`,
    description: `AI workspace, model routing, and knowledge vault configuration for ${namespace}`,
  };
}

export default async function NamespaceAiInfrastructurePage({ params }: Props) {
  const { namespace } = await params;
  const profile = getNamespaceAiProfile(namespace);

  if (!profile) notFound();

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
              {profile.executionMode}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Infrastructure</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">{namespace}</p>
          <p className="mt-2 text-sm text-gray-400">
            Isolated AI workspace, model routing policy, tool access controls, and knowledge
            vault configuration for this namespace.
          </p>
        </div>

        {/* Cards */}
        <NamespaceAiInfrastructureCard profile={profile} />
        <NamespaceModelRoutingPanel profile={profile} />
        <NamespaceKnowledgeVaultAccessPanel
          vaults={profile.knowledgeVaults}
          namespaceId={namespace}
        />

        {/* Safety note */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] px-5 py-4">
          <p className="text-xs text-gray-500">
            All AI infrastructure data is simulation-only. No external AI API calls are made.
            All access decisions require Control Hub approval before live execution is enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
