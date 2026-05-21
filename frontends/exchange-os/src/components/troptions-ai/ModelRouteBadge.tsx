"use client";

import type { TroptionsModelRoute } from "@/lib/troptions-ai/modelRouter";

interface Props {
  route: TroptionsModelRoute;
}

const PROVIDER_COLORS: Record<string, string> = {
  troptions_placeholder: "border-[#C9A84C]/30 bg-[#C9A84C]/5 text-[#C9A84C]",
  openai_placeholder: "border-gray-700 bg-gray-800/30 text-gray-400",
  anthropic_placeholder: "border-gray-700 bg-gray-800/30 text-gray-400",
  google_placeholder: "border-gray-700 bg-gray-800/30 text-gray-400",
  ollama_local_placeholder: "border-blue-900/40 bg-blue-900/10 text-blue-400",
  custom_private_model_placeholder: "border-purple-900/40 bg-purple-900/10 text-purple-400",
};

export default function ModelRouteBadge({ route }: Props) {
  const colorStyle = PROVIDER_COLORS[route.provider] ?? "border-gray-700 bg-gray-800 text-gray-400";

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${colorStyle}`}>
      {/* Availability dot — always red/unavailable */}
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" title="Unavailable — Simulation Only" />

      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">{route.modelLabel}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {route.isExternal && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">External</span>
          )}
          {route.isLocal && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-blue-500">Local</span>
          )}
          <span className="text-[9px] uppercase tracking-[0.2em] text-yellow-600">Simulation Only</span>
        </div>
      </div>
    </div>
  );
}
