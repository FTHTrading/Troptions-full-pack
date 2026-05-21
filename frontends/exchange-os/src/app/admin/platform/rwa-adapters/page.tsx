import Link from "next/link";
import { generateRwaRegistryReport, getAllRwaReadinessScores } from "@/lib/troptions/rwa-adapters/readiness";
import { getHighRegulatoryRiskProviders } from "@/lib/troptions/rwa-adapters/compliance";
import { getRwaEvidenceGapSummary } from "@/lib/troptions/rwa-adapters/evidence";
import { RWA_STATUS_LABELS, RWA_CATEGORY_LABELS } from "@/lib/troptions/rwa-adapters/types";

export const metadata = { title: "RWA Adapter Registry — TROPTIONS Platform" };

export default function RwaAdaptersPage() {
  const registry = generateRwaRegistryReport();
  const scores = getAllRwaReadinessScores();
  const highRisk = getHighRegulatoryRiskProviders();
  const evidenceGap = getRwaEvidenceGapSummary();

  const statusColors: Record<string, string> = {
    reference_only: "text-gray-400 border-gray-700",
    research_only: "text-gray-500 border-gray-700",
    design_ready: "text-blue-400 border-blue-800/50",
    legal_review_required: "text-orange-400 border-orange-800/50",
    provider_contract_required: "text-yellow-400 border-yellow-800/50",
    credentials_required: "text-purple-400 border-purple-800/50",
    sandbox_ready: "text-teal-400 border-teal-800/50",
    production_ready: "text-green-400 border-green-800/50",
    disabled: "text-gray-600 border-gray-800",
    blocked: "text-red-400 border-red-900/60",
  };

  const navCards = [
    { label: "All Providers", href: "/admin/platform/rwa-adapters/providers", description: "Full provider table with status, claims, credentials" },
    { label: "Readiness Scores", href: "/admin/platform/rwa-adapters/readiness", description: "Per-adapter readiness scoring and blockers" },
    { label: "Compliance Registry", href: "/admin/platform/rwa-adapters/compliance", description: "Regulatory status and compliance requirements" },
  ];

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — All RWA adapters are reference-only. No execution is enabled.
        These are not official partnerships unless signed provider contracts exist.
      </div>

      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PLATFORM
        </div>
        <h1 className="text-2xl font-bold text-white">RWA Provider Adapter Registry</h1>
        <p className="mt-2 text-gray-400 text-sm max-w-3xl">
          TROPTIONS is building provider-neutral readiness for real-world asset, tokenized treasury,
          onchain credit, and institutional asset infrastructure. Third-party products, custody,
          execution, and settlement require approved provider relationships, credentials,
          compliance review, and legal approval.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Adapters</div>
          <div className="text-3xl font-bold text-white">{registry.totalAdapters}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reference Only</div>
          <div className="text-3xl font-bold text-gray-400">{registry.referenceOnlyCount}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contract Required</div>
          <div className="text-3xl font-bold text-yellow-400">{registry.providerContractRequiredCount}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Legal Review Required</div>
          <div className="text-3xl font-bold text-orange-400">{registry.legalReviewRequiredCount}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Production Ready</div>
          <div className="text-3xl font-bold text-green-400">{registry.productionReadyCount}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">High Regulatory Risk</div>
          <div className="text-3xl font-bold text-red-400">{highRisk.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Evidence Gaps</div>
          <div className="text-3xl font-bold text-orange-300">{evidenceGap.missing}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Critical Evidence Gaps</div>
          <div className="text-3xl font-bold text-red-300">{evidenceGap.criticalGaps.length}</div>
        </div>
      </div>

      {/* Claim Warning */}
      <div className="rounded-lg border border-red-800/60 bg-red-900/20 p-5 mb-8">
        <div className="text-sm font-semibold text-red-400 mb-2">Critical Claim Rules — All Enforced</div>
        <ul className="space-y-1 text-xs text-red-300/80">
          <li>— No RWA adapter may claim production_ready without provider contract, credentials, legal review, AND compliance approval.</li>
          <li>— No adapter may claim execution_confirmed without real provider confirmation.</li>
          <li>— No adapter may claim TROPTIONS custody unless custody documents exist.</li>
          <li>— No adapter may claim asset backing unless title, custody, appraisal, audit, and legal evidence exist.</li>
          <li>— No adapter may claim public partnership unless a provider contract evidence record exists.</li>
        </ul>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg bg-[#0F1923] border border-gray-800 p-5 hover:border-[#C9A84C]/40 transition-colors"
          >
            <div className="text-sm font-semibold text-white mb-1">{card.label}</div>
            <div className="text-xs text-gray-500">{card.description}</div>
          </Link>
        ))}
      </div>

      {/* Provider Summary Table */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wide mb-3">
          All Provider Adapters
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-[#080C14] text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Contract</th>
                <th className="px-4 py-3 text-left">Legal</th>
                <th className="px-4 py-3 text-left">Execution</th>
              </tr>
            </thead>
            <tbody>
              {registry.adapters.map((adapter) => (
                <tr key={adapter.providerId} className="border-b border-gray-800/50 hover:bg-[#080C14]">
                  <td className="px-4 py-3 font-medium text-white">{adapter.displayName}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{RWA_CATEGORY_LABELS[adapter.category]}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs border ${statusColors[adapter.currentTroptionsStatus]}`}>
                      {RWA_STATUS_LABELS[adapter.currentTroptionsStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {adapter.hasProviderContract ? (
                      <span className="text-xs text-green-400">Present</span>
                    ) : adapter.requiredProviderContract ? (
                      <span className="text-xs text-red-400">Required</span>
                    ) : (
                      <span className="text-xs text-gray-600">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {adapter.hasLegalReview ? (
                      <span className="text-xs text-green-400">Reviewed</span>
                    ) : adapter.requiredLegalReview.length > 0 ? (
                      <span className="text-xs text-orange-400">Required</span>
                    ) : (
                      <span className="text-xs text-gray-600">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">Disabled</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Gap List */}
      {evidenceGap.criticalGaps.length > 0 && (
        <div className="rounded-lg bg-[#0F1923] border border-orange-800/50 p-5">
          <div className="text-sm font-semibold text-orange-400 mb-3">Critical Evidence Gaps</div>
          <ul className="space-y-1">
            {evidenceGap.criticalGaps.slice(0, 10).map((gap, i) => (
              <li key={i} className="text-xs text-orange-300/70">— {gap}</li>
            ))}
            {evidenceGap.criticalGaps.length > 10 && (
              <li className="text-xs text-gray-600">... and {evidenceGap.criticalGaps.length - 10} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
