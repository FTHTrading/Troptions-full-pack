import { SOVEREIGN_AI_TEMPLATES } from "@/content/troptions-ai/sovereignAiRegistry";
import SovereignAiTemplateCard from "@/components/troptions-ai/SovereignAiTemplateCard";

export const metadata = {
  title: "Sovereign AI Templates | Troptions AI",
  description: "Browse all Troptions Sovereign AI system templates by vertical.",
};

export default function TroptionsAiTemplatesPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: "#c4a84a" }}>
          Troptions AI
        </p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem", color: "#e8e0d0" }}>
          Sovereign AI Templates
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.95rem" }}>
          Browse all {SOVEREIGN_AI_TEMPLATES.length} Troptions Sovereign AI system templates. Each template defines
          the vertical, use cases, safety policies, enabled tools, and knowledge structure for a client-specific
          AI system. All templates are simulation-only.
        </p>
      </div>

      {/* Safety note */}
      <div style={{ background: "#0d1526", border: "1px solid #c9a84c33", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9a84c", marginBottom: "0.25rem" }}>
          Simulation Only
        </p>
        <p style={{ fontSize: "0.85rem", color: "#8a9ab5" }}>
          All templates require Control Hub approval before activation. Healthcare templates include strict
          no-diagnosis, no-PHI, no-clinical-decision-support policies. Financial templates block investment
          advice and securities tools. No live AI systems are deployed in this phase.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOVEREIGN_AI_TEMPLATES.map((template) => (
          <SovereignAiTemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
