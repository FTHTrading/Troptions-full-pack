import { getMockCapabilityRecords } from "@/lib/troptions/proof-room/capabilities";
import { CAPABILITY_STATUS_LABELS } from "@/lib/troptions/proof-room/types";

export const metadata = {
  title: "TROPTIONS Capabilities",
  description: "What TROPTIONS can honestly claim it is capable of today.",
};

export default function TroptionsCapabilitiesPage() {
  const records = getMockCapabilityRecords().filter((r) => r.canBeClaimedPublicly);

  const statusColors: Record<string, string> = {
    live: "text-green-400 bg-green-900/30 border-green-800/50",
    build_verified: "text-blue-400 bg-blue-900/30 border-blue-800/50",
    mock_only: "text-gray-400 bg-gray-800/30 border-gray-700",
    manual_only: "text-yellow-400 bg-yellow-900/30 border-yellow-800/50",
    provider_ready: "text-teal-400 bg-teal-900/30 border-teal-800/50",
    credentials_required: "text-orange-400 bg-orange-900/30 border-orange-800/50",
    legal_review_required: "text-red-400 bg-red-900/30 border-red-800/50",
    future_ready_not_live: "text-purple-400 bg-purple-900/30 border-purple-800/50",
    blocked: "text-red-500 bg-red-900/40 border-red-900/60",
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4">
          TROPTIONS CAPABILITIES
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">What TROPTIONS Can Do Today</h1>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          This page reflects build-verified capabilities. Live production features require
          provider configuration and compliance review.
        </p>

        <div className="space-y-6">
          {records.map((rec) => (
            <div key={rec.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">{rec.capabilityName}</h2>
                <span className={`shrink-0 rounded px-2 py-1 text-xs border ${statusColors[rec.currentStatus]}`}>
                  {CAPABILITY_STATUS_LABELS[rec.currentStatus]}
                </span>
              </div>
              {rec.softwareRoute && (
                <div className="text-xs text-gray-600 font-mono mb-3">{rec.softwareRoute}</div>
              )}
              {rec.limitations.length > 0 && (
                <div className="mt-2 space-y-1">
                  {rec.limitations.map((lim, i) => (
                    <div key={i} className="text-xs text-orange-300/70">— {lim}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-800 bg-[#0F1923] p-6 text-sm text-gray-500">
          <strong className="text-gray-400">Disclaimer:</strong> All capabilities shown are
          software-build verified. Live execution requires production-ready provider adapters.
          TROPTIONS is not a bank, payment processor, or licensed securities issuer.
          This page is not investment advice.
        </div>
      </div>
    </div>
  );
}
