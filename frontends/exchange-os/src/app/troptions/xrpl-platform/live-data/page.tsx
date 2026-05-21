import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplMarketDataCard } from "@/components/xrpl-platform/XrplMarketDataCard";
import { XrplSecurityBanner } from "@/components/xrpl-platform/XrplSecurityBanner";
import { XRPL_MARKET_DATA_REGISTRY } from "@/content/troptions/xrplMarketDataRegistry";

export default function TroptionsXrplLiveDataPage() {
  return (
    <XrplPlatformLayout title="XRPL Live Market Data Terminal" intro="Read-only market telemetry across XRPL DEX, AMM, and pathfinding surfaces.">
      <XrplSecurityBanner />
      <section className="xp-grid-2">
        {XRPL_MARKET_DATA_REGISTRY.map((record) => <XrplMarketDataCard key={record.id} record={record} />)}
      </section>
    </XrplPlatformLayout>
  );
}