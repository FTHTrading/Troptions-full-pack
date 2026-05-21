import { SOLANA_RAIL_CAPABILITIES } from "@/content/troptions/solanaRailRegistry";

export default function TroptionsChainsSolanaPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Solana Rail Readiness</h1>
      <p>Solana support is simulation-only for payment intents, token extension readiness, and public-benefit disbursement modeling.</p>
      <ul>{SOLANA_RAIL_CAPABILITIES.map((item) => <li key={item.id}>{item.capability} ({item.mode})</li>)}</ul>
    </main>
  );
}
