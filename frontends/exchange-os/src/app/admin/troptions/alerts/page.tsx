import { ALERT_REGISTRY } from "@/content/troptions/alertRegistry";
import { getAlertSummary } from "@/lib/troptions/alertEngine";

export default function AdminAlertsPage() {
  const summary = getAlertSummary();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Alerts</h1>
        <p className="text-slate-400">Active alerts: {summary.activeAlerts} | SLA breaches: {summary.slaBreaches}</p>

        <div className="space-y-3">
          {ALERT_REGISTRY.map((alert) => (
            <div key={alert.alertId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{alert.alertId}</p>
              <p className="text-white text-sm">{alert.category} / {alert.severity}</p>
              <p className="text-slate-400 text-xs">{alert.message}</p>
              <p className="text-slate-400 text-xs">Status: {alert.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
