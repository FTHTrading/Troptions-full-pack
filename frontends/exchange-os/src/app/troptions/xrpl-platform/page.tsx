import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplMarketDataCard } from "@/components/xrpl-platform/XrplMarketDataCard";
import { XrplReadinessGatePanel } from "@/components/xrpl-platform/XrplReadinessGatePanel";
import { XrplSecurityBanner } from "@/components/xrpl-platform/XrplSecurityBanner";
import { XRPL_LIVE_PLATFORM_REGISTRY } from "@/content/troptions/xrplLivePlatformRegistry";

export default function TroptionsXrplPlatformPage() {
  return (
    <XrplPlatformLayout title="XRPL Market Data, AMM, and DEX Readiness" intro={XRPL_LIVE_PLATFORM_REGISTRY.positioning.summary}>
      <XrplSecurityBanner />
      <section className="xp-grid-2">
        {XRPL_LIVE_PLATFORM_REGISTRY.marketData.map((record) => (
          <XrplMarketDataCard key={record.id} record={record} />
        ))}
      </section>
      <section className="xp-grid-3">
        {[
          "Live market data",
          "Order books",
          "AMM pools",
          "Trustlines",
          "Issued assets",
          "Pathfinding quotes",
          "Testnet lab",
          "Mainnet readiness gates",
          "GitHub + docs links",
        ].map((item) => (
          <article key={item} className="xp-card"><p className="xp-value" style={{ fontSize: "1.15rem" }}>{item}</p></article>
        ))}
      </section>
      <div className="xp-actions">
        <a href="/troptions/xrpl-platform/links" className="xp-chip">View XRPL Links</a>
        <a href="/portal/troptions/xrpl-platform" className="xp-chip">Open Portal XRPL</a>
        <a href="/admin/troptions/xrpl-platform" className="xp-chip">Admin XRPL Control</a>
      </div>
      <XrplReadinessGatePanel />
    </XrplPlatformLayout>
  );
}