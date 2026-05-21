import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { SOVEREIGN_AI_SYSTEMS, SOVEREIGN_AI_TEMPLATES, getVerticalLabel } from "@/content/troptions-ai/sovereignAiRegistry";
import SovereignAiSystemCard from "@/components/troptions-ai/SovereignAiSystemCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function NamespaceSovereignAiPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  const systems = SOVEREIGN_AI_SYSTEMS.filter((s) => s.namespaceId === ns.id);
  const templateCount = SOVEREIGN_AI_TEMPLATES.length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          Sovereign AI
        </p>
        <h1 className="text-2xl font-bold text-white">{ns.displayName} — AI Systems</h1>
        <p className="mt-1 text-sm text-gray-500">
          Client-specific AI systems for the <span className="font-mono text-gray-400">{ns.slug}</span> namespace.
          All systems are simulation-only. Control Hub approval required before production activation.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "AI Systems", value: systems.length.toString() },
          { label: "Templates", value: templateCount.toString() },
          { label: "Live Execution", value: "Disabled" },
          { label: "Status", value: "Simulation" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Systems list */}
      {systems.length === 0 ? (
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-8 text-center">
          <p className="mb-2 text-sm font-semibold text-white">No AI systems yet for this namespace</p>
          <p className="mb-4 text-xs text-gray-500">
            Build your first Sovereign AI system from one of {templateCount} templates.
          </p>
          <Link
            href={`/troptions-cloud/${namespace}/sovereign-ai/new`}
            className="inline-block cursor-not-allowed pointer-events-none rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs text-gray-600"
            aria-disabled="true"
            tabIndex={-1}
          >
            New AI System — Simulation Only
          </Link>
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <SovereignAiSystemCard key={system.id} system={system} namespaceSlug={namespace} />
          ))}
        </div>
      )}

      {/* Template explorer link */}
      <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          {templateCount} Templates Available
        </p>
        <p className="mb-3 text-sm text-gray-400">
          Browse all Troptions Sovereign AI templates to find the right starting point for your namespace.
        </p>
        <div className="flex flex-wrap gap-2">
          {["media_production", "healthcare_admin", "real_estate_diligence", "business_growth", "legal_compliance"].map((vertical) => (
            <span key={vertical} className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-500">
              {getVerticalLabel(vertical as Parameters<typeof getVerticalLabel>[0])}
            </span>
          ))}
          <span className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-500">
            +7 more verticals
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href="/troptions-ai/templates"
            className="rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-2 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          >
            Browse Templates
          </Link>
          <Link
            href={`/troptions-cloud/${namespace}/sovereign-ai/new`}
            className="cursor-not-allowed pointer-events-none rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs text-gray-600"
            aria-disabled="true"
            tabIndex={-1}
          >
            Build AI System — Simulation Only
          </Link>
        </div>
      </div>
    </div>
  );
}
