import { CLAIM_REGISTRY, getClaimsByType, getClaimsMissingEvidence } from "@/content/troptions/claimRegistry";
import { PROOF_REGISTRY, getProofWorkflowStatus } from "@/content/troptions/proofRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge, RiskBadge } from "@/components/troptions/StatusBadge";

const auditClaims = getClaimsByType("audit");
const allMissingEvidence = getClaimsMissingEvidence();
const auditProofs = PROOF_REGISTRY.filter((p) =>
  p.proofType === "proof-of-audit" || p.proofType === "proof-of-reserves",
);

export default function AuditRoomPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Audit Room
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Audit Room</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Audit claims, proof-of-audit status, proof-of-reserves status, and a full
            cross-claim missing evidence inventory. The audit room is the canonical source for what
            is documented and what remains missing.
          </p>
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{auditClaims.length}</div>
              <div className="text-slate-500 text-xs mt-1">Audit Claims</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{allMissingEvidence.length}</div>
              <div className="text-slate-500 text-xs mt-1">Claims Missing Evidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{auditProofs.length}</div>
              <div className="text-slate-500 text-xs mt-1">Audit/Reserve Proofs</div>
            </div>
          </div>
        </section>

        {/* Audit Claims */}
        {auditClaims.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Audit Claims ({auditClaims.length})</h2>
            <div className="space-y-6">
              {auditClaims.map((claim) => (
                <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[#C9A84C] font-mono text-xs">{claim.id}</span>
                      <p className="text-slate-500 text-xs mt-1">{claim.sourcePage}</p>
                    </div>
                    <div className="flex gap-2">
                      <RiskBadge level={claim.riskLevel} />
                      <StatusBadge status={claim.publishStatus} size="sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Original Text</p>
                      <p className="text-white text-sm italic border-l-2 border-red-600 pl-3">&ldquo;{claim.originalText}&rdquo;</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Problem</p>
                      <p className="text-slate-400 text-sm">{claim.problemSummary}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Approved Replacement</p>
                      <p className="text-green-300 text-sm border-l-2 border-green-600 pl-3">{claim.approvedReplacementText}</p>
                    </div>
                    {claim.missingEvidence.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">Missing Evidence</p>
                        <div className="flex flex-wrap gap-2">
                          {claim.missingEvidence.map((e) => (
                            <span key={e} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">{e}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-[#C9A84C]">Next Action: {claim.nextAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Audit / Reserve Proof Packages */}
        {auditProofs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Audit & Reserve Proof Packages</h2>
            <div className="space-y-4">
              {auditProofs.map((proof) => {
                const wf = getProofWorkflowStatus(proof);
                return (
                  <div key={proof.proofId} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[#C9A84C] font-mono text-xs">{proof.proofId}</span>
                        <p className="text-white font-semibold text-sm mt-1">{proof.label}</p>
                        <p className="text-slate-400 text-xs mt-1">{proof.description}</p>
                      </div>
                      <StatusBadge status={proof.currentStage} size="sm" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500 uppercase mb-1">Current Stage</p>
                        <p className="text-yellow-400">{wf.currentStage}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase mb-1">Next Stage</p>
                        <p className="text-slate-300">{wf.nextStage}</p>
                      </div>
                    </div>
                    {wf.blockers.length > 0 && (
                      <div className="mt-3">
                        <p className="text-slate-500 text-xs uppercase mb-1">Blockers</p>
                        <div className="flex flex-wrap gap-1">
                          {wf.blockers.map((b) => (
                            <span key={b} className="bg-red-950 border border-red-800 rounded px-2 py-0.5 text-red-300 text-xs">{b}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Cross-Claim Missing Evidence Inventory */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">
            Full Missing Evidence Inventory ({allMissingEvidence.length} claims affected)
          </h2>
          <div className="space-y-3">
            {allMissingEvidence.map((claim) => (
              <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[#C9A84C] font-mono text-xs">{claim.id}</span>
                  <RiskBadge level={claim.riskLevel} />
                </div>
                <p className="text-slate-400 text-xs mb-2 italic line-clamp-1">{claim.originalText}</p>
                <div className="flex flex-wrap gap-1">
                  {claim.missingEvidence.map((e) => (
                    <span key={e} className="bg-yellow-950 border border-yellow-800 rounded px-2 py-0.5 text-yellow-300 text-xs">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
