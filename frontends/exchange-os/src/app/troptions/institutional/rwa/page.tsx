import { RWA_REGISTRY } from "@/content/troptions/rwaRegistry";
import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";

const salpClaim = CLAIM_REGISTRY.find((c) => c.id === "CLAIM-SALP-001");

export default function RWAPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="rwa" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Real World Assets
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions RWA & SALP Programs</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Real-world asset tokenization intake requirements, custody gates, legal classification requirements,
            and SALP program status. No asset may be tokenized without completing all intake gates.
          </p>
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800 rounded-xl text-sm text-red-300">
            <strong>{RWA_REGISTRY.length} RWA program(s) registered.</strong> SALP is the primary intake framework.
            All tokenization is subject to securities exemption or registration, investor eligibility, and qualified custody.
          </div>
        </section>

        {/* SALP Claim Alert */}
        {salpClaim && (
          <section className="border border-red-800 bg-red-950/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-red-400 font-semibold text-sm">⚠ SALP Liquidity Claim — Blocked</p>
              <span className="text-[#C9A84C] font-mono text-xs">{salpClaim.id}</span>
            </div>
            <p className="text-slate-400 text-sm mb-2 italic">&ldquo;{salpClaim.originalText}&rdquo;</p>
            <p className="text-slate-400 text-sm mb-3">{salpClaim.problemSummary}</p>
            <p className="text-green-300 text-sm border-l-2 border-green-600 pl-3">{salpClaim.approvedReplacementText}</p>
          </section>
        )}

        {/* RWA Programs */}
        {RWA_REGISTRY.map((program) => (
          <section key={program.programId} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[#C9A84C] font-mono text-xs">{program.programId}</span>
                <h3 className="text-xl font-bold text-white mt-1">{program.name}</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-2xl">{program.description}</p>
              </div>
              <StatusBadge status={program.status} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Intake Requirements ({program.intakeRequirements.length})</p>
                <ul className="space-y-1">
                  {program.intakeRequirements.map((req) => (
                    <li key={req} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Custody Requirements ({program.custodyRequirements.length})</p>
                <ul className="space-y-1">
                  {program.custodyRequirements.map((req) => (
                    <li key={req} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Legal Requirements ({program.legalRequirements.length})</p>
                <ul className="space-y-1">
                  {program.legalRequirements.map((req) => (
                    <li key={req} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Transfer Restrictions ({program.transferRestrictions.length})</p>
                <ul className="space-y-1">
                  {program.transferRestrictions.map((req) => (
                    <li key={req} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500 text-xs uppercase mb-1">Chain</p>
                <p className="text-slate-300">{program.chain}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase mb-1">Risk Notes</p>
                <p className="text-slate-300">{program.riskNotes}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase mb-1">Next Action</p>
                <p className="text-[#C9A84C]">{program.nextAction}</p>
              </div>
            </div>
          </section>
        ))}

      </div>
    </main>
  );
}
