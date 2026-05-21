import Link from "next/link";
import { LegacyTimeline } from "@/components/troptions-evolution/LegacyTimeline";
import { EvidenceRequiredBanner } from "@/components/troptions-evolution/EvidenceRequiredBanner";
import { TROPTIONS_HISTORY_REGISTRY } from "@/content/troptions/troptionsHistoryRegistry";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Legacy",
  description: "Public Troptions legacy history presented as source-tracked, evidence-aware institutional language.",
};

export default function TroptionsLegacyPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Legacy Record</p>
          <h1 className="te-heading">Troptions Legacy</h1>
          <p className="te-subheading">
            This page preserves public Troptions history while converting legacy narratives into institutional diligence language.
          </p>
          <div className="te-cta-row">
            <Link href="/troptions/history" className="te-cta-link">View Full History</Link>
            <Link href="/troptions/diligence/source-map" className="te-cta-link">Review Source Map</Link>
          </div>
        </header>

        <LegacyTimeline milestones={TROPTIONS_HISTORY_REGISTRY} />

        <EvidenceRequiredBanner
          points={[
            "Founding and timeline statements require documentary corroboration.",
            "Merchant and payment claims require dated source and provider confirmation.",
            "Utility narratives are preserved but converted into reviewable claim records.",
          ]}
        />
      </div>
    </main>
  );
}
