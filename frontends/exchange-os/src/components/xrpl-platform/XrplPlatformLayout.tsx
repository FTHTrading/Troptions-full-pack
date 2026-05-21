import Link from "next/link";
import type { ReactNode } from "react";

type XrplPlatformLayoutProps = {
  readonly title: string;
  readonly intro: string;
  readonly children: ReactNode;
};

const PLATFORM_LINKS = [
  { href: "/troptions/xrpl-platform", label: "Platform" },
  { href: "/troptions/xrpl-platform/live-data", label: "Live Data" },
  { href: "/troptions/xrpl-platform/dex", label: "DEX" },
  { href: "/troptions/xrpl-platform/amm", label: "AMM" },
  { href: "/troptions/xrpl-platform/pathfinding", label: "Pathfinding" },
  { href: "/troptions/xrpl-platform/testnet-lab", label: "Testnet Lab" },
  { href: "/troptions/xrpl-platform/mainnet-readiness", label: "Mainnet Gates" },
  { href: "/troptions/xrpl-platform/security", label: "Security" },
  { href: "/troptions/xrpl-platform/links", label: "Links" },
] as const;

export function XrplPlatformLayout({ title, intro, children }: XrplPlatformLayoutProps) {
  return (
    <main className="xp-theme min-h-screen">
      <div className="xp-wrap">
        {/* Back nav row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <Link
            href="/troptions"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "#a0b4cc", textDecoration: "none", padding: "0.3rem 0.65rem", border: "1px solid rgba(201,162,74,0.2)", borderRadius: "0.4rem", background: "rgba(201,162,74,0.06)" }}
          >
            ← TROPTIONS
          </Link>
          <Link
            href="/exchange-os/trade"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "#00d4ff", textDecoration: "none", padding: "0.3rem 0.65rem", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "0.4rem", background: "rgba(0,212,255,0.05)" }}
          >
            ⟷ Exchange OS Trade
          </Link>
        </div>
        <header className="xp-header">
          <p className="xp-kicker">XRPL Platform</p>
          <h1 className="xp-title">{title}</h1>
          <p className="xp-intro">{intro}</p>
          <nav className="xp-nav" aria-label="XRPL platform sections">
            {PLATFORM_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="xp-grid">{children}</div>
      </div>
    </main>
  );
}