import { CLAIM_REGISTRY, getClaimsByType } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

const goldClaims = CLAIM_REGISTRY.filter(
  (c) =>
    (c.claimType === "gold-backed" || c.claimType === "reserve") &&
    (c.id.startsWith("CLAIM-GOLD") || c.sourcePage?.toLowerCase().includes("gold")),
);

export default function GoldPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="asset" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Troptions.Gold
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions.Gold — Claim & Reserve Review</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            All gold-backing, reserve, redemption, and value-appreciation claims from Troptions.Gold marketing
            and whitepaper materials. Every claim tracked here is blocked pending documentation.
          </p>
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800 rounded-xl text-sm text-red-300">
            <strong>0 gold claims approved.</strong> All {goldClaims.length} gold-related claims are blocked.
            Custody agreement, reserve schedule, warehouse receipt, purity certificate, and Howey analysis are all missing.
          </div>
        </section>

        {/* Custody Requirements */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Required Documentation (0 of 8 complete)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { item: "Qualified Custodian Agreement", status: "missing" },
              { item: "Gold Reserve Schedule", status: "missing" },
              { item: "Warehouse Receipt(s)", status: "missing" },
              { item: "Purity Certificate(s)", status: "missing" },
              { item: "Independent Reserve Attestation", status: "missing" },
              { item: "Redemption Policy Document", status: "missing" },
              { item: "Legal Classification (Howey Analysis)", status: "missing" },
              { item: "Transfer Restrictions Policy", status: "missing" },
            ].map((doc) => (
              <div key={doc.item} className="bg-red-950/30 border border-red-800 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{doc.item}</span>
                <span className="text-red-400 text-xs font-semibold">MISSING</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Terms */}
        <section className="border border-yellow-800 bg-yellow-950/20 rounded-xl p-6">
          <p className="text-yellow-400 font-semibold text-sm mb-3">Prohibited Gold Claims</p>
          <p className="text-slate-400 text-xs mb-4">These phrases are banned from all Troptions.Gold marketing until documentation is complete:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "gold-backed",
              "fully reserved",
              "increases in value",
              "physical delivery",
              "redeemable for gold",
              "guaranteed by gold",
              "asset-backed",
              "store of value",
            ].map((term) => (
              <span key={term} className="bg-red-950 border border-red-800 px-3 py-1 rounded-full text-red-300 text-xs">{term}</span>
            ))}
          </div>
        </section>

        {/* Claim Cards */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Gold Claims Registry ({goldClaims.length})</h2>
          <div className="space-y-6">
            {goldClaims.map((claim) => (
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

                <div className="space-y-3">
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Original Text</p>
                    <p className="text-white text-sm italic border-l-2 border-red-600 pl-3">&ldquo;{claim.originalText}&rdquo;</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Problem</p>
                    <p className="text-slate-400 text-sm">{claim.problemSummary}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Approved Replacement</p>
                    <p className="text-green-300 text-sm border-l-2 border-green-600 pl-3">{claim.approvedReplacementText}</p>
                  </div>
                  {claim.missingEvidence.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Missing Evidence</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.missingEvidence.map((e) => (
                          <span key={e} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-[#C9A84C]">Next Action: {claim.nextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
