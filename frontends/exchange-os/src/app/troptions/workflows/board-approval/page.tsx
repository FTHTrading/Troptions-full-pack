import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { BOARD_APPROVAL_WORKFLOW } from "@/content/troptions/boardApprovalWorkflow";

export default function BoardApprovalWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Workflow - Board Approval</p>
          <h1 className="text-3xl font-bold">Troptions Board Approval Workflow</h1>
          <p className="text-slate-400 mt-2">Board sign-off gates for assets and funding routes before operational release.</p>
        </section>
        <section className="space-y-3">
          {BOARD_APPROVAL_WORKFLOW.map((item) => (
            <div key={item.subjectId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#C9A84C] text-xs font-mono">{item.subjectId}</p>
                  <h2 className="text-white font-semibold">{item.name}</h2>
                  <p className="text-slate-400 text-xs">{item.subjectType}</p>
                </div>
                <span className="text-xs uppercase text-slate-300">{item.status}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
