import { INVESTOR_READINESS } from "@/content/troptions/investorReadiness";

export default function AdminInvestorWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Investor Workflow</h1>
        <div className="space-y-3">
          {INVESTOR_READINESS.map((item) => (
            <div key={item.subjectId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{item.subjectId}</p>
              <p className="text-white font-semibold">{item.investorName}</p>
              <p className="text-slate-400 text-xs">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
