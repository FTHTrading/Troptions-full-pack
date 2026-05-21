"use client";

import type { TroptionsKnowledgeItem } from "@/content/troptions-ai/knowledgeVaultRegistry";
import {
  getSensitivityLabel,
  getReviewStatusLabel,
  getSourceTypeLabel,
} from "@/content/troptions-ai/knowledgeVaultRegistry";

interface Props {
  items: TroptionsKnowledgeItem[];
}

const SENSITIVITY_STYLES: Record<string, string> = {
  public: "text-green-400",
  internal: "text-blue-400",
  confidential: "text-yellow-400",
  regulated: "text-orange-400",
  healthcare_restricted: "text-red-400",
  financial_restricted: "text-red-400",
  legal_restricted: "text-red-400",
};

const REVIEW_STYLES: Record<string, string> = {
  approved: "bg-green-900/30 text-green-400",
  pending_review: "bg-yellow-900/30 text-yellow-400",
  needs_legal_review: "bg-orange-900/30 text-orange-400",
  needs_compliance_review: "bg-orange-900/30 text-orange-400",
  rejected: "bg-red-900/30 text-red-400",
  blocked: "bg-red-900/30 text-red-400",
  archived: "bg-gray-800 text-gray-600",
};

export default function KnowledgeVaultTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-8 text-center">
        <p className="text-sm text-gray-600">No knowledge items in this vault.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 border-b border-gray-800 px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Item</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Type</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Sensitivity</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Status</p>
      </div>

      {/* Rows */}
      {items.map((item) => {
        const sensitivityStyle = SENSITIVITY_STYLES[item.sensitivity] ?? "text-gray-400";
        const reviewStyle = REVIEW_STYLES[item.reviewStatus] ?? "bg-gray-800 text-gray-400";

        return (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_120px_120px_120px] gap-4 border-b border-gray-800/50 px-5 py-4 last:border-0 hover:bg-[#080C14]/40 transition-colors"
          >
            {/* Title + description */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.title}</p>
              <p className="text-xs text-gray-600 truncate">{item.description}</p>
              {item.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded bg-gray-800/60 px-1.5 py-0.5 text-[9px] text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Source type */}
            <div className="flex items-center">
              <p className="text-xs text-gray-400">{getSourceTypeLabel(item.sourceType)}</p>
            </div>

            {/* Sensitivity */}
            <div className="flex items-center">
              <p className={`text-xs font-medium ${sensitivityStyle}`}>
                {getSensitivityLabel(item.sensitivity)}
              </p>
            </div>

            {/* Review status */}
            <div className="flex items-center">
              <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${reviewStyle}`}>
                {getReviewStatusLabel(item.reviewStatus)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-gray-800 px-5 py-3">
        <p className="text-[10px] text-gray-600">
          {items.length} item{items.length !== 1 ? "s" : ""} — Simulation Only — No PHI, private keys, or credentials permitted
        </p>
      </div>
    </div>
  );
}
