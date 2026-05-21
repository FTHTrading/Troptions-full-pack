import { PROOF_REGISTRY, getProofWorkflowStatus } from "@/content/troptions/proofRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

export default function ProofPackagesPage() {
  const withBlockers = PROOF_REGISTRY.filter((p) => p.exceptions.length > 0);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Proof Packages</p>
            <h1 className="text-3xl font-bold text-white">Proof Package Status</h1>
            <p className="text-slate-400 text-sm mt-1">
              {PROOF_REGISTRY.length} packages · {withBlockers.length} with open exceptions
            </p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        <div className="space-y-6">
          {PROOF_REGISTRY.map((proof) => {
            const wf = getProofWorkflowStatus(proof);
            return (
              <div key={proof.proofId} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[#C9A84C] font-mono text-xs">{proof.proofId}</span>
                    <h3 className="text-white font-bold text-lg mt-1">{proof.label}</h3>
                    <p className="text-slate-400 text-sm mt-1">{proof.description}</p>
                  </div>
                  <StatusBadge status={proof.currentStage} size="sm" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <p className="text-slate-500 uppercase mb-1">Proof Type</p>
                    <p className="text-slate-300">{proof.proofType}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase mb-1">Anchor Chain</p>
                    <p className="text-slate-300">{proof.anchorChain}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase mb-1">Hash Algorithm</p>
                    <p className="text-slate-300">{proof.hashAlgorithm}</p>
                  </div>
                  {proof.lastUpdated && (
                    <div>
                      <p className="text-slate-500 uppercase mb-1">Last Updated</p>
                      <p className="text-slate-300">{proof.lastUpdated}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-2">
                      Required Documents ({proof.requiredDocuments.length})
                    </p>
                    <ul className="space-y-1">
                      {proof.requiredDocuments.map((doc) => (
                        <li key={doc} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="text-red-400 mt-0.5">○</span> {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-2">Workflow Progress</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex gap-2">
                        <span className="text-slate-500">Current:</span>
                        <span className="text-yellow-400">{wf.currentStage}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500">Next:</span>
                        <span className="text-slate-300">{wf.nextStage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {wf.blockers.length > 0 && (
                  <div className="border-t border-slate-800 pt-3">
                    <p className="text-red-400 text-xs uppercase mb-2">Open Exceptions ({wf.blockers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {wf.blockers.map((b) => (
                        <span key={b} className="bg-red-950 border border-red-800 rounded px-2 py-0.5 text-red-300 text-xs">{b}</span>
                      ))}
                    </div>
                  </div>
                )}

                {proof.publishedReport && (
                  <div className="border-t border-slate-800 pt-3 mt-3">
                    <p className="text-slate-500 text-xs uppercase mb-1">Published Report</p>
                    <p className="text-[#C9A84C] text-xs">{proof.publishedReport}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
