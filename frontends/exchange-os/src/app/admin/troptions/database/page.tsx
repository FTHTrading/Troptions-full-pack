import { getDatabaseAdapter } from "@/lib/troptions/databaseAdapter";

export default async function DatabasePage() {
  const adapter = getDatabaseAdapter();
  const health = await adapter.healthCheck();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Database Adapter</h1>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded p-4 text-sm space-y-2">
          <p>adapter: <span className="text-[#C9A84C]">{adapter.type}</span></p>
          <p>configured: <span className="text-[#C9A84C]">{adapter.isConfigured() ? "yes" : "no"}</span></p>
          <p>health: <span className="text-[#C9A84C]">{health.ok ? "ok" : "failed"}</span></p>
          {health.error && <p className="text-red-400">error: {health.error}</p>}
          {health.details && <p className="text-slate-400">details: {health.details}</p>}
        </section>
      </div>
    </main>
  );
}
