import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplOrderBookTable } from "@/components/xrpl-platform/XrplOrderBookTable";
import { XRPL_ORDER_BOOK_REGISTRY } from "@/content/troptions/xrplOrderBookRegistry";

export default function TroptionsXrplDexPage() {
  return (
    <XrplPlatformLayout title="XRPL DEX Order Books" intro="Native XRPL Offers are monitored read-only through order-book views and route analysis.">
      <XrplOrderBookTable books={XRPL_ORDER_BOOK_REGISTRY} />
    </XrplPlatformLayout>
  );
}