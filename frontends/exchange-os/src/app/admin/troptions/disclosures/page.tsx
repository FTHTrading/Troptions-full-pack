import { LEGAL_REVIEW_QUEUE, getCriticalReviewItems, getPendingReviewItems } from "@/content/troptions/legalReviewQueue";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

const critical = getCriticalReviewItems();
const pending = getPendingReviewItems();

const priorityColors: Record<string, string> = {
  CRITICAL: "text-red-400",
  HIGH: "text-orange-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-slate-400",
};

export default function AdminDisclosuresPage() {
  const grouped = {
    CRITICAL: LEGAL_REVIEW_QUEUE.filter((i) => i.priority === "CRITICAL"),
    HIGH: LEGAL_REVIEW_QUEUE.filter((i) => i.priority === "HIGH"),
    MEDIUM: LEGAL_REVIEW_QUEUE.filter((i) => i.priority === "MEDIUM"),
    LOW: LEGAL_REVIEW_QUEUE.filter((i) => i.priority === "LOW"),
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Disclosures</p>
            <h1 className="text-3xl font-bold text-white">Legal Review Queue</h1>
            <p className="text-slate-400 text-sm mt-1">
              {critical.length} CRITICAL · {pending.length} pending · {LEGAL_REVIEW_QUEUE.length} total items
            </p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((priority) => {
          const items = grouped[priority];
          if (items.length === 0) return null;
          return (
            <section key={priority}>
              <h2 className={`text-lg font-bold mb-4 ${priorityColors[priority]}`}>
                {priority} Priority ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.itemId} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[#C9A84C] font-mono text-xs">{item.itemId}</span>
                        <span className="text-slate-500 text-xs ml-3">{item.category}</span>
                        <p className="text-white font-semibold text-sm mt-1">{item.subject}</p>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                      <div>
                        <span className="uppercase">Counsel: </span>
                        <span className="text-slate-300">{item.assignedCounsel ?? "Unassigned"}</span>
                      </div>
                      <div>
                        <span className="uppercase">Target: </span>
                        <span className="text-slate-300">{item.targetCompletionDate ?? "Not set"}</span>
                      </div>
                      {item.filingOrMemo && (
                        <div className="col-span-2">
                          <span className="uppercase">Filing/Memo: </span>
                          <span className="text-slate-300">{item.filingOrMemo}</span>
                        </div>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-slate-500 text-xs mt-2 border-t border-slate-800 pt-2">{item.notes}</p>
                    )}
                    {item.linkedIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.linkedIds.map((id) => (
                          <span key={id} className="bg-slate-800 rounded px-2 py-0.5 text-slate-400 text-xs">{id}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
