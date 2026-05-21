import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { InstitutionalVisualSection } from "@/components/troptions-media/InstitutionalVisualSection";
import { getMediaByCategory } from "@/content/troptions/mediaRegistry";

export default function TroptionsOldMoneyGoldPage() {
  const goldAssets = getMediaByCategory("gold");

  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.gold} />
      {goldAssets.length > 0 && (
        <div className="om-page" style={{ marginTop: "1.2rem" }}>
          <InstitutionalVisualSection
            heading="Gold Reserve Evidence"
            subheading="Serial-numbered reserve evidence and digital twin programme reference materials."
            assets={goldAssets}
            columns="auto"
          />
        </div>
      )}
    </>
  );
}
