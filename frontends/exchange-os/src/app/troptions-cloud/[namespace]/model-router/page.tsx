import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { MODEL_ROUTES, MODEL_POLICIES, getProviderLabel } from "@/lib/troptions-ai/modelRouter";
import ModelRouteBadge from "@/components/troptions-ai/ModelRouteBadge";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function ModelRouterPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          Model Router
        </p>
        <h1 className="text-2xl font-bold text-white">{ns.displayName} — Model Router</h1>
        <p className="mt-1 text-sm text-gray-500">
          AI model routing configuration for the{" "}
          <span className="font-mono text-gray-400">{ns.slug}</span> namespace.
          All providers are currently in simulation/placeholder state. No live model inference is enabled.
        </p>
      </div>

      {/* Safety note */}
      <div className="mb-6 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          No Live Inference
        </p>
        <p className="text-xs text-gray-500">
          All {MODEL_ROUTES.length} model routes are marked unavailable. External API calls are blocked.
          Live execution is disabled. Model routing decisions are simulated only — no actual AI inference
          occurs through this router in the current phase.
        </p>
      </div>

      {/* Route list */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Available Routes ({MODEL_ROUTES.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODEL_ROUTES.map((route) => (
            <ModelRouteBadge key={route.id} route={route} />
          ))}
        </div>
      </div>

      {/* Provider reference */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Provider Reference
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0F1923]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["Provider ID", "Label", "Type", "Status"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODEL_ROUTES.map((route) => (
                <tr key={route.id} className="border-b border-gray-800/50 hover:bg-[#080C14]/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{route.provider}</td>
                  <td className="px-4 py-3 text-xs text-white">{getProviderLabel(route.provider)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {route.provider.includes("local") ? "Local" : route.provider.includes("placeholder") ? "Placeholder" : "External"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Unavailable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy list */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Routing Policies ({MODEL_POLICIES.length})
        </h2>
        <div className="space-y-3">
          {MODEL_POLICIES.map((policy) => (
            <div key={policy.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{policy.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{policy.rule}</p>
                </div>
                <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${policy.enforcement === "blocking" ? "border-green-800/50 bg-green-950/20 text-green-400" : "border-gray-700 bg-[#080C14] text-gray-600"}`}>
                  {policy.enforcement === "blocking" ? "Blocking" : policy.enforcement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/troptions-cloud/${namespace}/ai-policy`}
          className="rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-2 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
        >
          AI Policy →
        </Link>
        <Link
          href={`/troptions-cloud/${namespace}/sovereign-ai`}
          className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:border-gray-700 transition-colors"
        >
          AI Systems
        </Link>
        <Link
          href={`/troptions-cloud/${namespace}/knowledge-vault`}
          className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:border-gray-700 transition-colors"
        >
          Knowledge Vault
        </Link>
      </div>
    </div>
  );
}
