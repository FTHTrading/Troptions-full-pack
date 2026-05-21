import { getApprovedPublicClaims, getApprovedInstitutionalClaims } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { ClaimAuditTable } from "@/components/troptions/ClaimAuditTable";
import Link from "next/link";

const publicClaims = getApprovedPublicClaims();
const institutionalClaims = getApprovedInstitutionalClaims();

export default function ApprovedClaimsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Claims</p>
            <h1 className="text-3xl font-bold text-white">Approved Claims</h1>
            <p className="text-slate-400 text-sm mt-1">
              {publicClaims.length} approved-public + {institutionalClaims.length} approved-institutional.
            </p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        {publicClaims.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-green-400 mb-4">Approved Public ({publicClaims.length})</h2>
            <ClaimAuditTable claims={publicClaims} />
          </section>
        )}

        {institutionalClaims.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-400 mb-4">Approved Institutional ({institutionalClaims.length})</h2>
            <ClaimAuditTable claims={institutionalClaims} />
          </section>
        )}

        {publicClaims.length === 0 && institutionalClaims.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
            No claims are currently approved.
          </div>
        )}
      </div>
    </main>
  );
}
