import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import {
  SOVEREIGN_AI_SYSTEMS,
  getVerticalLabel,
  getRiskLevelLabel,
  type TroptionsSovereignAiStatus,
} from "@/content/troptions-ai/sovereignAiRegistry";
import { type TroptionsKnowledgeSensitivity } from "@/content/troptions-ai/knowledgeVaultRegistry";
import { evaluateAiSystemPolicy } from "@/lib/troptions-ai/sovereignAiPolicyEngine";
import AiPolicyGatePanel from "@/components/troptions-ai/AiPolicyGatePanel";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pairs: { namespace: string; systemId: string }[] = [];
  for (const ns of TROPTIONS_NAMESPACES) {
    const systems = SOVEREIGN_AI_SYSTEMS.filter((s) => s.namespaceId === ns.id);
    for (const system of systems) {
      pairs.push({ namespace: ns.slug, systemId: system.id });
    }
  }
  // Include one fallback so static generation never returns empty array
  if (pairs.length === 0) {
    pairs.push({ namespace: "troptions", systemId: "sys-000" });
  }
  return pairs;
}

interface Props {
  params: Promise<{ namespace: string; systemId: string }>;
}

export default async function SovereignAiSystemDetailPage({ params }: Props) {
  const { namespace, systemId } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  const system = SOVEREIGN_AI_SYSTEMS.find(
    (s) => s.id === systemId && s.namespaceId === ns.id
  );
  if (!system) notFound();

  const policyDecision = evaluateAiSystemPolicy({
    namespaceActive: true,
    membershipActive: true,
    aiSystem: system,
    dataSensitivities: (system.riskLevel === "restricted" || system.riskLevel === "high"
      ? ["confidential"]
      : ["internal"]) as TroptionsKnowledgeSensitivity[],
    externalApiCallsEnabled: false,
    liveAutomationRequested: false,
    requestedModelProvider: "troptions_placeholder",
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
        <Link href={`/troptions-cloud/${namespace}/sovereign-ai`} className="hover:text-gray-400 transition-colors">
          ← Sovereign AI
        </Link>
        <span>/</span>
        <span className="text-gray-500">{system.systemName}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          {getVerticalLabel(system.vertical)}
        </p>
        <h1 className="text-2xl font-bold text-white">{system.systemName}</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl">{system.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column: system details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Risk Level", value: getRiskLevelLabel(system.riskLevel) },
              { label: "Deployment Mode", value: system.deploymentMode.replace(/_/g, " ") },
              { label: "Status", value: system.status.replace(/_/g, " ") },
              { label: "Namespace", value: system.namespaceId },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-800 bg-[#0F1923] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">{m.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Enabled tools */}
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
              Enabled Tools ({system.enabledTools.length})
            </p>
            {system.enabledTools.length === 0 ? (
              <p className="text-xs text-gray-600">No tools enabled yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {system.enabledTools.map((tool) => (
                  <span key={tool.id} className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-400">
                    {tool.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Knowledge sources */}
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
              Knowledge Sources ({system.knowledgeSources.length})
            </p>
            {system.knowledgeSources.length === 0 ? (
              <p className="text-xs text-gray-600">No knowledge sources attached yet.</p>
            ) : (
              <div className="space-y-2">
                {system.knowledgeSources.map((ks, i) => (
                  <div key={i} className="flex items-center gap-3 rounded border border-gray-800 bg-[#080C14] px-3 py-2">
                    <span className="text-xs font-medium text-white">{ks.label}</span>
                    <span className="text-[10px] text-gray-600">{ks.sourceType.replace(/_/g, " ")}</span>
                    <span className="ml-auto text-[10px] text-gray-600">{ks.sensitivity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety flags */}
          <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
              Safety Invariants
            </p>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {[
                { label: "Simulation Only", value: system.simulationOnly },
                { label: "Live Execution Disabled", value: !system.liveExecutionEnabled },
                { label: "External Calls Blocked", value: !system.externalApiCallsEnabled },
                { label: "Control Hub Required", value: system.requiresControlHubApproval },
                { label: "Data Review Required", value: system.requiresDataReview },
                { label: "Legal Review for Sensitive Use", value: system.requiresLegalReviewForSensitiveUse },
              ].map((flag) => (
                <div key={flag.label} className="flex items-center gap-2">
                  <span className={flag.value ? "text-green-400" : "text-red-400"}>{flag.value ? "✓" : "✕"}</span>
                  <span className="text-xs text-gray-400">{flag.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: policy gate */}
        <div>
          <AiPolicyGatePanel decision={policyDecision} title="Policy Gate Simulation" />
        </div>
      </div>
    </div>
  );
}
