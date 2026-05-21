// TROPTIONS Exchange OS — x402 Payment Verification

import { x402Config } from "@/config/exchange-os/x402";
import { getServiceById } from "./services";
import type { X402PaymentVerification, X402VerifyResult } from "./types";

/** Verify an x402 payment and unlock the service payload */
export async function verifyX402Payment(
  verification: X402PaymentVerification
): Promise<X402VerifyResult> {
  const service = getServiceById(verification.serviceId);

  if (!service) {
    return {
      verified: false,
      serviceId: verification.serviceId,
      demoMode: x402Config.demoMode,
      error: "Unknown service ID.",
    };
  }

  // Demo mode — always return demo verified state
  if (x402Config.demoMode) {
    return {
      verified: true,
      serviceId: verification.serviceId,
      demoMode: true,
      unlockedPayload: {
        message: "Demo mode: payment verified without real payment.",
        serviceId: verification.serviceId,
        serviceName: service.name,
        demo: true,
      },
    };
  }

  if (!x402Config.facilitatorUrl) {
    return {
      verified: false,
      serviceId: verification.serviceId,
      demoMode: false,
      error: "x402 facilitator URL is not configured.",
    };
  }

  // Forward verification to x402 facilitator
  try {
    const res = await fetch(`${x402Config.facilitatorUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: verification.serviceId,
        nonce: verification.nonce,
        txHash: verification.txHash,
        paymentHeader: verification.paymentHeader,
      }),
    });

    if (!res.ok) {
      return {
        verified: false,
        serviceId: verification.serviceId,
        demoMode: false,
        error: `Facilitator returned HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as { verified?: boolean; payload?: Record<string, unknown>; error?: string };

    return {
      verified: data.verified === true,
      serviceId: verification.serviceId,
      demoMode: false,
      unlockedPayload: data.payload,
      error: data.error,
    };
  } catch (err) {
    return {
      verified: false,
      serviceId: verification.serviceId,
      demoMode: false,
      error: err instanceof Error ? err.message : "Payment verification failed.",
    };
  }
}
