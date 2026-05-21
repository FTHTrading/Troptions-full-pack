import { LEGACY_SOURCE_REGISTRY } from "@/content/troptions/legacySourceRegistry";
import { SourceMapTable } from "@/components/troptions-evolution/SourceMapTable";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Legacy Sources",
  description: "Legacy source registry for Troptions public history and ecosystem claims.",
};

export default function TroptionsDiligenceLegacySourcesPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Diligence</p>
          <h1 className="te-heading">Legacy Source Registry</h1>
          <p className="te-subheading">Source-dated records from official, third-party, and historical Troptions materials.</p>
        </header>
        <SourceMapTable sources={LEGACY_SOURCE_REGISTRY} />
      </div>
    </main>
  );
}
