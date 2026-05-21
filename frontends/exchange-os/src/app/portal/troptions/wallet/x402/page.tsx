import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { X402WalletPanel } from "@/components/troptions-wallet/X402WalletPanel";
import { getX402Disclaimers } from "@/lib/troptions/walletX402Engine";
import { getX402AccessByWalletId } from "@/content/troptions/walletX402Registry";
import "@/styles/troptions-wallet.css";

export default function X402Page() {
  const walletId = "wallet_kevan_main";
  const x402Access = getX402AccessByWalletId(walletId);
  const disclaimers = getX402Disclaimers();

  if (!x402Access) {
    return (
      <WalletLayout title="x402 Payment Network" subtitle="Access not available">
        <div className="mx-auto max-w-2xl">
          <div className="wallet-card">
            <div className="card-body">
              <p>x402 access has not been configured for this wallet.</p>
            </div>
          </div>
        </div>
      </WalletLayout>
    );
  }

  return (
    <WalletLayout title="x402 Payment Network" subtitle="Create dry-run payment intents">
      <div className="mx-auto max-w-2xl">
        <X402WalletPanel
          walletId={walletId}
          status={x402Access.x402Status}
          operatorRole={x402Access.operatorRole}
          monthlyLimit={x402Access.monthlyPaymentIntentLimit}
          monthlyUsage={x402Access.monthlyPaymentIntentUsage}
          disclaimers={disclaimers}
        />
      </div>
    </WalletLayout>
  );
}
