import { getMockHistoryTimeline, getApprovedPublicHistory } from "@/lib/troptions/proof-room/history";

export const metadata = { title: "History Timeline — TROPTIONS Proof Room" };

export default function HistoryPage() {
  const all = getMockHistoryTimeline();
  const approved = getApprovedPublicHistory(all);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — History records are pending full verification review.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">History Timeline</h1>
        <p className="mt-1 text-gray-400 text-sm">Founding and evolution of TROPTIONS — reviewed and approved records.</p>
      </div>

      <div className="relative border-l border-gray-800 ml-4 space-y-8 pb-8">
        {all.map((event) => (
          <div key={event.id} className="pl-8 relative">
            <div className="absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-[#C9A84C] bg-[#060A12]" />
            <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-[#C9A84C]">{event.year}</div>
                <div className="flex items-center gap-2">
                  {event.reviewStatus === "approved" ? (
                    <span className="text-xs text-green-400 border border-green-800/50 rounded px-2 py-0.5">Approved</span>
                  ) : event.reviewStatus === "pending" ? (
                    <span className="text-xs text-yellow-400 border border-yellow-800/50 rounded px-2 py-0.5">Pending Review</span>
                  ) : (
                    <span className="text-xs text-red-400 border border-red-800/50 rounded px-2 py-0.5">Blocked</span>
                  )}
                  {!event.publicSafe && (
                    <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5">Internal Only</span>
                  )}
                </div>
              </div>
              <div className="font-semibold text-white mb-2">{event.title}</div>
              <div className="text-sm text-gray-400">{event.summary}</div>
              {event.notes && (
                <div className="mt-3 text-xs text-gray-600 italic">{event.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
