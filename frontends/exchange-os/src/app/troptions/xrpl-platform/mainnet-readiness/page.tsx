import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplReadinessGatePanel } from "@/components/xrpl-platform/XrplReadinessGatePanel";

export default function TroptionsXrplMainnetReadinessPage() {
  return (
    <XrplPlatformLayout title="XRPL Mainnet Readiness Gates" intro="Future execution remains blocked until legal, custody, provider, compliance, signer, and board approvals are complete.">
      <XrplReadinessGatePanel />
    </XrplPlatformLayout>
  );
}