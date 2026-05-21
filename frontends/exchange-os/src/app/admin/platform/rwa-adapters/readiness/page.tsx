import { getAllRwaReadinessScores } from "@/lib/troptions/rwa-adapters/readiness";
import { getRwaProviderById } from "@/lib/troptions/rwa-adapters/providers";

export const metadata = { title: "RWA Readiness Scores — TROPTIONS Platform" };

export default function RwaReadinessPage() {
  const scores = getAllRwaReadinessScores();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Scores reflect current build state. All execution scores are 0 by design.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PLATFORM / RWA ADAPTERS
        </div>
        <h1 className="text-2xl font-bold text-white">RWA Adapter Readiness Scores</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Per-adapter readiness evaluation. Execution score is always 0 until all gates are passed.
        </p>
      </div>

      <div className="space-y-4">
        {scores.map((score) => {
          const adapter = getRwaProviderById(score.providerId);
          if (!adapter) return null;
          const scoreColor =
            score.overallScore >= 60 ? "text-green-400" :
            score.overallScore >= 30 ? "text-yellow-400" :
            "text-red-400";

          return (
            <div key={score.providerId} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-white">{adapter.displayName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{adapter.category.replace(/_/g, " ")}</div>
                </div>
                <div className={`text-3xl font-bold ${scoreColor}`}>{score.overallScore}%</div>
              </div>

              {/* Score Bars */}
              <div className="space-y-2 mb-4">
                {[
                  { label: "Legal", value: score.legalScore },
                  { label: "Evidence", value: score.evidenceScore },
                  { label: "Execution", value: score.executionScore },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-500">{label}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-800">
                      <div
                        className="h-1.5 rounded-full bg-[#C9A84C]"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs text-gray-400">{value}%</div>
                  </div>
                ))}
              </div>

              {/* Partnership / Public Claim Status */}
              <div className="flex gap-4 mb-3">
                <div className={`text-xs ${score.canClaimPublicly ? "text-green-400" : "text-red-400"}`}>
                  Public Reference: {score.canClaimPublicly ? "Allowed" : "Blocked"}
                </div>
                <div className={`text-xs ${score.canClaimPartnership ? "text-green-400" : "text-red-400"}`}>
                  Partnership Claim: {score.canClaimPartnership ? "Allowed" : "Blocked"}
                </div>
              </div>

              {/* Blockers */}
              {score.blockers.length > 0 && (
                <div className="space-y-0.5">
                  {score.blockers.slice(0, 4).map((b, i) => (
                    <div key={i} className="text-xs text-orange-300/60">— {b}</div>
                  ))}
                  {score.blockers.length > 4 && (
                    <div className="text-xs text-gray-600">... and {score.blockers.length - 4} more</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
