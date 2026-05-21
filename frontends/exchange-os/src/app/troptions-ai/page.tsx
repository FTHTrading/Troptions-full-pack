import Link from "next/link";
import { AI_SEARCH_REGISTRY } from "@/content/troptions/aiSearchRegistry";
import { AI_ENTITY_REGISTRY } from "@/content/troptions/aiEntityRegistry";
import { KNOWLEDGE_NODES } from "@/content/troptions/aiKnowledgeGraph";
import { AI_CITATION_REGISTRY } from "@/content/troptions/aiCitationRegistry";

export const metadata = {
  title: "Troptions AI Search & Discovery Layer",
  description:
    "Structured AI search optimization, entity graph, knowledge base, and machine-readable trust for Troptions institutional infrastructure.",
};

export default function TroptionsAiPage() {
  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          AI-Era Infrastructure
        </p>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>
          Troptions AI Search &amp; Discovery Layer
        </h1>
        <p style={{ color: "#9ca3af", maxWidth: "720px", lineHeight: 1.7 }}>
          Machine-readable knowledge infrastructure for AI search engines, LLMs, and agentic systems.
          Structured entity data, knowledge graph, citations, and trust manifests — enabling accurate,
          compliant AI discovery of Troptions capabilities.
        </p>
        <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "6px", fontSize: "0.85rem", color: "#9ca3af", maxWidth: "720px" }}>
          <strong style={{ color: "#c4a84a" }}>Institutional Disclaimer:</strong>{" "}
          Troptions provides institutional operating infrastructure subject to provider, legal, compliance,
          custody, jurisdiction, and board approval gates. Not a bank, broker-dealer, exchange, or custodian.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {[
          { label: "AI Search Entries", value: AI_SEARCH_REGISTRY.length },
          { label: "Named Entities", value: AI_ENTITY_REGISTRY.length },
          { label: "Knowledge Nodes", value: KNOWLEDGE_NODES.length },
          { label: "AI Citations", value: AI_CITATION_REGISTRY.length },
          { label: "Public AI Files", value: 6 },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#c4a84a" }}>{stat.value}</div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.25rem" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Navigation cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {[
          { href: "/troptions-ai/search-optimization", title: "Search Optimization", desc: "AI search entries with gate status, keywords, and entity types for structured discovery." },
          { href: "/troptions-ai/entities", title: "Entity Registry", desc: "Named entities with types, attributes, relationships, and compliance annotations." },
          { href: "/troptions-ai/knowledge-graph", title: "Knowledge Graph", desc: "Connected node graph of Troptions entities, capabilities, and relationships." },
          { href: "/troptions-ai/ai-citations", title: "AI Citations", desc: "Authoritative source URLs for AI systems answering questions about Troptions." },
          { href: "/troptions-ai/machine-readable-trust", title: "Machine-Readable Trust", desc: "JSON-LD schema, disclaimers, release gates, and audit-ready compliance manifests." },
          { href: "/troptions-ai/llms", title: "LLMs.txt", desc: "Raw llms.txt content and AI crawler access policy for LLM training and indexing." },
          { href: "/troptions-ai/feeds", title: "Feeds & Sitemaps", desc: "JSON feed, RSS, sitemap, and structured data endpoints for AI content ingestion." },
          { href: "/troptions-ai/x402", title: "x402 Readiness", desc: "Machine-payable API protocol readiness — dry-run until provider and board approval." },
          { href: "/troptions-ai/telecom", title: "Telecom Concierge", desc: "Telnyx institutional communications — TCPA/CTIA consent-tracked, compliance-gated." },
        ].map((card) => (
          <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem", transition: "border-color 0.2s" }}>
              <h3 style={{ color: "#c4a84a", fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{card.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Public files */}
      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Public AI-Readable Files</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { path: "/llms.txt", desc: "Primary LLM knowledge file" },
            { path: "/ai.txt", desc: "AI crawler access policy" },
            { path: "/troptions-knowledge.json", desc: "Structured capabilities JSON" },
            { path: "/troptions-entity-map.json", desc: "Entity relationship map" },
            { path: "/troptions-capabilities.json", desc: "Full capabilities with gate status" },
            { path: "/troptions-proof-index.json", desc: "Proof-gated issuance index" },
          ].map((f) => (
            <div key={f.path} style={{ display: "flex", gap: "1rem", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "6px", padding: "0.75rem 1rem", alignItems: "center" }}>
              <a href={f.path} target="_blank" rel="noopener noreferrer" style={{ color: "#c4a84a", fontFamily: "monospace", fontSize: "0.85rem", minWidth: "280px" }}>
                {f.path}
              </a>
              <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
