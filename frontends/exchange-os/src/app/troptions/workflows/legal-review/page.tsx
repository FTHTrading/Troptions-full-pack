import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { LEGAL_WORKFLOW } from "@/content/troptions/legalWorkflow";

export default function LegalReviewWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Workflow - Legal Review</p>
          <h1 className="text-3xl font-bold">Troptions Legal Review Workflow</h1>
          <p className="text-slate-400 mt-2">Counsel assignment and filing/memo completion controls for claims, assets, and routes.</p>
        </section>

        <section className="space-y-3">
          {LEGAL_WORKFLOW.map((item) => (
            <div key={item.itemId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#C9A84C] text-xs font-mono">{item.itemId}</p>
                  <h2 className="text-white font-semibold">{item.subject}</h2>
                  <p className="text-slate-400 text-xs">Priority: {item.priority}</p>
                </div>
                <span className="text-xs uppercase text-slate-300">{item.status}</span>
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
