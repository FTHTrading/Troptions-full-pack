import { XrplAmmPoolCard } from "@/components/xrpl-platform/XrplAmmPoolCard";
import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XRPL_AMM_POOL_REGISTRY } from "@/content/troptions/xrplAmmPoolRegistry";

export default function TroptionsXrplAmmPage() {
  return (
    <XrplPlatformLayout title="XRPL AMM Pool Monitor" intro="AMM pool depth, fee bands, and LP positioning for documented XRPL liquidity pairs.">
      <section className="xp-grid-2">
        {XRPL_AMM_POOL_REGISTRY.map((pool) => <XrplAmmPoolCard key={pool.id} pool={pool} />)}
      </section>
    </XrplPlatformLayout>
  );
}