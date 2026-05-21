export const metadata = {
  title: "Telecom Concierge — Troptions AI",
  description: "Telnyx institutional communications infrastructure — TCPA/CTIA consent-tracked, compliance-gated.",
};

export default function TelecomPage() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Communications Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>Telecom Concierge</h1>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem", maxWidth: "680px", lineHeight: 1.7 }}>
        Telnyx-backed institutional communications — voice, SMS, and messaging channels with
        TCPA/CTIA consent tracking and compliance audit logging.
      </p>

      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1e3058", border: "1px solid #2d4a7a", borderRadius: "6px", marginBottom: "2.5rem" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c4a84a", display: "inline-block" }} />
        <span style={{ color: "#c4a84a", fontSize: "0.85rem", fontWeight: 600 }}>Status: COMPLIANCE-GATED</span>
        <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>— requires TCPA consent + provider approval</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Voice Concierge", desc: "Inbound/outbound voice calls with AI transcription and routing — gated", status: "gated" },
          { label: "SMS Notifications", desc: "Compliance-gated SMS for onboarding, proof status, and approvals", status: "gated" },
          { label: "Consent Manager", desc: "TCPA/CTIA opt-in/opt-out tracking with immutable audit log", status: "ready" },
          { label: "Number Registry", desc: "Provisioned phone numbers mapped to entities and contacts", status: "planned" },
          { label: "Fax Delivery", desc: "Secure document delivery via eFax for institutional paperwork", status: "planned" },
          { label: "Audit Export", desc: "Communication logs exportable for compliance and legal review", status: "ready" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: "#e8e0d0", fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</span>
              <span style={{ fontSize: "0.75rem", color: item.status === "ready" ? "#22c55e" : item.status === "gated" ? "#c4a84a" : "#9ca3af" }}>
                {item.status}
              </span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Compliance Requirements</h2>
        <ul style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 2, paddingLeft: "1.25rem" }}>
          <li>TCPA written consent required before any outbound SMS or voice contact</li>
          <li>CTIA opt-out (STOP/HELP) handled automatically, logged immutably</li>
          <li>No marketing communications — institutional workflow notifications only</li>
          <li>All calls recorded and stored subject to jurisdiction-specific retention rules</li>
          <li>DNC (Do Not Call) registry check before any outbound voice</li>
        </ul>
        <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "1rem" }}>
          Telecom features are simulation-only until Telnyx provider setup, TCPA consent framework,
          and compliance review are complete.
        </p>
      </div>
    </div>
  );
}
