import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";

export default function TroptionsPaymentRailsPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Institutional Payment Rail Readiness</h1>
      <p>Troptions evaluates payment rails across stablecoins and chains in simulation-only mode with blocked-by-default release controls.</p>
      <ul>{STABLECOIN_ISSUER_REGISTRY.map((item) => <li key={item.symbol}>{item.symbol}: {item.useCases.join(", ")}</li>)}</ul>
    </main>
  );
}
