import { getMockCapabilityRecords } from "@/lib/troptions/proof-room/capabilities";
import { CAPABILITY_STATUS_LABELS } from "@/lib/troptions/proof-room/types";

export const metadata = { title: "Capability Records — TROPTIONS Proof Room" };

export default function ProofRoomCapabilitiesPage() {
  const records = getMockCapabilityRecords();

  const statusColors: Record<string, string> = {
    live: "text-green-400 border-green-800/50",
    build_verified: "text-blue-400 border-blue-800/50",
    mock_only: "text-gray-400 border-gray-700",
    manual_only: "text-yellow-400 border-yellow-800/50",
    provider_ready: "text-teal-400 border-teal-800/50",
    credentials_required: "text-orange-400 border-orange-800/50",
    legal_review_required: "text-red-400 border-red-800/50",
    future_ready_not_live: "text-purple-400 border-purple-800/50",
    blocked: "text-red-500 border-red-900/60",
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Capability records reflect build-verified state.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Capability Records</h1>
        <p className="mt-1 text-gray-400 text-sm">What TROPTIONS can honestly claim it is capable of today.</p>
      </div>

      <div className="space-y-4">
        {records.map((rec) => (
          <div key={rec.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{rec.capabilityName}</div>
                <div className="text-xs text-gray-500 capitalize mt-0.5">{rec.capabilityCategory}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs border ${statusColors[rec.currentStatus]}`}>
                  {CAPABILITY_STATUS_LABELS[rec.currentStatus]}
                </span>
                {rec.canBeClaimedPublicly ? (
                  <span className="text-xs text-green-400 border border-green-800/50 rounded px-2 py-0.5">Public OK</span>
                ) : (
                  <span className="text-xs text-red-400 border border-red-800/50 rounded px-2 py-0.5">Internal Only</span>
                )}
              </div>
            </div>
            {rec.limitations.length > 0 && (
              <ul className="space-y-1 mt-3">
                {rec.limitations.map((lim, i) => (
                  <li key={i} className="text-xs text-orange-300/70">— {lim}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
