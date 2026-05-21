import React from "react";
import {
  PARTNER_ONBOARDING_PIPELINE,
  PARTNER_ONBOARDING_WHAT_TROPTIONS_PROVIDES,
  PARTNER_ONBOARDING_WHAT_TROPTIONS_REFUSES,
} from "@/data/partnerOnboarding";

const STATUS_COLOR: Record<string, string> = {
  not_started: "#6b7280",
  in_progress: "#eab308",
  awaiting_partner: "#a78bfa",
  awaiting_committee: "#06b6d4",
  approved: "#22c55e",
  blocked: "#ef4444",
  rejected: "#dc2626",
};

const OWNER_LABEL: Record<string, string> = {
  partner: "Partner",
  troptions: "TROPTIONS OS",
  committee: "Committee",
  legal: "Legal",
  technical: "Technical",
};

export default function PartnerOnboardingPipeline() {
  return (
    <div>
      <div
        style={{
          background: "rgba(167,139,250,0.06)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: "var(--xos-radius)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--xos-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#a78bfa" }}>Partner Onboarding Policy:</strong> All
        partner tokens must complete this full pipeline before any public launch claim.
        TROPTIONS does not shortcut legal, KYC/AML, or committee review for any reason.
      </div>

      {/* Pipeline steps */}
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
          Onboarding Pipeline — {PARTNER_ONBOARDING_PIPELINE.length} Stages
        </div>
        {PARTNER_ONBOARDING_PIPELINE.map((stage) => {
          const sc = STATUS_COLOR[stage.status] ?? "#6b7280";
          const ownerLabel = OWNER_LABEL[stage.ownerParty] ?? stage.ownerParty;
          return (
            <div
              key={stage.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.7rem 0.75rem",
                borderBottom: "1px solid var(--xos-border)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: sc + "18",
                  border: `2px solid ${sc}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: sc,
                  flexShrink: 0,
                }}
              >
                {stage.step}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--xos-text)" }}>
                    {stage.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 3,
                      color: sc,
                      background: sc + "14",
                    }}
                  >
                    {stage.status.replace(/_/g, " ")}
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
                    Owner: {ownerLabel}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "var(--xos-text-subtle)", marginLeft: "auto" }}>
                    {stage.estimatedDuration}
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)", margin: "0 0 0.3rem", lineHeight: 1.5 }}>
                  {stage.description}
                </p>
                <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontStyle: "italic" }}>
                  {stage.notes}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provides vs Refuses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div
          style={{
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "var(--xos-radius)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.6rem 0.75rem",
              background: "rgba(34,197,94,0.06)",
              borderBottom: "1px solid rgba(34,197,94,0.15)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--xos-green)",
            }}
          >
            TROPTIONS Provides
          </div>
          <ul style={{ margin: 0, padding: "0.5rem 0.75rem 0.75rem 1.4rem" }}>
            {PARTNER_ONBOARDING_WHAT_TROPTIONS_PROVIDES.map((item) => (
              <li key={item} style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", marginBottom: "0.3rem", lineHeight: 1.45 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "var(--xos-radius)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.6rem 0.75rem",
              background: "rgba(239,68,68,0.06)",
              borderBottom: "1px solid rgba(239,68,68,0.15)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#ef4444",
            }}
          >
            TROPTIONS Refuses
          </div>
          <ul style={{ margin: 0, padding: "0.5rem 0.75rem 0.75rem 1.4rem" }}>
            {PARTNER_ONBOARDING_WHAT_TROPTIONS_REFUSES.map((item) => (
              <li key={item} style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", marginBottom: "0.3rem", lineHeight: 1.45 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
