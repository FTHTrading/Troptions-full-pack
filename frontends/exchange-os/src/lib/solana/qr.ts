// QR code helpers — uses qrcode package (already installed)
import QRCode from 'qrcode';
import { sanitizeNamespace } from './campaignTypes';

const BASE_URL = process.env.NEXT_PUBLIC_CAMPAIGN_BASE_URL ?? 'https://launch.unykorn.org';

export function buildCampaignQrUrl(namespaceSlug: string): string {
  const ns = sanitizeNamespace(namespaceSlug);
  return `${BASE_URL}/c/${ns}`;
}

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: { dark: '#ffffff', light: '#00000000' },
    errorCorrectionLevel: 'M',
  });
}

// Client-safe: calls /api/solana/campaign/qr endpoint
export async function requestQrForNamespace(ns: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/solana/campaign/qr?ns=${encodeURIComponent(ns)}`);
    if (!res.ok) return null;
    const { dataUrl } = await res.json();
    return dataUrl as string;
  } catch {
    return null;
  }
}
