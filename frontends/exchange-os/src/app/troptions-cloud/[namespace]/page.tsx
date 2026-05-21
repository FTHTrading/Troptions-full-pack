import type { Metadata } from "next";
import Link from "next/link";
import {
  TROPTIONS_NAMESPACES,
  getNamespace,
  NAMESPACE_PLAN_LABELS,
  NAMESPACE_STATUS_LABELS,
  NAMESPACE_MODULE_LABELS,
} from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return {
    title: `${namespace} — Troptions Cloud`,
    description: `Troptions Cloud namespace: ${namespace}`,
  };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const MODULE_ROUTES: Record<string, string> = {
  ai_studio: "ai",
  ai_system_builder: "ai/systems",
  media_studio: "media",
  proof_vault: "proof",
  healthcare_workspace: "healthcare",
  business_workspace: "business",
  web3_identity: "web3",
  control_hub: "settings",
  education_library: "membership",
  defi_simulation: "business",
  wallet_scaffold: "web3",
  opportunity_room: "membership",
  smart_contract_templates: "proof",
  audit_log: "audit",
  team_management: "team",
};

export default async function NamespaceDashboardPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);

  if (!ns) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Namespace &quot;{namespace}&quot; not found.</p>
        <Link href="/troptions-cloud" className="text-[#C9A84C] hover:underline text-sm">← Back to Troptions Cloud</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              {NAMESPACE_PLAN_LABELS[ns.plan]}
            </span>
            <span className="rounded-full bg-gray-800 px-2.5 py-1 text-[10px] text-gray-400">
              {NAMESPACE_STATUS_LABELS[ns.status]}
            </span>
            <span className="rounded-full bg-yellow-900/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-500">
              Simulation Only
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{ns.displayName}</h1>
          <p className="text-[10px] font-mono text-gray-500 mt-1">{ns.slug}</p>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">{ns.description}</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All modules in this namespace are simulation-only. No live execution, trading, or investment operations are enabled.
          </p>
        </div>

        {/* Enabled Modules */}
        <div className="mb-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Enabled Modules</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ns.enabledModules.map((module) => {
              const route = MODULE_ROUTES[module] ?? "settings";
              return (
                <Link
                  key={module}
                  href={`/troptions-cloud/${ns.slug}/${route}`}
                  className="block rounded-xl border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-colors"
                >
                  <p className="text-sm font-semibold text-white mb-1">{NAMESPACE_MODULE_LABELS[module]}</p>
                  <p className="text-[10px] font-mono text-gray-600">{module}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Namespace Info */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 mb-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Namespace Details</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-0.5">Type</dt>
              <dd className="text-sm text-gray-300 capitalize">{ns.type}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-0.5">Plan</dt>
              <dd className="text-sm text-gray-300">{NAMESPACE_PLAN_LABELS[ns.plan]}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-0.5">Owner</dt>
              <dd className="text-sm text-gray-300 font-mono text-xs">{ns.ownerUserId}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-0.5">Member Count</dt>
              <dd className="text-sm text-gray-300">{ns.members.length}</dd>
            </div>
          </dl>
        </div>

        {/* Safety flags */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Safety Flags</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-yellow-500">⚠</span> simulationOnly: <span className="text-green-400 font-mono">{String(ns.simulationOnly)}</span>
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-yellow-500">⚠</span> liveExecutionEnabled: <span className="text-red-400 font-mono">{String(ns.liveExecutionEnabled)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
