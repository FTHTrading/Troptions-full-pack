import type { WalletAccount } from "@/content/troptions/walletAccountRegistry";

export interface SendRequest {
  walletId: string;
  amount: string;
  currency: string;
  sourceChain: string;
  destinationChain: string;
  destinationAddress?: string;
  recipientName?: string;
  notes?: string;
}

export interface SendResult {
  ok: boolean;
  status: "simulation-only" | "pending" | "executed" | "failed";
  message: string;
  blockedReason?: string;
  simulation?: {
    estimatedFee: string;
    estimatedTime: string;
    requiresApprovals: readonly string[];
  };
}

export function simulateSend(
  account: Pick<WalletAccount, "allowedActions" | "blockedActions">,
  request: SendRequest
): SendResult {
  const canSend = account.allowedActions.includes("simulation-send") && !account.blockedActions.includes("simulation-send");

  if (!canSend) {
    return {
      ok: false,
      status: "failed",
      message: "Send action is not allowed for this wallet",
      blockedReason: "send-not-allowed",
    };
  }

  if (parseFloat(request.amount) <= 0) {
    return {
      ok: false,
      status: "failed",
      message: "Send amount must be greater than 0",
      blockedReason: "invalid-amount",
    };
  }

  return {
    ok: true,
    status: "simulation-only",
    message: `Simulating send of ${request.amount} ${request.currency} from ${request.sourceChain} to ${request.destinationChain}`,
    simulation: {
      estimatedFee: (parseFloat(request.amount) * 0.001).toFixed(2),
      estimatedTime: "2-5 minutes (in production)",
      requiresApprovals: ["KYC verification", "Sanctions screening", "Provider approval", "Custody approval"],
    },
  };
}

export function canPerformSend(amount: string, dailyLimit: string, usedDailyLimit: string): boolean {
  const amountNum = parseFloat(amount);
  const limitNum = parseFloat(dailyLimit);
  const usedNum = parseFloat(usedDailyLimit);
  return amountNum > 0 && usedNum + amountNum <= limitNum;
}
