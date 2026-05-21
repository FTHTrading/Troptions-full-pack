"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Overview",    href: "/troptions" },
  { label: "Technology",  href: "/troptions/layer1" },
  { label: "Proof",       href: "/troptions/verification" },
  { label: "Stablecoins", href: "/troptions/stablecoins" },
  { label: "History",     href: "/troptions/history" },
  { label: "Contact",     href: "/troptions/contact" },
] as const;

export default function TroptionsSubNav() {
  const [open, setOpen] = useState(false); // mobile menu open
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#071426",
          borderBottom: "1px solid rgba(201,162,74,0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "all 0.25s",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: collapsed ? 34 : 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            transition: "height 0.25s",
            overflow: "hidden",
          }}
        >
          {/* Logo + wordmark */}
          <Link
            href="/troptions"
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", flexShrink: 0 }}
          >
            <Image
              src="/assets/troptions/logos/troptions-primary-official.jpg"
              alt="TROPTIONS"
              width={collapsed ? 20 : 30}
              height={collapsed ? 20 : 30}
              style={{ objectFit: "contain", borderRadius: 4, transition: "all 0.2s" }}
            />
            {!collapsed && (
              <span
                style={{
                  fontFamily: "'Palatino Linotype','Book Antiqua',Georgia,serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.12em",
                  color: "#e8c066",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                TROPTIONS
              </span>
            )}
          </Link>

          {/* Center nav links — hidden on small screens or when collapsed */}
          {!collapsed && (
            <div
              style={{ display: "flex", gap: "1.5rem", alignItems: "center", overflow: "hidden" }}
              className="troptions-subnav-links"
            >
              {NAV_LINKS.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    color: "#a0b4cc",
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    transition: "color 150ms",
                  }}
                  onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#e8c066")}
                  onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#a0b4cc")}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right: CTAs + collapse + hamburger */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
            {!collapsed && (
              <>
                <Link
                  href="/exchange-os"
                  style={{
                    background: "rgba(201,162,74,0.15)",
                    border: "1px solid rgba(201,162,74,0.5)",
                    color: "#e8c066",
                    borderRadius: "0.45rem",
                    padding: "0.35rem 0.8rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                  className="troptions-subnav-links"
                >
                  ⟷ Exchange OS
                </Link>
                <Link
                  href="/portal/troptions/dashboard"
                  style={{
                    background: "#1B3259",
                    color: "#ffffff",
                    borderRadius: "0.4rem",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    border: "1px solid #243d60",
                  }}
                  className="troptions-subnav-links"
                >
                  Portal
                </Link>
              </>
            )}
            {/* Desktop collapse toggle */}
            <button
              onClick={() => { setCollapsed(!collapsed); setOpen(false); }}
              title={collapsed ? "Expand navigation" : "Collapse navigation"}
              className="troptions-subnav-collapse-btn"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,162,74,0.2)",
                color: "#a0b4cc",
                borderRadius: "0.35rem",
                padding: "0.3rem 0.55rem",
                cursor: "pointer",
                fontSize: "0.75rem",
                lineHeight: 1,
              }}
            >
              {collapsed ? "▼" : "▲"}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              title="Menu"
              className="troptions-subnav-hamburger"
              style={{
                background: "none",
                border: "none",
                color: "#a0b4cc",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0.25rem",
                lineHeight: 1,
              }}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && !collapsed && (
          <div
            style={{
              background: "#071426",
              borderTop: "1px solid rgba(201,162,74,0.15)",
              padding: "0.75rem 1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.1rem",
            }}
          >
            {NAV_LINKS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                style={{
                  color: "#a0b4cc",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {n.label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.75rem" }}>
              <Link href="/exchange-os" style={{ background: "rgba(201,162,74,0.15)", border: "1px solid rgba(201,162,74,0.4)", color: "#e8c066", borderRadius: "0.4rem", padding: "0.45rem 0.9rem", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
                ⟷ Exchange OS
              </Link>
              <Link href="/portal/troptions/dashboard" style={{ background: "#1B3259", color: "#fff", borderRadius: "0.4rem", padding: "0.45rem 0.9rem", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
                Portal
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .troptions-subnav-collapse-btn { display: flex; }
        .troptions-subnav-hamburger    { display: none; }
        @media (max-width: 768px) {
          .troptions-subnav-links         { display: none !important; }
          .troptions-subnav-collapse-btn  { display: none; }
          .troptions-subnav-hamburger     { display: flex; }
        }
      `}</style>
    </>
  );
}
