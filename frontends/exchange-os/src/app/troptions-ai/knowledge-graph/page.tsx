import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from "@/content/troptions/aiKnowledgeGraph";

export const metadata = {
  title: "Knowledge Graph — Troptions AI",
  description: "Entity relationship graph for Troptions institutional platform.",
};

export default function KnowledgeGraphPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI Knowledge Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Knowledge Graph</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        {KNOWLEDGE_NODES.length} nodes · {KNOWLEDGE_EDGES.length} edges. Represents the institutional entity
        relationships within Troptions infrastructure.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {KNOWLEDGE_NODES.map((node) => (
          <div key={node.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ minWidth: "180px" }}>
              <div style={{ color: "#c4a84a", fontWeight: 600, fontSize: "0.95rem" }}>{node.label}</div>
              <div style={{ color: "#6b7280", fontSize: "0.75rem", fontStyle: "italic", marginTop: "0.2rem" }}>{node.type}</div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.5rem" }}>{node.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {node.connections.map((conn) => (
                  <span key={conn} style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "3px", color: "#9ca3af" }}>
                    → {conn}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
