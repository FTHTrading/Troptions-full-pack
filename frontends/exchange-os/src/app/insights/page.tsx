import Link from "next/link";
import { INSIGHTS, INSIGHT_CATEGORIES, EDITORIAL_DISCLAIMER } from "@/content/troptions/insightsRegistry";

export const metadata = {
  title: "Insights — Troptions Institutional Infrastructure",
  description: "Institutional insights on RWA, settlement, compliance, AI infrastructure, and Troptions workflows.",
};

const CAT_COLOR: Record<string, string> = {
  infrastructure: "#60a5fa",
  settlement: "#22c55e",
  "asset-classes": "#c4a84a",
  compliance: "#f59e0b",
  "ai-agentic": "#a78bfa",
};

export default function InsightsIndexPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Institutional Research
      </p>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Troptions Insights</h1>
      <p style={{ color: "#9ca3af", marginBottom: "1rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Infrastructure concepts, workflow models, and compliance frameworks — designed for institutional
        teams evaluating RWA, settlement, and AI-era operating systems.
      </p>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "2.5rem", maxWidth: "680px", lineHeight: 1.6 }}>
        {EDITORIAL_DISCLAIMER}
      </p>

      {/* Category filter links */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
        <Link href="/insights" style={{ padding: "0.3rem 0.75rem", background: "#1e3058", border: "1px solid #2d4a7a", borderRadius: "20px", color: "#c4a84a", textDecoration: "none", fontSize: "0.8rem" }}>
          All ({INSIGHTS.length})
        </Link>
        {INSIGHT_CATEGORIES.map((cat) => {
          const count = INSIGHTS.filter((i) => i.category === cat.id).length;
          return (
            <Link key={cat.id} href={`/insights?category=${cat.id}`} style={{ padding: "0.3rem 0.75rem", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "20px", color: "#9ca3af", textDecoration: "none", fontSize: "0.8rem" }}>
              {cat.label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Insight cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {INSIGHTS.map((insight) => (
          <Link key={insight.id} href={`/insights/${insight.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <h2 style={{ color: "#e8e0d0", fontSize: "1.05rem", fontWeight: 600, maxWidth: "640px", lineHeight: 1.4 }}>
                  {insight.title}
                </h2>
                <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: "#1e3058", color: CAT_COLOR[insight.category] ?? "#9ca3af", whiteSpace: "nowrap" }}>
                  {insight.category}
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{insight.summary}</p>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#6b7280", flexWrap: "wrap" }}>
                <span>{insight.date}</span>
                <span>{insight.readingTime} read</span>
                {insight.tags.slice(0, 4).map((tag) => (
                  <span key={tag} style={{ color: "#4b5563" }}>#{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
