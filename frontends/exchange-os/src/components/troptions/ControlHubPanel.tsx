"use client";

import { CONTROL_HUB_CONFIG, CONTROL_HUB_POLICY_SUMMARY, CONTROL_HUB_AGENT_TIERS, CLAWD_ROUTING_RULES, JEFE_CLAWD_COMMANDS } from "@/content/troptions/controlHubRegistry";
import { CLAWD_CAPABILITIES } from "@/content/troptions/clawdCapabilities";
import type { ControlHubStateSnapshot } from "@/lib/troptions/controlHubStateTypes";

// ─── sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${highlight ? "text-red-400" : "text-[#C9A84C]"}`}>{value}</p>
    </div>
  );
}

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        ok ? "bg-emerald-900/60 text-emerald-300" : "text-red-300 bg-red-900/60"
      }`}
    >
      {ok ? "✓ Allowed" : "✗ Blocked"}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-slate-800 pb-3 text-xl font-semibold text-white">{children}</h2>
  );
}

// ─── capability matrix ────────────────────────────────────────────────────────

function CapabilityMatrix() {
  const grouped = CLAWD_CAPABILITIES.reduce<Record<string, typeof CLAWD_CAPABILITIES>>(
    (acc, cap) => {
      (acc[cap.category] = acc[cap.category] || []).push(cap);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, caps]) => (
        <div key={category}>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">{category}</p>
          <div className="space-y-2">
            {caps.map((cap) => (
              <div
                key={cap.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-white">{cap.label}</span>
                  <span className="ml-3 text-slate-400">{cap.description}</span>
                </div>
                <StatusPill ok={cap.allowed} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── constraint list ──────────────────────────────────────────────────────────

function ConstraintList() {
  return (
    <ol className="space-y-2">
      {CONTROL_HUB_POLICY_SUMMARY.constraints.map((constraint, i) => (
        <li key={i} className="flex gap-3 rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          <span className="shrink-0 font-mono text-amber-500">{String(i + 1).padStart(2, "0")}</span>
          {constraint}
        </li>
      ))}
    </ol>
  );
}

// ─── agent tiers ──────────────────────────────────────────────────────────────

function AgentTierGrid() {
  const tierColors: Record<string, string> = {
    fast: "border-sky-800 bg-sky-950/30 text-sky-300",
    deep: "border-[#C9A84C]/40 bg-amber-950/20 text-[#C9A84C]",
    specialist: "border-slate-700 bg-slate-900 text-slate-300",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CONTROL_HUB_AGENT_TIERS.map((tier) => (
        <div key={tier.tier} className={`rounded-xl border p-5 ${tierColors[tier.tier]}`}>
          <p className="text-xs uppercase tracking-widest opacity-70">{tier.tier} tier</p>
          <p className="mt-1 text-base font-semibold">{tier.label}</p>
          <p className="mt-2 text-xs leading-5 opacity-80">{tier.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {tier.agents.map((a) => (
              <span key={a} className="rounded bg-black/30 px-2 py-0.5 text-xs">
                {a}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs opacity-60">
            Governance: <strong>{tier.governanceModel}</strong> •{" "}
            {tier.humanApprovalRequired ? "Human approval required" : "No approval required"}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── routing rules ────────────────────────────────────────────────────────────

function RoutingRulesTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Intent Pattern</th>
            <th className="px-4 py-3 text-left">Routed To</th>
            <th className="px-4 py-3 text-left">Approval</th>
            <th className="px-4 py-3 text-left">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {CLAWD_ROUTING_RULES.map((rule) => (
            <tr key={rule.intentPattern} className="bg-slate-950/50 hover:bg-slate-900/60 transition-colors">
              <td className="px-4 py-3 font-mono text-[#C9A84C]">{rule.intentPattern}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {rule.routedTo.map((agent) => (
                    <span key={agent} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {agent}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                {rule.requiresApproval ? (
                  <span className="text-amber-400 text-xs font-semibold">Required</span>
                ) : (
                  <span className="text-slate-500 text-xs">Not required</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs">{rule.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Jefe commands that invoke Clawd ──────────────────────────────────────────

function JefeClawdCommands() {
  if (JEFE_CLAWD_COMMANDS.length === 0) {
    return <p className="text-sm text-slate-500 italic">No Jefe commands currently route to Clawd.</p>;
  }
  return (
    <div className="space-y-3">
      {JEFE_CLAWD_COMMANDS.map((cmd) => (
        <div key={cmd.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#C9A84C]">{cmd.id}</span>
            <span className="text-sm text-white">&ldquo;{cmd.prompt}&rdquo;</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="opacity-60">Agents:</span>
            {cmd.routedAgents.map((a) => (
              <span key={a} className="rounded bg-slate-800 px-2 py-0.5">{a}</span>
            ))}
            <span className="ml-2 opacity-60">Sources:</span>
            {cmd.sources.map((s) => (
              <span key={s} className="rounded bg-slate-800 px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── persisted state summary ──────────────────────────────────────────────────

const PERSISTENCE_MODE_LABELS: Record<string, string> = {
  postgres: "Postgres (durable)",
  sqlite: "SQLite (local)",
  unavailable: "Unavailable",
};

function PersistenceStateSection({ snapshot }: { snapshot: ControlHubStateSnapshot }) {
  const modeLabel = PERSISTENCE_MODE_LABELS[snapshot.persistenceMode] ?? snapshot.persistenceMode;
  const isLive = snapshot.persistenceMode !== "unavailable";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" : "bg-slate-500"}`}
        />
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Governance Persistence — {modeLabel}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Tasks" value={snapshot.totalTasks} />
        <StatCard label="Simulations" value={snapshot.totalSimulations} />
        <StatCard label="Awaiting Approval" value={snapshot.totalApprovalRequired} highlight={snapshot.totalApprovalRequired > 0} />
        <StatCard label="Blocked Actions" value={snapshot.totalBlockedActions} highlight={snapshot.totalBlockedActions > 0} />
        <StatCard label="Audit Entries" value={snapshot.totalAuditEntries} />
        <StatCard label="Recommendations" value={snapshot.totalRecommendations} />
      </div>
      {snapshot.lastUpdatedAt && (
        <p className="text-xs text-slate-500">
          Last activity:{" "}
          <span className="font-mono text-slate-400">
            {new Date(snapshot.lastUpdatedAt).toLocaleString()}
          </span>
        </p>
      )}
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────

export function ControlHubPanel({ snapshot }: { snapshot?: ControlHubStateSnapshot }) {
  const cfg = CONTROL_HUB_CONFIG;

  return (
    <div className="space-y-12">
      {/* stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="System constraints" value={cfg.constraintCount} />
        <StatCard label="Allowed capabilities" value={cfg.allowedCapabilityCount} />
        <StatCard label="Blocked capabilities" value={cfg.blockedCapabilityCount} highlight />
        <StatCard label="OpenClaw blocked actions" value={cfg.enforcedPolicies.openClawBlocked} highlight />
        <StatCard label="Jefe blocked actions" value={cfg.enforcedPolicies.jefeBlocked} highlight />
        <StatCard label="Routing rules" value={CLAWD_ROUTING_RULES.length} />
      </section>

      {/* governance mode banner */}
      <section className="rounded-xl border border-[#C9A84C]/30 bg-amber-950/20 px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <div>
            <p className="text-xs uppercase tracking-widest text-[#C9A84C]">Governance Mode Active</p>
            <p className="mt-0.5 text-sm text-white">{cfg.label}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
              Mode: {cfg.activeMode}
            </span>
            <span className="rounded-full border border-amber-700 bg-amber-950 px-3 py-1 text-amber-300">
              Audit: {cfg.auditModel}
            </span>
            <span className="rounded-full border border-orange-700 bg-orange-950 px-3 py-1 text-orange-300">
              Human review required
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">{cfg.description}</p>
      </section>

      {/* agent tiers */}
      <section className="space-y-4">
        <SectionHeader>Agent Governance Tiers</SectionHeader>
        <AgentTierGrid />
      </section>

      {/* capability matrix */}
      <section className="space-y-4">
        <SectionHeader>Clawd Capability Matrix</SectionHeader>
        <CapabilityMatrix />
      </section>

      {/* system prompt constraints */}
      <section className="space-y-4">
        <SectionHeader>Enforced System Prompt Constraints</SectionHeader>
        <ConstraintList />
      </section>

      {/* routing rules */}
      <section className="space-y-4">
        <SectionHeader>Intent Routing Rules</SectionHeader>
        <RoutingRulesTable />
      </section>

      {/* Jefe → Clawd commands */}
      <section className="space-y-4">
        <SectionHeader>Jefe Commands That Invoke Clawd</SectionHeader>
        <JefeClawdCommands />
      </section>

      {/* persisted state */}
      {snapshot && (
        <section className="space-y-4">
          <SectionHeader>Persisted Governance State</SectionHeader>
          <PersistenceStateSection snapshot={snapshot} />
        </section>
      )}
    </div>
  );
}
