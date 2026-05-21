import type { NamespaceAiInfrastructureProfile } from "@/lib/troptions-cloud/namespaceAiX402Types";

interface Props {
  profile: NamespaceAiInfrastructureProfile;
}

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  groq: "Groq",
  mistral: "Mistral",
  gemini: "Gemini",
  cohere: "Cohere",
  together: "Together AI",
  local_ollama: "Local (Ollama)",
  azure_openai: "Azure OpenAI",
};

export default function NamespaceModelRoutingPanel({ profile }: Props) {
  const routing = profile.modelRoutingPolicy.fallbackBehavior;
  const blocked = profile.blockedModelProviders;
  const allowed = profile.allowedModelProviders;

  return (
    <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Model Routing Policy</h3>
        <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#C9A84C] uppercase tracking-wider">
          {routing}
        </span>
      </div>

      {/* Allowed providers */}
      {allowed.length > 0 && (
        <div>
          <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-widest mb-2">
            Allowed Providers
          </p>
          <div className="flex flex-wrap gap-2">
            {allowed.map((p) => (
              <span
                key={p}
                className="rounded-full bg-emerald-900/30 px-2.5 py-0.5 text-[10px] text-emerald-400 font-semibold"
              >
                {PROVIDER_LABELS[p] ?? p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Blocked providers */}
      {blocked.length > 0 && (
        <div>
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">
            Blocked Providers
          </p>
          <div className="flex flex-wrap gap-2">
            {blocked.map((p) => (
              <span
                key={p}
                className="rounded-full bg-red-900/30 px-2.5 py-0.5 text-[10px] text-red-400 font-semibold"
              >
                {PROVIDER_LABELS[p] ?? p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Safety note */}
      <div className="rounded-lg bg-[#080C14] px-4 py-3 border border-gray-800">
        <p className="text-[11px] text-gray-400">
          All routing decisions are simulation-only. No external API calls are triggered.
          Control Hub approval is required before any live routing is enabled.
        </p>
      </div>
    </div>
  );
}
