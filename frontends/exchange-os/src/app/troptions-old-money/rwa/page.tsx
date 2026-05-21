import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { InstitutionalVisualSection } from "@/components/troptions-media/InstitutionalVisualSection";
import { getMediaByCategory } from "@/content/troptions/mediaRegistry";

export default function TroptionsOldMoneyRwaPage() {
  const rwaAssets = getMediaByCategory("rwa");

  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.rwa} />
      {rwaAssets.length > 0 && (
        <div className="om-page" style={{ marginTop: "1.2rem" }}>
          <InstitutionalVisualSection
            heading="Asset Evidence &amp; Flow Diagrams"
            subheading="Institutional reference materials for the RWA intake, token readiness, and custody gating process."
            assets={rwaAssets}
            columns="auto"
          />
        </div>
      )}
    </>
  );
}
