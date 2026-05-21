const CARDS = [
  { id: "rag-status", label: "RAG Index Status", value: "6,333+ chunks", detail: "nomic-embed-text · 5 repos · last run: incremental", color: "#22c55e", status: "active" },
  { id: "mcp-tools", label: "MCP Tool Registry", value: "7 active / 3 blocked", detail: "Blocked: approve, issue, settle", color: "#60a5fa", status: "active" },
  { id: "clawd-planner", label: "Clawd Planning Agent", value: "Simulation Mode", detail: "Awaiting compliance gate for live activation", color: "#a78bfa", status: "gated" },
  { id: "ai-search", label: "AI Search Layer", value: "8 entries indexed", detail: "AiSearchRegistry · 6 topic clusters · llms.txt live", color: "#22c55e", status: "active" },
  { id: "entity-registry", label: "AI Entity Registry", value: "12 entities", detail: "Organizations, products, protocols, compliance", color: "#22c55e", status: "active" },
  { id: "knowledge-graph", label: "Knowledge Graph", value: "22 nodes · 18 edges", detail: "XRPL, SBLC, POF, RWA, Compliance, AI nodes", color: "#22c55e", status: "active" },
  { id: "insights-corpus", label: "Insights Corpus", value: "20 insights", detail: "5 categories · RSS + JSON feed + sitemap live", color: "#22c55e", status: "active" },
  { id: "x402-readiness", label: "x402 Protocol Readiness", value: "3 ready / 3 gated", detail: "Payment-intent: dry-run · compliance gate pending", color: "#f59e0b", status: "gated" },
  { id: "telecom-ops", label: "Telecom Operations", value: "5 capabilities", detail: "Telnyx provider gated · TCPA consent required", color: "#f59e0b", status: "gated" },
  { id: "trading-sim", label: "Trading AI Simulations", value: "3 models active", detail: "XRPL AMM · settlement route · liquidity depth", color: "#60a5fa", status: "simulation" },
  { id: "trust-manifest", label: "Machine-Readable Trust", value: "6 gates defined", detail: "manifest + disclaimers + release-gates APIs live", color: "#22c55e", status: "active" },
  { id: "agent-count", label: "Registered AI Agents", value: "1 defined", detail: "Clawd planner · additional agents pending", color: "#a78bfa", status: "simulation" },
  { id: "audit-trail", label: "AI Ops Audit Trail", value: "All actions logged", detail: "MCP tools audit-logged · idempotency enforced", color: "#22c55e", status: "active" },
  { id: "gate-compliance", label: "Gate Compliance", value: "0 / 6 gates active", detail: "All capabilities gated. No live AI ops until gates satisfied.", color: "#f59e0b", status: "gated" },
];

const STATUS_COLOR: Record<string, string> = {
  active: "#22c55e",
  gated: "#f59e0b",
  simulation: "#60a5fa",
};

const DISCLAIMER =
  "Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates.";

export default function AdminAiOpsPage() {
  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#e8e0d0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Admin — AI Operations
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.5rem" }}>
          AI Ops Center
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Monitor all AI infrastructure components: RAG, MCP tools, agents, knowledge graph, x402, telecom, and trust layer.
        </p>

        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Active Components", value: CARDS.filter((c) => c.status === "active").length, color: "#22c55e" },
            { label: "Gated Components", value: CARDS.filter((c) => c.status === "gated").length, color: "#f59e0b" },
            { label: "Simulation Mode", value: CARDS.filter((c) => c.status === "simulation").length, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0d1526", border: `1px solid ${s.color}`, borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {CARDS.map((card) => (
            <div key={card.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#c4a84a", margin: 0 }}>{card.label}</h3>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "#0a0f1a", color: STATUS_COLOR[card.status] ?? "#9ca3af", border: `1px solid ${STATUS_COLOR[card.status] ?? "#1e3058"}` }}>
                  {card.status}
                </span>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: card.color, marginBottom: "0.25rem" }}>{card.value}</div>
              <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{card.detail}</div>
            </div>
          ))}
        </div>

        {/* API quick reference */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>AI Ops API Quick Reference</h2>
        <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          {[
            ["GET", "/api/troptions/ai/summary", "AI layer summary"],
            ["GET", "/api/troptions/ai/entities", "Entity registry"],
            ["GET", "/api/troptions/ai/knowledge-graph", "Knowledge graph"],
            ["GET", "/api/troptions/mcp/tools", "MCP tool registry"],
            ["POST", "/api/troptions/rag/query", "RAG semantic query (auth)"],
            ["POST", "/api/troptions/clawd/plan", "Clawd planning (auth + idempotency)"],
            ["GET", "/api/troptions/x402/readiness", "x402 readiness report"],
            ["GET", "/api/troptions/telecom/status", "Telecom status"],
            ["GET", "/api/troptions/trust/manifest", "Trust manifest"],
            ["GET", "/api/troptions/trust/audit-status", "Audit status"],
          ].map(([method, path, desc]) => (
            <div key={path} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid #0a0f1a" }}>
              <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "3px", background: method === "GET" ? "#1e3a5f" : "#3b2f00", color: method === "GET" ? "#60a5fa" : "#f59e0b", minWidth: "36px", textAlign: "center" }}>{method}</span>
              <code style={{ fontSize: "0.78rem", color: "#c4a84a", flex: 1 }}>{path}</code>
              <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{desc}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", fontSize: "0.8rem", color: "#6b7280" }}>
          <strong style={{ color: "#9ca3af" }}>Institutional Disclaimer:</strong> {DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
