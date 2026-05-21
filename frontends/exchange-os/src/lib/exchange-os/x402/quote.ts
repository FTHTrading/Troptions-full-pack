// TROPTIONS Exchange OS — x402 Payment Quote Generator

import { x402Config } from "@/config/exchange-os/x402";
import { getServiceById } from "./services";
import type { X402PaymentQuote, X402DemoState } from "./types";
import { randomUUID } from "crypto";

/** Generate a payment quote for an x402-gated service */
export function generateX402Quote(
  serviceId: string
): X402PaymentQuote | X402DemoState {
  const service = getServiceById(serviceId);

  if (!service) {
    throw new Error(`Unknown x402 service: ${serviceId}`);
  }

  if (!x402Config.enabled || x402Config.demoMode) {
    const demo: X402DemoState = {
      demoMode: true,
      paymentRequired: true,
      message:
        "x402 production payments are not configured. " +
        "Set X402_ENABLED=true, X402_FACILITATOR_URL, and X402_RECEIVING_ADDRESS.",
      serviceId,
      priceCents: service.priceCents,
      priceDisplay: service.priceDisplay,
    };
    return demo;
  }

  if (!x402Config.receivingAddress) {
    throw new Error(
      "X402_RECEIVING_ADDRESS env var is required when x402 is enabled."
    );
  }

  const quote: X402PaymentQuote = {
    serviceId,
    priceCents: service.priceCents,
    priceDisplay: service.priceDisplay,
    network: service.network,
    asset: service.asset,
    receivingAddress: x402Config.receivingAddress,
    nonce: randomUUID(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1_000).toISOString(), // 5 min
    paymentRequired: true,
    demoMode: false,
  };

  return quote;
}
