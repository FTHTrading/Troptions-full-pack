export interface WalletQrCode {
  readonly qrCodeId: string;
  readonly walletId: string;
  readonly userId: string;
  readonly handle: string;
  readonly qrPayloadUri: string;
  readonly qrPayloadText: string;
  readonly displayFormat: "wallet-profile" | "payment-request" | "contact-card";
  readonly issuedAt: string;
  readonly expiresAt?: string;
  readonly scansCount: number;
  readonly lastScannedAt?: string;
  readonly status: "active" | "expired" | "revoked";
  readonly disclaimer: string;
}

export const WALLET_QR_REGISTRY: readonly WalletQrCode[] = [
  {
    qrCodeId: "qr_kevan_001",
    walletId: "wallet_kevan_main",
    userId: "user_kevan_burns",
    handle: "kevan.troptions",
    qrPayloadUri: "troptions://wallet/kevan.troptions",
    qrPayloadText:
      'troptions://wallet/kevan.troptions\nProfile: TROPTIONS Chairman\nRole: Chairman\nNetwork: Troptions Genesis',
    displayFormat: "wallet-profile",
    issuedAt: "2026-04-25T12:00:00Z",
    expiresAt: undefined,
    scansCount: 0,
    status: "active",
    disclaimer:
      "QR code identifies wallet profile only. Does not contain private keys, seed phrases, passwords, spend authority, or authentication credentials.",
  },
];

export const WALLET_QR_STATEMENT =
  "Your Troptions Genesis Wallet profile is created in simulation mode. QR codes identify wallet profiles only and do not contain private keys, seed phrases, passwords, or spend authority.";

export function getQrCodeByQrId(qrCodeId: string): WalletQrCode | undefined {
  return WALLET_QR_REGISTRY.find((qr) => qr.qrCodeId === qrCodeId);
}

export function getQrCodeByWalletId(walletId: string): WalletQrCode | undefined {
  return WALLET_QR_REGISTRY.find((qr) => qr.walletId === walletId);
}

export function getQrCodeByHandle(handle: string): WalletQrCode | undefined {
  return WALLET_QR_REGISTRY.find((qr) => qr.handle === handle);
}

export function isQrCodeValid(qr: WalletQrCode): boolean {
  if (qr.status !== "active") return false;
  if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) return false;
  return true;
}

export function recordQrCodeScan(qrCodeId: string): void {
  // In production, update scan count and timestamp
  console.log(`QR code ${qrCodeId} scanned at ${new Date().toISOString()}`);
}
