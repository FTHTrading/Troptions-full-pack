import { RWA_PROVIDER_ADAPTERS } from "@/lib/troptions/rwa-adapters/providers";
import { getComplianceRecord } from "@/lib/troptions/rwa-adapters/compliance";
import { RWA_STATUS_LABELS, RWA_CATEGORY_LABELS, RWA_CAPABILITY_LABELS } from "@/lib/troptions/rwa-adapters/types";

export const metadata = { title: "RWA Provider Records — TROPTIONS Platform" };

export default function RwaProvidersPage() {
  const adapters = RWA_PROVIDER_ADAPTERS;

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

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — All adapters are reference-only. No execution enabled. Not official partnerships.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PLATFORM / RWA ADAPTERS
        </div>
        <h1 className="text-2xl font-bold text-white">RWA Provider Records</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Full provider adapter records — not official partnerships. Each shows allowed/blocked public language.
        </p>
      </div>

      <div className="space-y-6">
        {adapters.map((adapter) => {
          const compliance = getComplianceRecord(adapter.providerId);
          return (
            <div key={adapter.providerId} className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-bold text-white">{adapter.displayName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{RWA_CATEGORY_LABELS[adapter.category]}</div>
                  {adapter.officialReferenceUrl && (
                    <div className="text-xs text-blue-400/70 font-mono mt-0.5">{adapter.officialReferenceUrl}</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded px-2 py-0.5 text-xs border ${statusColors[adapter.currentTroptionsStatus]}`}>
                    {RWA_STATUS_LABELS[adapter.currentTroptionsStatus]}
                  </span>
                  <span className="text-xs text-gray-600 border border-gray-800 rounded px-2 py-0.5">
                    {RWA_CAPABILITY_LABELS[adapter.capabilityStatus]}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">{adapter.description}</p>

              {/* Asset Classes & Chains */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Asset Classes</div>
                  <div className="flex flex-wrap gap-1">
                    {adapter.supportedAssetClasses.map((a) => (
                      <span key={a} className="text-xs bg-[#080C14] border border-gray-800 rounded px-2 py-0.5 text-gray-400">
                        {a.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                {adapter.supportedChains.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Chains</div>
                    <div className="flex flex-wrap gap-1">
                      {adapter.supportedChains.map((c) => (
                        <span key={c} className="text-xs bg-[#080C14] border border-gray-800 rounded px-2 py-0.5 text-gray-400">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Allowed Public Language */}
              <div className="rounded bg-[#080C14] border border-[#C9A84C]/20 p-3 mb-3">
                <div className="text-xs text-[#C9A84C] uppercase tracking-wide mb-1">Approved Public Language</div>
                <div className="text-xs text-gray-300 leading-relaxed">{adapter.allowedPublicLanguage}</div>
              </div>

              {/* Blocked Language */}
              {adapter.blockedPublicLanguage.length > 0 && (
                <div className="rounded bg-[#080C14] border border-red-900/40 p-3 mb-3">
                  <div className="text-xs text-red-400 uppercase tracking-wide mb-1">Blocked Public Language</div>
                  <ul className="space-y-0.5">
                    {adapter.blockedPublicLanguage.map((bl, i) => (
                      <li key={i} className="text-xs text-red-300/60">— {bl}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compliance Note */}
              {compliance?.securitiesLawApplies && (
                <div className="rounded bg-[#080C14] border border-orange-900/40 p-3 mb-3">
                  <div className="text-xs text-orange-400 uppercase tracking-wide mb-1">Securities Law Applies</div>
                  <div className="text-xs text-orange-300/60">{compliance.notes}</div>
                </div>
              )}

              {/* Gate Status */}
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { label: "Contract", value: adapter.hasProviderContract },
                  { label: "Credentials", value: adapter.hasCredentials },
                  { label: "Legal Review", value: adapter.hasLegalReview },
                  { label: "Compliance", value: adapter.hasComplianceApproval },
                  { label: "Execution", value: false },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${value ? "bg-green-500" : "bg-red-700"}`} />
                    <span className="text-xs text-gray-500">{label}: {value ? "Yes" : "No"}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
