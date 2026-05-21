import { CHAIN_RISK_REGISTRY } from "@/content/troptions/chainRiskRegistry";

export default function TroptionsChainRiskPage() {
  return (<main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}><h1>Chain Risk</h1><ul>{CHAIN_RISK_REGISTRY.map((item) => <li key={item.chain}>{item.chain}: {item.baseRisk}</li>)}</ul></main>);
}
