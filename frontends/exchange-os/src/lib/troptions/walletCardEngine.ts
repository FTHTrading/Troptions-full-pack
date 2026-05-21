import { getCardsByWalletId, canFreezeCard, canRequestCardFunding } from "@/content/troptions/walletCardRegistry";

export interface CardAction {
  action: "reveal" | "freeze" | "unfreeze" | "fund" | "cancel";
  status: "simulation-only" | "request-pending" | "approved" | "denied";
  message: string;
  blockedReason?: string;
}

export function freezeCard(walletId: string, cardId: string): CardAction {
  const cards = getCardsByWalletId(walletId);
  const card = cards.find((c) => c.cardId === cardId);

  if (!card) {
    return {
      action: "freeze",
      status: "denied",
      message: "Card not found",
      blockedReason: "card-not-found",
    };
  }

  if (!canFreezeCard(card)) {
    return {
      action: "freeze",
      status: "denied",
      message: "Card cannot be frozen (not active or already frozen)",
      blockedReason: "card-not-freezable",
    };
  }

  return {
    action: "freeze",
    status: "simulation-only",
    message: `Card freeze request logged for ${card.cardLabel}. In production, request submitted to card provider.`,
  };
}

export function requestCardFunding(walletId: string, cardId: string, amount: string): CardAction {
  const cards = getCardsByWalletId(walletId);
  const card = cards.find((c) => c.cardId === cardId);

  if (!card) {
    return {
      action: "fund",
      status: "denied",
      message: "Card not found",
      blockedReason: "card-not-found",
    };
  }

  if (!canRequestCardFunding(card)) {
    return {
      action: "fund",
      status: "approved",
      message: `Card funding already ${card.fundingStatus}. Cannot request new funding.`,
      blockedReason: "funding-already-requested",
    };
  }

  return {
    action: "fund",
    status: "simulation-only",
    message: `Card funding request: $${amount} for ${card.cardLabel}. In production, funding request submitted for provider approval and source verification.`,
  };
}

export function revealCardNumber(cardId: string): CardAction {
  // In production, this would require additional verification (OTP, biometric, etc.)
  return {
    action: "reveal",
    status: "simulation-only",
    message: "Card details reveal request. In production, would require additional authentication.",
  };
}

export function getCardStatus(walletId: string): {
  activeCards: number;
  frozenCards: number;
  pendingCards: number;
  fundingRequestsPending: number;
} {
  const cards = getCardsByWalletId(walletId);

  return {
    activeCards: cards.filter((c) => c.status === "active").length,
    frozenCards: cards.filter((c) => c.status === "frozen").length,
    pendingCards: cards.filter((c) => c.status === "pending").length,
    fundingRequestsPending: cards.filter((c) => c.fundingStatus === "pending").length,
  };
}
