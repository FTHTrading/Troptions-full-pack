import { XrplExternalLinksPanel } from "@/components/xrpl-platform/XrplExternalLinksPanel";
import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";

export default function TroptionsXrplLinksPage() {
  return (
    <XrplPlatformLayout title="XRPL Docs, GitHub, and Troptions Links" intro="Official XRPL references, testnet resources, security notes, and Troptions platform entry points.">
      <XrplExternalLinksPanel />
    </XrplPlatformLayout>
  );
}