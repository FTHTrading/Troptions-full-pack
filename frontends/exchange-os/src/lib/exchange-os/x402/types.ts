// TROPTIONS Exchange OS — x402 Shared Types

export interface X402Service {
  id: string;
  name: string;
  description: string;
  /** Price in USD cents */
  priceCents: number;
  /** Display price string */
  priceDisplay: string;
  network: string;
  asset: string;
  category: "report" | "ai" | "api" | "analytics" | "agent";
  available: boolean;
  demoAvailable: boolean;
  /** Estimated response time */
  estimatedMs?: number;
}

export interface X402PaymentQuote {
  serviceId: string;
  priceCents: number;
  priceDisplay: string;
  network: string;
  asset: string;
  receivingAddress: string;
  /** One-time payment nonce */
  nonce: string;
  /** ISO timestamp when quote expires */
  expiresAt: string;
  paymentRequired: true;
  demoMode: boolean;
}

export interface X402PaymentVerification {
  serviceId: string;
  nonce: string;
  /** Transaction hash or proof */
  txHash?: string;
  /** Raw payment header (from x402 HTTP header) */
  paymentHeader?: string;
}

export interface X402VerifyResult {
  verified: boolean;
  serviceId: string;
  demoMode: boolean;
  /** Unlocked payload — only present when verified */
  unlockedPayload?: Record<string, unknown>;
  error?: string;
}

/** Demo payment state returned when x402 is not configured */
export interface X402DemoState {
  demoMode: true;
  paymentRequired: true;
  message: string;
  serviceId: string;
  priceCents: number;
  priceDisplay: string;
}

export function isDemoState(v: unknown): v is X402DemoState {
  return typeof v === "object" && v !== null && (v as X402DemoState).demoMode === true;
}
