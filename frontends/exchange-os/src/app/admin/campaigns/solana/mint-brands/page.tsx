'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LOCKED_BRAND_NAMESPACES } from '@/data/locked-namespaces';

const MAINNET_ENABLED = process.env.NEXT_PUBLIC_SOLANA_MAINNET_ENABLED === 'true';

type MintState = 'idle' | 'minting' | 'minted' | 'error';

interface BrandMintStatus {
  namespace: string;
  state: MintState;
  txHash?: string;
  error?: string;
}

export default function MintBrandsAdminPage() {
  const [mintStatuses, setMintStatuses] = useState<Record<string, BrandMintStatus>>({});

  function getStatus(ns: string): BrandMintStatus {
    return mintStatuses[ns] ?? { namespace: ns, state: 'idle' };
  }

  async function mintBrandNamespace(namespace: string, brand: string) {
    setMintStatuses((prev) => ({ ...prev, [namespace]: { namespace, state: 'minting' } }));
    try {
      const res = await fetch('/api/solana/campaign/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namespace,
          campaignName: `${brand} Brand Namespace`,
          campaignType: 'merchant_namespace',
          network: 'mainnet-beta',
          lockedBrand: true,
        }),
      });
      const data = await res.json() as { ok?: boolean; txHash?: string; error?: string };
      if (res.ok) {
        setMintStatuses((prev) => ({
          ...prev,
          [namespace]: { namespace, state: 'minted', txHash: data.txHash },
        }));
      } else {
        setMintStatuses((prev) => ({
          ...prev,
          [namespace]: { namespace, state: 'error', error: data.error ?? 'Mint failed' },
        }));
      }
    } catch (err) {
      setMintStatuses((prev) => ({
        ...prev,
        [namespace]: { namespace, state: 'error', error: String(err) },
      }));
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/admin/campaigns/solana" className="text-xs text-white/40 hover:text-white transition-colors">← Solana Admin</Link>
        <span className="text-xs font-mono text-white/30">Brand Namespace Mint</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[9px] font-mono border border-white/10 text-white/30 rounded px-2 py-0.5">ADMIN ONLY</span>
            <span className={`text-[9px] font-mono border rounded px-2 py-0.5 ${MAINNET_ENABLED ? 'border-green-500/30 text-green-400/60' : 'border-red-500/30 text-red-400/60'}`}>
              {MAINNET_ENABLED ? 'MAINNET ACTIVE' : 'MAINNET REQUIRED — SET NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true'}
            </span>
            <span className="text-[9px] font-mono border border-cyan-900/30 text-cyan-400/40 rounded px-2 py-0.5">PERMANENT ON-CHAIN RECORDS</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Brand Namespace Minting</h1>
          <p className="text-sm text-white/40 max-w-xl">
            Mint core brand namespaces as permanent on-chain Solana records. These are the first mints on mainnet launch.
            Each namespace becomes a locked, immutable record tied to the trust wallet.
          </p>
        </div>

        {!MAINNET_ENABLED && (
          <div className="border border-red-500/20 bg-red-500/5 rounded-xl px-5 py-4 mb-8 text-sm text-red-400/70">
            <strong className="font-mono text-red-400/90">MAINNET REQUIRED</strong> — Brand namespace minting must run on mainnet-beta.
            Set <code className="bg-white/5 rounded px-1">NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true</code> in your environment to enable.
          </div>
        )}

        {/* Brand namespace table */}
        <div className="border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left text-[10px] font-mono text-white/30 px-4 py-3">NAMESPACE</th>
                <th className="text-left text-[10px] font-mono text-white/30 px-4 py-3">BRAND</th>
                <th className="text-left text-[10px] font-mono text-white/30 px-4 py-3 hidden md:table-cell">DESCRIPTION</th>
                <th className="text-right text-[10px] font-mono text-white/30 px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {LOCKED_BRAND_NAMESPACES.map((b) => {
                const status = getStatus(b.namespace);
                return (
                  <tr key={b.namespace} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-cyan-400/70">{b.namespace}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white/80">{b.brand}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-white/30">{b.description}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {status.state === 'minted' ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono text-green-400/70 border border-green-500/20 rounded px-2 py-0.5">MINTED</span>
                          {status.txHash && (
                            <a
                              href={`https://explorer.solana.com/tx/${status.txHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] font-mono text-white/20 hover:text-white/40 underline"
                            >
                              {status.txHash.slice(0, 8)}…
                            </a>
                          )}
                        </div>
                      ) : status.state === 'error' ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono text-red-400/70">ERROR</span>
                          <span className="text-[9px] text-red-400/40">{status.error}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => mintBrandNamespace(b.namespace, b.brand)}
                          disabled={!MAINNET_ENABLED || status.state === 'minting'}
                          className="text-xs font-mono border border-white/10 text-white/40 hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed rounded px-3 py-1.5 transition-colors"
                        >
                          {status.state === 'minting' ? 'Minting…' : 'Mint Brand Namespace'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-[10px] text-white/20 font-mono leading-relaxed max-w-2xl">
          Brand namespace minting creates immutable on-chain records tied to the TROPTIONS trust wallet.
          Minting is one-time and permanent. Ensure TRUST_WALLET_SECRET_KEY is configured and the trust wallet
          has sufficient SOL for transaction fees (~0.002 SOL per mint). Recommended: use a Squads Protocol
          multi-sig wallet for core brand namespaces.
        </div>
      </div>
    </div>
  );
}
