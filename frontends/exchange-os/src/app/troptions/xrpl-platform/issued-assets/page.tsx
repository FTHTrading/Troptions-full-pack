import { XrplIssuedAssetCard } from "@/components/xrpl-platform/XrplIssuedAssetCard";
import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XRPL_ISSUED_ASSET_REGISTRY } from "@/content/troptions/xrplIssuedAssetRegistry";

export default function TroptionsXrplIssuedAssetsPage() {
  return (
    <XrplPlatformLayout title="XRPL Issued Asset Registry" intro="Institutional visibility into claim receipts, settlement tokens, and evidence markers on XRPL.">
      <section className="xp-grid-2">
        {XRPL_ISSUED_ASSET_REGISTRY.map((asset) => <XrplIssuedAssetCard key={asset.id} asset={asset} />)}
      </section>
    </XrplPlatformLayout>
  );
}