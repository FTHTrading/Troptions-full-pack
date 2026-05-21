import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { TROPTIONS_AI_SYSTEMS } from "@/content/troptions-cloud/aiSystemRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `AI Systems — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function AiSystemsPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href={`/troptions-cloud/${namespace}/ai`} className="hover:text-white transition-colors">AI Studio</Link>
            <span className="mx-2">/</span>
            <span className="text-white">AI Systems</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">AI System Builder</h1>
          <p className="mt-2 text-sm text-gray-400">
            Configure and deploy AI agent systems for your namespace. All deployments require Control Hub approval.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            AI System deployment is non-functional in this phase. All configurations are simulated.
            External API calls are disabled. Control Hub approval is required for all production deployments.
          </p>
        </div>

        {/* System Templates */}
        <div className="space-y-4">
          {TROPTIONS_AI_SYSTEMS.map((system) => (
            <div
              key={system.id}
              className="rounded-xl border border-gray-800 bg-[#0F1923] p-5"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400 capitalize">
                      {system.category.replace(/_/g, " ")}
                    </span>
                    <span className="rounded-full bg-yellow-900/20 px-2 py-0.5 text-[10px] text-yellow-500">
                      Simulation Only
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{system.displayName}</h2>
                  <p className="text-[10px] font-mono text-gray-600 mt-0.5">{system.slug}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-3">{system.description}</p>

              {/* Tools */}
              {system.tools.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1.5">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {system.tools.slice(0, 5).map((tool) => (
                      <span key={tool.id} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {tool.name}
                      </span>
                    ))}
                    {system.tools.length > 5 && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                        +{system.tools.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Policies */}
              {system.policies.length > 0 && (
                <div className="mb-3 rounded-lg border border-gray-700/50 bg-[#080C14] p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1.5">Safety Policies</p>
                  {system.policies.map((policy) => (
                    <p key={policy.id} className="text-[10px] text-gray-400">
                      {policy.rule}
                    </p>
                  ))}
                </div>
              )}

              {/* Safety flags */}
              <div className="mb-3 flex flex-wrap gap-3 text-[10px]">
                <span className="text-gray-500">
                  simulationOnly: <span className="font-mono text-green-400">{String(system.simulationOnly)}</span>
                </span>
                <span className="text-gray-500">
                  liveExecutionEnabled: <span className="font-mono text-red-400">{String(system.liveExecutionEnabled)}</span>
                </span>
                <span className="text-gray-500">
                  externalApiCallsEnabled: <span className="font-mono text-red-400">{String(system.externalApiCallsEnabled)}</span>
                </span>
                <span className="text-gray-500">
                  requiresControlHubApproval: <span className="font-mono text-yellow-400">{String(system.requiresControlHubApproval)}</span>
                </span>
              </div>

              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs font-semibold text-gray-600"
              >
                Configure System — Simulation Only
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[10px] text-gray-600 leading-relaxed">
          All AI systems require Control Hub review and approval before production deployment.
          Healthcare AI systems may not provide diagnosis, treatment recommendations, or emergency guidance.
        </p>
      </div>
    </div>
  );
}
