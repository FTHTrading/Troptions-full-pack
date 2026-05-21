import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Proof Vault — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const PROOF_TOOLS = [
  { id: "fingerprint", label: "Document Fingerprinting", description: "Generate a cryptographic fingerprint of a document for timestamped proof of existence." },
  { id: "ipfs-anchor", label: "IPFS Anchoring (Scaffold)", description: "Pin document hashes to IPFS for decentralized proof storage. Requires production integration." },
  { id: "timestamp-cert", label: "Timestamp Certificate", description: "Issue a verifiable timestamp certificate for signed documents." },
  { id: "audit-chain", label: "Proof Audit Chain", description: "View the full audit chain for a proof record." },
  { id: "verification", label: "Proof Verification", description: "Verify a document against its stored proof fingerprint." },
];

export default async function ProofVaultPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Proof Vault</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Proof Vault</h1>
          <p className="mt-2 text-sm text-gray-400">
            Cryptographic document fingerprinting, IPFS anchoring, and verifiable proof records.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All Proof Vault tools are non-functional in this phase. No real cryptographic operations will occur.
          </p>
        </div>

        {/* Proof Hash Simulator */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">Document Hash Simulator</p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Document Upload</label>
              <input
                disabled
                type="file"
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Generated Hash (SHA-256)</label>
              <input
                disabled
                type="text"
                value="0000000000000000000000000000000000000000000000000000000000000000"
                readOnly
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 font-mono text-sm text-gray-600"
              />
            </div>
          </div>
          <button
            disabled
            className="mt-4 cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs font-semibold text-gray-600"
          >
            Generate Proof — Simulation Only
          </button>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROOF_TOOLS.map((tool) => (
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
