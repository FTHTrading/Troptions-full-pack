import { getCriticalClaims, getHighRiskClaims } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { ClaimAuditTable } from "@/components/troptions/ClaimAuditTable";
import { TroptionsClaim } from "@/content/troptions/claimRegistry";
import Link from "next/link";

const critical = getCriticalClaims();
const high = getHighRiskClaims();
// Deduplicate: high-risk list includes CRITICAL too, so show them separately
const highOnly = high.filter((c) => c.riskLevel === "HIGH");

export default function HighRiskClaimsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Claims</p>
            <h1 className="text-3xl font-bold text-white">High Risk & Critical Claims</h1>
            <p className="text-slate-400 text-sm mt-1">
              {critical.length} CRITICAL claim(s) + {highOnly.length} HIGH claim(s). These require legal review before any publication.
            </p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        {critical.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-red-400 mb-4">CRITICAL Claims ({critical.length})</h2>
            <ClaimAuditTable claims={critical} />
          </section>
        )}

        {highOnly.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-orange-400 mb-4">HIGH Risk Claims ({highOnly.length})</h2>
            <ClaimAuditTable claims={highOnly} />
          </section>
        )}
      </div>
    </main>
  );
}
