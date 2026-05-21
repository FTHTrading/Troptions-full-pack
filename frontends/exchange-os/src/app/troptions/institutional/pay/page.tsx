import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

const payClaims = CLAIM_REGISTRY.filter(
  (c) =>
    c.id === "CLAIM-MERCHANT-001" ||
    c.id === "CLAIM-MERCHANT-002" ||
    c.id === "CLAIM-PAY-001",
);

export default function PayPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Troptions Pay
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Pay — Payment Rail & Merchant Claims</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Troptions Pay claim review covering merchant acceptance counts, payment rail availability,
            and instant-payment utility claims. All are blocked pending rail provider agreement and verified merchant data.
          </p>
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800 rounded-xl text-sm text-red-300">
            <strong>{payClaims.length} Pay-related claims registered. 0 approved.</strong> GivBux agreement and MTL
            status are required before any payment-rail claims can be published.
          </div>
        </section>

        {/* Payment Rail Requirements */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Payment Rail Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { item: "GivBux / Rail Provider Agreement (signed)", priority: "CRITICAL" },
              { item: "Money Transmitter License (MTL) by Jurisdiction", priority: "CRITICAL" },
              { item: "Acceptance Geography Map", priority: "HIGH" },
              { item: "Excluded Merchant Categories (documentation)", priority: "HIGH" },
              { item: "Single Verified Merchant Count with Source + Date", priority: "CRITICAL" },
              { item: "Reconciliation Memo (480K vs 580K)", priority: "CRITICAL" },
              { item: "Transaction Confirmation Flow", priority: "HIGH" },
              { item: "Fee Disclosure (all-in costs to merchants)", priority: "HIGH" },
            ].map((req) => (
              <div key={req.item} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{req.item}</span>
                <RiskBadge level={req.priority as "HIGH" | "CRITICAL" | "LOW" | "MEDIUM"} />
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Terms */}
        <section className="border border-red-800 bg-red-950/20 rounded-xl p-5">
          <p className="text-red-400 font-semibold text-sm mb-3">Prohibited Pay Claims</p>
          <div className="flex flex-wrap gap-2">
            {[
              "instant borderless payments",
              "accepted everywhere",
              "guaranteed acceptance",
              "580,000 locations",
              "480,000 locations",
              "works worldwide",
              "no restrictions",
            ].map((term) => (
              <span key={term} className="bg-red-950 border border-red-800 px-3 py-1 rounded-full text-red-300 text-xs">{term}</span>
            ))}
          </div>
        </section>

        {/* Claim Cards */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Pay & Merchant Claims ({payClaims.length})</h2>
          <div className="space-y-6">
            {payClaims.map((claim) => (
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
