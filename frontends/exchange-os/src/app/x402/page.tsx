import Link from 'next/link';
import { X402_PRODUCTS, X402_DISCLAIMER } from '@/data/x402Products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'x402 Payment-Gated Intelligence | TROPTIONS / UNYKORN',
  description:
    'x402-gated intelligence reports for token issuers, partners, and institutions. Not investment advice. Infrastructure only.',
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  public: { label: 'FREE', color: '#22c55e' },
  x402_gated: { label: 'x402 GATED', color: '#c4a84a' },
  coming_soon: { label: 'COMING SOON', color: '#6b7280' },
  disabled: { label: 'DISABLED', color: '#4b5563' },
};

export default function X402Page() {
  const freeProducts = X402_PRODUCTS.filter((p) => !p.requiresPayment);
  const gatedProducts = X402_PRODUCTS.filter((p) => p.requiresPayment);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      {/* Header */}
      <p style={{ fontSize: '0.75rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Payment-Gated Intelligence
      </p>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.75rem' }}>
        x402 Commerce Layer
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '1.5rem', maxWidth: 680, lineHeight: 1.7 }}>
        TROPTIONS uses the <strong style={{ color: '#e8e0d0' }}>x402 protocol</strong> to gate access to intelligence reports.
        Approved reports are unlocked by verified on-chain payment receipt. No payment happens in your browser — receipts
        are verified server-side only.
      </p>

      {/* Disclaimer */}
      <div style={{ background: '#0d1a0d', border: '1px solid #1a3a1a', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: '#9ca3af' }}>Infrastructure Disclaimer:</strong> {X402_DISCLAIMER}
        </p>
      </div>

      {/* IS / IS NOT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8rem', color: '#22c55e', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            THIS IS
          </h3>
          <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem' }}>
            <li>Intelligence infrastructure</li>
            <li>Ecosystem readiness analysis</li>
            <li>Partner onboarding data</li>
            <li>Token proof packet requirements</li>
            <li>DEX readiness reports</li>
            <li>Payment-gated access control</li>
          </ul>
        </div>
        <div style={{ background: '#1a0d0d', border: '1px solid #3a1e1e', borderRadius: 8, padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8rem', color: '#ef4444', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            THIS IS NOT
          </h3>
          <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem' }}>
            <li>Investment advice</li>
            <li>A brokerage or exchange</li>
            <li>Legal counsel</li>
            <li>Custody of funds or tokens</li>
            <li>Market making</li>
            <li>Guaranteed financial outcomes</li>
          </ul>
        </div>
      </div>

      {/* Status */}
      <div style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Catalog</div>
          <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.85rem' }}>Ready</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Live Payments</div>
          <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>Gated</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Receipt Verification</div>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Demo Mode</div>
        </div>
      </div>

      {/* Free products */}
      {freeProducts.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', color: '#e8e0d0', marginBottom: '1rem' }}>Free Intelligence</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {freeProducts.map((p) => {
              const badge = STATUS_BADGE[p.status];
              return (
                <div key={p.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ color: '#e8e0d0', fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{p.title}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.description}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.4rem' }}>Audience: {p.audience}</p>
                    </div>
                    <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: 4, background: '#1e3058', color: badge.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Gated products preview */}
      <h2 style={{ fontSize: '1.1rem', color: '#e8e0d0', marginBottom: '0.5rem' }}>x402-Gated Intelligence Reports</h2>
      <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        {gatedProducts.length} reports available · Full catalog with pricing →
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {gatedProducts.slice(0, 3).map((p) => {
          const badge = STATUS_BADGE[p.status];
          return (
            <div key={p.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ color: '#e8e0d0', fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.description}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.4rem' }}>Proof required: {p.proofRequired}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: 4, background: '#1e3058', color: badge.color, display: 'block', marginBottom: '0.4rem' }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#c4a84a', fontWeight: 700 }}>${p.priceUsd} {p.currency}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/x402/catalog" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: '#c4a84a', color: '#000', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
          View Full Catalog
        </Link>
        <Link href="/exchange-os/status" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid #1e3058', color: '#9ca3af', borderRadius: 6, fontSize: '0.85rem', textDecoration: 'none' }}>
          Ecosystem Status
        </Link>
      </div>
    </div>
  );
}
