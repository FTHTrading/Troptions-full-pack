import Link from "next/link";
import { MULTI_CHAIN_REGISTRY } from "@/content/troptions/multiChainRegistry";

export default function TroptionsChainsPage() {
  return (
    <main style={{ background: "#0a0f1a", minHeight: "100vh", color: "#e8e0d0", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <h1>Troptions Multi-Chain Infrastructure</h1>
        <p>Simulation, monitoring, and readiness by default across Solana, TRON, XRPL, and EVM/T-REX rails.</p>
        <ul>
          {MULTI_CHAIN_REGISTRY.map((chain) => (
            <li key={chain.chainId}>{chain.displayName}: {chain.role} ({chain.supportMode})</li>
          ))}
        </ul>
        <p><Link href="/troptions/chains/solana">Solana</Link> · <Link href="/troptions/chains/tron">TRON</Link> · <Link href="/troptions/chains/xrpl">XRPL</Link> · <Link href="/troptions/chains/evm-trex">EVM/T-REX</Link></p>
      </div>
    </main>
  );
}
