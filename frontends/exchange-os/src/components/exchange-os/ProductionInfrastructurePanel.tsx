'use client';

import { PRODUCTION_INFRASTRUCTURE, type InfraStatus, type InfraLevel } from '@/data/productionInfrastructure';

const STATUS_CONFIG: Record<InfraStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-900/40 text-green-300 border border-green-700' },
  required: { label: 'Required', className: 'bg-red-900/40 text-red-300 border border-red-700' },
  planned: { label: 'Planned', className: 'bg-blue-900/40 text-blue-300 border border-blue-700' },
  blocked: { label: 'Blocked', className: 'bg-amber-900/40 text-amber-300 border border-amber-700' },
};

const LEVEL_COLORS: Record<InfraLevel, string> = {
  'Level 2': 'text-yellow-400',
  'Level 3': 'text-orange-400',
  'Level 4': 'text-red-400',
  'Level 5': 'text-purple-400',
};

export default function ProductionInfrastructurePanel() {
  const active = PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'active').length;
  const required = PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'required').length;
  const planned = PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'planned').length;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Production Infrastructure</h2>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{active} active</span>
          <span className="text-red-400">{required} required</span>
          <span className="text-blue-400">{planned} planned</span>
        </div>
      </div>

      <div className="space-y-3">
        {PRODUCTION_INFRASTRUCTURE.map((item) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 ${
                item.status === 'active' ? 'bg-slate-800 border-slate-700' :
                item.status === 'required' ? 'bg-red-950/20 border-red-900/40' :
                'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{item.purpose}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="text-slate-500">
                      Owner: <span className="text-slate-300">{item.owner}</span>
                    </span>
                    <span className="text-slate-500">
                      Required for:{' '}
                      {item.requiredFor.map((lvl, i) => (
                        <span key={lvl} className={LEVEL_COLORS[lvl]}>
                          {lvl}{i < item.requiredFor.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                  {item.envVarNamesOnly.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.envVarNamesOnly.map((v) => (
                        <span key={v} className="font-mono text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2 italic">{item.clientImpact}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
