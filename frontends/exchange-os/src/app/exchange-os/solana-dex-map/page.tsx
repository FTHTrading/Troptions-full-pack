import React from "react";
import { SOLANA_DEX_REGISTRY, SOLANA_LAUNCHPAD_COMPETITORS, SOLANA_OPEN_SOURCE_STACK } from "@/data/solanaDexRegistry";

export default function SolanaDexMapPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Solana DEX & Launch Venue Map</h1>
        <h2 className="text-xl text-gray-300 mb-2">Route intelligence, liquidity proof, token launch readiness, and non-custodial market infrastructure for Solana-based ecosystems.</h2>
        <div className="bg-gray-900 border-l-4 border-gold-400 p-4 mb-4">
          <span className="font-semibold text-gold-400">Truth label:</span> TROPTIONS monitors and prepares launch-control infrastructure. TROPTIONS does not operate an exchange, custody assets, guarantee liquidity, promote tokens, or make investment claims.
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-2">Solana Liquidity Map</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOLANA_DEX_REGISTRY.map(dex => (
            <li key={dex.id} className="bg-gray-800 rounded p-3 border-l-4 border-cyan-400">
              <div className="font-bold text-cyan-200">{dex.name}</div>
              <div className="text-gray-300">{dex.category} | Priority: {dex.integrationPriority}</div>
              <div className="text-xs text-gray-400">{dex.notes}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gold-400 mb-2">Integration Priority</h3>
        <div className="bg-gray-800 rounded p-4 border-l-4 border-gold-400">
          <div className="mb-2 font-semibold">Phase 1:</div>
          Jupiter route quotes, Meteora liquidity/launch readiness, Raydium pool monitoring, Orca Whirlpool pool monitoring, Token-2022/Metaplex metadata checks
          <div className="mt-2 font-semibold">Phase 2:</div>
          OpenBook orderbook-depth monitoring, Phoenix monitoring, Pyth oracle integration, advanced dashboards
          <div className="mt-2 font-semibold">Phase 3:</div>
          Drift, Lifinity, Saros pool tracking, deeper analytics/indexing
          <div className="mt-2 font-semibold">Monitor only:</div>
          Pump.fun, Bonk.fun, Moonshot, Bags.fm, LaunchLab, meme-token launchpad clones
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-2">Solana Proof Packet Requirements</h3>
        <ul className="list-disc pl-6 text-gray-300">
          <li>Mint address</li>
          <li>Token standard: SPL Token or Token-2022</li>
          <li>Metadata account</li>
          <li>Mint authority</li>
          <li>Freeze authority</li>
          <li>Update authority</li>
          <li>Transfer hook status if Token-2022</li>
          <li>Transfer fee status if Token-2022</li>
          <li>Permanent delegate status if Token-2022</li>
          <li>Top holders</li>
          <li>Creator/team wallets</li>
          <li>LP wallet</li>
          <li>Pool address</li>
          <li>Liquidity venue</li>
          <li>LP lock or vesting proof</li>
          <li>Legal memo</li>
          <li>KYC/AML status</li>
          <li>Marketing review</li>
          <li>Launch committee status</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gold-400 mb-2">Route Intelligence Model</h3>
        <div className="bg-gray-800 rounded p-4 border-l-4 border-cyan-400">
          Wallet connects → quote request → compare Jupiter/Meteora/Raydium/Orca/OpenBook where available → prepare unsigned transaction → user signs in wallet → transaction submitted to chain → proof recorded → monitoring starts.
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-2">Competitor Matrix</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOLANA_LAUNCHPAD_COMPETITORS.map(lp => (
            <li key={lp.id} className="bg-gray-800 rounded p-3 border-l-4 border-red-400">
              <div className="font-bold text-red-200">{lp.name}</div>
              <div className="text-xs text-gray-400">{lp.notes}</div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-2xl font-semibold text-gold-400 mb-2">Open-Source Stack</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOLANA_OPEN_SOURCE_STACK.map(stack => (
            <li key={stack.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">
              <div className="font-bold text-gold-200">{stack.name}</div>
              <div className="text-gray-300">{stack.purpose}</div>
              <div className="text-xs text-gray-400">{stack.useCaseInTroptions}</div>
              <div className="text-xs text-gray-500">{stack.licenseNotes} | {stack.securityNotes}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
