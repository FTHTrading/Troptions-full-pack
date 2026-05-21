import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplMarketDataCard } from "@/components/xrpl-platform/XrplMarketDataCard";
import { XRPL_MARKET_DATA_REGISTRY } from "@/content/troptions/xrplMarketDataRegistry";

export default function PortalXrplLiveDataPage() {
  return <ClientPortalLayout title="XRPL Live Data" intro="Read-only XRPL market telemetry.">{XRPL_MARKET_DATA_REGISTRY.slice(0, 2).map((record) => <XrplMarketDataCard key={record.id} record={record} />)}</ClientPortalLayout>;
}