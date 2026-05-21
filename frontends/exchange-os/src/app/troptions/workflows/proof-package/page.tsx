import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { PROOF_WORKFLOW } from "@/content/troptions/proofWorkflow";

export default function ProofPackageWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Workflow - Proof Package</p>
          <h1 className="text-3xl font-bold">Troptions Proof Package Workflow</h1>
          <p className="text-slate-400 mt-2">Document ingestion, evidence checks, proof package readiness, and blocker resolution.</p>
        </section>

        <section className="space-y-3">
          {PROOF_WORKFLOW.map((proof) => (
            <div key={proof.proofId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#C9A84C] text-xs font-mono">{proof.proofId}</p>
                  <h2 className="text-white font-semibold">{proof.label}</h2>
                  <p className="text-slate-400 text-xs">{proof.currentStage} {"->"} {proof.nextStage}</p>
                </div>
                <span className="text-xs uppercase text-slate-300">{proof.status}</span>
              </div>
              {proof.missingEvidence.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proof.missingEvidence.map((blocker) => (
                    <span key={blocker} className="text-xs bg-red-950 border border-red-800 px-2 py-0.5 rounded">{blocker}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
