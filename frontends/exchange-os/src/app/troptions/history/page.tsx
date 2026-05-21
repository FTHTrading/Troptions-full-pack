import { LegacyTimeline } from "@/components/troptions-evolution/LegacyTimeline";
import { EvidenceRequiredBanner } from "@/components/troptions-evolution/EvidenceRequiredBanner";
import { TROPTIONS_HISTORY_REGISTRY } from "@/content/troptions/troptionsHistoryRegistry";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions History",
  description: "Chronological Troptions history from legacy utility era to institutional operating system transition.",
};

export default function TroptionsHistoryPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">History</p>
          <h1 className="te-heading">Troptions Legacy to Institutional Future</h1>
          <p className="te-subheading">
            Troptions history is retained as source-dated records with explicit verification and evidence requirements.
          </p>
        </header>

        <LegacyTimeline milestones={TROPTIONS_HISTORY_REGISTRY} />

        <EvidenceRequiredBanner
          points={[
            "Historical references are treated as claims until corroborated.",
            "Institutional publication requires source and risk labeling.",
            "No legacy statement is promoted without evidence attachments.",
          ]}
        />
      </div>
    </main>
  );
}
