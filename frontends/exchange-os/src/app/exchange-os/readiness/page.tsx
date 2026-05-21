import React from "react";
import { TROPTIONS_IS, TROPTIONS_IS_NOT, TOKEN_LAUNCH_GATES, TECHNICAL_SCALE_REQUIREMENTS, PARTNER_CONTROL_REQUIREMENTS, MAINNET_ACTIVATION_BLOCKERS } from "@/data/exchangeOsReadiness";

export default function ExchangeOsReadinessPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">TROPTIONS Exchange OS Readiness</h1>
        <h2 className="text-xl text-gray-300 mb-2">Institutional launch-control, proof, compliance, and non-custodial market infrastructure for tokenized ecosystems.</h2>
        <div className="bg-gray-900 border-l-4 border-gold-400 p-4 mb-4">
          <span className="font-semibold text-gold-400">Truth label:</span> Launch-control infrastructure only. TROPTIONS is not an exchange, broker, market maker, custodian, underwriter, investment adviser, token promoter, or legal counsel.
        </div>
      </section>
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-cyan-300 mb-2">What TROPTIONS Is</h3>
          <ul className="space-y-2">
            {TROPTIONS_IS.map(item => (
              <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-cyan-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-red-400 mb-2">What TROPTIONS Is Not</h3>
          <ul className="space-y-2">
            {TROPTIONS_IS_NOT.map(item => (
              <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-red-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gold-400 mb-2">Token Launch Gate</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOKEN_LAUNCH_GATES.map(item => (
            <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-2">Millions of Volume Readiness</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TECHNICAL_SCALE_REQUIREMENTS.map(item => (
            <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-cyan-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gold-400 mb-2">Partner Control Model</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNER_CONTROL_REQUIREMENTS.map(item => (
            <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-2">Non-Custodial Trading Model</h3>
        <div className="bg-gray-800 rounded p-4 border-l-4 border-cyan-400">
          User connects wallet → TROPTIONS prepares unsigned transaction → user reviews/signs in wallet → transaction routes through approved DEX/chain rail → proof is recorded → monitoring begins.
        </div>
      </section>
      <section>
        <h3 className="text-2xl font-semibold text-red-400 mb-2">Mainnet Activation Blockers</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MAINNET_ACTIVATION_BLOCKERS.map(item => (
            <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-red-400">{item.title}: <span className="text-gray-300">{item.description}</span></li>
          ))}
        </ul>
      </section>
    </main>
  );
}
