import { SOVEREIGN_AI_TEMPLATES, getVerticalLabel, getRiskLevelLabel } from "@/content/troptions-ai/sovereignAiRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return SOVEREIGN_AI_TEMPLATES.map((t) => ({ templateId: t.id }));
}

interface Props {
  params: Promise<{ templateId: string }>;
}

export default async function TemplateDetailPage({ params }: Props) {
  const { templateId } = await params;
  const template = SOVEREIGN_AI_TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/troptions-ai/templates" style={{ color: "#c4a84a", textDecoration: "none", fontSize: "0.8rem" }}>
          ← Templates
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: "#c4a84a", marginBottom: "0.25rem" }}>
          {getVerticalLabel(template.vertical)}
        </p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>
          {template.name}
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.95rem", maxWidth: "600px" }}>
          {template.description}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Use Cases */}
        <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#c4a84a", marginBottom: "0.75rem" }}>
            Use Cases
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {template.useCases.map((uc, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "#b0b8c8" }}>
                <span style={{ color: "#c4a84a", flexShrink: 0 }}>›</span>
                {uc}
              </li>
            ))}
          </ul>
        </div>

        {/* Enabled Tools */}
        <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#c4a84a", marginBottom: "0.75rem" }}>
            Allowed Tools ({template.allowedTools.length})
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {template.allowedTools.map((tool) => (
              <span key={tool} style={{ background: "#0a1628", border: "1px solid #1e3058", borderRadius: "0.4rem", padding: "0.2rem 0.6rem", fontSize: "0.75rem", color: "#8a9ab5" }}>
                {tool.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Safety Notes */}
        <div style={{ background: "#0d1526", border: "1px solid #7f1d1d33", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#f87171", marginBottom: "0.75rem" }}>
            Safety Policies ({template.safetyNotes.length})
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {template.safetyNotes.map((note, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "#fca5a5" }}>
                <span style={{ color: "#ef4444", flexShrink: 0 }}>✕</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Blocked Tools */}
        {template.blockedTools.length > 0 && (
          <div style={{ background: "#0d1526", border: "1px solid #7f1d1d33", borderRadius: "0.75rem", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#f87171", marginBottom: "0.75rem" }}>
              Blocked Tools ({template.blockedTools.length})
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {template.blockedTools.map((tool) => (
                <span key={tool} style={{ background: "#200a0a", border: "1px solid #7f1d1d55", borderRadius: "0.4rem", padding: "0.2rem 0.6rem", fontSize: "0.75rem", color: "#f87171" }}>
                  {tool.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metadata bar */}
      <div style={{ marginTop: "1.5rem", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#4a5568" }}>Risk Level</p>
          <p style={{ fontSize: "0.85rem", color: "#e8e0d0", fontWeight: 600 }}>{getRiskLevelLabel(template.riskLevel)}</p>
        </div>
        <div>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#4a5568" }}>Required Approvals</p>
          <p style={{ fontSize: "0.85rem", color: "#e8e0d0" }}>{template.requiredApprovals.length} step(s)</p>
        </div>
        <div>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#4a5568" }}>Status</p>
          <p style={{ fontSize: "0.85rem", color: "#fbbf24" }}>Simulation Only</p>
        </div>
        <div>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#4a5568" }}>Control Hub</p>
          <p style={{ fontSize: "0.85rem", color: "#60a5fa" }}>Approval Required</p>
        </div>
      </div>

      {/* CTA (disabled) */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", color: "#4a5568", marginBottom: "0.75rem" }}>
          To build an AI system from this template, request a Troptions Sovereign AI build.
        </p>
        <Link
          href="/troptions-ai/sovereign"
          style={{ display: "inline-block", background: "#c9a84c1a", border: "1px solid #c9a84c4d", borderRadius: "0.5rem", padding: "0.6rem 1.5rem", color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}
        >
          Request Troptions AI Build
        </Link>
      </div>
    </div>
  );
}
