import { buildFaqJsonLd, ORG_JSONLD, SOFTWARE_JSONLD } from "@/content/troptions/aiSchemaRegistry";

export const metadata = {
  title: "Machine-Readable Trust — Troptions AI",
  description: "JSON-LD schema, disclaimers, gate registry, and trust manifests for institutional AI discovery.",
};

export default function MachineReadableTrustPage() {
  const faq = buildFaqJsonLd();

  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Trust Infrastructure</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Machine-Readable Trust</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Structured trust data: JSON-LD schema, institutional disclaimers, release gate registry, and
        proof room audit status. Designed for AI systems, compliance bots, and institutional verifiers.
      </p>

      {/* Trust API endpoints */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Trust API Endpoints</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { path: "/api/troptions/trust/manifest", desc: "Full trust manifest with what Troptions is and is not" },
            { path: "/api/troptions/trust/disclaimers", desc: "All institutional disclaimers in structured JSON" },
            { path: "/api/troptions/trust/release-gates", desc: "Gate registry for all capabilities" },
            { path: "/api/troptions/trust/proof-room", desc: "Proof room audit status (auth required)" },
            { path: "/api/troptions/trust/audit-status", desc: "Public audit status summary" },
          ].map((ep) => (
            <div key={ep.path} style={{ display: "flex", gap: "1rem", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "6px", padding: "0.75rem 1rem", flexWrap: "wrap" }}>
              <code style={{ color: "#c4a84a", fontSize: "0.8rem", minWidth: "320px" }}>{ep.path}</code>
              <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Organization JSON-LD preview */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Organization Schema (JSON-LD)</h2>
        <pre style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", color: "#9ca3af", fontSize: "0.8rem", overflow: "auto" }}>
          {JSON.stringify(ORG_JSONLD, null, 2)}
        </pre>
      </div>

      {/* Software JSON-LD */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Software Application Schema</h2>
        <pre style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", color: "#9ca3af", fontSize: "0.8rem", overflow: "auto" }}>
          {JSON.stringify(SOFTWARE_JSONLD, null, 2)}
        </pre>
      </div>

      {/* FAQ JSON-LD */}
      <div>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>FAQ Schema (JSON-LD)</h2>
        <pre style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", color: "#9ca3af", fontSize: "0.8rem", overflow: "auto", maxHeight: "400px" }}>
          {JSON.stringify(faq, null, 2)}
        </pre>
      </div>
    </div>
  );
}
