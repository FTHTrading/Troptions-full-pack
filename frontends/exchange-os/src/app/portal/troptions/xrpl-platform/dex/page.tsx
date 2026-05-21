import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplOrderBookTable } from "@/components/xrpl-platform/XrplOrderBookTable";
import { XRPL_ORDER_BOOK_REGISTRY } from "@/content/troptions/xrplOrderBookRegistry";

export default function PortalXrplDexPage() {
  return <ClientPortalLayout title="XRPL DEX" intro="Order-book monitoring via XRPL Offers."><div style={{ gridColumn: "1 / -1" }}><XrplOrderBookTable books={XRPL_ORDER_BOOK_REGISTRY} /></div></ClientPortalLayout>;
}