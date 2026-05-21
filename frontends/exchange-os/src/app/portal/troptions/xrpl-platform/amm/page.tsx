import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplAmmPoolCard } from "@/components/xrpl-platform/XrplAmmPoolCard";
import { XRPL_AMM_POOL_REGISTRY } from "@/content/troptions/xrplAmmPoolRegistry";

export default function PortalXrplAmmPage() {
  return <ClientPortalLayout title="XRPL AMM" intro="Pool depth and LP monitoring for documented XRPL pairs.">{XRPL_AMM_POOL_REGISTRY.slice(0, 2).map((pool) => <XrplAmmPoolCard key={pool.id} pool={pool} />)}</ClientPortalLayout>;
}