import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import {
  KNOWLEDGE_ITEMS,
  getSensitivityRule,
  getSensitivityLabel,
  getSourceTypeLabel,
  getReviewStatusLabel,
} from "@/content/troptions-ai/knowledgeVaultRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pairs: { namespace: string; itemId: string }[] = [];
  for (const ns of TROPTIONS_NAMESPACES) {
    const items = KNOWLEDGE_ITEMS.filter((item) => item.namespaceId === ns.id);
    for (const item of items) {
      pairs.push({ namespace: ns.slug, itemId: item.id });
    }
  }
  if (pairs.length === 0) {
    pairs.push({ namespace: "troptions", itemId: "ki-000" });
  }
  return pairs;
}

interface Props {
  params: Promise<{ namespace: string; itemId: string }>;
}

export default async function KnowledgeItemDetailPage({ params }: Props) {
  const { namespace, itemId } = await params;
  const ns = getNamespace(namespace);
  if (!ns) notFound();

  const item = KNOWLEDGE_ITEMS.find((i) => i.id === itemId && i.namespaceId === ns.id);
  if (!item) notFound();

  const sensitivityRule = getSensitivityRule(item.sensitivity);

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
        <Link href={`/troptions-cloud/${namespace}/knowledge-vault`} className="hover:text-gray-400 transition-colors">
          ← Knowledge Vault
        </Link>
        <span>/</span>
        <span className="text-gray-500 truncate">{item.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
          {getSourceTypeLabel(item.sourceType)}
        </p>
        <h1 className="text-2xl font-bold text-white">{item.title}</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl">{item.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Item details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Sensitivity", value: getSensitivityLabel(item.sensitivity) },
              { label: "Review Status", value: getReviewStatusLabel(item.reviewStatus) },
              { label: "Source Type", value: getSourceTypeLabel(item.sourceType) },
              { label: "Created", value: new Date(item.createdAt).toLocaleDateString() },
              { label: "Updated", value: new Date(item.updatedAt).toLocaleDateString() },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-800 bg-[#0F1923] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">{m.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allowed AI systems */}
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
              Allowed AI Systems
            </p>
            {item.allowedAiSystemIds.length === 0 ? (
              <p className="text-xs text-red-400">No AI systems are permitted to access this item.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {item.allowedAiSystemIds.map((id) => (
                  <span key={id} className="rounded border border-gray-800 bg-[#080C14] px-2 py-0.5 text-[10px] font-mono text-gray-400">
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sensitivity rule panel */}
        {sensitivityRule && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                Sensitivity Rules
              </p>
              <div className="space-y-2">
                {[
                  { label: "Live AI Routing", blocked: !sensitivityRule.allowLiveAiRouting },
                  { label: "Requires Review", blocked: sensitivityRule.requiresReview },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span className={rule.blocked ? "text-red-400" : "text-green-400"}>
                      {rule.blocked ? "✕" : "✓"}
                    </span>
                    <span className="text-xs text-gray-400">{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {sensitivityRule.blockedNote && (
              <div className="rounded-xl border border-yellow-800/40 bg-yellow-900/10 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500">
                  Blocked Note
                </p>
                <p className="text-xs text-yellow-600">{sensitivityRule.blockedNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
