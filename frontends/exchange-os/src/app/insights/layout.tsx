import Link from "next/link";
import type { ReactNode } from "react";
import { INSIGHT_CATEGORIES } from "@/content/troptions/insightsRegistry";

export const metadata = {
  title: "Insights — Troptions",
  description: "Institutional insights on RWA, settlement, compliance, AI infrastructure, and Troptions workflows.",
};

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", fontFamily: "Georgia, serif" }}>
      <nav style={{ borderBottom: "1px solid #1e3058", padding: "1rem 2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/insights" style={{ color: "#c4a84a", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
          Troptions Insights
        </Link>
        {INSIGHT_CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`/insights?category=${cat.id}`} style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.85rem" }}>
            {cat.label}
          </Link>
        ))}
      </nav>
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
