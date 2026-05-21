import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

const unityClaims = CLAIM_REGISTRY.filter(
  (c) =>
    c.id === "CLAIM-UNITY-001" ||
    c.id === "CLAIM-UNITY-002" ||
    c.id === "CLAIM-STABLE-001" ||
    c.sourcePage?.toLowerCase().includes("unity"),
);

export default function UnityPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="stable" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Troptions Unity
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Unity — Stable & Humanitarian Claim Review</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Troptions Unity is a Solana-based token. Stable-value claims, asset-backed claims, and
            humanitarian-impact claims tracked in the registry. All are blocked until reserve documentation,
            governance controls, and legal classification are complete.
          </p>
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800 rounded-xl text-sm text-red-300">
            <strong>Critical:</strong> Troptions Unity is NOT confirmed as a stablecoin. Stable-value claims
            require reserve proof, redemption policy, and stablecoin legal classification memo before any use.
          </div>
        </section>

        {/* Not a Stablecoin Panel */}
        <section className="border border-orange-800 bg-orange-950/20 rounded-xl p-6">
          <p className="text-orange-400 font-semibold text-sm mb-3">⚠ Stable-Value Designation Not Confirmed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-2">Required Before Any Stable Claims</p>
              <ul className="space-y-1 text-slate-400">
                <li>• Reserve schedule (full backing)</li>
                <li>• Custodian agreement (reserve custody)</li>
                <li>• Independent reserve attestation</li>
                <li>• Redemption policy document</li>
                <li>• Stablecoin legal classification memo</li>
                <li>• Regulatory analysis (jurisdiction)</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-2">Status</p>
              <ul className="space-y-1 text-red-400">
                <li>• Reserve schedule: <span className="font-bold">MISSING</span></li>
                <li>• Custodian agreement: <span className="font-bold">MISSING</span></li>
                <li>• Reserve attestation: <span className="font-bold">MISSING</span></li>
                <li>• Redemption policy: <span className="font-bold">MISSING</span></li>
                <li>• Legal classification: <span className="font-bold">NOT STARTED</span></li>
                <li>• Regulatory analysis: <span className="font-bold">NOT STARTED</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Humanitarian Impact Panel */}
        <section className="border border-yellow-800 bg-yellow-950/20 rounded-xl p-6">
          <p className="text-yellow-400 font-semibold text-sm mb-3">Humanitarian Impact Claims — Blocked</p>
          <p className="text-slate-400 text-sm mb-4">
            Claims that &ldquo;every transaction funds humanitarian causes&rdquo; require a confirmed beneficiary organization,
            use-of-proceeds policy, donation confirmation mechanism, and governance controls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { item: "Beneficiary Organization (confirmed)", status: "MISSING" },
              { item: "Use-of-Proceeds Policy", status: "MISSING" },
              { item: "Transaction → Donation Mechanism", status: "MISSING" },
            ].map((doc) => (
              <div key={doc.item} className="bg-yellow-950/30 border border-yellow-800 rounded-lg px-3 py-2 text-xs">
                <p className="text-slate-300">{doc.item}</p>
                <p className="text-red-400 font-bold mt-1">{doc.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Terms */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Prohibited Unity Claims</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "stable token",
              "stable value",
              "asset-backed",
              "maintains value",
              "stablecoin",
              "every transaction funds charity",
              "guaranteed humanitarian impact",
            ].map((term) => (
              <span key={term} className="bg-red-950 border border-red-800 px-3 py-1 rounded-full text-red-300 text-xs">{term}</span>
            ))}
          </div>
        </section>

        {/* Claim Cards */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Unity Claims ({unityClaims.length})</h2>
          <div className="space-y-6">
            {unityClaims.map((claim) => (
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
