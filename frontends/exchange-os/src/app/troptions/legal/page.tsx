import { LEGAL_REVIEW_QUEUE, getPendingReviewItems, getCriticalReviewItems } from "@/content/troptions/legalReviewQueue";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { RiskBadge, StatusBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Legal Review Queue — Troptions",
};

export default function LegalReviewPage() {
  const pending = getPendingReviewItems();
  const critical = getCriticalReviewItems();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Legal & Compliance</p>
          <h1 className="text-3xl font-bold text-white mt-2">Legal Review Queue</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {critical.length} critical items requiring immediate legal action. {pending.length} total pending.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="master" />

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Items", value: LEGAL_REVIEW_QUEUE.length, color: "text-white" },
            { label: "Critical", value: critical.length, color: "text-red-500" },
            { label: "Pending", value: pending.length, color: "text-yellow-400" },
            { label: "Completed", value: LEGAL_REVIEW_QUEUE.filter((i) => i.status === "approved").length, color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* All Items */}
        <div className="space-y-4">
          {LEGAL_REVIEW_QUEUE.map((item) => (
            <div
              key={item.itemId}
              className={`border rounded-lg p-5 ${
                item.priority === "CRITICAL"
                  ? "bg-red-950/20 border-red-800/40"
                  : "bg-[#0D1B2A] border-[#C9A84C]/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-xs">{item.itemId}</span>
                  <RiskBadge level={item.priority} />
                  <StatusBadge status={item.status === "pending" ? "pending" : item.status} label={item.status} size="sm" />
                </div>
              </div>
              <h3 className="text-white font-semibold">{item.subject}</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed mb-3">{item.description}</p>
              <div className="bg-[#0D1B2A]/60 rounded p-3 mb-3">
                <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-mono mb-1">Notes</p>
                <p className="text-slate-300 text-xs">{item.notes}</p>
              </div>
              {item.linkedIds.length > 0 && (
                <div>
                  <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono mb-1">Linked Items</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.linkedIds.map((b, i) => (
                      <span key={i} className="text-xs bg-red-950/30 border border-red-800/30 text-red-300 rounded px-2 py-0.5 font-mono">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-slate-500 text-xs mt-3">Counsel: <span className="text-slate-400">{item.assignedCounsel ?? "Unassigned"}</span></p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
