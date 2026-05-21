import { getWalletAccountsByUserId } from "@/content/troptions/walletAccountRegistry";

export interface WalletCreationRequest {
  userId: string;
  handle: string;
  displayName: string;
  accountLabel: string;
  accountType: "personal" | "institutional" | "treasury" | "test";
}

export interface WalletCreationResult {
  ok: boolean;
  walletId?: string;
  simulationMode: boolean;
  message: string;
  blockedReason?: string;
  nextSteps?: readonly string[];
}

export function createWalletAccount(request: WalletCreationRequest): WalletCreationResult {
  // Validate inputs
  if (!request.userId || !request.handle) {
    return {
      ok: false,
      simulationMode: true,
      message: "Missing required fields: userId, handle",
      blockedReason: "invalid-request",
    };
  }

  // Check if user already has account with this handle (in production, query database)
  const existingAccounts = getWalletAccountsByUserId(request.userId);
  if (existingAccounts.length > 0) {
    return {
      ok: true,
      walletId: existingAccounts[0].walletId,
      simulationMode: true,
      message: `Wallet account already exists in simulation mode: ${existingAccounts[0].walletId}`,
      nextSteps: [
        "View wallet dashboard",
        "Complete KYC verification",
        "Request funding approval",
        "Enable chain routes",
      ],
    };
  }

  // Create new wallet ID (in production, use database)
  const newWalletId = `wallet_${request.handle}_${Date.now()}`;

  return {
    ok: true,
    walletId: newWalletId,
    simulationMode: true,
    message: `Wallet created in simulation mode: ${newWalletId}. Live funding and transactions require provider approval, compliance review, and custody verification.`,
    nextSteps: [
      "Complete KYC/KYB verification",
      "Pass sanctions screening",
      "Request funding",
      "Enable chain integrations",
      "Setup x402 access (optional)",
    ],
  };
}

export function getWalletCreationRequirements(): {
  kycRequired: boolean;
  kybRequired: boolean;
  sanctionsScreening: boolean;
  fundingApprovalRequired: boolean;
  custodyRequired: boolean;
  estimatedTimeToProduction: string;
} {
  return {
    kycRequired: true,
    kybRequired: false,
    sanctionsScreening: true,
    fundingApprovalRequired: true,
    custodyRequired: true,
    estimatedTimeToProduction: "5-10 business days after approvals",
  };
}
