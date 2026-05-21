import { EVM_TREX_PERMISSION_GATES } from "@/content/troptions/evmTrexRegistry";

export default function TroptionsRwaTrexPage() {
  return (<main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}><h1>RWA T-REX Readiness</h1><p>Permissioned tokenized asset support is readiness-only and depends on identity, eligibility, transfer restrictions, and legal classification controls.</p><ul>{EVM_TREX_PERMISSION_GATES.map((item) => <li key={item.id}>{item.gate}</li>)}</ul></main>);
}
