import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplReadinessGatePanel } from "@/components/xrpl-platform/XrplReadinessGatePanel";

export default function PortalXrplReadinessPage() {
  return <ClientPortalLayout title="XRPL Readiness" intro="Mainnet execution stays blocked until every approval gate is satisfied."><div style={{ gridColumn: "1 / -1" }}><XrplReadinessGatePanel /></div></ClientPortalLayout>;
}