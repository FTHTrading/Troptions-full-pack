import { ACTION_REGISTRY, getPendingActions } from "@/content/troptions/actionRegistry";
import { APPROVAL_REGISTRY, getPendingApprovals } from "@/content/troptions/approvalRegistry";
import { getOpenExceptions } from "@/content/troptions/exceptionRegistry";
import { ALERT_REGISTRY, getActiveAlerts } from "@/content/troptions/alertRegistry";
import { getFailedReleaseGates } from "@/content/troptions/releaseGateRegistry";
import { SLA_REGISTRY, getBreachedSla } from "@/content/troptions/slaRegistry";
import { getRecentAuditEvents } from "@/lib/troptions/auditLogEngine";
import { ROLE_PERMISSIONS } from "@/content/troptions/permissionRegistry";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-[#C9A84C] mt-1">{value}</p>
    </div>
  );
}

export default function AdminControlPlanePage() {
  const pendingActions = getPendingActions();
  const pendingApprovals = getPendingApprovals();
  const overdueApprovals = pendingApprovals.filter((item) => item.status === "in-review");
  const rejections = APPROVAL_REGISTRY.filter((item) => item.status === "rejected");
  const openExceptions = getOpenExceptions();
  const criticalExceptions = openExceptions.filter((item) => item.severity === "CRITICAL");
  const activeAlerts = getActiveAlerts();
  const slaBreaches = getBreachedSla();
  const failedReleaseGates = getFailedReleaseGates();
  const auditToday = getRecentAuditEvents(200).filter((item) => item.timestamp.startsWith(new Date().toISOString().slice(0, 10)));
  const unauthorizedBlocked = getRecentAuditEvents(200).filter((item) => item.reason.toLowerCase().includes("authorizationguard") || item.reason.toLowerCase().includes("not permitted"));
  const aiBlockedActions = unauthorizedBlocked.filter((item) => item.actorRole === "ai-concierge");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Operational Control Plane</p>
          <h1 className="text-4xl font-bold">Troptions Control Plane</h1>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Actions pending" value={pendingActions.length} />
          <StatCard label="Approvals requested" value={pendingApprovals.length} />
          <StatCard label="Approvals overdue" value={overdueApprovals.length} />
          <StatCard label="Rejections" value={rejections.length} />
          <StatCard label="Open exceptions" value={openExceptions.length} />
          <StatCard label="Critical exceptions" value={criticalExceptions.length} />
          <StatCard label="Alerts active" value={activeAlerts.length} />
          <StatCard label="SLA breaches" value={slaBreaches.length} />
          <StatCard label="Release gates failing" value={failedReleaseGates.length} />
          <StatCard label="Audit events today" value={auditToday.length} />
          <StatCard label="Unauthorized attempts blocked" value={unauthorizedBlocked.length} />
          <StatCard label="AI concierge blocked actions" value={aiBlockedActions.length} />
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-3">Pending Approvals</h2>
            <div className="space-y-2">
              {pendingApprovals.map((item) => (
                <div key={item.approvalId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.approvalId} - {item.approvalType} - {item.status}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Recent Audit Events</h2>
            <div className="space-y-2">
              {getRecentAuditEvents(20).map((item) => (
                <div key={item.eventId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.eventId} - {item.actionType} - {item.subjectId}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Open Exceptions</h2>
            <div className="space-y-2">
              {openExceptions.map((item) => (
                <div key={item.exceptionId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.exceptionId} - {item.subjectId} - {item.severity}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Failed Release Gates</h2>
            <div className="space-y-2">
              {failedReleaseGates.map((item) => (
                <div key={item.gateId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.gateId} - {item.subjectId} - {item.failingRules.join(", ")}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Active Alerts</h2>
            <div className="space-y-2">
              {ALERT_REGISTRY.filter((item) => item.status === "active").map((item) => (
                <div key={item.alertId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.alertId} - {item.category} - {item.severity}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">SLA Timers</h2>
            <div className="space-y-2">
              {SLA_REGISTRY.map((item) => (
                <div key={item.slaId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.slaId} - {item.type} - {item.status}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Role Permissions</h2>
            <div className="space-y-2">
              {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
                <div key={role} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {role}: {permissions.join(", ")}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Recent Workflow Transitions</h2>
            <div className="space-y-2">
              {ACTION_REGISTRY.filter((item) => item.actionType === "workflow-transition").map((item) => (
                <div key={item.actionId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                  {item.actionId} - {item.subjectId} - {item.status}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-xs text-slate-500">
          Safe-control-plane mode: no funds movement, no issuance, no investor approvals, no live custody or banking integration.
        </section>
      </div>
    </main>
  );
}
