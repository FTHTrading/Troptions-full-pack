"use client";

import type { TroptionsPolicyDecision } from "@/lib/troptions-ai/sovereignAiPolicyEngine";

interface Props {
  decision: TroptionsPolicyDecision;
  title?: string;
}

export default function AiPolicyGatePanel({ decision, title = "Policy Gate" }: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
            Troptions AI
          </p>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>

        {/* Gate status */}
        <div className="text-right">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              decision.allowedForSimulation
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
          >
            {decision.allowedForSimulation ? "Simulation Allowed" : "Blocked"}
          </span>
          <p className="mt-1 text-[9px] text-gray-600 uppercase tracking-[0.2em]">Live: Blocked</p>
        </div>
      </div>

      {/* Blockers */}
      {decision.blockers.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-900/30 bg-red-900/5 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
            Blockers ({decision.blockers.length})
          </p>
          <ul className="space-y-1">
            {decision.blockers.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-300">
                <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {decision.warnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-900/30 bg-yellow-900/5 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Warnings ({decision.warnings.length})
          </p>
          <ul className="space-y-1">
            {decision.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-yellow-300">
                <span className="mt-0.5 shrink-0 text-yellow-500">⚠</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required approvals */}
      {decision.requiredApprovals.length > 0 && (
        <div className="mb-4 rounded-lg border border-blue-900/30 bg-blue-900/5 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
            Required Approvals ({decision.requiredApprovals.length})
          </p>
          <ul className="space-y-1">
            {decision.requiredApprovals.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-blue-300">
                <span className="mt-0.5 shrink-0 text-blue-500">→</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Always-blocked live note */}
      <div className="rounded-lg border border-yellow-800/30 bg-yellow-900/5 px-3 py-2">
        <p className="text-[10px] text-yellow-600">
          Live execution is disabled in all Troptions AI systems. Control Hub approval required before any production activation.
        </p>
      </div>
    </div>
  );
}
