import React from "react";
import {
  XRPL_DEX_REGISTRY,
  XRPL_ISSUER_PROOF_REQUIREMENTS,
  XRPL_AMM_POOL_PROOF_REQUIREMENTS,
  XRPL_COMPLIANCE_NOTES,
  type XrplVenue,
} from "@/data/xrplDexRegistry";

const RISK_COLOR: Record<string, string> = {
  low: "var(--xos-green)",
  medium: "var(--xos-gold)",
  high: "#f97316",
};

function VenueCard({ venue }: { venue: XrplVenue }) {
  const riskColor = RISK_COLOR[venue.riskLevel] ?? "#6b7280";
  return (
    <div
      style={{
        border: "1px solid var(--xos-border)",
        borderRadius: "var(--xos-radius)",
        overflow: "hidden",
        background: "var(--xos-bg)",
      }}
    >
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--xos-border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--xos-surface)",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--xos-text)" }}>
          {venue.name}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.62rem",
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 4,
            color: riskColor,
            background: `${riskColor}18`,
          }}
        >
          {venue.riskLevel.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: "0.75rem 1rem" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginBottom: "0.6rem", lineHeight: 1.5 }}>
          {venue.description}
        </p>
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--xos-text-subtle)", marginBottom: "0.3rem" }}>
            TROPTIONS Use
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {venue.troptionsUse.map((u) => (
              <span
                key={u}
                style={{
                  fontSize: "0.62rem",
                  padding: "2px 6px",
                  background: "rgba(6,182,212,0.08)",
                  color: "var(--xos-cyan)",
                  borderRadius: 3,
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                {u.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.3rem" }}>
            Will NOT Do
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {venue.whatTroptionsWillNotDo.map((w) => (
              <li key={w} style={{ fontSize: "0.68rem", color: "var(--xos-text-muted)", marginBottom: "0.15rem" }}>
                {w}
              </li>
            ))}
          </ul>
        </div>
        {venue.docsUrl && (
          <a
            href={venue.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.68rem", color: "var(--xos-cyan)", display: "block", marginTop: "0.5rem" }}
          >
            XRPL Docs →
          </a>
        )}
      </div>
    </div>
  );
}

export default function XrplDexIntelligencePanel() {
  return (
    <div>
      <div
        style={{
          background: "rgba(6,182,212,0.06)",
          border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--xos-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--xos-cyan)" }}>Truth label:</strong> XRPL DEX
        intelligence — read-only monitoring, route display, and proof verification.
        TROPTIONS does not operate a licensed exchange, act as market maker, or custody
        assets on XRPL.
      </div>

      {/* Venue Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {XRPL_DEX_REGISTRY.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {/* Issuer Proof Requirements */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--xos-surface)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid var(--xos-border)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--xos-text)",
          }}
        >
          XRPL Issuer Proof Requirements
        </div>
        {XRPL_ISSUER_PROOF_REQUIREMENTS.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              gap: "0.75rem",
              padding: "0.55rem 0.75rem",
              borderBottom: "1px solid var(--xos-border)",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 3,
                color: r.required ? "#ef4444" : "#6b7280",
                background: r.required ? "rgba(239,68,68,0.1)" : "rgba(107,114,128,0.1)",
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              {r.required ? "Required" : "Optional"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                {r.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                {r.description}
              </div>
              <div style={{ fontSize: "0.67rem", color: "var(--xos-text-subtle)", marginTop: 2 }}>
                Verify: {r.verificationMethod}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AMM Pool Proof Requirements */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--xos-surface)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid var(--xos-border)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--xos-text)",
          }}
        >
          XRPL AMM Pool Proof Requirements
        </div>
        {XRPL_AMM_POOL_PROOF_REQUIREMENTS.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              gap: "0.75rem",
              padding: "0.55rem 0.75rem",
              borderBottom: "1px solid var(--xos-border)",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 3,
                color: r.required ? "#ef4444" : "#6b7280",
                background: r.required ? "rgba(239,68,68,0.1)" : "rgba(107,114,128,0.1)",
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              {r.required ? "Required" : "Optional"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                {r.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                {r.description}
              </div>
              <div style={{ fontSize: "0.67rem", color: "var(--xos-text-subtle)", marginTop: 2 }}>
                Verify: {r.verificationMethod}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Notes */}
      <div
        style={{
          border: "1px solid rgba(234,179,8,0.25)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          background: "rgba(234,179,8,0.04)",
        }}
      >
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.5rem" }}>
          XRPL Compliance Notes
        </div>
        <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
          {XRPL_COMPLIANCE_NOTES.map((note, i) => (
            <li key={i} style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", marginBottom: "0.3rem", lineHeight: 1.5 }}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
