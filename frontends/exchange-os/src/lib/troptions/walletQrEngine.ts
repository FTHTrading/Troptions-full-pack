import { getQrCodeByWalletId } from "@/content/troptions/walletQrRegistry";

export interface QrCodeData {
  qrCodeId: string;
  walletId: string;
  handle: string;
  payloadUri: string;
  payloadText: string;
  isValid: boolean;
  disclaimer: string;
}

export function generateWalletQrData(walletId: string, handle: string): QrCodeData {
  const qr = getQrCodeByWalletId(walletId);

  const payloadUri = `troptions://wallet/${handle}`;
  const payloadText = `troptions://wallet/${handle}\nProfile: ${handle}\nNetwork: Troptions Genesis`;

  return {
    qrCodeId: qr?.qrCodeId || `qr_${handle}_new`,
    walletId,
    handle,
    payloadUri,
    payloadText,
    isValid: qr ? !qr.expiresAt || new Date(qr.expiresAt) > new Date() : true,
    disclaimer:
      "QR code identifies wallet profile only. Does not contain private keys, seed phrases, passwords, or spend authority.",
  };
}

export function getQrDisplayImage(walletId: string): string {
  const qr = getQrCodeByWalletId(walletId);
  if (!qr) {
    return "";
  }

  // Generate simple CSS-based placeholder QR representation
  // In production, use qrcode library like 'qrcode.react'
  return qr.qrPayloadUri;
}

export function recordQrScan(qrCodeId: string): {
  success: boolean;
  message: string;
} {
  // In production, update scan count and timestamp in database
  return {
    success: true,
    message: `QR code ${qrCodeId} scan recorded at ${new Date().toISOString()}`,
  };
}

export function generateQrPayloadUrl(handle: string): string {
  return `https://troptions.unykorn.org/join-troptions/invite?handle=${encodeURIComponent(handle)}`;
}
