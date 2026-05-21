import { ADVERTISING_AUDIT, AdvertisingAuditEntry } from "@/content/troptions/advertisingAudit";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

const statusColors: Record<AdvertisingAuditEntry["publishStatus"], string> = {
  blocked: "border-red-700 bg-red-950/20",
  "pending-review": "border-yellow-700 bg-yellow-950/20",
  approved: "border-green-700 bg-green-950/20",
  rejected: "border-slate-700 bg-slate-900",
};

export default function AdvertisingAuditPage() {
  const blocked = ADVERTISING_AUDIT.filter((e) => e.publishStatus === "blocked");
  const pending = ADVERTISING_AUDIT.filter((e) => e.publishStatus === "pending-review");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-2">Admin — Advertising Audit</p>
            <h1 className="text-3xl font-bold text-white">Advertising Copy Audit</h1>
            <p className="text-slate-400 text-sm mt-1">
              {ADVERTISING_AUDIT.length} ad copy entries · {blocked.length} blocked · {pending.length} pending review
            </p>
          </div>
          <Link href="/admin/troptions" className="text-[#C9A84C] text-sm hover:underline">← Back to Admin</Link>
        </div>

        <div className="space-y-6">
          {ADVERTISING_AUDIT.map((entry) => (
            <div key={entry.auditId} className={`border rounded-xl p-6 ${statusColors[entry.publishStatus]}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[#C9A84C] font-mono text-xs">{entry.auditId}</span>
                  <span className="text-slate-500 text-xs ml-3">{entry.source}</span>
                </div>
                <StatusBadge status={entry.publishStatus} size="sm" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Original Copy</p>
                  <p className="text-white text-sm italic border-l-2 border-red-700 pl-3">&ldquo;{entry.originalCopy}&rdquo;</p>
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Problems ({entry.problems.length})</p>
                  <ul className="space-y-1">
                    {entry.problems.map((p) => (
                      <li key={p} className="text-red-300 text-xs flex gap-2">
                        <span className="text-red-500">✗</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Institutional Rewrite</p>
                  <p className="text-green-300 text-sm border-l-2 border-green-700 pl-3">{entry.institutionalRewrite}</p>
                </div>

                {entry.requiredEvidence.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Required Evidence ({entry.requiredEvidence.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.requiredEvidence.map((e) => (
                        <span key={e} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">{e}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500 uppercase mb-1">Required Disclosure</p>
                    <p className="text-slate-300">{entry.disclosureRequired}</p>
                  </div>
                  {entry.linkedClaimIds.length > 0 && (
                    <div>
                      <p className="text-slate-500 uppercase mb-1">Linked Claims</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.linkedClaimIds.map((id) => (
                          <span key={id} className="bg-slate-800 rounded px-2 py-0.5 text-slate-300">{id}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.linkedRiskRuleIds.length > 0 && (
                    <div>
                      <p className="text-slate-500 uppercase mb-1">Linked Risk Rules</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.linkedRiskRuleIds.map((id) => (
                          <span key={id} className="bg-orange-950 border border-orange-800 rounded px-2 py-0.5 text-orange-300">{id}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
