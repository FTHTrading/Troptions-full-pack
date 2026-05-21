import { TELECOM_CAPABILITIES, TELECOM_COMPLIANCE_REQUIREMENTS, TELECOM_DISCLAIMER } from "@/content/troptions/telexRegistry";

const STATUS_COLOR: Record<string, string> = { gated: "#f59e0b", ready: "#22c55e", "dry-run": "#60a5fa" };

export default function AdminTelecomPage() {
  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#e8e0d0" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Admin — Telecom
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.5rem" }}>
          Telnyx Telecom Infrastructure
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Institutional telecom capabilities via Telnyx. All capabilities gated or dry-run.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Capabilities", value: TELECOM_CAPABILITIES.length },
            { label: "TCPA Required", value: TELECOM_CAPABILITIES.filter((c) => c.tcpaRequired).length, color: "#f59e0b" },
            { label: "Compliance Rules", value: TELECOM_COMPLIANCE_REQUIREMENTS.length, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: s.color ?? "#c4a84a" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>Capabilities</h2>
        {TELECOM_CAPABILITIES.map((cap) => (
          <div key={cap.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#c4a84a", margin: 0 }}>{cap.label}</h3>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "#1e3058", color: STATUS_COLOR[cap.status] ?? "#9ca3af" }}>{cap.status}</span>
                {cap.tcpaRequired && <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "#3b2f00", color: "#f59e0b" }}>TCPA</span>}
                {cap.ctiaRequired && <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "#1e3058", color: "#a78bfa" }}>CTIA</span>}
              </div>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "0.4rem" }}>{cap.description}</p>
            {cap.gatesRequired.length > 0 && (
              <div style={{ fontSize: "0.75rem", color: "#f59e0b" }}>Gates: {cap.gatesRequired.join(", ")}</div>
            )}
          </div>
        ))}

        {/* Compliance */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", margin: "2rem 0 1rem" }}>Compliance Requirements</h2>
        {TELECOM_COMPLIANCE_REQUIREMENTS.map((req) => (
          <div key={req.id} style={{ display: "flex", gap: "1rem", padding: "0.75rem", borderBottom: "1px solid #1e3058", alignItems: "flex-start" }}>
            <span style={{ minWidth: "80px", fontSize: "0.75rem", padding: "0.2rem 0.4rem", background: "#0d1526", color: "#c4a84a", borderRadius: "4px", textAlign: "center" }}>{req.id.toUpperCase()}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#e8e0d0", marginBottom: "0.2rem" }}>{req.label}</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{req.description}</div>
            </div>
            {req.required && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#ef4444" }}>REQUIRED</span>}
          </div>
        ))}

        {/* Disclaimer */}
        <div style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", fontSize: "0.8rem", color: "#6b7280", marginTop: "2rem" }}>
          <strong style={{ color: "#9ca3af" }}>Telecom Disclaimer:</strong> {TELECOM_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
