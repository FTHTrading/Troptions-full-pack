import { CLAIM_REGISTRY, getClaimsByType, getBlockedClaims } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

const merchantClaims = getClaimsByType("merchant-acceptance");
const paymentClaims = getClaimsByType("payment-utility");
const allMerchantRelated = [...merchantClaims, ...paymentClaims];

export default function MerchantNetworkPage() {
  const blocked = allMerchantRelated.filter((c) => c.publishStatus === "blocked");
  const allCountClaims = CLAIM_REGISTRY.filter(
    (c) => c.claimType === "merchant-acceptance" || c.claimType === "payment-utility",
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Merchant Network
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Merchant Network Claim Review</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            All Troptions Pay merchant-acceptance and payment-utility claims tracked in the claim registry.
            Merchant counts are inconsistent across platforms. Neither count is sourced, dated, or verified.
            All are blocked from institutional use until evidence requirements are met.
          </p>
          <div className="mt-6 flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{blocked.length}</div>
              <div className="text-slate-500 text-xs mt-1">Blocked Claims</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{allCountClaims.length}</div>
              <div className="text-slate-500 text-xs mt-1">Total Merchant Claims</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">0</div>
              <div className="text-slate-500 text-xs mt-1">Approved</div>
            </div>
          </div>
        </section>

        {/* Merchant Count Inconsistency Warning */}
        <section className="border border-red-800 bg-red-950/30 rounded-xl p-6">
          <p className="text-red-400 font-semibold text-sm mb-3">⚠ Merchant Count Inconsistency</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Troptions.org shows two conflicting merchant counts: <strong className="text-white">580,000</strong> and{" "}
            <strong className="text-white">480,000</strong>. Neither is sourced, dated, or verified. Both claims are
            blocked from institutional use. Reconciliation memo and provider confirmation are required.
          </p>
          <div className="flex gap-3 text-xs font-mono">
            <span className="bg-red-900 px-2 py-1 rounded text-red-300">CLAIM-MERCHANT-001: 580K</span>
            <span className="bg-red-900 px-2 py-1 rounded text-red-300">CLAIM-MERCHANT-002: 480K</span>
            <span className="bg-yellow-900 px-2 py-1 rounded text-yellow-300">Inconsistent — Blocked</span>
          </div>
        </section>

        {/* Evidence Requirements */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Evidence Required to Unblock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { item: "GivBux / Rail Provider Agreement", priority: "CRITICAL" },
              { item: "Merchant Count — Single Verified Source", priority: "CRITICAL" },
              { item: "Acceptance Date-Stamp", priority: "CRITICAL" },
              { item: "Geographic Coverage Disclosure", priority: "HIGH" },
              { item: "Excluded Merchant Categories", priority: "HIGH" },
              { item: "Acceptance Conditions Document", priority: "HIGH" },
              { item: "Reconciliation Memo (480K vs 580K)", priority: "CRITICAL" },
              { item: "MTL Status by Jurisdiction (Pay)", priority: "HIGH" },
            ].map((req) => (
              <div key={req.item} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{req.item}</span>
                <RiskBadge level={req.priority as "HIGH" | "CRITICAL" | "LOW" | "MEDIUM"} />
              </div>
            ))}
          </div>
        </section>

        {/* Claim Cards */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Merchant & Payment Claims</h2>
          <div className="space-y-6">
            {allMerchantRelated.map((claim) => (
              <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[#C9A84C] font-mono text-xs">{claim.id}</span>
                    <p className="text-slate-500 text-xs mt-1">{claim.sourcePage}</p>
                  </div>
                  <div className="flex gap-2">
                    <RiskBadge level={claim.riskLevel} />
                    <StatusBadge status={claim.publishStatus} size="sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Original Text</p>
                    <p className="text-white text-sm italic border-l-2 border-red-600 pl-3">&ldquo;{claim.originalText}&rdquo;</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Problem</p>
                    <p className="text-slate-400 text-sm">{claim.problemSummary}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Approved Replacement</p>
                    <p className="text-green-300 text-sm border-l-2 border-green-600 pl-3">{claim.approvedReplacementText}</p>
                  </div>
                  {claim.missingEvidence.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Missing Evidence ({claim.missingEvidence.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.missingEvidence.map((e) => (
                          <span key={e} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-slate-500">
                    <span className="text-[#C9A84C]">Next Action:</span> {claim.nextAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
