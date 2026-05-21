'use client';

import { MAINNET_READINESS_CHECKLIST, MAINNET_READINESS_SUMMARY, canEnableMainnetTrading, type MainnetReadinessItem } from '@/data/mainnetReadiness';

const STATUS_CONFIG: Record<MainnetReadinessItem['status'], { label: string; className: string; icon: string }> = {
  complete: { label: 'Complete', className: 'bg-green-900/40 text-green-300 border border-green-700', icon: '✓' },
  pending: { label: 'Pending', className: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700', icon: '○' },
  required: { label: 'Required', className: 'bg-blue-900/40 text-blue-300 border border-blue-700', icon: '!' },
  blocked: { label: 'Blocked', className: 'bg-red-900/40 text-red-300 border border-red-700', icon: '✗' },
  gated: { label: 'Gated', className: 'bg-purple-900/40 text-purple-300 border border-purple-700', icon: '🔒' },
};

export default function MainnetReadinessLockPanel() {
  const { allowed, blockers } = canEnableMainnetTrading(MAINNET_READINESS_CHECKLIST);
  const criticalItems = MAINNET_READINESS_CHECKLIST.filter(i => i.critical);
  const nonCriticalItems = MAINNET_READINESS_CHECKLIST.filter(i => !i.critical);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Mainnet Readiness Lock</h2>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          allowed
            ? 'bg-green-900/40 border-green-700 text-green-300'
            : 'bg-red-900/40 border-red-700 text-red-300'
        }`}>
          <span className="text-sm font-bold">{allowed ? '🟢 TRADING ENABLED' : '🔴 TRADING LOCKED'}</span>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 mb-5">
        <p className="text-xs text-slate-400 mb-1">
          <strong className="text-slate-300">Progress:</strong>{' '}
          {MAINNET_READINESS_SUMMARY.criticalComplete}/{MAINNET_READINESS_SUMMARY.critical} critical items complete
        </p>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all"
            style={{ width: `${(MAINNET_READINESS_SUMMARY.criticalComplete / MAINNET_READINESS_SUMMARY.critical) * 100}%` }}
          />
        </div>
        {!allowed && (
          <p className="text-xs text-red-400 mt-2">
            {blockers.length} critical blocker{blockers.length !== 1 ? 's' : ''} must be resolved before mainnet trading.
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-3">Critical Items ({criticalItems.length})</h3>
          <div className="space-y-2">
            {criticalItems.map((item) => {
              const config = STATUS_CONFIG[item.status];
              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 ${
                    item.status === 'complete' ? 'bg-slate-800 border-slate-700 opacity-70' :
                    item.status === 'blocked' || item.status === 'required' ? 'bg-red-950/20 border-red-900/40' :
                    'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${config.className}`}>
                      {config.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white">{item.name}</span>
                        <span className={`text-xs ${config.className} px-1.5 py-0.5 rounded`}>{config.label}</span>
                      </div>
                      <p className="text-xs text-slate-400">{item.notes}</p>
                      {item.proofRequired && item.status !== 'complete' && (
                        <p className="text-xs text-slate-500 mt-1">Proof required: {item.proofRequired}</p>
                      )}
                      {item.envVarName && (
                        <span className="inline-block font-mono text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded mt-1">
                          {item.envVarName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Non-Critical Items ({nonCriticalItems.length})</h3>
          <div className="space-y-2">
            {nonCriticalItems.map((item) => {
              const config = STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${config.className}`}>
                      {config.icon}
                    </span>
                    <span className="text-sm text-white">{item.name}</span>
                    <span className={`text-xs ${config.className} px-1.5 py-0.5 rounded`}>{config.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-8">{item.notes}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 bg-amber-900/20 border border-amber-800 rounded text-xs text-amber-400">
        ⚠ <strong>Governance Rule:</strong> NEXT_PUBLIC_SOLANA_MAINNET_ENABLED may only be set to true after written launch committee GO and all critical items confirmed complete. This is not a technical decision alone.
      </div>
    </div>
  );
}
