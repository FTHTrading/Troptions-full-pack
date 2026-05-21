import { AI_SEARCH_REGISTRY } from "@/content/troptions/aiSearchRegistry";

export const metadata = {
  title: "AI Search Optimization — Troptions",
  description: "Structured AI search entries with gate status, entity types, and keywords for institutional AI discovery.",
};

const STATUS_COLOR: Record<string, string> = {
  live: "#22c55e",
  gated: "#c4a84a",
  simulation: "#60a5fa",
  planned: "#9ca3af",
};

export default function AiSearchOptimizationPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI Search Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Search Optimization Registry</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Structured search entries for AI search engines, LLMs, and discovery systems.
        Each entry includes entity type, gate status, and institutional keywords.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {AI_SEARCH_REGISTRY.map((entry) => (
          <div key={entry.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h2 style={{ color: "#e8e0d0", fontSize: "1rem", fontWeight: 600 }}>{entry.title}</h2>
              <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: "#1e3058", color: STATUS_COLOR[entry.status] ?? "#9ca3af" }}>
                {entry.status}
              </span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{entry.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {entry.keywords.map((kw) => (
                <span key={kw} style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "4px", color: "#c4a84a" }}>
                  {kw}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              <strong style={{ color: "#9ca3af" }}>Gate:</strong> {entry.gateStatus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
