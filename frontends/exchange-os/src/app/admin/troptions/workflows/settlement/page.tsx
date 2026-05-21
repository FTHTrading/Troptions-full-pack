import { SETTLEMENT_READINESS } from "@/content/troptions/settlementReadiness";

export default function AdminSettlementWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Settlement Workflow</h1>
        <div className="space-y-3">
          {SETTLEMENT_READINESS.map((item) => (
            <div key={item.assetId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{item.assetId}</p>
              <p className="text-white font-semibold">{item.assetName}</p>
              <p className="text-slate-400 text-xs">{item.status} (score: {item.settlementScore})</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
