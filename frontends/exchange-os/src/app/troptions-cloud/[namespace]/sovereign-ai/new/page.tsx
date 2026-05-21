import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { SOVEREIGN_AI_TEMPLATES, getVerticalLabel, getRiskLevelLabel } from "@/content/troptions-ai/sovereignAiRegistry";
import ClientAiOnboardingChecklist from "@/components/troptions-ai/ClientAiOnboardingChecklist";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function NewSovereignAiPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
          <Link href={`/troptions-cloud/${namespace}/sovereign-ai`} className="hover:text-gray-400 transition-colors">
            ← Sovereign AI
          </Link>
        </div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          New AI System
        </p>
        <h1 className="text-2xl font-bold text-white">Build a Troptions AI System</h1>
        <p className="mt-1 text-sm text-gray-500">
          Define your client-specific AI system for the{" "}
          <span className="font-mono text-gray-400">{ns.slug}</span> namespace.
          All configuration is simulation-only until Control Hub approval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Onboarding checklist */}
        <div>
          <ClientAiOnboardingChecklist />
        </div>

        {/* Template selection */}
        <div>
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
              Choose a Starting Template
            </p>
            <h3 className="mb-4 text-sm font-semibold text-white">
              {SOVEREIGN_AI_TEMPLATES.length} Templates Available
            </h3>

            <div className="space-y-2">
              {SOVEREIGN_AI_TEMPLATES.slice(0, 6).map((template) => (
                <div
                  key={template.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#080C14] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{template.name}</p>
                    <p className="text-[10px] text-gray-600">{getVerticalLabel(template.vertical)} · {getRiskLevelLabel(template.riskLevel)} Risk</p>
                  </div>
                  <button
                    disabled
                    aria-disabled="true"
                    className="cursor-not-allowed shrink-0 rounded border border-gray-700 bg-[#080C14] px-2 py-1 text-[10px] text-gray-600"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <Link
                href="/troptions-ai/templates"
                className="text-xs text-[#C9A84C] hover:underline"
              >
                View all {SOVEREIGN_AI_TEMPLATES.length} templates →
              </Link>
            </div>
          </div>

          {/* Approval gate note */}
          <div className="mt-4 rounded-xl border border-yellow-800/40 bg-yellow-900/10 p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500">
              Control Hub Approval Required
            </p>
            <p className="text-xs text-yellow-600">
              All new AI systems require Control Hub review and approval before activation. This form
              collects your system requirements for the review process. No live AI systems are created
              in simulation phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
