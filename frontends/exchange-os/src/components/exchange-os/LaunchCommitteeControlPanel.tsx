import React from "react";
import {
  REQUIRED_REVIEWERS,
  REQUIRED_DOCUMENTS,
  COMMITTEE_BLOCKERS,
  ESCALATION_TRIGGERS,
} from "@/data/launchCommitteeControls";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
};

export default function LaunchCommitteeControlPanel() {
  return (
    <div>
      <div
        style={{
          background: "rgba(234,179,8,0.06)",
          border: "1px solid rgba(234,179,8,0.2)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--xos-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--xos-gold)" }}>Launch Committee Policy:</strong> Every
        token launch requires a unanimous GO from the TROPTIONS launch committee. Any reviewer
        with veto authority can block a launch. NO public launch claim may be made before
        committee GO is issued.
      </div>

      {/* Required Reviewers */}
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
          Required Committee Reviewers
        </div>
        {REQUIRED_REVIEWERS.map((r) => (
          <div
            key={r.role}
            style={{
              padding: "0.65rem 0.75rem",
              borderBottom: "1px solid var(--xos-border)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
                  {r.title}
                </span>
                {r.vetoAuthority && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 3,
                      color: "#ef4444",
                      background: "rgba(239,68,68,0.1)",
                    }}
                  >
                    VETO
                  </span>
                )}
              </div>
              <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.1rem" }}>
                {r.responsibilities.map((resp) => (
                  <li key={resp} style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", marginBottom: "0.1rem" }}>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Required Documents */}
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
          Required Documents for Committee Review
        </div>
        {REQUIRED_DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: "0.6rem 0.75rem",
              borderBottom: "1px solid var(--xos-border)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 3,
                color: doc.vetoIfMissing ? "#ef4444" : "#eab308",
                background: doc.vetoIfMissing ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.08)",
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              {doc.vetoIfMissing ? "VETO if missing" : "Required"}
            </span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                {doc.name}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                {doc.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blockers */}
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
          Launch Blockers
        </div>
        {COMMITTEE_BLOCKERS.map((b) => {
          const color = SEVERITY_COLOR[b.severity] ?? "#6b7280";
          return (
            <div
              key={b.id}
              style={{
                padding: "0.6rem 0.75rem",
                borderBottom: "1px solid var(--xos-border)",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 3,
                  color,
                  background: color + "14",
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}
              >
                {b.severity.toUpperCase()}
              </span>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                  [{b.category}] {b.description}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)", marginTop: 2 }}>
                  Resolution: {b.resolution}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escalation Triggers */}
      <div
        style={{
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "rgba(239,68,68,0.05)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid rgba(239,68,68,0.15)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#ef4444",
          }}
        >
          Escalation Triggers
        </div>
        {ESCALATION_TRIGGERS.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "0.6rem 0.75rem",
              borderBottom: "1px solid var(--xos-border)",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
              {t.description}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)", marginTop: "0.15rem" }}>
              Escalate to: {t.escalateTo} · Time limit: {t.timeLimit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
