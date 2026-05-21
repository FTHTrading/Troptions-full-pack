import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { SiteOpsPanel } from "@/components/openclaw/SiteOpsPanel";

export default function AdminOpenClawSiteOpsPage() {
  return (
    <OpenClawLayout title="OpenClaw Site Ops" intro="Site checks, route monitoring, and draft-fix planning.">
      <SiteOpsPanel />
    </OpenClawLayout>
  );
}
