import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplQuoteSimulator } from "@/components/xrpl-platform/XrplQuoteSimulator";

export default function PortalXrplQuotePage() {
  return <ClientPortalLayout title="XRPL Quote Simulation" intro="Unsigned route estimation only."><div style={{ gridColumn: "1 / -1" }}><XrplQuoteSimulator /></div></ClientPortalLayout>;
}