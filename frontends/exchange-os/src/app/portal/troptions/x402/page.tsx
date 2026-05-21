import { X402_CAPABILITIES, X402_DISCLAIMER, getReadyCapabilities, getGatedCapabilities } from "@/content/troptions/x402Registry";

const STATUS_COLOR: Record<string, string> = {
  ready: "#22c55e",
  gated: "#f59e0b",
  simulation: "#60a5fa",
};

export default function PortalX402Page() {
  const ready = getReadyCapabilities();
  const gated = getGatedCapabilities();

  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#e8e0d0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Portal — x402 Protocol
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.5rem" }}>
          x402 Machine-Payable APIs
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>
          x402 enables machine-to-machine payment flows for institutional API access. Activation requires compliance and legal gate satisfaction.
        </p>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#0d1526", border: "1px solid #22c55e", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#22c55e" }}>{ready.length}</div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Infrastructure Ready</div>
          </div>
          <div style={{ background: "#0d1526", border: "1px solid #f59e0b", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{gated.length}</div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Gated — Awaiting Approval</div>
          </div>
        </div>

        {/* Capabilities */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>Capability Status</h2>
        {X402_CAPABILITIES.map((cap) => (
          <div key={cap.id} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#c4a84a", marginBottom: "0.25rem" }}>{cap.label}</div>
              <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{cap.description}</div>
              {cap.gatesRequired.length > 0 && (
                <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.4rem" }}>
                  Requires: {cap.gatesRequired.join(", ")}
                </div>
              )}
            </div>
            <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: "#1e3058", color: STATUS_COLOR[cap.status] ?? "#9ca3af", whiteSpace: "nowrap" }}>
              {cap.status}
            </span>
          </div>
        ))}

        {/* Disclaimer */}
        <div style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", fontSize: "0.8rem", color: "#6b7280", marginTop: "2rem" }}>
          <strong style={{ color: "#9ca3af" }}>Disclaimer:</strong> {X402_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
