import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { PROOF_REGISTRY } from "@/content/troptions/proofRegistry";
import { CUSTODY_WORKFLOW } from "@/content/troptions/custodyWorkflow";
import { FUNDING_READINESS } from "@/content/troptions/fundingReadiness";
import { ISSUANCE_READINESS } from "@/content/troptions/issuanceReadiness";
import { SETTLEMENT_READINESS } from "@/content/troptions/settlementReadiness";
import { getOpenExceptions } from "@/content/troptions/exceptionRegistry";
import { getReadinessDashboardSummary, READINESS_SCORING } from "@/content/troptions/readinessScoring";

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-[#C9A84C] mt-1">{value}</p>
    </div>
  );
}

export default function AdminReadinessDashboardPage() {
  const summary = getReadinessDashboardSummary();
  const openExceptions = getOpenExceptions();

  const claimReadiness = CLAIM_REGISTRY.map((claim) => ({
    subjectId: claim.id,
    status: claim.evidenceStatus === "missing" || claim.evidenceStatus === "not-started" ? "blocked" : "ready",
    evidenceStatus: claim.evidenceStatus,
    legalStatus: claim.legalStatus,
  }));

  const proofReadiness = PROOF_REGISTRY.map((proof) => ({
    subjectId: proof.proofId,
    status: proof.exceptions.length > 0 ? "blocked" : "ready",
    missingEvidence: proof.exceptions.length,
  }));

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Readiness Dashboard</p>
          <h1 className="text-4xl font-bold">Troptions Readiness Dashboard</h1>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card label="Assets in intake" value={summary.assetsInIntake} />
          <Card label="Claims blocked" value={summary.claimsBlocked} />
          <Card label="Proof packages incomplete" value={summary.proofPackagesIncomplete} />
          <Card label="Legal reviews pending" value={summary.legalReviewsPending} />
          <Card label="Custody reviews pending" value={summary.custodyReviewsPending} />
          <Card label="Board approvals pending" value={summary.boardApprovalsPending} />
          <Card label="Investors not ready" value={summary.investorsNotReady} />
          <Card label="Funding routes not ready" value={summary.fundingRoutesNotReady} />
          <Card label="Issuance blocked" value={summary.issuanceBlocked} />
          <Card label="Settlement blocked" value={summary.settlementBlocked} />
          <Card label="Exceptions open" value={summary.exceptionsOpen} />
          <Card label="Items ready for approval" value={summary.itemsReadyForApproval} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Asset Readiness</h2>
          <div className="space-y-2">
            {READINESS_SCORING.map((item) => (
              <div key={item.subjectId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.subjectId}</span>
                <span className="text-slate-400">{item.readinessStatus} (total: {item.totalScore})</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Claim Readiness</h2>
          <div className="space-y-2">
            {claimReadiness.map((item) => (
              <div key={item.subjectId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.subjectId}</span>
                <span className="text-slate-400">{item.status} (evidence: {item.evidenceStatus})</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Proof Readiness</h2>
          <div className="space-y-2">
            {proofReadiness.map((item) => (
              <div key={item.subjectId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.subjectId}</span>
                <span className="text-slate-400">{item.status} (missing: {item.missingEvidence})</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Custody Readiness</h2>
          <div className="space-y-2">
            {CUSTODY_WORKFLOW.map((item) => (
              <div key={item.assetId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.assetId}</span>
                <span className="text-slate-400">{item.custodianApproval ? "ready" : "blocked"}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Funding Readiness</h2>
          <div className="space-y-2">
            {FUNDING_READINESS.map((item) => (
              <div key={item.routeId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.routeId}</span>
                <span className="text-slate-400">{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Issuance Readiness</h2>
          <div className="space-y-2">
            {ISSUANCE_READINESS.map((item) => (
              <div key={item.assetId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.assetId}</span>
                <span className="text-slate-400">{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Settlement Readiness</h2>
          <div className="space-y-2">
            {SETTLEMENT_READINESS.map((item) => (
              <div key={item.assetId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between">
                <span>{item.assetId}</span>
                <span className="text-slate-400">{item.status} ({item.settlementScore})</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Open Exceptions</h2>
          <div className="space-y-2">
            {openExceptions.map((item) => (
              <div key={item.exceptionId} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm">
                <p className="text-[#C9A84C] font-mono text-xs">{item.exceptionId} - {item.subjectId}</p>
                <p className="text-slate-400 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
