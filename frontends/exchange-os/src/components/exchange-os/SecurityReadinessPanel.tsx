'use client';

import { SECURITY_CONTROLS, SECURITY_SUMMARY, type SecurityStatus } from '@/data/securityReadiness';

const STATUS_CONFIG: Record<SecurityStatus, { label: string; className: string; icon: string }> = {
  implemented: { label: 'Implemented', className: 'bg-green-900/40 text-green-300 border border-green-700', icon: '✓' },
  active: { label: 'Active', className: 'bg-blue-900/40 text-blue-300 border border-blue-700', icon: '◉' },
  documented: { label: 'Documented', className: 'bg-purple-900/40 text-purple-300 border border-purple-700', icon: '📄' },
  required: { label: 'Required', className: 'bg-red-900/40 text-red-300 border border-red-700', icon: '!' },
};

export default function SecurityReadinessPanel() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Security Readiness</h2>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{SECURITY_SUMMARY.implemented + SECURITY_SUMMARY.active} active</span>
          <span className="text-purple-400">{SECURITY_SUMMARY.documented} documented</span>
          <span className="text-red-400">{SECURITY_SUMMARY.required} required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SECURITY_CONTROLS.map((control) => {
          const config = STATUS_CONFIG[control.status];
          return (
            <div
              key={control.id}
              className={`border rounded-lg p-3 ${
                control.status === 'required' ? 'bg-red-950/20 border-red-900/50' :
                control.status === 'implemented' || control.status === 'active' ? 'bg-slate-800 border-slate-700' :
                'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 flex-shrink-0 ${config.className}`}>
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white leading-tight">{control.title}</h3>
                    {!control.clientVisible && (
                      <span className="text-xs text-slate-500 flex-shrink-0">Internal</span>
                    )}
                  </div>
                  {control.description && (
                    <p className="text-xs text-slate-400 mt-1">{control.description}</p>
                  )}
                  {control.requiredFor && (
                    <p className="text-xs text-slate-600 mt-1">Required for: {control.requiredFor}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-800 border border-slate-600 rounded text-xs text-slate-400">
        <strong className="text-slate-300">Security Note:</strong> Controls marked &ldquo;Required&rdquo; must be implemented before Level 3 (mainnet pilot).
        Controls marked &ldquo;Active&rdquo; or &ldquo;Implemented&rdquo; are in place today.
      </div>
    </div>
  );
}
