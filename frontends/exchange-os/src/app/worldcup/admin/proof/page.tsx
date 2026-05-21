import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')

function readJSON(file: string) {
  const p = join(DATA_DIR, file)
  if (!existsSync(p)) return null
  return JSON.parse(readFileSync(p, 'utf-8'))
}

export default function ProofPage() {
  const merchantData = readJSON('merchants.json')
  const offerData = readJSON('offers.json')
  const callData = readJSON('call_list.json')

  const merchants: Record<string, unknown>[] = merchantData?.merchants ?? []
  const offers: Record<string, unknown>[] = offerData?.offers ?? []
  const leads: Record<string, unknown>[] = callData?.leads ?? []

  const stats = {
    total_merchants: merchants.length,
    paid: merchants.filter(m => m.payment_status === 'paid' || m.status === 'paid').length,
    active: merchants.filter(m => m.status === 'active' || m.status === 'ACTIVE').length,
    payment_pending: merchants.filter(m => m.payment_status === 'payment_pending' || m.status === 'PENDING').length,
    total_offers: offers.length,
    active_offers: offers.filter(o => o.active).length,
    total_scans: offers.reduce((s, o) => s + Number(o.scans ?? 0), 0),
    total_redemptions: offers.reduce((s, o) => s + Number(o.redemptions ?? 0), 0),
    // Revenue calcs
    setup_collected: merchants
      .filter(m => m.payment_status === 'paid' || m.status === 'paid')
      .reduce((s, m) => s + Number(m.setup_usd ?? 0), 0),
    setup_pending: merchants
      .filter(m => m.status === 'PENDING' || m.payment_status === 'payment_pending')
      .reduce((s, m) => s + Number(m.setup_usd ?? 0), 0),
    monthly_mrr: merchants
      .filter(m => m.payment_status === 'paid' || m.status === 'paid')
      .reduce((s, m) => s + Number(m.monthly_usd ?? 0), 0),
    // Leads
    total_leads: leads.length,
    not_called: leads.filter(l => l.status === 'NOT_CALLED').length,
    called: leads.filter(l => Number(l.call_attempts ?? 0) > 0).length,
    interested: leads.filter(l => l.status === 'INTERESTED').length,
    closed_leads: leads.filter(l => l.status === 'CLOSED').length,
  }

  const topMerchants = merchants.slice(0, 10)
  const topOffers = offers.slice(0, 10)
  const nextCalls = leads.filter(l => l.status === 'NOT_CALLED').slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-xs text-green-400 uppercase tracking-widest mb-1">TROPTIONS — World Cup Admin</div>
          <h1 className="text-3xl font-black">Proof Report</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Revenue snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Setup Collected', value: `$${stats.setup_collected}`, color: 'text-green-400' },
            { label: 'Setup Pending', value: `$${stats.setup_pending}`, color: 'text-yellow-400' },
            { label: 'Monthly MRR', value: `$${stats.monthly_mrr}/mo`, color: 'text-blue-400' },
            { label: 'QR Scans', value: String(stats.total_scans), color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Call progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: stats.total_leads },
            { label: 'Not Called', value: stats.not_called },
            { label: 'Called', value: stats.called },
            { label: 'Interested', value: stats.interested },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Merchants */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Merchants ({stats.total_merchants})</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Package</th>
                  <th className="px-4 py-2 text-right">Setup $</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Registered</th>
                </tr>
              </thead>
              <tbody>
                {topMerchants.map((m, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-2 font-medium">{String(m.name)}</td>
                    <td className="px-4 py-2 text-gray-400">{String(m.type)}</td>
                    <td className="px-4 py-2 text-gray-400">{String(m.package)}</td>
                    <td className="px-4 py-2 text-right text-green-400">${String(m.setup_usd)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        m.payment_status === 'paid' || m.status === 'paid' ? 'bg-green-900 text-green-300' :
                        m.status === 'ACTIVE' || m.status === 'active' ? 'bg-blue-900 text-blue-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {String(m.payment_status ?? m.status ?? 'pending')}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500 text-xs">
                      {m.registered_at ? new Date(String(m.registered_at)).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {merchants.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-600">No merchants yet — start calling!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active QR Offers */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Active QR Offers ({stats.active_offers})</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                  <th className="px-4 py-2 text-left">QR Code</th>
                  <th className="px-4 py-2 text-left">Merchant</th>
                  <th className="px-4 py-2 text-left">Offer</th>
                  <th className="px-4 py-2 text-right">Scans</th>
                  <th className="px-4 py-2 text-right">Redemptions</th>
                </tr>
              </thead>
              <tbody>
                {topOffers.map((o, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="px-4 py-2 font-mono text-xs text-green-400">{String(o.qr_code)}</td>
                    <td className="px-4 py-2 text-gray-300">{String(o.merchant_name)}</td>
                    <td className="px-4 py-2 text-gray-400">{String(o.title)}</td>
                    <td className="px-4 py-2 text-right">{String(o.scans ?? 0)}</td>
                    <td className="px-4 py-2 text-right text-green-400">{String(o.redemptions ?? 0)}</td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-600">No offers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next 10 calls */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Next Calls ({stats.not_called} remaining)</h2>
          <div className="space-y-2">
            {nextCalls.map((l, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{String(l.name)}</span>
                  <span className="text-gray-500 text-sm ml-3">{String(l.type)} · {String(l.area)}</span>
                </div>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">P{String(l.priority)}</span>
              </div>
            ))}
            {nextCalls.length === 0 && (
              <div className="text-center text-gray-600 py-6">All businesses contacted!</div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-700 mt-8 pb-8">
          TROPTIONS World Cup Atlanta 2026 · Operator view · {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}
