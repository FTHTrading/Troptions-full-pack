import { getChainsByAsset } from "@/content/troptions/walletChainRegistry";

export interface ConversionRequest {
  walletId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  sourceChain: string;
  destinationChain: string;
}

export interface ConversionResult {
  ok: boolean;
  status: "simulation-only" | "pending" | "completed" | "failed";
  message: string;
  estimatedRate?: string;
  estimatedReceiveAmount?: string;
  estimatedFee?: string;
  blockedReason?: string;
  requiresApprovals?: readonly string[];
}

export function simulateConversion(request: ConversionRequest): ConversionResult {
  if (parseFloat(request.amount) <= 0) {
    return {
      ok: false,
      status: "failed",
      message: "Conversion amount must be greater than 0",
      blockedReason: "invalid-amount",
    };
  }

  // Check if both currencies are available on requested chains
  const fromAvailable = getChainsByAsset(request.fromCurrency).some((c) => c.chainId === request.sourceChain);
  const toAvailable = getChainsByAsset(request.toCurrency).some((c) => c.chainId === request.destinationChain);

  if (!fromAvailable || !toAvailable) {
    return {
      ok: false,
      status: "failed",
      message: `Currency pair ${request.fromCurrency}/${request.toCurrency} not available on requested chains`,
      blockedReason: "currency-pair-unavailable",
    };
  }

  // Simulate conversion rates (in production, get from pricing service)
  const estimatedRate = "0.98";
  const estimatedAmount = (parseFloat(request.amount) * parseFloat(estimatedRate)).toFixed(2);
  const estimatedFeeAmount = (parseFloat(request.amount) * 0.001).toFixed(2);

  return {
    ok: true,
    status: "simulation-only",
    message: `Simulating conversion: ${request.amount} ${request.fromCurrency} → ${estimatedAmount} ${request.toCurrency}`,
    estimatedRate,
    estimatedReceiveAmount: estimatedAmount,
    estimatedFee: estimatedFeeAmount,
    requiresApprovals: [
      "Provider liquidity approval",
      "Compliance stablecoin routing approval",
      "Treasury fund availability",
    ],
  };
}

export function getAvailableConversionPairs(walletId: string): readonly string[] {
  return [
    "TROP USD → USDF",
    "USDF → USDC",
    "USDC → TROP USD",
    "TROP USD → UNY",
    "UNY → TROP USD",
  ];
}
