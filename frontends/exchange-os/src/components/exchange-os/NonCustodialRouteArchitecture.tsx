import React from "react";
import {
  NON_CUSTODIAL_ROUTE_FLOW,
  CHAIN_ROUTE_MODELS,
  NON_CUSTODIAL_GUARANTEES,
  type RouteStep,
} from "@/data/nonCustodialRouteModel";

const ACTOR_COLOR: Record<string, string> = {
  user: "var(--xos-green)",
  troptions_os: "var(--xos-gold)",
  chain: "var(--xos-cyan)",
  wallet: "#a78bfa",
};

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  active: { color: "var(--xos-green)", label: "Active" },
  pending: { color: "var(--xos-text-subtle)", label: "Pending" },
  completed: { color: "var(--xos-cyan)", label: "Completed" },
  blocked: { color: "#ef4444", label: "Blocked" },
  user_action: { color: "#a78bfa", label: "User Action" },
};

function StepCard({ step }: { step: RouteStep }) {
  const actorColor = ACTOR_COLOR[step.actor] ?? "var(--xos-text-muted)";
  const statusStyle = STATUS_STYLE[step.status] ?? { color: "#6b7280", label: step.status };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem 0.5rem",
        borderBottom: "1px solid var(--xos-border)",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: actorColor + "18",
          border: `2px solid ${actorColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          fontWeight: 800,
          color: actorColor,
          flexShrink: 0,
        }}
      >
        {step.step}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--xos-text)" }}>
            {step.title}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 3,
              color: actorColor,
              background: actorColor + "14",
            }}
          >
            {step.actor.replace(/_/g, " ").toUpperCase()}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: 3,
              color: statusStyle.color,
              background: statusStyle.color + "12",
              marginLeft: "auto",
            }}
          >
            {statusStyle.label}
          </span>
        </div>
        <p style={{ fontSize: "0.76rem", color: "var(--xos-text-muted)", margin: "0 0 0.2rem", lineHeight: 1.5 }}>
          {step.description}
        </p>
        <p style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", margin: 0, fontStyle: "italic" }}>
          {step.notes}
        </p>
      </div>
    </div>
  );
}

export default function NonCustodialRouteArchitecture() {
  return (
    <div>
      {/* Truth banner */}
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
        <strong style={{ color: "var(--xos-green)" }}>Non-Custodial Guarantee:</strong>{" "}
        TROPTIONS never holds private keys, signs transactions, or controls user assets. Every
        transaction requires explicit user wallet signature. TROPTIONS provides unsigned
        transaction construction and route intelligence only.
      </div>

      {/* Guarantees */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1.25rem",
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
          Non-Custodial Guarantees
        </div>
        <ul style={{ margin: 0, padding: "0.5rem 0.75rem 0.75rem 1.5rem" }}>
          {NON_CUSTODIAL_GUARANTEES.map((g, i) => (
            <li key={i} style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginBottom: "0.35rem", lineHeight: 1.5 }}>
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Route flow */}
      <div
        style={{
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius)",
          overflow: "hidden",
          marginBottom: "1.25rem",
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
          Trade Route Flow (Non-Custodial)
        </div>
        <div>
          {NON_CUSTODIAL_ROUTE_FLOW.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>

      {/* Chain models */}
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
          Chain-Specific Route Models
        </div>
        {CHAIN_ROUTE_MODELS.map((m) => (
          <div
            key={m.chain}
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--xos-border)",
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              gap: "0.5rem 1rem",
              alignItems: "start",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--xos-gold)" }}>
              {m.chain}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1rem" }}>
              <div>
                <div style={{ fontSize: "0.62rem", color: "var(--xos-text-subtle)", fontWeight: 700 }}>Wallet</div>
                <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>{m.walletStandard}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "var(--xos-text-subtle)", fontWeight: 700 }}>Signature</div>
                <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>{m.signatureMethod}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "var(--xos-text-subtle)", fontWeight: 700 }}>RPC</div>
                <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>{m.rpcProvider}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "var(--xos-text-subtle)", fontWeight: 700 }}>Aggregator</div>
                <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>{m.aggregator ?? "None"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
