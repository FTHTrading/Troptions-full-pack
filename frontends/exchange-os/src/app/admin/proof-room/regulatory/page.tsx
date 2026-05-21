import { getMockRegulatoryRecords } from "@/lib/troptions/proof-room/regulatory";

export const metadata = { title: "Regulatory History — TROPTIONS Proof Room" };

export default function RegulatoryPage() {
  const records = getMockRegulatoryRecords();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        INTERNAL — Regulatory records are for internal review. Consult legal counsel before public disclosure.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Regulatory History</h1>
        <p className="mt-1 text-gray-400 text-sm">Regulatory records, approved public language, and risk notes.</p>
      </div>

      <div className="space-y-4">
        {records.map((rec) => (
          <div key={rec.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{rec.title}</div>
                <div className="text-xs text-gray-500">{rec.jurisdiction} — {rec.date}</div>
              </div>
              <span className="text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-400 capitalize">
                {rec.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-3">{rec.summary}</div>
            <div className="rounded bg-[#080C14] border border-[#C9A84C]/20 p-3 mb-3">
              <div className="text-xs text-[#C9A84C] uppercase tracking-wide mb-1">Approved Public Language</div>
              <div className="text-xs text-gray-200">{rec.approvedPublicLanguage}</div>
            </div>
            {rec.riskNotes && (
              <div className="rounded bg-[#080C14] border border-orange-900/40 p-3">
                <div className="text-xs text-orange-400 uppercase tracking-wide mb-1">Risk Notes</div>
                <div className="text-xs text-orange-300/70">{rec.riskNotes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
