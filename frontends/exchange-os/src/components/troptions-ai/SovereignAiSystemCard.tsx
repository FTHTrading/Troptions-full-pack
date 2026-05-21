"use client";

import type { TroptionsSovereignAiSystem } from "@/content/troptions-ai/sovereignAiRegistry";
import { getVerticalLabel, getRiskLevelLabel } from "@/content/troptions-ai/sovereignAiRegistry";
import Link from "next/link";

interface Props {
  system: TroptionsSovereignAiSystem;
  namespaceSlug: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-800 text-gray-400",
  simulation: "bg-yellow-900/40 text-yellow-400",
  pending_review: "bg-blue-900/40 text-blue-400",
  approved_for_internal_use: "bg-green-900/40 text-green-400",
  blocked: "bg-red-900/40 text-red-400",
  archived: "bg-gray-800 text-gray-600",
};

const RISK_STYLES: Record<string, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  restricted: "text-red-400",
};

export default function SovereignAiSystemCard({ system, namespaceSlug }: Props) {
  const statusStyle = STATUS_STYLES[system.status] ?? "bg-gray-800 text-gray-400";
  const riskStyle = RISK_STYLES[system.riskLevel] ?? "text-gray-400";

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 hover:border-[#C9A84C]/30 transition-colors">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
            {getVerticalLabel(system.vertical)}
          </p>
          <h3 className="text-sm font-semibold text-white truncate">{system.systemName}</h3>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusStyle}`}>
          {system.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-xs text-gray-500 line-clamp-2">{system.description}</p>

      {/* Metadata row */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <span className="text-gray-600 uppercase tracking-[0.2em]">Risk</span>
          <p className={`font-semibold ${riskStyle}`}>{getRiskLevelLabel(system.riskLevel)}</p>
        </div>
        <div>
          <span className="text-gray-600 uppercase tracking-[0.2em]">Deployment</span>
          <p className="text-gray-400">{system.deploymentMode.replace(/_/g, " ")}</p>
        </div>
        <div>
          <span className="text-gray-600 uppercase tracking-[0.2em]">Tools</span>
          <p className="text-gray-400">{system.enabledTools.length} enabled</p>
        </div>
        <div>
          <span className="text-gray-600 uppercase tracking-[0.2em]">Knowledge</span>
          <p className="text-gray-400">{system.knowledgeSources.length} sources</p>
        </div>
      </div>

      {/* Safety flags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className="rounded border border-yellow-800/40 bg-yellow-900/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-yellow-500">
          Simulation Only
        </span>
        {system.requiresControlHubApproval && (
          <span className="rounded border border-blue-800/40 bg-blue-900/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-400">
            Hub Approval Required
          </span>
        )}
        {system.vertical === "healthcare_admin" && (
          <span className="rounded border border-red-800/40 bg-red-900/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400">
            No PHI / No Diagnosis
          </span>
        )}
      </div>

      {/* View link */}
      <Link
        href={`/troptions-cloud/${namespaceSlug}/sovereign-ai/${system.id}`}
        className="block w-full cursor-not-allowed pointer-events-none rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-center text-xs text-gray-600"
        aria-disabled="true"
        tabIndex={-1}
      >
        View System — Simulation Only
      </Link>
    </div>
  );
}
