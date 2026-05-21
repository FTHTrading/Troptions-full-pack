import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplMarketDataCard } from "@/components/xrpl-platform/XrplMarketDataCard";
import { XrplReadinessGatePanel } from "@/components/xrpl-platform/XrplReadinessGatePanel";
import { XRPL_MARKET_DATA_REGISTRY } from "@/content/troptions/xrplMarketDataRegistry";

export default function PortalXrplPlatformPage() {
  return (
    <ClientPortalLayout title="XRPL Platform" intro="Institutional XRPL market data, route simulation, and approval-gated execution readiness.">
      <XrplMarketDataCard record={XRPL_MARKET_DATA_REGISTRY[0]} />
      <XrplReadinessGatePanel />
    </ClientPortalLayout>
  );
}