import { getPendingReviewClaims } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";
import { ClaimAuditTable } from "@/components/troptions/ClaimAuditTable";
import Link from "next/link";

const claims = getPendingReviewClaims();

export default function ClaimsReviewPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Claims</p>
            <h1 className="text-3xl font-bold text-white">Claims Pending Review</h1>
            <p className="text-slate-400 text-sm mt-1">{claims.length} claim(s) awaiting legal or editorial review.</p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        {claims.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
            No claims are currently pending review.
          </div>
        ) : (
          <ClaimAuditTable claims={claims} />
        )}
      </div>
    </main>
  );
}
