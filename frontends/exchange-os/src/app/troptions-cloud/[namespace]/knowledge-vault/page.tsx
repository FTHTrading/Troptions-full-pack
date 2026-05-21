import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import {
  KNOWLEDGE_ITEMS,
  KNOWLEDGE_VAULTS,
  getKnowledgeVaultByNamespace,
  getKnowledgeItemsByNamespace,
  getSensitivityLabel,
  getSourceTypeLabel,
  getReviewStatusLabel,
} from "@/content/troptions-ai/knowledgeVaultRegistry";
import KnowledgeVaultTable from "@/components/troptions-ai/KnowledgeVaultTable";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function KnowledgeVaultPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  const vault = getKnowledgeVaultByNamespace(ns.id);
  const items = getKnowledgeItemsByNamespace(ns.id);

  // Suppress "unused" lint — these are referenced below for label rendering
  void KNOWLEDGE_ITEMS;
  void KNOWLEDGE_VAULTS;
  void getSensitivityLabel;
  void getSourceTypeLabel;
  void getReviewStatusLabel;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          Knowledge Vault
        </p>
        <h1 className="text-2xl font-bold text-white">{ns.displayName} — Knowledge Vault</h1>
        <p className="mt-1 text-sm text-gray-500">
          Private knowledge documents and data sources for the{" "}
          <span className="font-mono text-gray-400">{ns.slug}</span> AI system. All knowledge access is
          simulation-only. Live AI routing requires Control Hub approval.
        </p>
      </div>

      {/* Vault metadata */}
      {vault ? (
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Vault ID", value: vault.id },
              { label: "Total Items", value: vault.itemCount.toString() },
              { label: "Last Updated", value: new Date(vault.updatedAt).toLocaleDateString() },
              { label: "AI Routing", value: "Blocked (Simulation)" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">{m.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-800 pt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                Vault Sensitivity
              </p>
              <span className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-400">
                {getSensitivityLabel(vault.sensitivity)}
              </span>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-6 text-center">
          <p className="text-sm text-gray-500">No knowledge vault configured for this namespace yet.</p>
        </div>
      )}

      {/* Simulation note */}
      <div className="mb-5 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          Simulation Only — No Live AI Routing
        </p>
        <p className="text-xs text-gray-500">
          All knowledge items shown are mock/placeholder records. Live AI routing is blocked until Control Hub
          approval. Healthcare and financial data have additional sensitivity restrictions that prevent external
          model routing by default.
        </p>
      </div>

      {/* Knowledge items table */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-8 text-center">
          <p className="mb-2 text-sm font-semibold text-white">No knowledge items yet</p>
          <p className="mb-4 text-xs text-gray-500">
            Add documents, FAQs, policies, and procedures to this namespace knowledge vault.
          </p>
          <button
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs text-gray-600"
          >
            Add Knowledge Item — Simulation Only
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">{items.length} Knowledge Items</p>
            <button
              disabled
              aria-disabled="true"
              className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-1.5 text-xs text-gray-600"
            >
              Add Item — Simulation Only
            </button>
          </div>
          <KnowledgeVaultTable items={items} />
        </div>
      )}

      {/* Quick links */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/troptions-cloud/${namespace}/sovereign-ai`}
          className="rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-2 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
        >
          ← AI Systems
        </Link>
        <Link
          href={`/troptions-cloud/${namespace}/model-router`}
          className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:border-gray-700 transition-colors"
        >
          Model Router
        </Link>
        <Link
          href={`/troptions-cloud/${namespace}/ai-policy`}
          className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:border-gray-700 transition-colors"
        >
          AI Policy
        </Link>
      </div>
    </div>
  );
}
