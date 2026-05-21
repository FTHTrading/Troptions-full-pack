import React from "react";
import { SOLANA_DEX_REGISTRY, SOLANA_LAUNCHPAD_COMPETITORS, type SolanaDex } from "@/data/solanaDexRegistry";

const RISK_COLOR: Record<string, string> = {
  low: "var(--xos-green)",
  medium: "var(--xos-gold)",
  high: "#f97316",
  critical: "#ef4444",
};

const PRIORITY_BADGE: Record<string, { label: string; color: string }> = {
  phase_1: { label: "Phase 1", color: "var(--xos-gold)" },
  phase_2: { label: "Phase 2", color: "var(--xos-cyan)" },
  phase_3: { label: "Phase 3", color: "var(--xos-text-muted)" },
  monitor_only: { label: "Monitor Only", color: "#6b7280" },
};

function VenueRow({ venue }: { venue: SolanaDex }) {
  const priority = PRIORITY_BADGE[venue.integrationPriority] ?? { label: "Unknown", color: "#6b7280" };
  const riskColor = RISK_COLOR[venue.riskLevel] ?? "#6b7280";

  return (
    <tr
      style={{
        borderBottom: "1px solid var(--xos-border)",
      }}
    >
      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
        {venue.name}
        <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 400 }}>
          {venue.category}
        </div>
      </td>
      <td style={{ padding: "0.6rem 0.75rem" }}>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 4,
            color: priority.color,
            background: `${priority.color}18`,
            border: `1px solid ${priority.color}40`,
          }}
        >
          {priority.label}
        </span>
      </td>
      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>
        {venue.troptionsUse.map((u) => u.replace(/_/g, " ")).join(", ")}
      </td>
      <td style={{ padding: "0.6rem 0.75rem" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: riskColor }}>
          {venue.riskLevel.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.72rem", color: "var(--xos-text-subtle)", fontStyle: "italic" }}>
        {venue.notes}
      </td>
    </tr>
  );
}

export default function SolanaVenueRiskMatrix() {
  return (
    <div>
      <div
        style={{
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--xos-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--xos-green)" }}>Truth label:</strong> This is a
        DEX intelligence matrix. TROPTIONS uses these venues for read-only route intelligence,
        liquidity proof, and monitoring. TROPTIONS does not operate, endorse, or make markets
        on any of these venues.
      </div>

      {/* Core DEX table */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "var(--xos-surface)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid var(--xos-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ width: 3, height: 14, background: "var(--xos-green)", borderRadius: 2 }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
            Core DEX / Venue Registry
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--xos-bg)" }}>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600 }}>Venue</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600 }}>Priority</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600 }}>TROPTIONS Use</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600 }}>Risk</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {SOLANA_DEX_REGISTRY.map((venue) => (
                <VenueRow key={venue.id} venue={venue} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor / launchpad watchlist */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "var(--xos-surface)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid var(--xos-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ width: 3, height: 14, background: "#f97316", borderRadius: 2 }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
            Competitor / Launchpad Watchlist
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontStyle: "italic" }}>
            Market research only — no integration, no hype tools
          </span>
        </div>
        <div style={{ padding: "0.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.25rem 0.5rem" }}>
            {SOLANA_LAUNCHPAD_COMPETITORS.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "4px 10px",
                  border: "1px solid var(--xos-border)",
                  borderRadius: "var(--xos-radius)",
                  fontSize: "0.72rem",
                  color: "var(--xos-text-muted)",
                }}
                title={c.notes}
              >
                {c.name}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", padding: "0.25rem 0.75rem 0.5rem", fontStyle: "italic" }}>
            TROPTIONS does not provide fake volume, hype tools, rug-pull mechanics, or bonding-curve manipulation for any launchpad.
          </div>
        </div>
      </div>
    </div>
  );
}
