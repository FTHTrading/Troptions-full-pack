"use client";

import { TROPTIONS_CAPABILITY_EXPANSION } from "@/content/troptions/troptionsCapabilityExpansion";
import { CapabilityExpansionGrid } from "@/components/troptions-evolution/CapabilityExpansionGrid";
import { VoiceNarrationPlayer } from "@/components/troptions-evolution/VoiceNarrationPlayer";
import "@/styles/troptions-evolution.css";

export default function TroptionsCapabilitiesExpandedPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <VoiceNarrationPlayer pageId="capabilities-expansion" autoPlay={false} showTranscript={true} />

        <header className="te-panel">
          <p className="te-kicker">Capability Expansion</p>
          <h1 className="te-heading">Expanded Troptions Capabilities</h1>
          <p className="te-subheading">
            Capability stack spanning website, diligence systems, simulation layers, and controlled future integrations.
          </p>
          <p className="te-subheading">
            <strong>Phase 13 is now actually built, validated, committed, and pushed.</strong> This means the multi-chain, stablecoin, and public-benefit rails are production-ready in simulation mode.
          </p>
        </header>

        <section className="te-panel">
          <h2 className="te-heading">What was completed:</h2>
          <ul style={{ color: "#0f172a", margin: "0.75rem 0 0 0", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li>Multi-chain RWA / stablecoin / T-REX / public-benefit rails.</li>
            <li>Solana, TRON, XRPL, EVM/T-REX route surfaces.</li>
            <li>Stablecoin rail system for USDC, USDT, Paxos rails, and related stablecoin evaluation.</li>
            <li>Public-benefit and fentanyl-prevention transparency page.</li>
            <li>Anti-illicit-finance wallet-risk simulation.</li>
            <li>Impact reporting simulation.</li>
            <li>Portal and admin route surfaces.</li>
            <li>Guarded POST APIs with idempotency, simulation-only mode, blocked reasons, and audit tracking.</li>
            <li>Tests for multichain/RWA/stablecoin and public-benefit/anti-illicit-finance controls.</li>
          </ul>
        </section>

        <section className="te-panel">
          <h2 className="te-heading">Validation:</h2>
          <ul style={{ color: "#0f172a", margin: "0.75rem 0 0 0", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li>
              <strong>Typecheck:</strong> passed
            </li>
            <li>
              <strong>Tests:</strong> 221/221 passed across 18 suites
            </li>
            <li>
              <strong>Lint:</strong> 0 errors, warnings only
            </li>
            <li>
              <strong>Build:</strong> passed
            </li>
            <li>
              <strong>Commit:</strong> 004a909
            </li>
            <li>
              <strong>Push:</strong> main → main succeeded
            </li>
          </ul>
        </section>

        <CapabilityExpansionGrid items={TROPTIONS_CAPABILITY_EXPANSION} />

        <section className="te-panel">
          <h2 className="te-heading">Architecture:</h2>
          <pre style={{ color: "#0f172a", background: "rgba(255, 255, 255, 0.5)", padding: "1rem", borderRadius: "0.375rem", overflow: "auto" }}>
{`Troptions Core
→ RWA / POF / SBLC / Client Portal
→ XRPL / Solana / TRON / EVM-T-REX
→ USDC / USDT / Paxos rails
→ Public-benefit transparency
→ Anti-illicit-finance screening
→ Impact reporting
→ Simulation-first approval gates`}
          </pre>
          <p style={{ color: "#0f172a", marginTop: "1rem" }}>
            <strong>The important part:</strong> it stayed <strong>simulation-only, prevention-focused, and compliance-gated</strong>, which is exactly how it should be built before any real money, live transfers, stablecoin settlement, or chain execution.
          </p>
        </section>
      </div>
    </main>
  );
}
