import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { EXCEPTION_REGISTRY } from "@/content/troptions/exceptionRegistry";

export default function ExceptionManagementWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Workflow - Exceptions</p>
          <h1 className="text-3xl font-bold">Troptions Exception Management Workflow</h1>
          <p className="text-slate-400 mt-2">No approval may proceed while linked exceptions remain open.</p>
        </section>
        <section className="space-y-3">
          {EXCEPTION_REGISTRY.map((item) => (
            <div key={item.exceptionId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#C9A84C] text-xs font-mono">{item.exceptionId}</p>
                  <h2 className="text-white font-semibold">{item.subjectId}</h2>
                  <p className="text-slate-400 text-xs">{item.description}</p>
                </div>
                <span className="text-xs uppercase text-slate-300">{item.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.blockers.map((blocker) => (
                  <span key={blocker} className="text-xs bg-red-950 border border-red-800 px-2 py-0.5 rounded">{blocker}</span>
                ))}
              </div>
              <p className="text-xs text-yellow-400 mt-3">Next Action: {item.nextAction}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
