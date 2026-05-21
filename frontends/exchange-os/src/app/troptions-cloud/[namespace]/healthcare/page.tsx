import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Healthcare Workspace — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const HEALTHCARE_TOOLS = [
  { id: "hipaa-docs", label: "HIPAA Documentation Templates", description: "Access HIPAA compliance document templates for administrative use." },
  { id: "baa-builder", label: "BAA Builder (Scaffold)", description: "Scaffold Business Associate Agreement documents. Legal review required." },
  { id: "policy-library", label: "Healthcare Policy Library", description: "Browse healthcare administrative policy templates." },
  { id: "edu-library", label: "Healthcare Education Library", description: "Access general health education resources and materials. Not clinical guidance." },
  { id: "admin-forms", label: "Administrative Forms", description: "Standard healthcare administrative and intake form templates." },
];

export default async function HealthcareWorkspacePage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Healthcare Workspace</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Healthcare Workspace</h1>
          <p className="mt-2 text-sm text-gray-400">Administrative and educational tools only.</p>
        </div>

        {/* CRITICAL SAFETY DISCLAIMER — ALWAYS DISPLAYED */}
        <div className="mb-6 rounded-xl border-2 border-red-700/60 bg-red-900/15 p-5">
          <p className="text-sm font-bold text-red-400 uppercase tracking-[0.15em] mb-3">
            Critical Safety Notice
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-red-300">
              <span className="shrink-0 font-bold">✗</span>
              <span>No diagnosis or treatment recommendations. This platform does not provide medical diagnosis, clinical assessment, or treatment guidance.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-red-300">
              <span className="shrink-0 font-bold">✗</span>
              <span>No emergency guidance. For medical emergencies, call 911 or your local emergency number immediately.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-red-300">
              <span className="shrink-0 font-bold">✗</span>
              <span>No PHI storage. This platform does not store Protected Health Information (PHI) as defined by HIPAA.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-red-300">
              <span className="shrink-0 font-bold">✗</span>
              <span>Not a covered entity or business associate. A signed BAA is required before any covered entity may use any feature of this platform.</span>
            </li>
          </ul>
        </div>

        {/* HIPAA / BAA Notice */}
        <div className="mb-8 rounded-xl border border-orange-800/40 bg-orange-900/10 p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-1">HIPAA Compliance Requirement</p>
          <p className="text-xs text-orange-300/80 leading-relaxed">
            Healthcare industry users must have a signed Business Associate Agreement (BAA) on file before
            using any Troptions Cloud tools for covered healthcare operations. This workspace provides
            administrative templates and education resources only. No clinical workflow automation is provided.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">All healthcare workspace tools are non-functional in this phase.</p>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {HEALTHCARE_TOOLS.map((tool) => (
            <div key={tool.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-2">{tool.label}</h2>
              <p className="text-xs text-gray-400 flex-1 mb-4">{tool.description}</p>
              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-xs font-semibold text-gray-600"
              >
                Open — Simulation Only
              </button>
            </div>
          ))}
        </div>

        {/* Scope statement */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Scope of This Workspace</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            The Healthcare Workspace provides <strong className="text-white">administrative and educational resources only</strong>.
            Features include document templates, policy libraries, and educational materials.
            This workspace does not provide clinical decision support, electronic health records (EHR),
            medical billing, or any service that would constitute practicing medicine.
          </p>
        </div>
      </div>
    </div>
  );
}
