import { getMockPublicClaims } from "@/lib/troptions/proof-room/claims";
import { evaluateClaimSafety } from "@/lib/troptions/proof-room/claimGuards";
import { CLAIM_STATUS_LABELS, PUBLIC_USE_LABELS } from "@/lib/troptions/proof-room/types";

export const metadata = { title: "Claims Register — TROPTIONS Proof Room" };

export default function ClaimsPage() {
  const claims = getMockPublicClaims();

  const riskColors: Record<string, string> = {
    low: "text-green-400 border-green-800/50",
    medium: "text-yellow-400 border-yellow-800/50",
    high: "text-orange-400 border-orange-800/50",
    critical: "text-red-400 border-red-800/50",
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Claims register is internal only until fully reviewed.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Claims Register</h1>
        <p className="mt-1 text-gray-400 text-sm">All public claims and their approval and risk status.</p>
      </div>

      <div className="space-y-4">
        {claims.map((claim) => {
          const safety = evaluateClaimSafety(claim);
          return (
            <div key={claim.id} className={`rounded-lg bg-[#0F1923] border p-5 ${
              claim.claimStatus === "do_not_claim"
                ? "border-red-800/60"
                : "border-gray-800"
            }`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="font-semibold text-white text-sm">{claim.claimText}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded px-2 py-0.5 text-xs border ${riskColors[claim.riskLevel]}`}>
                    {claim.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">{claim.plainEnglishVersion}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-600 uppercase tracking-wide mb-1">Claim Status</div>
                  <div className="text-white">{CLAIM_STATUS_LABELS[claim.claimStatus]}</div>
                </div>
                <div>
                  <div className="text-gray-600 uppercase tracking-wide mb-1">Public Use</div>
                  <div className="text-white">{PUBLIC_USE_LABELS[claim.publicUseStatus]}</div>
                </div>
              </div>
              {claim.allowedCopy && (
                <div className="mt-3 rounded bg-[#080C14] border border-gray-800 p-3">
                  <div className="text-xs text-green-400 uppercase tracking-wide mb-1">Allowed Copy</div>
                  <div className="text-xs text-gray-300">{claim.allowedCopy}</div>
                </div>
              )}
              {claim.blockedCopy && (
                <div className="mt-2 rounded bg-[#080C14] border border-red-900/40 p-3">
                  <div className="text-xs text-red-400 uppercase tracking-wide mb-1">Blocked Copy</div>
                  <div className="text-xs text-red-300/70">{claim.blockedCopy}</div>
                </div>
              )}
              {!safety.safe && safety.warnings.length > 0 && (
                <div className="mt-3">
                  {safety.warnings.map((w, i) => (
                    <div key={i} className="text-xs text-orange-300">— {w}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
