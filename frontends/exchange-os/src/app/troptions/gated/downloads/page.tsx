import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/current-user';
import { PDF_DOCUMENT_REGISTRY, type PdfDocumentRecord } from '@/lib/troptions/pdfDocumentRegistry';

export const metadata = {
  title: 'TROPTIONS Gated Materials — Institutional PDFs',
  description: 'Restricted access to institutional playbooks, governance frameworks, and professional diligence packages.',
};

const SECTIONS: {
  heading: string;
  description: string;
  filter: (d: PdfDocumentRecord) => boolean;
  accentColor: string;
}[] = [
  {
    heading: 'Private Placement & Governance',
    description: 'Owner-level strategy briefs, sales execution guides, minting frameworks, and leverage controls.',
    accentColor: '#f0cf82',
    filter: (d) => d.id?.includes('private-placement') || d.id?.includes('minting-leverage'),
  },
  {
    heading: 'Vault & Treasury Controls',
    description: 'Locked treasury attestation frameworks, proof-of-funds packages, and verification procedures.',
    accentColor: '#8b5cf6',
    filter: (d) => d.id?.includes('vault-attestation') || d.id?.includes('proof-of-funds'),
  },
  {
    heading: 'Core Platform & Onboarding',
    description: 'Platform overview and KYC/onboarding procedures required for transaction participation.',
    accentColor: '#0ea5e9',
    filter: (d) => d.category === 'Core Platform' || d.category === 'Onboarding / KYC',
  },
  {
    heading: 'Asset Owner Packets',
    description: 'RWA, carbon credit, and natural resource asset submission packages.',
    accentColor: '#8b5cf6',
    filter: (d) => d.category === 'RWA / Asset Packages' || d.category === 'PATE-COAL-001',
  },
  {
    heading: 'Funding Routes & Playbooks',
    description: 'Funding guides, acquisition playbooks, and deal execution procedures.',
    accentColor: '#0ea5e9',
    filter: (d) => d.category === 'Funding Routes',
  },
  {
    heading: 'Technical & Web3',
    description: 'XRPL integration, wallet procedures, and Rust runtime controls.',
    accentColor: '#14b8a6',
    filter: (d) => d.category === 'XRPL / IOU / Wallets',
  },
  {
    heading: 'Legacy, Buyback & Liquidity',
    description: 'Legacy token migration, buyback reviews, and liquidity pool procedures.',
    accentColor: '#64748b',
    filter: (d) => d.category === 'Legacy / Buyback / LP Review',
  },
];

const PRIORITY_DOC_IDS = [
  'bryan-stone-kyc-cis-master-file',
  'usdt-proof-of-funds-verification-and-validation',
  'counterparty-verification-sheet',
  'trader-account-validation-and-lock-control-framework',
  'capital-leverage-structuring-framework-50m',
  'xrpl-tx-cd7271274743c20635ed58515f84b399a4113fe40e62cfc8248446a494d1e642-xrpscan',
  'xrpl-tx-b14c09d240af67279eec84e0cb521766df9bcfb909e1481486e62b928a528093-xrpscan',
] as const;

export default async function GatedDownloadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/troptions/auth/login');
  }

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem' }}>
        {/* Breadcrumb + Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <Link href='/troptions' style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'none' }}>
            ← TROPTIONS Home
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            Logged in as <strong>{user.email}</strong>{' '}
            <form
              action='/api/auth/logout'
              method='POST'
              style={{ display: 'inline', marginLeft: '1rem' }}
            >
              <button
                type='submit'
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f0cf82',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.8rem',
                }}
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#f0cf82', margin: '0 0 0.4rem' }}>
            Restricted Access
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.9rem, 4vw, 2.9rem)',
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0 0 0.75rem',
            }}
          >
            Institutional Materials
          </h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.65, maxWidth: 720, margin: '0 0 1.25rem', fontSize: '0.92rem' }}>
            {PDF_DOCUMENT_REGISTRY.length} professional institutional PDFs for qualified counterparties, lenders, and governance teams. All materials are confidential and for authorized use only.
          </p>

          {/* Safety banner */}
          <div
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.28)',
              borderRadius: '0.65rem',
              padding: '0.85rem 1.1rem',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: '#f87171' }}>CONFIDENTIAL:</strong> These materials are restricted to authorized
              recipients. They are for informational and due-diligence purposes only. No live execution, custody,
              exchange, or direct issuance is enabled. All governance and compliance approvals required before action.
            </p>
          </div>

          <div
            style={{
              marginTop: '1rem',
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              borderRadius: '0.65rem',
              padding: '0.95rem 1.1rem',
            }}
          >
            <p style={{ fontSize: '0.78rem', color: '#bae6fd', margin: '0 0 0.6rem', fontWeight: 600 }}>
              Priority Access: CIS + PoF Verification Pack
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem' }}>
              {PRIORITY_DOC_IDS.map((id) => {
                const doc = PDF_DOCUMENT_REGISTRY.find((item) => item.id === id);
                if (!doc) return null;
                return (
                  <a
                    key={doc.id}
                    href={doc.pdfPath}
                    target='_blank'
                    rel='noreferrer'
                    style={{
                      background: 'rgba(15, 23, 42, 0.55)',
                      border: '1px solid rgba(14, 165, 233, 0.35)',
                      borderRadius: '0.55rem',
                      padding: '0.6rem 0.75rem',
                      textDecoration: 'none',
                    }}
                  >
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.76rem', fontWeight: 600 }}>{doc.title}</p>
                    <p style={{ margin: '0.2rem 0 0', color: '#7dd3fc', fontSize: '0.7rem' }}>Open PDF</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Document Sections */}
        {SECTIONS.map((section, idx) => {
          const docs = PDF_DOCUMENT_REGISTRY.filter(section.filter);
          if (docs.length === 0) return null;

          return (
            <div key={idx} style={{ marginBottom: '2.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: section.accentColor,
                    margin: '0 0 0.35rem',
                  }}
                >
                  {section.heading}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  {section.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {docs.map((doc) => (
                  <a
                    key={doc.pdfPath}
                    href={doc.pdfPath}
                    download
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      border: `1px solid ${section.accentColor}22`,
                      borderRadius: '0.65rem',
                      padding: '1.1rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: 0, flex: 1 }}>
                        {doc.title}
                      </h3>
                      <span style={{ fontSize: '1.25rem', marginLeft: '0.5rem' }}>📄</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                      {doc.subtitle}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0.5rem 0 0' }}>
                      v{doc.version?.split('·')[0].trim()} • Download
                    </p>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginTop: '3rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.7 }}>
            All materials are confidential and proprietary to TROPTIONS. Unauthorized reproduction or distribution is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
