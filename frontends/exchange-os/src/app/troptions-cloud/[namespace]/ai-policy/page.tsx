import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { SOVEREIGN_AI_GLOBAL_POLICIES } from "@/content/troptions-ai/sovereignAiRegistry";
import { MODEL_POLICIES, getProviderLabel } from "@/lib/troptions-ai/modelRouter";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function AiPolicyPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          AI Policy
        </p>
        <h1 className="text-2xl font-bold text-white">{ns.displayName} — AI Policy</h1>
        <p className="mt-1 text-sm text-gray-500">
          Global policy rules, model routing policies, and safety controls for the{" "}
          <span className="font-mono text-gray-400">{ns.slug}</span> namespace.
          All policies are enforced at the policy engine layer before any AI operation is permitted.
        </p>
      </div>

      {/* How the policy gate works */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          How the Policy Gate Works
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs text-gray-400">
          {[
            "Every AI operation is evaluated before execution",
            "Namespace and membership must be active",
            "AI system status must be approved or active",
            "Control Hub approval required for sensitive operations",
            "Healthcare vertical enforces no-PHI, no-diagnosis rules",
            "Financial vertical blocks investment and securities tools",
            "External model routing blocked for regulated data",
            "Live execution is globally disabled in simulation phase",
            "All decisions are recorded in the proof and audit trail",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#C9A84C] shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global AI policies */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Global AI Policies ({SOVEREIGN_AI_GLOBAL_POLICIES.length})
        </h2>
        <div className="space-y-3">
          {SOVEREIGN_AI_GLOBAL_POLICIES.map((policy) => (
            <div key={policy.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{policy.name}</p>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${policy.enforcementLevel === "blocking" ? "border-green-800/50 bg-green-950/20 text-green-400" : "border-gray-700 bg-[#080C14] text-gray-600"}`}>
                      {policy.enforcementLevel === "blocking" ? "Blocking" : policy.enforcementLevel}
                    </span>
                    <span className="rounded border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-2 py-0.5 text-[10px] text-[#C9A84C]">
                      Global
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{policy.rule}</p>
                  <p className="mt-1 text-[10px] font-mono text-gray-600">{policy.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model routing policies */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Model Routing Policies ({MODEL_POLICIES.length})
        </h2>
        <div className="space-y-3">
          {MODEL_POLICIES.map((policy) => (
            <div key={policy.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{policy.name}</p>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${policy.enforcement === "blocking" ? "border-green-800/50 bg-green-950/20 text-green-400" : "border-gray-700 bg-[#080C14] text-gray-600"}`}>
                      {policy.enforcement === "blocking" ? "Blocking" : policy.enforcement}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{policy.rule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live execution block */}
      <div className="mb-6 rounded-xl border border-red-900/30 bg-red-950/10 p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
          Live Execution Globally Disabled
        </p>
        <p className="text-xs text-red-400/80 leading-relaxed">
          No AI system in the Troptions platform can execute live AI inference in the current phase.
          Live execution requires: Control Hub approval, completed legal review, completed data review,
          healthcare compliance review (if applicable), and explicit Troptions platform activation.
          This restriction applies to all namespaces, including {ns.displayName}.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/troptions-cloud/${namespace}/sovereign-ai`}
          className="rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-2 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
        >
          AI Systems
        </Link>
        <Link
          href={`/troptions-cloud/${namespace}/model-router`}
          className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:border-gray-700 transition-colors"
        >
          Model Router
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
