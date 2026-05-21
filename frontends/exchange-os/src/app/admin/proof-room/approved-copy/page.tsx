import { getMockApprovedCopy } from "@/lib/troptions/proof-room/approvedCopy";
import { PUBLIC_USE_LABELS } from "@/lib/troptions/proof-room/types";

export const metadata = { title: "Approved Copy — TROPTIONS Proof Room" };

export default function ApprovedCopyPage() {
  const blocks = getMockApprovedCopy();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        These are pre-approved copy blocks. Use only the "approvedText". Do not modify without re-review.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Approved Copy</h1>
        <p className="mt-1 text-gray-400 text-sm">Pre-approved text blocks for public use in TROPTIONS communications.</p>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-white">{block.blockName}</div>
              <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5">
                {PUBLIC_USE_LABELS[block.publicUseStatus]}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-3">Purpose: {block.purpose}</div>
            <div className="rounded bg-[#080C14] border border-[#C9A84C]/20 p-4">
              <div className="text-xs text-[#C9A84C] uppercase tracking-wide mb-2">Approved Text</div>
              <div className="text-sm text-gray-200 leading-relaxed">{block.approvedText}</div>
            </div>
            {block.disclaimer && (
              <div className="mt-3 rounded bg-[#080C14] border border-yellow-900/40 p-3">
                <div className="text-xs text-yellow-400 uppercase tracking-wide mb-1">Disclaimer</div>
                <div className="text-xs text-yellow-200/70">{block.disclaimer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
