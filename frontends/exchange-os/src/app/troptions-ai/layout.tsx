import type { ReactNode } from "react";
import Link from "next/link";

const AI_NAV = [
  { label: "Overview", href: "/troptions-ai" },
  { label: "Search Optimization", href: "/troptions-ai/search-optimization" },
  { label: "Entities", href: "/troptions-ai/entities" },
  { label: "Knowledge Graph", href: "/troptions-ai/knowledge-graph" },
  { label: "AI Citations", href: "/troptions-ai/ai-citations" },
  { label: "Machine-Readable Trust", href: "/troptions-ai/machine-readable-trust" },
  { label: "LLMs.txt", href: "/troptions-ai/llms" },
  { label: "Feeds & Sitemaps", href: "/troptions-ai/feeds" },
  { label: "x402 Readiness", href: "/troptions-ai/x402" },
  { label: "Telecom", href: "/troptions-ai/telecom" },
  { label: "Sovereign AI", href: "/troptions-ai/sovereign" },
  { label: "Templates", href: "/troptions-ai/templates" },
];

export default function TroptionsAiLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#e8e0d0", fontFamily: "Georgia, serif" }}>
      <nav style={{ background: "#0d1526", borderBottom: "1px solid #1e3058", padding: "0.75rem 2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {AI_NAV.map((item) => (
          <Link key={item.href} href={item.href} style={{ color: "#c4a84a", textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
            {item.label}
          </Link>
        ))}
      </nav>
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        {children}
      </main>
    </div>
  );
}
