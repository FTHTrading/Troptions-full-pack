import { EVM_TREX_PERMISSION_GATES } from "@/content/troptions/evmTrexRegistry";

export default function TroptionsChainsEvmTrexPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>EVM / T-REX Permissioned Asset Readiness</h1>
      <p>Permissioned tokenized-asset logic is readiness-only and remains legally/provider gated.</p>
      <ul>{EVM_TREX_PERMISSION_GATES.map((item) => <li key={item.id}>{item.gate}</li>)}</ul>
    </main>
  );
}
