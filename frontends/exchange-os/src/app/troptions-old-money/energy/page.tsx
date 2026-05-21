import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { InstitutionalVisualSection } from "@/components/troptions-media/InstitutionalVisualSection";
import { AssetImageCard } from "@/components/troptions-media/AssetImageCard";
import { getMediaByCategory, MEDIA_REGISTRY } from "@/content/troptions/mediaRegistry";

export default function TroptionsOldMoneyEnergyPage() {
  const energyAssets = getMediaByCategory("energy");
  const certAsset = MEDIA_REGISTRY.find((m) => m.id === "certificate-power-genesis");

  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.energy} />
      {energyAssets.length > 0 && (
        <div className="om-page" style={{ marginTop: "1.2rem", gap: "1.2rem", display: "flex", flexDirection: "column" }}>
          <InstitutionalVisualSection
            heading="Energy Namespace Marks"
            subheading="Institutional asset marks for oil and carbon environmental namespaces."
            assets={energyAssets}
            columns="auto"
          />
          {certAsset && (
            <div className="tm-visual-section">
              <h2 className="tm-section-heading">Production Certificate</h2>
              <p className="tm-section-subheading">
                Power Genesis certificate retained in the energy asset evidence package.
              </p>
              <div style={{ maxWidth: "420px" }}>
                <AssetImageCard
                  src={certAsset.src}
                  alt={certAsset.alt}
                  title={certAsset.title}
                  caption={certAsset.description}
                  category={certAsset.category}
                  complianceNote={certAsset.complianceNote}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
