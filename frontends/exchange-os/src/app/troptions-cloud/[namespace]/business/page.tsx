import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Business Workspace — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const BUSINESS_TOOLS = [
  { id: "proposal-builder", label: "Proposal Builder", description: "Build and manage business proposals for Troptions partnerships." },
  { id: "document-vault", label: "Document Vault", description: "Securely store and organize business documents." },
  { id: "contract-templates", label: "Contract Templates", description: "Access Troptions-standard contract and agreement templates." },
  { id: "nda-builder", label: "NDA Builder", description: "Generate non-disclosure agreements for business engagements." },
  { id: "directory", label: "Business Directory", description: "List and discover Troptions-affiliated businesses." },
  { id: "opportunity-room", label: "Opportunity Room", description: "Access requires individual legal eligibility review." },
];

export default async function BusinessWorkspacePage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Business Workspace</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Business Workspace</h1>
          <p className="mt-2 text-sm text-gray-400">
            Business tools, proposals, documents, and Troptions partnership resources.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">All business tools are non-functional in this phase.</p>
        </div>

        {/* Opportunity Room Disclaimer */}
        <div className="mb-8 rounded-xl border border-orange-800/40 bg-orange-900/10 p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-1">Opportunity Room Notice</p>
          <p className="text-xs text-orange-300/80 leading-relaxed">
            Access to the Opportunity Room requires individual legal eligibility review.
            Membership does not guarantee access to investment opportunities.
            No investment, return, yield, or profit is promised or implied.
          </p>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BUSINESS_TOOLS.map((tool) => (
            <div key={tool.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-2">{tool.label}</h2>
              <p className="text-xs text-gray-400 flex-1 mb-4">{tool.description}</p>
              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-xs font-semibold text-gray-600"
              >
                {tool.id === "opportunity-room" ? "Requires Legal Review — Simulation Only" : "Open — Simulation Only"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
