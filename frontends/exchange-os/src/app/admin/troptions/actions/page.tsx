import { ACTION_REGISTRY, getPendingActions } from "@/content/troptions/actionRegistry";

export default function AdminActionsPage() {
  const pending = getPendingActions();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Actions</h1>
        <p className="text-slate-400">Pending actions: {pending.length}</p>

        <div className="space-y-3">
          {ACTION_REGISTRY.map((action) => (
            <div key={action.actionId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{action.actionId}</p>
              <p className="text-white font-semibold">{action.actionType}</p>
              <p className="text-slate-400 text-xs">{action.subjectType}: {action.subjectId}</p>
              <p className="text-slate-400 text-xs">Status: {action.status}</p>
              <p className="text-slate-500 text-xs mt-2">{action.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
