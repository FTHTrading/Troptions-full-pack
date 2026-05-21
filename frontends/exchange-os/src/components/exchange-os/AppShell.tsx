"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { features as _features } from "@/config/exchange-os/features"; void _features;
import { PRIMARY_NAV, SECONDARY_NAV, MOBILE_NAV } from "@/config/exchange-os/routes";
import { brand } from "@/config/exchange-os/brand";
import { TroptionsSidebarLogo } from "./TroptionsLogo";
import { TopBar } from "./TopBar";
import { LiveMarketsTicker } from "./LiveMarketsTicker";
import { ECOSYSTEM_FOOTER_LINKS } from "@/data/ecosystem-nav";
import "@/styles/exchange-os.css";

const NAV_ICONS: Record<string, string> = {
  home: "⌂",
  "chart-candlestick": "📊",
  rocket: "🚀",
  coins: "◎",
  zap: "⚡",
  list: "≡",
  wallet: "◈",
  code: "< >",
  megaphone: "📣",
  settings: "⚙",
  presentation: "▣",
  "user-plus": "＋",
  mic: "🎙",
  diamond: "◆",
  send: "↑",
};

function NavIcon({ icon }: { icon: string }) {
  const glyph = NAV_ICONS[icon] ?? "◆";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, fontSize: "0.85rem", flexShrink: 0, lineHeight: 1 }}>
      {glyph}
    </span>
  );
}



function SidebarNav({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={`xos-sidebar${collapsed ? " xos-sidebar--collapsed" : ""}`}>
      <div className="xos-sidebar-logo">
        {collapsed ? (
          <button
            onClick={onToggle}
            title="Expand sidebar"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--xos-gold)", fontSize: "1.1rem", padding: 0 }}
          >
            ▶
          </button>
        ) : (
          <Link href="/exchange-os" style={{ textDecoration: "none" }}>
            <TroptionsSidebarLogo />
          </Link>
        )}
      </div>
      <nav className="xos-sidebar-nav">
        {!collapsed && <div className="xos-nav-section-label">Exchange</div>}
        {PRIMARY_NAV.map((route) => {
          const active = pathname === route.href || pathname.startsWith(route.href + "/");
          return (
            <Link key={route.href} href={route.href} title={route.label}
              className={`xos-nav-item ${active ? "xos-nav-item--active" : ""}`}>
              <NavIcon icon={route.icon} />
              <span className="xos-nav-label">{route.label}</span>
              {route.badge && <span className="xos-badge xos-badge--cyan xos-nav-badge">{route.badge}</span>}
            </Link>
          );
        })}
        {!collapsed && <div className="xos-nav-section-label" style={{ marginTop: "1rem" }}>Platform</div>}
        {SECONDARY_NAV.map((route) => {
          const active = pathname === route.href;
          return (
            <Link key={route.href} href={route.href} title={route.label}
              className={`xos-nav-item xos-nav-item--secondary ${active ? "xos-nav-item--active-secondary" : ""}`}>
              <NavIcon icon={route.icon} />
              <span className="xos-nav-label">{route.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="xos-sidebar-footer">
        {!collapsed && (
          <Link href="/troptions" style={{ display: "flex", alignItems: "center", gap: "0.45rem", textDecoration: "none", marginBottom: "0.6rem", padding: "0.35rem 0.5rem", borderRadius: "0.35rem", background: "rgba(201,162,74,0.07)", border: "1px solid rgba(201,162,74,0.2)" }}>
            <span style={{ fontSize: "0.65rem", color: "var(--xos-gold-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>← TROPTIONS.ORG</span>
          </Link>
        )}
        {collapsed ? (
          <Link href="/troptions" title="← TROPTIONS.ORG" style={{ color: "var(--xos-gold-muted)", textDecoration: "none", fontSize: "0.9rem" }}>←</Link>
        ) : (
          <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: "var(--xos-gold-muted)", marginBottom: 2 }}>TROPTIONS Live DEX</div>
            {brand.poweredBy}
            <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[
                { href: "/exchange-os/docs", label: "Docs" },
                { href: "/exchange-os/fees", label: "Fees" },
                { href: "/exchange-os/status", label: "Status" },
                { href: "/exchange-os/risk", label: "Risk" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: "var(--xos-text-subtle)", textDecoration: "none", padding: "0.1rem 0.3rem", borderRadius: "0.2rem", border: "1px solid var(--xos-border)", fontSize: "0.62rem" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse sidebar"}
          style={{
            marginTop: collapsed ? 0 : "0.75rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--xos-border)",
            borderRadius: "var(--xos-radius)",
            cursor: "pointer",
            color: "var(--xos-text-subtle)",
            fontSize: "0.7rem",
            padding: "0.3rem 0.5rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
            transition: "all var(--xos-transition)",
          }}
        >
          {collapsed ? "▶" : "◀ Collapse"}
        </button>
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="xos-mobile-nav">
      {MOBILE_NAV.map((route) => {
        const active = pathname === route.href || pathname.startsWith(route.href + "/");
        return (
          <Link key={route.href} href={route.href}
            className={`xos-mobile-nav-item ${active ? "xos-mobile-nav-item--active" : ""}`}>
            <NavIcon icon={route.icon} />
            <span>{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function EcosystemFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--xos-border)", padding: "2rem 1.5rem", marginTop: "4rem", background: "var(--xos-surface-1)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        {ECOSYSTEM_FOOTER_LINKS.map(section => (
          <div key={section.section}>
            <div style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "var(--xos-text-subtle)", letterSpacing: "0.2em", marginBottom: "0.75rem", textTransform: "uppercase" }}>
              {section.section}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {section.links.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)", textDecoration: "none" }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--xos-text)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--xos-text-muted)"; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.6rem", color: "var(--xos-text-subtle)", maxWidth: 700, margin: "1.5rem auto 0" }}>
        TROPTIONS provides Exchange OS infrastructure only. Not an exchange operator, custodian, broker/dealer, or investment adviser.
      </div>
    </footer>
  );
}

const ALL_ROUTES = [...PRIMARY_NAV, ...SECONDARY_NAV];

function BreadcrumbBar() {
  const pathname = usePathname();
  if (pathname === "/exchange-os" || pathname === "/exchange-os/") return null;

  const matched = ALL_ROUTES.find(
    (r) => r.href !== "/exchange-os" && pathname.startsWith(r.href)
  );
  const label = matched?.label ?? decodeURIComponent(pathname.split("/").pop() ?? "");

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        padding: "0.35rem 1rem",
        borderBottom: "1px solid var(--xos-border)",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.78rem",
        color: "var(--xos-text-muted)",
        background: "var(--xos-surface-1)",
      }}
    >
      <Link
        href="/exchange-os"
        style={{ color: "var(--xos-cyan)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
      >
        ⌂ Home
      </Link>
      {label && (
        <>
          <span style={{ opacity: 0.45 }}>/</span>
          <span style={{ color: "var(--xos-text)" }}>{label}</span>
        </>
      )}
    </nav>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    // Read localStorage synchronously during init to avoid a post-mount re-render
    if (typeof window !== "undefined") {
      return localStorage.getItem("xos-sidebar-collapsed") === "1";
    }
    return false;
  });
  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("xos-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="xos">
      <div className="xos-layout">
        <div className={`xos-sidebar-wrapper${collapsed ? " xos-sidebar-wrapper--collapsed" : ""}`}>
          <SidebarNav collapsed={collapsed} onToggle={toggle} />
        </div>
        <div className="xos-main-column">
          <TopBar />
          <LiveMarketsTicker />
          <BreadcrumbBar />
          <main className="xos-content">
            {children}
          </main>
          <EcosystemFooter />
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}