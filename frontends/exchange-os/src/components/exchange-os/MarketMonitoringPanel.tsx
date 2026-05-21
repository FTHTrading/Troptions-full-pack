import React from "react";
import {
  MONITORING_ALERTS,
  MONITORING_DATA_SOURCES,
  INCIDENT_RESPONSE_RUNBOOK_STEPS,
  type AlertSeverity,
} from "@/data/marketMonitoringRequirements";

const SEV_COLOR: Record<AlertSeverity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
  info: "#06b6d4",
};

const CHAIN_BADGE: Record<string, string> = {
  solana: "var(--xos-green)",
  xrpl: "var(--xos-cyan)",
  all: "var(--xos-gold)",
};

export default function MarketMonitoringPanel() {
  const criticalAlerts = MONITORING_ALERTS.filter((a) => a.severity === "critical");
  const otherAlerts = MONITORING_ALERTS.filter((a) => a.severity !== "critical");

  return (
    <div>
      <div
        style={{
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--xos-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#ef4444" }}>Monitoring Scope:</strong> All active partner
        tokens are subject to continuous read-only monitoring. TROPTIONS monitoring cannot
        freeze, pause, or modify on-chain state. Monitoring is investigative and alerting
        only.
      </div>

      {/* Critical alerts */}
      <div
        style={{
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid rgba(239,68,68,0.2)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#ef4444",
          }}
        >
          Critical Alert Types
        </div>
        {criticalAlerts.map((alert) => {
          const chainColor = CHAIN_BADGE[alert.chain] ?? "#6b7280";
          return (
            <div
              key={alert.id}
              style={{
                padding: "0.65rem 0.75rem",
                borderBottom: "1px solid var(--xos-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
                  {alert.name}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 3,
                    color: chainColor,
                    background: chainColor + "14",
                  }}
                >
                  {alert.chain.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    padding: "1px 6px",
                    borderRadius: 3,
                    color: "var(--xos-text-subtle)",
                    background: "var(--xos-surface)",
                    border: "1px solid var(--xos-border)",
                  }}
                >
                  {alert.category}
                </span>
              </div>
              <p style={{ fontSize: "0.74rem", color: "var(--xos-text-muted)", margin: "0 0 0.2rem" }}>
                {alert.description}
              </p>
              <p style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", margin: "0 0 0.2rem", fontStyle: "italic" }}>
                Trigger: {alert.triggerCondition}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#ef4444", margin: 0, fontWeight: 500 }}>
                Response: {alert.response}
              </p>
              {alert.escalation && (
                <p style={{ fontSize: "0.68rem", color: "#f97316", margin: "0.15rem 0 0" }}>
                  Escalation: {alert.escalation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Other alerts */}
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
          High / Medium Alert Types
        </div>
        {otherAlerts.map((alert) => {
          const sevColor = SEV_COLOR[alert.severity] ?? "#6b7280";
          const chainColor = CHAIN_BADGE[alert.chain] ?? "#6b7280";
          return (
            <div
              key={alert.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                borderBottom: "1px solid var(--xos-border)",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 3,
                  color: sevColor,
                  background: sevColor + "14",
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}
              >
                {alert.severity.toUpperCase()}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                    {alert.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.58rem",
                      padding: "1px 5px",
                      borderRadius: 3,
                      color: chainColor,
                      background: chainColor + "12",
                    }}
                  >
                    {alert.chain}
                  </span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", margin: "0 0 0.15rem" }}>
                  {alert.description}
                </p>
                <p style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", margin: 0 }}>
                  Response: {alert.response}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Sources */}
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
          Monitoring Data Sources (Read-Only)
        </div>
        {MONITORING_DATA_SOURCES.map((ds) => {
          const chainColor = CHAIN_BADGE[ds.chain] ?? "#6b7280";
          return (
            <div
              key={ds.id}
              style={{
                padding: "0.55rem 0.75rem",
                borderBottom: "1px solid var(--xos-border)",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 3,
                  color: chainColor,
                  background: chainColor + "14",
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}
              >
                {ds.chain.toUpperCase()}
              </span>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                  {ds.name}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                  {ds.dataType} · {ds.updateFrequency}
                </div>
                <div style={{ fontSize: "0.67rem", color: "var(--xos-text-subtle)" }}>
                  {ds.notes}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Response Runbook */}
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
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--xos-text)",
          }}
        >
          Incident Response Runbook
        </div>
        {INCIDENT_RESPONSE_RUNBOOK_STEPS.map((step) => (
          <div
            key={step.step}
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
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid var(--xos-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "var(--xos-gold)",
                flexShrink: 0,
              }}
            >
              {step.step}
            </span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--xos-text)" }}>
                {step.action}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--xos-text-muted)" }}>
                Owner: {step.owner} · {step.timeLimit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
