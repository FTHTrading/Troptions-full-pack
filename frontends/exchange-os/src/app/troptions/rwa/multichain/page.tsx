import { RWA_CHAIN_CAPABILITY_REGISTRY } from "@/content/troptions/rwaChainCapabilityRegistry";

export default function TroptionsRwaMultichainPage() {
  return (<main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}><h1>RWA Multi-Chain Readiness</h1><ul>{RWA_CHAIN_CAPABILITY_REGISTRY.map((item) => <li key={item.id}>{item.chain}: {item.capability}</li>)}</ul></main>);
}
