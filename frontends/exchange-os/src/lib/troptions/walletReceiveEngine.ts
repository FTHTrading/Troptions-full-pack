export interface ReceiveRequest {
  walletId: string;
  currency: string;
  chain: string;
  amount?: string;
  note?: string;
}

export interface ReceiveResult {
  ok: boolean;
  status: "ready" | "pending" | "simulation";
  receiveAddress?: string;
  qrPayload?: string;
  message: string;
  expiresAt?: string;
  disclaimer: string;
}

export function generateReceiveRequest(request: ReceiveRequest): ReceiveResult {
  // Generate a placeholder receive address (in production, request from provider)
  const receiveAddress = `troptions_${request.walletId}_${request.chain}`;

  return {
    ok: true,
    status: "ready",
    receiveAddress,
    qrPayload: `troptions://receive/${request.walletId}?currency=${request.currency}&chain=${request.chain}`,
    message: `Receive address generated for ${request.currency} on ${request.chain}. In production, this would be a real provider address.`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    disclaimer:
      "Receive address is simulation-only. Live deposits require provider activation, AML screening, and source verification.",
  };
}

export function getReceiveInstructions(walletId: string, currency: string): string {
  return `To receive ${currency}:
1. Share your receive address with the sender
2. Funds will appear in your wallet after provider confirmation
3. Deposits require AML verification and may take 1-3 business days`;
}

export function canReceive(walletStatus: string, kycStatus: string): boolean {
  return walletStatus === "activated" && kycStatus === "verified";
}
