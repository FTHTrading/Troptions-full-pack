import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletFundingRequestPanel } from "@/components/troptions-wallet/WalletFundingRequestPanel";
import { getDefaultFundingBlockers } from "@/content/troptions/walletFundingRequestRegistry";
import "@/styles/troptions-wallet.css";

export default function FundingRequestPage() {
  const blockers = getDefaultFundingBlockers();

  return (
    <WalletLayout title="Request Funding" subtitle="Apply for funding approval">
      <div className="mx-auto max-w-2xl">
        <WalletFundingRequestPanel blockedUntil={blockers} />
      </div>
    </WalletLayout>
  );
}
