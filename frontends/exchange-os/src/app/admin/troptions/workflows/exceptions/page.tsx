import { EXCEPTION_REGISTRY } from "@/content/troptions/exceptionRegistry";

export default function AdminExceptionsWorkflowPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Exceptions Workflow</h1>
        <div className="space-y-3">
          {EXCEPTION_REGISTRY.map((item) => (
            <div key={item.exceptionId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{item.exceptionId}</p>
              <p className="text-white font-semibold">{item.subjectId}</p>
              <p className="text-slate-400 text-xs">{item.status}</p>
              <p className="text-yellow-400 text-xs mt-2">Next Action: {item.nextAction}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
