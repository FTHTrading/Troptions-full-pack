import Link from 'next/link';
import { PROOF_CARDS, GOATX_PROOF, PUBLIC_CLAIM_RULES, TOKEN_PROOF_PACKET_REQUIREMENTS, PROOF_ROOM_TRUTH_BANNER } from '@/data/clientProofRoom';

const PROOF_TYPE_ICONS: Record<string, string> = {
  'on-chain': '⛓',
  architectural: '🏗',
  operational: '⚙️',
  governance: '🔒',
};

export default function ProofRoomPage() {
  const allowedClaims = PUBLIC_CLAIM_RULES.filter(r => r.allowed);
  const prohibitedClaims = PUBLIC_CLAIM_RULES.filter(r => !r.allowed);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Truth Banner */}
        <div className="bg-amber-900/30 border border-amber-600 rounded-xl p-4 text-center">
          <p className="text-amber-300 font-semibold text-sm">{PROOF_ROOM_TRUTH_BANNER}</p>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Proof Room</h1>
          <p className="text-slate-400 max-w-2xl">
            TROPTIONS Exchange OS provides verifiable, on-chain proofs for every token it tracks.
            This room documents what is proven, how it is proven, and what can be claimed as a result.
          </p>
        </div>

        {/* What TROPTIONS Proves — 6 Cards */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">What TROPTIONS Proves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROOF_CARDS.map((card) => (
              <div
                key={card.id}
                className={`bg-slate-900 border rounded-xl p-4 ${
                  card.verified ? 'border-green-700' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{PROOF_TYPE_ICONS[card.proofType]}</span>
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  {card.verified && (
                    <span className="ml-auto text-xs text-green-400 bg-green-900/30 border border-green-700 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">{card.description}</p>
                {card.evidence && (
                  <p className="text-xs text-slate-500 font-mono break-all">{card.evidence}</p>
                )}
                {card.evidenceLink && (
                  <a
                    href={card.evidenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1 block"
                  >
                    View on-chain →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* GoatX Mainnet Proof Card */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">GoatX — First Mainnet Proof Anchor</h2>
          <div className="bg-slate-900 border border-green-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-900/40 border border-green-600 flex items-center justify-center text-green-300 font-bold">
                GX
              </div>
              <div>
                <h3 className="text-white font-bold">{GOATX_PROOF.name}</h3>
                <p className="text-xs text-slate-400">{GOATX_PROOF.network}</p>
              </div>
              <span className="ml-auto text-xs text-green-400 bg-green-900/30 border border-green-700 px-2 py-1 rounded">
                Mainnet Confirmed
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800 rounded p-3">
                <p className="text-xs text-slate-500 mb-1">Mint Address</p>
                <p className="text-xs font-mono text-slate-300 break-all">{GOATX_PROOF.mintAddress}</p>
              </div>
              <div className="bg-slate-800 rounded p-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Mint Authority</p>
                  <p className={`text-xs font-semibold ${GOATX_PROOF.mintAuthorityRevoked ? 'text-green-400' : 'text-red-400'}`}>
                    {GOATX_PROOF.mintAuthorityRevoked ? 'Revoked ✓' : 'Active ⚠'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Freeze Authority</p>
                  <p className={`text-xs font-semibold ${GOATX_PROOF.freezeAuthorityRevoked ? 'text-green-400' : 'text-red-400'}`}>
                    {GOATX_PROOF.freezeAuthorityRevoked ? 'Revoked ✓' : 'Active ⚠'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Raydium LP</p>
                  <p className={`text-xs font-semibold ${GOATX_PROOF.raydiumLpCreated ? 'text-green-400' : 'text-amber-400'}`}>
                    {GOATX_PROOF.raydiumLpCreated ? 'Created ✓' : 'Not yet created'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">LP Locked</p>
                  <p className={`text-xs font-semibold ${GOATX_PROOF.lpLocked ? 'text-green-400' : 'text-amber-400'}`}>
                    {GOATX_PROOF.lpLocked ? 'Locked ✓' : 'Pending LP creation'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">{GOATX_PROOF.notes}</p>
            <div className="flex gap-3">
              <a
                href={GOATX_PROOF.solscanLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 border border-blue-700 bg-blue-900/20 px-3 py-1.5 rounded"
              >
                View on Solscan →
              </a>
              <Link
                href="https://launch.unykorn.org/mints"
                className="text-xs text-slate-300 hover:text-white border border-slate-600 bg-slate-800 px-3 py-1.5 rounded"
              >
                Mint Registry →
              </Link>
            </div>
          </div>
        </section>

        {/* Token Proof Packet Requirements */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Token Proof Packet Requirements</h2>
          <p className="text-sm text-slate-400 mb-4">
            Every token onboarded to TROPTIONS Exchange OS must complete a proof packet before any public claim is authorized.
          </p>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="space-y-2">
              {TOKEN_PROOF_PACKET_REQUIREMENTS.map((req) => (
                <div key={req.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                    req.required ? 'bg-red-900/40 border border-red-600' : 'bg-slate-700 border border-slate-600'
                  }`}>
                    {req.required ? (
                      <span className="text-red-400 text-xs">*</span>
                    ) : (
                      <span className="text-slate-500 text-xs">○</span>
                    )}
                  </div>
                  <span className="text-sm text-slate-300">{req.label}</span>
                  {req.required && (
                    <span className="ml-auto text-xs text-red-400">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Public Claim Rules */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Public Claim Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-3">✓ Allowed Claims</h3>
              <div className="space-y-2">
                {allowedClaims.map((rule) => (
                  <div key={rule.id} className="bg-green-900/20 border border-green-800 rounded p-3">
                    <p className="text-xs text-green-300 font-medium">{rule.claimText}</p>
                    {rule.condition && (
                      <p className="text-xs text-slate-500 mt-1">{rule.condition}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-3">✗ Prohibited Claims</h3>
              <div className="space-y-2">
                {prohibitedClaims.map((rule) => (
                  <div key={rule.id} className="bg-red-900/20 border border-red-800 rounded p-3">
                    <p className="text-xs text-red-300 font-medium">{rule.claimText}</p>
                    {rule.condition && (
                      <p className="text-xs text-slate-500 mt-1">{rule.condition}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Onboarding Gates */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Client Onboarding Gates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { gate: 'Partner Demo', status: 'READY', color: 'green', notes: 'Show proof room, partner demo, truth layer' },
              { gate: 'Pilot Intake', status: 'READY', color: 'green', notes: 'Accept intake form, NDA, MOU review' },
              { gate: 'Mainnet Pilot', status: 'GATED', color: 'amber', notes: 'Needs LP capital, legal memo, committee GO' },
              { gate: 'Live Trading', status: 'GATED', color: 'red', notes: 'Full Level 3 checklist required' },
              { gate: 'Enterprise Volume', status: 'GATED', color: 'red', notes: '4-8 weeks infra after Level 3' },
            ].map(({ gate, status, color, notes }) => (
              <div key={gate} className={`bg-slate-900 border border-${color}-700/50 rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    color === 'green' ? 'bg-green-900/40 text-green-300 border border-green-700' :
                    color === 'amber' ? 'bg-amber-900/40 text-amber-300 border border-amber-700' :
                    'bg-red-900/40 text-red-300 border border-red-700'
                  }`}>
                    {status}
                  </span>
                  <span className="text-sm font-semibold text-white">{gate}</span>
                </div>
                <p className="text-xs text-slate-500">{notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Resources</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="https://launch.unykorn.org/mints" className="text-sm text-blue-400 hover:text-blue-300 border border-blue-700 bg-blue-900/20 px-4 py-2 rounded-lg">
              Mint Registry →
            </Link>
            <Link href="https://launch.unykorn.org/system/truth" className="text-sm text-slate-300 hover:text-white border border-slate-600 bg-slate-800 px-4 py-2 rounded-lg">
              System Truth →
            </Link>
            <Link href="/exchange-os/status" className="text-sm text-slate-300 hover:text-white border border-slate-600 bg-slate-800 px-4 py-2 rounded-lg">
              Exchange OS Status →
            </Link>
            <Link href="/exchange-os/readiness" className="text-sm text-slate-300 hover:text-white border border-slate-600 bg-slate-800 px-4 py-2 rounded-lg">
              Partner Readiness →
            </Link>
          </div>
        </section>

        {/* Footer disclaimer */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-600 text-center">
            TROPTIONS Exchange OS is not an exchange, broker-dealer, custodian, or investment adviser.
            Nothing on this page constitutes financial advice or a guarantee of any kind.
            All on-chain data is publicly verifiable on Solscan.
          </p>
        </div>
      </div>
    </div>
  );
}
