"use client";

import type { TroptionsSovereignAiTemplate } from "@/content/troptions-ai/sovereignAiRegistry";
import { getVerticalLabel, getRiskLevelLabel } from "@/content/troptions-ai/sovereignAiRegistry";
import Link from "next/link";

interface Props {
  template: TroptionsSovereignAiTemplate;
}

const RISK_STYLES: Record<string, string> = {
  low: "text-green-400 border-green-900/40 bg-green-900/10",
  medium: "text-yellow-400 border-yellow-900/40 bg-yellow-900/10",
  high: "text-orange-400 border-orange-900/40 bg-orange-900/10",
  restricted: "text-red-400 border-red-900/40 bg-red-900/10",
};

export default function SovereignAiTemplateCard({ template }: Props) {
  const riskStyle = RISK_STYLES[template.riskLevel] ?? "text-gray-400 border-gray-800 bg-gray-800";

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 hover:border-[#C9A84C]/30 transition-colors">
      {/* Header */}
      <div className="mb-1">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          {getVerticalLabel(template.vertical)}
        </p>
        <h3 className="text-sm font-semibold text-white">{template.name}</h3>
      </div>

      {/* Description */}
      <p className="mb-4 text-xs text-gray-500 line-clamp-3">{template.description}</p>

      {/* Use cases */}
      <div className="mb-4">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-600">Use Cases</p>
        <ul className="space-y-0.5">
          {template.useCases.slice(0, 3).map((uc, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="text-[#C9A84C]">›</span>
              {uc}
            </li>
          ))}
          {template.useCases.length > 3 && (
            <li className="text-xs text-gray-600">+{template.useCases.length - 3} more</li>
          )}
        </ul>
      </div>

      {/* Risk badge */}
      <div className="mb-4">
        <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${riskStyle}`}>
          {getRiskLevelLabel(template.riskLevel)} Risk
        </span>
      </div>

      {/* Safety notes count */}
      {template.safetyNotes.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-900/30 bg-red-900/5 px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400">
            {template.safetyNotes.length} Safety Policies
          </p>
        </div>
      )}

      {/* Flags */}
      <div className="mb-4 flex flex-wrap gap-1">
        <span className="rounded border border-yellow-800/40 bg-yellow-900/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-yellow-500">
          Simulation Only
        </span>
        <span className="rounded border border-blue-800/40 bg-blue-900/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-400">
          Hub Approval
        </span>
      </div>

      {/* CTA */}
      <Link
        href={`/troptions-ai/templates/${template.id}`}
        className="block w-full rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-2 text-center text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
      >
        View Template
      </Link>
    </div>
  );
}
