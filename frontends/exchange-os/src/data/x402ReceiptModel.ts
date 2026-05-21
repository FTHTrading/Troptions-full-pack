// x402 receipt model — all receipts are verified server-side
// No real payment execution happens client-side

export type X402ReceiptStatus =
  | 'x402_demo'       // demo/stub receipt — not a real payment
  | 'pending'         // submitted, awaiting confirmation
  | 'confirmed'       // on-chain confirmed
  | 'expired'         // receipt TTL exceeded
  | 'invalid';        // failed verification

export interface X402Receipt {
  receiptId: string;
  productId: string;
  productSlug: string;
  status: X402ReceiptStatus;
  isDemoReceipt: boolean;
  network: 'solana' | 'xrpl' | 'polygon' | 'none';
  currency: 'USDC' | 'SOL' | 'free';
  amountUsd: number;
  /** Public wallet address only — never a private key */
  payerPublicAddress?: string;
  /** Public transaction signature/hash only */
  txSignature?: string;
  issuedAt: string;  // ISO timestamp
  expiresAt: string; // ISO timestamp
  disclaimer: string;
  verificationNote: string;
}

export const X402_DEMO_DISCLAIMER =
  'DEMO RECEIPT — This is a stub receipt for demonstration purposes only. No real payment was processed. No goods or services are delivered via this demo receipt. TROPTIONS provides intelligence infrastructure only.';

export const X402_RECEIPT_VERIFICATION_NOTE =
  'Receipt verification is performed server-side. Client-side receipt objects do not grant access without server confirmation.';

export function buildDemoReceipt(
  productId: string,
  productSlug: string,
  amountUsd: number,
  network: X402Receipt['network'],
  currency: X402Receipt['currency'],
): X402Receipt {
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h
  return {
    receiptId: `demo_${productId}_${Date.now()}`,
    productId,
    productSlug,
    status: 'x402_demo',
    isDemoReceipt: true,
    network,
    currency,
    amountUsd,
    payerPublicAddress: undefined,
    txSignature: undefined,
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    disclaimer: X402_DEMO_DISCLAIMER,
    verificationNote: X402_RECEIPT_VERIFICATION_NOTE,
  };
}

export function isReceiptValid(receipt: X402Receipt): boolean {
  if (receipt.isDemoReceipt) return false;
  if (receipt.status !== 'confirmed') return false;
  if (new Date(receipt.expiresAt) < new Date()) return false;
  return true;
}
