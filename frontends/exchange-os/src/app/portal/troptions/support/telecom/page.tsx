import { TELECOM_CAPABILITIES, TELECOM_DISCLAIMER } from "@/content/troptions/telexRegistry";

const STATUS_COLOR: Record<string, string> = { gated: "#f59e0b", ready: "#22c55e", "dry-run": "#60a5fa" };

export default function SupportTelecomPage() {
  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#e8e0d0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Portal — Support
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.5rem" }}>
          Telecom Communication Channels
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Institutional communication channels via Telnyx. Active channels subject to TCPA compliance and gate approval.
        </p>

        {/* Gate notice */}
        <div style={{ background: "#0a0f1a", border: "1px solid #f59e0b", borderRadius: "8px", padding: "1rem", marginBottom: "2rem", color: "#f59e0b", fontSize: "0.85rem" }}>
          All telecom channels require TCPA prior express written consent before activation. Contact your compliance officer to initiate consent workflows.
        </div>

        {/* Channels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {TELECOM_CAPABILITIES.map((cap) => (
            <div key={cap.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#c4a84a", margin: 0 }}>{cap.label}</h3>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "4px", background: "#1e3058", color: STATUS_COLOR[cap.status] ?? "#9ca3af" }}>
                  {cap.status}
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>{cap.description}</p>
              {cap.tcpaRequired && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "#f59e0b" }}>⚠ TCPA consent required</div>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", fontSize: "0.8rem", color: "#6b7280" }}>
          <strong style={{ color: "#9ca3af" }}>Telecom Disclaimer:</strong> {TELECOM_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
