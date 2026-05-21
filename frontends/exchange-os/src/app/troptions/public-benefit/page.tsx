import Link from "next/link";
import { PUBLIC_BENEFIT_RAIL_STATEMENT, PUBLIC_BENEFIT_REGISTRY } from "@/content/troptions/publicBenefitRegistry";

export default function TroptionsPublicBenefitPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Troptions Public Benefit Rail</h1>
      <p>{PUBLIC_BENEFIT_RAIL_STATEMENT}</p>
      <ul>{PUBLIC_BENEFIT_REGISTRY.map((item) => <li key={item.id}>{item.control}: {item.purpose}</li>)}</ul>
      <p><Link href="/troptions/public-benefit/fentanyl-prevention">Fentanyl Prevention Transparency Layer</Link></p>
    </main>
  );
}
