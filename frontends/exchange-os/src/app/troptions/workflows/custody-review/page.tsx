import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { CUSTODY_WORKFLOW } from "@/content/troptions/custodyWorkflow";

export default function CustodyReviewWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Workflow - Custody Review</p>
          <h1 className="text-3xl font-bold">Troptions Custody Review Workflow</h1>
          <p className="text-slate-400 mt-2">Custodian approval, agreement activation, and board custody gate checks.</p>
        </section>

        <section className="space-y-3">
          {CUSTODY_WORKFLOW.map((item) => (
            <div key={item.assetId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#C9A84C] text-xs font-mono">{item.assetId}</p>
                  <h2 className="text-white font-semibold">{item.assetName}</h2>
                  <p className="text-slate-400 text-xs">Custody status: {item.custodyStatus}</p>
                </div>
                <span className="text-xs uppercase text-slate-300">{item.custodianApproval ? "approved" : "blocked"}</span>
              </div>
              {item.blockers.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.blockers.map((blocker) => (
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
