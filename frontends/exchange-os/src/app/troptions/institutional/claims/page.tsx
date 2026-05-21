import { CLAIM_REGISTRY, getBlockedClaims, getCriticalClaims, getHighRiskClaims, getClaimsMissingEvidence } from "@/content/troptions/claimRegistry";
import { ClaimAuditTable } from "@/components/troptions/ClaimAuditTable";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Claim Audit — Troptions Institutional",
  description: "Audit of all public Troptions advertising claims with risk analysis and institutional rewrites.",
};

export default function ClaimAuditPage() {
  const blocked = getBlockedClaims();
  const critical = getCriticalClaims();
  const high = getHighRiskClaims();
  const missingEvidence = getClaimsMissingEvidence();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Institutional Claim Audit</p>
          <h1 className="text-3xl font-bold text-white mt-2">Public Claim Review</h1>
          <p className="text-gray-400 mt-2 text-sm">Every public advertising claim catalogued with risk level, missing evidence, and publish status.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="master" />

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Claims", value: CLAIM_REGISTRY.length, color: "text-white" },
            { label: "Blocked", value: blocked.length, color: "text-red-400" },
            { label: "Critical Risk", value: critical.length, color: "text-red-500" },
            { label: "Missing Evidence", value: missingEvidence.length, color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Critical Claims */}
        {critical.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
              Critical Risk Claims — Blocked
            </h2>
            <div className="space-y-4">
              {critical.map((claim) => (
                <div key={claim.id} className="bg-red-950/20 border border-red-800/40 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-500 font-mono text-xs">{claim.id}</span>
                    <RiskBadge level={claim.riskLevel} />
                    <StatusBadge status={claim.publishStatus} size="sm" />
                  </div>
                  <p className="text-slate-300 text-sm italic mb-3">&ldquo;{claim.originalText}&rdquo;</p>
                  <div className="bg-[#0D1B2A]/60 rounded p-3 mb-3">
                    <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-mono mb-1">Institutional Rewrite</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{claim.approvedReplacementText}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono mb-1">Missing Evidence</p>
                    <ul className="list-disc list-inside text-slate-400 text-xs space-y-0.5">
                      {claim.missingEvidence.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Claims Table */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">All Registered Claims</h2>
          <ClaimAuditTable claims={CLAIM_REGISTRY} />
        </section>
      </div>
    </main>
  );
}
