import { TRON_RAIL_REGISTRY } from "@/content/troptions/tronRailRegistry";

export default function TroptionsChainsTronPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>TRON Rail Monitoring</h1>
      <p>TRON is treated as a USDT monitoring and risk-evaluation rail with blocked-by-default live execution.</p>
      <ul>{TRON_RAIL_REGISTRY.map((item) => <li key={item.rail}>{item.rail}: {item.status}</li>)}</ul>
    </main>
  );
}
