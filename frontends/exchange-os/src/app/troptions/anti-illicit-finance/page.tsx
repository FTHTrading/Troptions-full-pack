import { ANTI_ILLICIT_FINANCE_REGISTRY } from "@/content/troptions/antiIllicitFinanceRegistry";

export default function TroptionsAntiIllicitFinancePage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Anti-Illicit-Finance Controls</h1>
      <p>Wallet risk simulation, sanctions placeholders, suspicious route flags, freeze awareness, compliance escalation, and audit export controls.</p>
      <ul>{ANTI_ILLICIT_FINANCE_REGISTRY.map((item) => <li key={item.id}>{item.control}</li>)}</ul>
    </main>
  );
}
