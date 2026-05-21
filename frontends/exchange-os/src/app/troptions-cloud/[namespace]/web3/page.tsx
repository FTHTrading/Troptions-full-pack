import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Web3 Identity — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const WEB3_TOOLS = [
  { id: "did-builder", label: "DID Builder (Scaffold)", description: "Scaffold a decentralized identity (DID) document for your namespace." },
  { id: "wallet-preview", label: "Wallet Scaffold Preview", description: "Preview wallet address formats for XRPL, EVM, and Solana. Read-only simulation." },
  { id: "credential-template", label: "Verifiable Credential Templates", description: "Access standard verifiable credential schemas for Troptions identity use." },
  { id: "identity-proof", label: "Identity Proof Vault Link", description: "Link an identity proof to the Troptions Proof Vault." },
];

export default async function Web3IdentityPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Web3 Identity</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Web3 Identity</h1>
          <p className="mt-2 text-sm text-gray-400">
            Decentralized identity tools, wallet scaffolding, and verifiable credentials for Troptions members.
          </p>
        </div>

        {/* No token issuance notice */}
        <div className="mb-6 rounded-xl border border-orange-800/40 bg-orange-900/10 p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-1">Token Issuance Not Enabled</p>
          <p className="text-xs text-orange-300/80 leading-relaxed">
            Token issuance, minting, or any on-chain asset creation is not enabled in Troptions Cloud.
            This workspace provides identity scaffolding and wallet address preview tools only.
            No real transactions will occur.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">All Web3 Identity features are non-functional in this phase. Wallet addresses shown are simulated only.</p>
        </div>

        {/* Wallet Scaffold Preview */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">Wallet Address Preview (Simulated)</p>
          <div className="space-y-3">
            {[
              { label: "XRPL", value: "r0000000000000000000000000000000000" },
              { label: "EVM (Ethereum/Polygon)", value: "0x0000000000000000000000000000000000000000" },
              { label: "Solana", value: "11111111111111111111111111111111" },
            ].map((chain) => (
              <div key={chain.label}>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">{chain.label}</label>
                <input
                  disabled
                  type="text"
                  value={chain.value}
                  readOnly
                  className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 font-mono text-xs text-gray-600"
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-gray-600">These are simulated addresses only. No real wallets are created.</p>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WEB3_TOOLS.map((tool) => (
            <div key={tool.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-2">{tool.label}</h2>
              <p className="text-xs text-gray-400 flex-1 mb-4">{tool.description}</p>
              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-xs font-semibold text-gray-600"
              >
                Open — Simulation Only
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
