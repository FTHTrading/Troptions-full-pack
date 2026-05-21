import { PROOF_WORKFLOW } from "@/content/troptions/proofWorkflow";

export default function AdminProofWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Proof Workflow</h1>
        <div className="space-y-3">
          {PROOF_WORKFLOW.map((item) => (
            <div key={item.proofId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{item.proofId}</p>
              <p className="text-white font-semibold">{item.label}</p>
              <p className="text-slate-400 text-xs">{item.currentStage} {"->"} {item.nextStage}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
