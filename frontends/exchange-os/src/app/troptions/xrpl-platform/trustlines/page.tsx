import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplTrustlineTable } from "@/components/xrpl-platform/XrplTrustlineTable";
import { XRPL_TRUSTLINE_REGISTRY } from "@/content/troptions/xrplTrustlineRegistry";

export default function TroptionsXrplTrustlinesPage() {
  return (
    <XrplPlatformLayout title="XRPL Trustline Registry" intro="Read-only trustline visibility for issuer exposure, freeze controls, and holder authorization state.">
      <XrplTrustlineTable trustlines={XRPL_TRUSTLINE_REGISTRY} />
    </XrplPlatformLayout>
  );
}