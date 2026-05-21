import { AI_ENTITY_REGISTRY } from "@/content/troptions/aiEntityRegistry";

export const metadata = {
  title: "Entity Registry — Troptions AI",
  description: "Named entities in the Troptions knowledge system with types, relationships, and compliance attributes.",
};

const STATUS_COLOR: Record<string, string> = { active: "#22c55e", planned: "#9ca3af", gated: "#c4a84a" };

export default function EntitiesPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI Knowledge Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Entity Registry</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Named entities in the Troptions institutional knowledge system.
        Used by AI search engines, LLMs, and agentic systems for accurate entity resolution.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        {AI_ENTITY_REGISTRY.map((entity) => (
          <div key={entity.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <h2 style={{ color: "#c4a84a", fontSize: "0.95rem", fontWeight: 600 }}>{entity.name}</h2>
              <span style={{ fontSize: "0.7rem", color: STATUS_COLOR[entity.status] ?? "#9ca3af" }}>{entity.status}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem", fontStyle: "italic" }}>{entity.type}</p>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{entity.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
              {entity.relatedEntities.slice(0, 5).map((rel) => (
                <span key={rel} style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "3px", color: "#9ca3af" }}>
                  {rel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
