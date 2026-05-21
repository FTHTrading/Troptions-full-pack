export interface WalletCard {
  readonly cardId: string;
  readonly walletId: string;
  readonly cardType: "virtual" | "physical" | "placeholder";
  readonly cardBrand: string;
  readonly cardLabel: string;
  readonly maskedNumber: string;
  readonly displayName: string;
  readonly expiryMonth: string;
  readonly expiryYear: string;
  readonly status: "active" | "frozen" | "pending" | "expired" | "cancelled";
  readonly dailyLimit: string;
  readonly monthlyLimit: string;
  readonly usedDailyLimit: string;
  readonly usedMonthlyLimit: string;
  readonly fundingSource: "internal-ledger" | "provider-route" | "none";
  readonly fundingStatus: "none" | "pending" | "approved" | "denied";
  readonly cardholderName: string;
  readonly createdAt: string;
  readonly activatedAt?: string;
}

export const WALLET_CARD_REGISTRY: readonly WalletCard[] = [
  {
    cardId: "card_kevan_001",
    walletId: "wallet_kevan_main",
    cardType: "virtual",
    cardBrand: "Troptions",
    cardLabel: "Troptions Black Label",
    maskedNumber: "•••• •••• •••• 0000",
    displayName: "TROPTIONS Chairman",
    expiryMonth: "--",
    expiryYear: "--",
    status: "active",
    dailyLimit: "5000.00",
    monthlyLimit: "50000.00",
    usedDailyLimit: "0.00",
    usedMonthlyLimit: "0.00",
    fundingSource: "none",
    fundingStatus: "none",
    cardholderName: "TROPTIONS CHAIRMAN",
    createdAt: "2026-04-25T12:00:00Z",
    activatedAt: "2026-04-25T12:05:00Z",
  },
];

export function getCardByCardId(cardId: string): WalletCard | undefined {
  return WALLET_CARD_REGISTRY.find((card) => card.cardId === cardId);
}

export function getCardsByWalletId(walletId: string): readonly WalletCard[] {
  return WALLET_CARD_REGISTRY.filter((card) => card.walletId === walletId);
}

export function isCardActive(card: WalletCard): boolean {
  return card.status === "active" && card.fundingStatus !== "denied";
}

export function canFreezeCard(card: WalletCard): boolean {
  return card.status === "active";
}

export function canRequestCardFunding(card: WalletCard): boolean {
  return card.fundingStatus === "none" || card.fundingStatus === "denied";
}
