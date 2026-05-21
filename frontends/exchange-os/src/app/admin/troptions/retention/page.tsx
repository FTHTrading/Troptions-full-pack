import { getRetentionPolicySummary } from "@/lib/troptions/retentionPolicy";

export default function RetentionPage() {
  const summary = getRetentionPolicySummary();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Retention Policy</h1>
        </section>

        <section className="space-y-2">
          {Object.entries(summary).map(([key, value]) => (
            <pre key={key} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm overflow-x-auto">
              {key}: {typeof value === "string" ? value : JSON.stringify(value)}
            </pre>
          ))}
        </section>
      </div>
    </main>
  );
}
