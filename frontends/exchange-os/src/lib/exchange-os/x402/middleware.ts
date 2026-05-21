// TROPTIONS Exchange OS — x402 Middleware
// Use with Next.js API routes to gate endpoints behind x402 payment.

import type { NextRequest } from "next/server";
import { x402Config } from "@/config/exchange-os/x402";
import { getServiceById } from "./services";
import { verifyX402Payment } from "./verify";
import type { X402VerifyResult } from "./types";

export interface X402MiddlewareResult {
  allowed: boolean;
  demoMode: boolean;
  verifyResult?: X402VerifyResult;
  /** Set these headers on the 402 response */
  paymentRequiredHeaders?: Record<string, string>;
}

/**
 * Check if an incoming API request has a valid x402 payment.
 * If not, returns allowed=false with 402 headers.
 * In demo mode, always returns allowed=true with demoMode=true.
 */
export async function checkX402Payment(
  req: Request | import("next/server").NextRequest,
  serviceId: string
): Promise<X402MiddlewareResult> {
  const service = getServiceById(serviceId);
  if (!service) {
    return { allowed: false, demoMode: x402Config.demoMode };
  }

  // Demo mode — always allow
  if (x402Config.demoMode) {
    return {
      allowed: true,
      demoMode: true,
      verifyResult: {
        verified: true,
        serviceId,
        demoMode: true,
        unlockedPayload: { demo: true },
      },
    };
  }

  // Check for X-PAYMENT header (x402 protocol)
  const paymentHeader = req.headers.get("X-PAYMENT") ?? undefined;
  const nonce = req.headers.get("X-PAYMENT-NONCE") ?? "";
  const txHash = req.headers.get("X-PAYMENT-TX") ?? undefined;

  if (!paymentHeader && !txHash) {
    // No payment provided — return 402 info
    return {
      allowed: false,
      demoMode: false,
      paymentRequiredHeaders: {
        "X-Price-Cents": String(service.priceCents),
        "X-Price-Display": service.priceDisplay,
        "X-Payment-Asset": service.asset,
        "X-Payment-Network": service.network,
        "X-Receiving-Address": x402Config.receivingAddress,
        "X-Service-ID": serviceId,
      },
    };
  }

  const result = await verifyX402Payment({
    serviceId,
    nonce,
    paymentHeader,
    txHash,
  });

  return {
    allowed: result.verified,
    demoMode: false,
    verifyResult: result,
  };
}
