import { LEGACY_SOURCE_REGISTRY } from "@/content/troptions/legacySourceRegistry";
import { SourceMapTable } from "@/components/troptions-evolution/SourceMapTable";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Legacy Source Map",
  description: "Institutional source map for Troptions legacy and public ecosystem claims.",
};

export default function TroptionsDiligenceSourceMapPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Source Map</p>
          <h1 className="te-heading">Legacy Source Map</h1>
          <p className="te-subheading">
            This source map is the diligence index for historical and public Troptions materials and their institutional-use status.
          </p>
        </header>
        <SourceMapTable sources={LEGACY_SOURCE_REGISTRY} />
      </div>
    </main>
  );
}
