import { getObservabilitySnapshot } from "@/lib/troptions/observabilityEngine";

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-[#C9A84C] mt-1">{value}</p>
    </div>
  );
}

export default async function ObservabilityPage() {
  const snapshot = await getObservabilitySnapshot();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Observability Dashboard</h1>
          <p className="text-slate-400 mt-2 text-sm">Generated at {snapshot.generatedAt}</p>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card label="Total requests" value={snapshot.cards.totalRequests} />
          <Card label="Failed requests" value={snapshot.cards.failedRequests} />
          <Card label="Auth failures" value={snapshot.cards.authFailures} />
          <Card label="Rate-limit blocks" value={snapshot.cards.rateLimitBlocks} />
          <Card label="Gate blocks" value={snapshot.cards.gateBlocks} />
          <Card label="Critical alerts" value={snapshot.cards.criticalAlerts} />
          <Card label="Open incidents" value={snapshot.cards.openIncidents} />
          <Card label="Unresolved exceptions" value={snapshot.cards.unresolvedExceptions} />
          <Card label="Failed release gates" value={snapshot.cards.failedReleaseGates} />
          <Card label="Audit exports" value={snapshot.cards.auditExports} />
          <Card label="DB health" value={snapshot.cards.dbHealth} />
          <Card label="Backup freshness" value={snapshot.cards.backupFreshness} />
          <Card label="Smoke checks" value={snapshot.cards.smokeCheckStatus} />
        </section>
      </div>
    </main>
  );
}
