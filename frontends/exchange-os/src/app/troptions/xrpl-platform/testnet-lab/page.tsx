import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplSecurityBanner } from "@/components/xrpl-platform/XrplSecurityBanner";
import { createUnsignedTestnetOffer, createUnsignedTestnetPayment } from "@/lib/troptions/xrplTestnetExecutionEngine";

export default function TroptionsXrplTestnetLabPage() {
  const offer = createUnsignedTestnetOffer({ account: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" });
  const payment = createUnsignedTestnetPayment({ account: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" });

  return (
    <XrplPlatformLayout title="XRPL Testnet Trading Lab" intro="Unsigned testnet payloads only. No private-key import, in-app signing, or mainnet submission.">
      <XrplSecurityBanner />
      <section className="xp-grid-2">
        <article className="xp-card"><p className="xp-label">Unsigned OfferCreate</p><pre className="xp-code">{JSON.stringify(offer.txJson, null, 2)}</pre></article>
        <article className="xp-card"><p className="xp-label">Unsigned Payment</p><pre className="xp-code">{JSON.stringify(payment.txJson, null, 2)}</pre></article>
      </section>
    </XrplPlatformLayout>
  );
}