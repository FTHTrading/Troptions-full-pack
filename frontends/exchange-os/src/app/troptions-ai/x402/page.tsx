export const metadata = {
  title: "x402 Readiness — Troptions AI",
  description: "x402 machine-payable API protocol readiness status — dry-run until provider and board approval.",
};

export default function X402Page() {
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#c4a84a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Protocol Layer</p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e8e0d0", marginBottom: "0.75rem" }}>x402 Protocol Readiness</h1>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem", maxWidth: "680px", lineHeight: 1.7 }}>
        The x402 protocol enables machine-payable API access — allowing AI agents to pay per request
        without human intervention. Troptions infrastructure readiness is tracked here.
      </p>

      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1e3058", border: "1px solid #2d4a7a", borderRadius: "6px", marginBottom: "2.5rem" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c4a84a", display: "inline-block" }} />
        <span style={{ color: "#c4a84a", fontSize: "0.85rem", fontWeight: 600 }}>Status: DRY-RUN</span>
        <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>— requires provider, legal, and board approval</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Payment Channel", status: "pending", desc: "Apostle Chain ATP settlement — awaiting chain integration approval" },
          { label: "API Gateway", status: "pending", desc: "x402 header parsing and 402 response — implementation ready, not deployed" },
          { label: "Agent Registry", status: "pending", desc: "Agent ID verification against Apostle Chain registry" },
          { label: "Compliance Gate", status: "required", desc: "KYB/AML check required for each paying agent" },
          { label: "Rate Limiting", status: "ready", desc: "Token bucket per agent ID — implementation complete" },
          { label: "Audit Log", status: "ready", desc: "Per-request audit trail — implementation complete" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: "#e8e0d0", fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</span>
              <span style={{ fontSize: "0.75rem", color: item.status === "ready" ? "#22c55e" : item.status === "required" ? "#f59e0b" : "#9ca3af" }}>
                {item.status}
              </span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#0d1526", border: "1px solid #1e3058", borderRadius: "8px", padding: "1.5rem" }}>
        <h2 style={{ color: "#e8e0d0", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>What x402 Enables</h2>
        <ul style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 2, paddingLeft: "1.25rem" }}>
          <li>AI agents request data and settle payment atomically via HTTP 402 flow</li>
          <li>Per-request pricing without subscriptions or human approval</li>
          <li>Proof-gated data delivery — payment receipt verifies access</li>
          <li>Audit trail of every machine-to-machine transaction</li>
          <li>Compliance gate checks agent identity before releasing data</li>
        </ul>
        <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "1rem" }}>
          All x402 flows are simulation-only until provider, legal, compliance, custody, and board approval gates are satisfied.
        </p>
      </div>
    </div>
  );
}
