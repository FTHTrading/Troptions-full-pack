import { X402_CAPABILITIES, X402_BLOCKED_ACTIONS, X402_DISCLAIMER, getReadyCapabilities, getGatedCapabilities } from "@/content/troptions/x402Registry";

const cardStyle = { background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem", marginBottom: "1rem" };

const STATUS_COLOR: Record<string, string> = {
  ready: "#22c55e",
  gated: "#f59e0b",
  simulation: "#60a5fa",
  blocked: "#ef4444",
};

export default function AdminX402Page() {
  const ready = getReadyCapabilities();
  const gated = getGatedCapabilities();

  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#e8e0d0" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Admin — x402 Protocol
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.5rem" }}>
          x402 Readiness Operations
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Monitor and manage x402 payment protocol readiness. Live payments gated.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Capabilities", value: X402_CAPABILITIES.length },
            { label: "Ready", value: ready.length, color: "#22c55e" },
            { label: "Gated", value: gated.length, color: "#f59e0b" },
            { label: "Blocked Actions", value: X402_BLOCKED_ACTIONS.length, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: s.color ?? "#c4a84a" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "1rem" }}>Capabilities</h2>
        {X402_CAPABILITIES.map((cap) => (
          <div key={cap.id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#c4a84a", margin: 0 }}>{cap.label}</h3>
              <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: "#1e3058", color: STATUS_COLOR[cap.status] ?? "#9ca3af" }}>
                {cap.status}
              </span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{cap.description}</p>
            {cap.gatesRequired.length > 0 && (
              <div style={{ fontSize: "0.75rem", color: "#f59e0b" }}>
                Gates required: {cap.gatesRequired.join(", ")}
              </div>
            )}
            {cap.dryRun && (
              <div style={{ fontSize: "0.75rem", color: "#60a5fa", marginTop: "0.25rem" }}>Dry-run mode only</div>
            )}
          </div>
        ))}

        {/* Blocked actions */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", margin: "2rem 0 1rem" }}>Blocked Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          {X402_BLOCKED_ACTIONS.map((a) => (
            <span key={a} style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "#1e3058", color: "#ef4444", borderRadius: "4px", border: "1px solid #ef4444" }}>
              {a}
            </span>
          ))}
        </div>

        {/* API reference */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e8e0d0", margin: "2rem 0 1rem" }}>API Reference</h2>
        <div style={cardStyle}>
          {[
            { method: "GET", path: "/api/troptions/x402/readiness", desc: "Readiness report (public)" },
            { method: "POST", path: "/api/troptions/x402/payment-intent", desc: "Create dry-run payment intent (auth + idempotency required)" },
          ].map((ep) => (
            <div key={ep.path} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.5rem 0", borderBottom: "1px solid #1e3058" }}>
              <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem", background: ep.method === "GET" ? "#1e3a5f" : "#3b2f00", color: ep.method === "GET" ? "#60a5fa" : "#f59e0b", borderRadius: "3px", minWidth: "40px", textAlign: "center" }}>{ep.method}</span>
              <code style={{ fontSize: "0.8rem", color: "#c4a84a" }}>{ep.path}</code>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{ep.desc}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: "#0a0f1a", border: "1px solid #1e3058", borderRadius: "6px", padding: "1rem", fontSize: "0.8rem", color: "#6b7280", marginTop: "2rem" }}>
          <strong style={{ color: "#9ca3af" }}>Disclaimer:</strong> {X402_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
