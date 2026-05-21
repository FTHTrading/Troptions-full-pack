import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletBalanceCard } from "@/components/troptions-wallet/WalletBalanceCard";
import { WalletActionButtons } from "@/components/troptions-wallet/WalletActionButtons";
import { WalletComplianceNotice } from "@/components/troptions-wallet/WalletComplianceNotice";
import { WalletRiskBanner } from "@/components/troptions-wallet/WalletRiskBanner";
import { WalletCardPreview } from "@/components/troptions-wallet/WalletCardPreview";
import { getWalletBalances } from "@/content/troptions/walletBalanceRegistry";
import { getCardsByWalletId } from "@/content/troptions/walletCardRegistry";
import { getWalletRiskAssessment } from "@/content/troptions/walletRiskRegistry";
import "@/styles/troptions-wallet.css";

export default function WalletDashboard() {
  const walletId = "wallet_kevan_main";
  const balances = getWalletBalances(walletId);
  const risk = getWalletRiskAssessment(walletId);
  const cards = getCardsByWalletId(walletId);

  return (
    <WalletLayout title="Your Wallet" subtitle="Welcome to your Troptions Genesis Wallet in simulation mode">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* Risk Banner */}
        {risk && <WalletRiskBanner riskLevel={risk.overallRiskLevel} />}

        {/* Compliance Notice */}
        <WalletComplianceNotice />

        {/* Wallet Card */}
        {cards.length > 0 && <WalletCardPreview card={cards[0]} />}

        {/* Balances */}
        {balances.map((balance) => (
          <WalletBalanceCard key={balance.balanceId} balance={balance} />
        ))}

        {/* Actions */}
        <div style={{ gridColumn: "1 / -1" }}>
          <WalletActionButtons canSend={true} canReceive={true} canConvert={true} canRequestFunding={true} />
        </div>
      </div>
    </WalletLayout>
  );
}
