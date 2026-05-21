import { PROOF_REGISTRY, getProofWorkflowStatus } from "@/content/troptions/proofRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Proof of Funds / Reserves / Control — Troptions",
  description: "Proof workflow status for all Troptions assets.",
};

export default function ProofPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Institutional Proof Layer</p>
          <h1 className="text-3xl font-bold text-white mt-2">Proof Registry</h1>
          <p className="text-gray-400 mt-2 text-sm">All proof types with current workflow stage, blockers, and next action.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="master" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROOF_REGISTRY.map((proof) => {
            const workflowStatus = getProofWorkflowStatus(proof);
            return (
              <div key={proof.proofId} className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest">{proof.proofId}</p>
                    <h3 className="text-white font-semibold mt-0.5">{proof.label}</h3>
                  </div>
                  <StatusBadge status={proof.currentStage} />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{proof.description}</p>

                {/* Workflow Progress */}
                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">Workflow Stage</p>
                  <p className="text-slate-300 text-sm">{workflowStatus.currentStage}</p>
                  {workflowStatus.nextStage && (
                    <p className="text-slate-500 text-xs mt-1">Next: {workflowStatus.nextStage}</p>
                  )}
                </div>

                {/* Blockers */}
                {workflowStatus.blockers.length > 0 && (
                  <div className="bg-red-950/20 border border-red-800/30 rounded p-3">
                    <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono mb-1">Blockers</p>
                    <ul className="list-disc list-inside text-red-300 text-xs space-y-0.5">
                      {workflowStatus.blockers.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}

                {/* Required Documents */}
                <div className="mt-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1.5">Required Documents</p>
                  <ul className="list-disc list-inside text-slate-400 text-xs space-y-0.5">
                    {proof.requiredDocuments.map((doc, i) => <li key={i}>{doc}</li>)}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
