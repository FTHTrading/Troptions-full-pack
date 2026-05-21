import Link from "next/link";
import { SOVEREIGN_AI_TEMPLATES } from "@/content/troptions-ai/sovereignAiRegistry";

export const metadata = {
  title: "Build Your Own Sovereign AI System | Troptions AI",
  description:
    "Troptions creates client-specific AI systems built around your documents, workflows, rules, team, and goals — not a one-size-fits-all corporate chatbot.",
};

const INDUSTRIES = [
  "Media & Broadcasting",
  "Healthcare Administration",
  "Real Estate & Property",
  "Business Services",
  "Legal & Compliance",
  "Entertainment & Talent",
  "News & Publishing",
  "Enterprise Operations",
  "Education & Training",
  "Faith & Community",
  "Non-Profit & Advocacy",
  "Financial Services (General Info Only)",
];

const FEATURES = [
  {
    title: "Private Client Namespace",
    description:
      "Each client gets a dedicated Troptions namespace — a private workspace with its own identity, access controls, and governance layer.",
  },
  {
    title: "Client Knowledge Vault",
    description:
      "Upload your documents, FAQs, policies, and procedures. The AI learns from your specific content — not generic web data.",
  },
  {
    title: "Custom AI Rules",
    description:
      "Define exactly what the AI can and cannot do. Set restrictions, prohibited topics, required tone, and output formats for your use case.",
  },
  {
    title: "Workflow Tools",
    description:
      "Connect the AI to specific client workflows: content generation, Q&A, form completion, summarization, and more — scoped to your operations.",
  },
  {
    title: "Proof & Audit Trail",
    description:
      "Every AI system action is logged in the Troptions proof and audit layer. Every change, every approval, every policy check is recorded.",
  },
  {
    title: "Control Hub Approval Gates",
    description:
      "No AI system goes live without explicit Control Hub approval. Every configuration change requires review before activation.",
  },
  {
    title: "Role-Based Access",
    description:
      "Control who can interact with the AI system, who can configure it, and who can review its outputs — at the namespace level.",
  },
  {
    title: "Client Branding",
    description:
      "Each Sovereign AI system carries the client's Troptions namespace identity, not a generic platform label.",
  },
];

const DEPLOYMENT_OPTIONS = [
  {
    label: "Troptions-Hosted",
    note: "Recommended",
    description: "Troptions manages all infrastructure. Client focuses on knowledge and configuration. Fastest path to deployment.",
  },
  {
    label: "Client-Hosted",
    note: "Planned",
    description: "Client provides own infrastructure. Troptions provides the AI system framework, knowledge vault, and audit layer.",
  },
  {
    label: "Hybrid",
    note: "Planned",
    description: "Core AI logic on Troptions infrastructure, sensitive data processing on client infrastructure.",
  },
  {
    label: "Local Model",
    note: "Planned",
    description: "AI model runs on client hardware with no external API calls. Maximum data privacy for regulated industries.",
  },
];

export default function SovereignAiSalesPage() {
  const templateCount = SOVEREIGN_AI_TEMPLATES.length;

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5em", color: "#c4a84a", marginBottom: "0.75rem" }}>
          Troptions Sovereign AI
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem", lineHeight: 1.3 }}>
          Build Your Own Sovereign AI System<br />with Troptions
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "1rem", maxWidth: "640px", margin: "0 auto 2rem" }}>
          Troptions creates client-specific AI systems built around your documents, workflows, rules, team, and
          goals — not a one-size-fits-all corporate chatbot.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            disabled
            aria-disabled="true"
            style={{ cursor: "not-allowed", background: "#0d1526", border: "1px solid #4a5568", borderRadius: "0.5rem", padding: "0.7rem 1.5rem", color: "#4a5568", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Request AI System Build — Simulation Only
          </button>
          <Link
            href="/troptions-ai/templates"
            style={{ display: "inline-block", background: "#c9a84c1a", border: "1px solid #c9a84c4d", borderRadius: "0.5rem", padding: "0.7rem 1.5rem", color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}
          >
            View {templateCount} Templates
          </Link>
        </div>
      </div>

      {/* What is Troptions Sovereign AI */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>
          What is Troptions Sovereign AI?
        </h2>
        <p style={{ color: "#8a9ab5", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
          Troptions Sovereign AI is a client-specific AI system factory. Instead of sharing one generic AI platform
          with all users, Troptions builds each client their own AI system — scoped to their namespace, their knowledge,
          their rules, and their team.
        </p>
        <p style={{ color: "#8a9ab5", fontSize: "0.95rem", lineHeight: 1.7 }}>
          Each Troptions Sovereign AI system is defined by: a client namespace, a private knowledge vault, a set of
          enabled tools, a ruleset for what the AI can and cannot do, a workflow configuration, and a proof and audit
          trail layer tied to the Troptions Control Hub.
        </p>
      </div>

      {/* Why client-specific AI matters */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>
          Why Client-Specific AI Matters
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
            <p style={{ fontWeight: 700, color: "#e8e0d0", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Generic AI Problems</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {["Trained on generic public data, not your business", "No knowledge of your specific documents or policies", "Can't enforce your brand voice or restrictions", "No audit trail for your operations", "Shared platform — no client isolation"].map((item, i) => (
                <li key={i} style={{ fontSize: "0.8rem", color: "#ef4444", display: "flex", gap: "0.5rem" }}>
                  <span>✕</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
            <p style={{ fontWeight: 700, color: "#e8e0d0", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Troptions Sovereign AI</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {["Built from your documents and policies", "Your rules encoded at the system level", "Your namespace, your branding, your access controls", "Every action in the proof and audit trail", "Private client workspace — not shared with others"].map((item, i) => (
                <li key={i} style={{ fontSize: "0.8rem", color: "#4ade80", display: "flex", gap: "0.5rem" }}>
                  <span>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Eight features */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1.5rem" }}>
          What Every Troptions Sovereign AI System Includes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 700, color: "#c4a84a", fontSize: "0.85rem", marginBottom: "0.4rem" }}>{f.title}</p>
              <p style={{ fontSize: "0.8rem", color: "#8a9ab5", lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>
          Industries Served
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {INDUSTRIES.map((ind, i) => (
            <span key={i} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.4rem", padding: "0.3rem 0.8rem", fontSize: "0.8rem", color: "#8a9ab5" }}>
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Deployment options */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>
          Deployment Options
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {DEPLOYMENT_OPTIONS.map((opt, i) => (
            <div key={i} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <p style={{ fontWeight: 700, color: "#e8e0d0", fontSize: "0.85rem" }}>{opt.label}</p>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: opt.note === "Recommended" ? "#c4a84a" : "#4a5568" }}>
                  {opt.note}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#8a9ab5", lineHeight: 1.6 }}>{opt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation note */}
      <div style={{ background: "#0d1526", border: "1px solid #c9a84c33", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "2.5rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9a84c", marginBottom: "0.4rem" }}>
          Current Phase: Simulation Only
        </p>
        <p style={{ fontSize: "0.85rem", color: "#8a9ab5" }}>
          All Troptions Sovereign AI systems are currently in simulation phase. No live AI inference occurs.
          All configurations require Control Hub approval before production activation. Healthcare systems
          include strict no-PHI and no-diagnosis policies. Financial systems block investment advice and
          securities tools by default.
        </p>
      </div>

      {/* Bottom CTAs */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8e0d0" }}>
          Ready to Build Your Troptions AI System?
        </h2>
        <p style={{ color: "#8a9ab5", fontSize: "0.9rem" }}>
          Start with a Troptions namespace, then build your knowledge vault and AI system from one of our {templateCount} templates.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            disabled
            aria-disabled="true"
            style={{ cursor: "not-allowed", background: "#0d1526", border: "1px solid #4a5568", borderRadius: "0.5rem", padding: "0.7rem 1.5rem", color: "#4a5568", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Request AI System Build — Simulation Only
          </button>
          <Link
            href="/troptions-ai/templates"
            style={{ display: "inline-block", background: "#c9a84c1a", border: "1px solid #c9a84c4d", borderRadius: "0.5rem", padding: "0.7rem 1.5rem", color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Explore Templates
          </Link>
          <Link
            href="/troptions-cloud"
            style={{ display: "inline-block", background: "#0d1526", border: "1px solid #1e3058", borderRadius: "0.5rem", padding: "0.7rem 1.5rem", color: "#8a9ab5", textDecoration: "none", fontSize: "0.85rem" }}
          >
            Start Troptions Namespace
          </Link>
        </div>
      </div>
    </div>
  );
}
