import { ThenNowComparison } from "@/components/troptions-evolution/ThenNowComparison";
import { EvidenceRequiredBanner } from "@/components/troptions-evolution/EvidenceRequiredBanner";
import { CapabilityExpansionGrid } from "@/components/troptions-evolution/CapabilityExpansionGrid";
import { TROPTIONS_CAPABILITY_EXPANSION } from "@/content/troptions/troptionsCapabilityExpansion";
import {
  TROPTIONS_EARLY_ERA_SUMMARY,
  TROPTIONS_NEW_ERA_SUMMARY,
  TROPTIONS_THEN_NOW_REGISTRY,
} from "@/content/troptions/troptionsThenNowRegistry";
import { INSTITUTIONAL_BLOCKED_ACTIONS } from "@/content/troptions/institutionalFutureRegistry";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Then vs Now",
  description: "Comparison of early Troptions utility era and the current institutional operating-system transition.",
};

const WHAT_TROPTIONS_BUILT = [
  "Troptions Pay",
  "Merchant payment rails",
  "GivBux connection",
  "Unity",
  "Gold / RWA ideas",
  "Community and humanitarian positioning",
  "Token utility",
  "Real-world use narrative",
] as const;

const WHAT_THIS_CHANGES = [
  "Turns legacy claims into evidence packages",
  "Turns public marketing into source-tracked diligence",
  "Turns RWA ideas into controlled intake workflows",
  "Turns payment and merchant claims into dated source records",
  "Turns token stories into role-based system definitions",
  "Turns trading and exchange ideas into simulation and approval workflows",
  "Turns support into telecom and AI concierge pathways",
  "Turns content into AI-readable knowledge infrastructure",
] as const;

const WHAT_WILL_BE_POSSIBLE = [
  "Onboard clients",
  "Track KYC/KYB readiness",
  "Manage POF evidence",
  "Manage SBLC evidence",
  "Intake RWA assets",
  "Track title, valuation, custody, and proof",
  "Coordinate provider rails",
  "Evaluate banking rails",
  "Evaluate stablecoin rails",
  "Simulate XRPL routes",
  "Simulate AMM and DEX conversions",
  "Simulate trading strategies",
  "Manage release gates",
  "Produce signed audit exports",
  "Publish AI-readable trust manifests",
  "Maintain institutional source maps",
  "Run AI search optimized insight system",
  "Support future x402 paid API/report access",
  "Support Telnyx voice and SMS concierge in dry-run until approved",
] as const;

export default function TroptionsThenNowPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Then vs Now</p>
          <h1 className="te-heading">From Legacy Utility to Institutional Infrastructure</h1>
          <p className="te-subheading">{TROPTIONS_NEW_ERA_SUMMARY}</p>
        </header>

        <section className="te-panel">
          <h2>The Early Troptions Era</h2>
          <p>{TROPTIONS_EARLY_ERA_SUMMARY}</p>
        </section>

        <section className="te-panel">
          <h2>What Troptions Built</h2>
          <div className="te-grid-3">
            {WHAT_TROPTIONS_BUILT.map((item) => (
              <article key={item} className="te-panel"><p>{item}</p></article>
            ))}
          </div>
        </section>

        <section className="te-panel">
          <h2>What Had To Change</h2>
          <p>
            The digital asset market matured. Institutions require proof, custody, auditability, compliance,
            source tracking, jurisdiction controls, and provider gating. Marketing claims alone are no longer
            enough. Every claim now needs evidence.
          </p>
        </section>

        <section className="te-panel">
          <h2>The Institutional Troptions Era</h2>
          <ThenNowComparison records={TROPTIONS_THEN_NOW_REGISTRY} />
        </section>

        <section className="te-panel">
          <h2>What This Changes</h2>
          <ul>
            {WHAT_THIS_CHANGES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="te-panel">
          <h2>What Troptions Will Be Able To Do</h2>
          <div className="te-grid-3">
            {WHAT_WILL_BE_POSSIBLE.map((item) => (
              <article key={item} className="te-panel"><p>{item}</p></article>
            ))}
          </div>
        </section>

        <section className="te-panel">
          <h2>What Still Cannot Happen Without Approval</h2>
          <ul>
            {INSTITUTIONAL_BLOCKED_ACTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="te-panel">
          <h2>Capability Snapshot</h2>
          <CapabilityExpansionGrid items={TROPTIONS_CAPABILITY_EXPANSION.slice(0, 9)} />
        </section>

        <EvidenceRequiredBanner
          points={[
            "No claim is treated as institutional fact without source and evidence status.",
            "Legally sensitive statements remain blocked until legal and provider approvals.",
            "Simulation and readiness workflows do not imply production authorization.",
          ]}
        />
      </div>
    </main>
  );
}
