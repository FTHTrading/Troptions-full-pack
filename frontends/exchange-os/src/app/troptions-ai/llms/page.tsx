import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "LLMs.txt — Troptions AI",
  description: "Primary LLM knowledge file and AI crawler access policy for Troptions.",
};

export default function LlmsPage() {
  const llmsTxt = readFileSync(path.join(process.cwd(), "public", "llms.txt"), "utf-8");
  const aiTxt = readFileSync(path.join(process.cwd(), "public", "ai.txt"), "utf-8");

  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI-Readable Files</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>LLMs.txt &amp; AI Access Policy</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Structured text files for LLMs and AI crawlers. These files are served publicly and inform
        AI systems about Troptions capabilities, entity structure, and access policy.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <a href="/llms.txt" target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1.25rem", background: "#1e3058", border: "1px solid #2d4a7a", borderRadius: "6px", color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem" }}>
          View /llms.txt ↗
        </a>
        <a href="/ai.txt" target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1.25rem", background: "#1e3058", border: "1px solid #2d4a7a", borderRadius: "6px", color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem" }}>
          View /ai.txt ↗
        </a>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>llms.txt</h2>
        <pre style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1.25rem", color: "#9ca3af", fontSize: "0.8rem", overflow: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {llmsTxt}
        </pre>
      </div>

      <div>
        <h2 style={{ color: "#e8e0d0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>ai.txt</h2>
        <pre style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1.25rem", color: "#9ca3af", fontSize: "0.8rem", overflow: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {aiTxt}
        </pre>
      </div>
    </div>
  );
}
