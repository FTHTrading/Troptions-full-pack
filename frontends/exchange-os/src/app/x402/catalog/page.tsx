import Link from 'next/link';
import { X402_PRODUCTS, X402_DISCLAIMER } from '@/data/x402Products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'x402 Catalog — Intelligence Reports | TROPTIONS',
  description:
    'Full catalog of x402 payment-gated intelligence reports for token issuers, partners, and institutions.',
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  public:      { label: 'FREE',        color: '#22c55e', bg: '#0d1a0d' },
  x402_gated:  { label: 'x402 GATED', color: '#c4a84a', bg: '#1a1500' },
  coming_soon: { label: 'SOON',        color: '#6b7280', bg: '#111' },
  disabled:    { label: 'DISABLED',    color: '#4b5563', bg: '#111' },
};

const NETWORK_LABEL: Record<string, string> = {
  solana: 'Solana',
  xrpl: 'XRPL',
  polygon: 'Polygon',
  any: 'Any',
  none: '—',
};

export default function X402CatalogPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      <p style={{ fontSize: '0.75rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        x402 Intelligence
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.75rem' }}>
        Intelligence Report Catalog
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '1rem', maxWidth: 680, lineHeight: 1.7 }}>
        All TROPTIONS intelligence reports are listed below. Gated reports require a verified x402 payment receipt.
        No investment decisions should be based on these reports — they document infrastructure readiness only.
      </p>
      <div style={{ background: '#0d1a0d', border: '1px solid #1a3a1a', borderRadius: 8, padding: '0.85rem 1.1rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#9ca3af' }}>Disclaimer:</strong> {X402_DISCLAIMER}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
        {X402_PRODUCTS.map((p) => {
          const badge = STATUS_BADGE[p.status];
          return (
            <div
              key={p.id}
              style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 10, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <h2 style={{ color: '#e8e0d0', fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 }}>{p.title}</h2>
                <span style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', borderRadius: 4, background: badge.bg, color: badge.color, whiteSpace: 'nowrap', border: `1px solid ${badge.color}33`, flexShrink: 0 }}>
                  {badge.label}
                </span>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{p.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Audience: </span>
                  <span style={{ color: '#9ca3af' }}>{p.audience}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Network: </span>
                  <span style={{ color: '#9ca3af' }}>{NETWORK_LABEL[p.network] ?? p.network}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Price: </span>
                  <span style={{ color: '#c4a84a', fontWeight: 700 }}>
                    {p.priceUsd === 0 ? 'Free' : `$${p.priceUsd} ${p.currency}`}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Proof: </span>
                  <span style={{ color: '#9ca3af' }}>{p.proofRequired}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#4b5563', borderTop: '1px solid #1e3058', paddingTop: '0.75rem', lineHeight: 1.5 }}>
                {p.noInvestmentAdviceDisclaimer}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/x402" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← x402 Overview
        </Link>
        <Link href="/exchange-os" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          Exchange OS
        </Link>
      </div>
    </div>
  );
}
