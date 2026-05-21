export const metadata = {
  title: "Feeds & Sitemaps — Troptions AI",
  description: "JSON feed, RSS, sitemap, and structured data endpoints for AI content ingestion.",
};

export default function FeedsPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI Distribution Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Feeds &amp; Sitemaps</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Structured content feeds and sitemaps for AI indexers, RSS readers, and content aggregators.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {[
          { path: "/api/insights/feed.json", label: "Insights JSON Feed", desc: "Latest institutional insights in JSON feed format" },
          { path: "/api/insights/rss.xml", label: "Insights RSS Feed", desc: "RSS 2.0 feed for institutional insights" },
          { path: "/api/insights/sitemap.xml", label: "Insights Sitemap", desc: "XML sitemap for insights content" },
          { path: "/api/troptions/ai/summary", label: "AI Summary API", desc: "Structured Troptions summary for AI systems" },
          { path: "/api/troptions/ai/entities", label: "Entities API", desc: "Named entity registry in JSON" },
          { path: "/api/troptions/ai/knowledge-graph", label: "Knowledge Graph API", desc: "Full node/edge graph in JSON" },
          { path: "/api/troptions/ai/capabilities", label: "Capabilities API", desc: "Capability registry with gate status" },
          { path: "/api/troptions/ai/proof-index", label: "Proof Index API", desc: "Proof-gated issuance index" },
          { path: "/api/troptions/ai/llms", label: "LLMs.txt API", desc: "llms.txt served as JSON object" },
        ].map((feed) => (
          <div key={feed.path} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <code style={{ color: "#c4a84a", fontSize: "0.8rem", minWidth: "280px" }}>{feed.path}</code>
              <div>
                <div style={{ color: "#e8e0d0", fontSize: "0.85rem", fontWeight: 500 }}>{feed.label}</div>
                <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{feed.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
