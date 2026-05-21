import { getMockEvidenceRecords } from "@/lib/troptions/proof-room/evidence";

export const metadata = { title: "Evidence Records — TROPTIONS Proof Room" };

export default function EvidencePage() {
  const records = getMockEvidenceRecords();

  const statusColors: Record<string, string> = {
    verified: "text-green-400 border-green-800/50",
    partially_verified: "text-yellow-400 border-yellow-800/50",
    missing: "text-red-400 border-red-800/50",
    expired: "text-orange-400 border-orange-800/50",
    needs_review: "text-blue-400 border-blue-800/50",
    disputed: "text-red-300 border-red-900/50",
    not_applicable: "text-gray-500 border-gray-700",
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Evidence records are build-verified records.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Evidence Records</h1>
        <p className="mt-1 text-gray-400 text-sm">All supporting evidence for TROPTIONS public claims.</p>
      </div>

      <div className="space-y-4">
        {records.map((rec) => (
          <div key={rec.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{rec.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-mono">{rec.id}</div>
              </div>
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs border ${statusColors[rec.verificationStatus]}`}>
                {rec.verificationStatus.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-3">{rec.description}</div>
            {rec.sourceUrl && (
              <div className="text-xs text-blue-400 font-mono">{rec.sourceUrl}</div>
            )}
            {rec.relatedClaimIds.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Related claims: {rec.relatedClaimIds.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
