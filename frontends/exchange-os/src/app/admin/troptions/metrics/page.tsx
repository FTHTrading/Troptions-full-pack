import { getMetricsSnapshot } from "@/lib/troptions/metricsRegistry";

export default function MetricsPage() {
  const metrics = getMetricsSnapshot();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Metrics Registry</h1>
        </section>

        <section className="space-y-2">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded p-3 flex items-center justify-between text-sm">
              <span className="text-slate-300">{key}</span>
              <span className="text-[#C9A84C] font-bold">{value}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
