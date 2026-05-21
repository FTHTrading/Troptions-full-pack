import { getClaimsMissingEvidence } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { RiskBadge, StatusBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

const claims = getClaimsMissingEvidence();

export default function MissingEvidencePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Claims</p>
            <h1 className="text-3xl font-bold text-white">Claims With Missing Evidence</h1>
            <p className="text-slate-400 text-sm mt-1">{claims.length} claim(s) have one or more missing evidence items.</p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        {claims.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
            All claims have complete evidence. Nothing missing.
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[#C9A84C] font-mono text-xs">{claim.id}</span>
                    <p className="text-slate-400 text-xs mt-0.5">{claim.sourcePage}</p>
                    <p className="text-white text-sm mt-2 italic line-clamp-2">&ldquo;{claim.originalText}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <RiskBadge level={claim.riskLevel} />
                    <StatusBadge status={claim.publishStatus} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase mb-2">Missing Evidence ({claim.missingEvidence.length} items)</p>
                  <div className="flex flex-wrap gap-2">
                    {claim.missingEvidence.map((item) => (
                      <span key={item} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[#C9A84C] text-xs mt-3">Next: {claim.nextAction}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
