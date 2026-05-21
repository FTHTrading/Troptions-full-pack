'use client';

import { ENTERPRISE_ONBOARDING_STAGES, type EnterpriseOnboardingStage, type OnboardingStatus } from '@/data/enterpriseClientOnboarding';

const STATUS_CONFIG: Record<OnboardingStatus, { label: string; className: string }> = {
  complete: { label: 'Complete', className: 'bg-green-900/40 text-green-300 border border-green-700' },
  pending: { label: 'Pending', className: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700' },
  required: { label: 'Required', className: 'bg-blue-900/40 text-blue-300 border border-blue-700' },
  blocked: { label: 'Blocked', className: 'bg-red-900/40 text-red-300 border border-red-700' },
};

const RISK_CONFIG: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

function StageBadge({ status }: { status: OnboardingStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function StageCard({ stage }: { stage: EnterpriseOnboardingStage }) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
          stage.status === 'complete' ? 'bg-green-700 border-green-500 text-white' :
          stage.status === 'blocked' ? 'bg-red-900 border-red-600 text-red-300' :
          'bg-slate-700 border-slate-500 text-slate-300'
        }`}>
          {stage.stageNumber}
        </div>
        {stage.stageNumber < ENTERPRISE_ONBOARDING_STAGES.length && (
          <div className="w-px flex-1 mt-1 bg-slate-700 min-h-4" />
        )}
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-white">{stage.title}</h3>
          <StageBadge status={stage.status} />
          {!stage.clientVisible && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
              Internal
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-2">{stage.description}</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="text-slate-500">
            Owner: <span className="text-slate-300">{stage.owner}</span>
          </span>
          <span className="text-slate-500">
            Risk: <span className={RISK_CONFIG[stage.riskLevel]}>{stage.riskLevel}</span>
          </span>
        </div>
        {stage.status === 'blocked' || stage.status === 'required' ? (
          <div className="mt-2 text-xs text-amber-400 bg-amber-900/20 border border-amber-800 rounded px-2 py-1">
            ⚠ {stage.blockerIfMissing}
          </div>
        ) : null}
        {stage.requiredDocuments.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">
              {stage.requiredDocuments.length} required document{stage.requiredDocuments.length !== 1 ? 's' : ''}
            </summary>
            <ul className="mt-1 ml-3 space-y-0.5">
              {stage.requiredDocuments.map((doc) => (
                <li key={doc} className="text-xs text-slate-400 list-disc list-inside">{doc}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}

export default function EnterpriseClientOnboardingPanel() {
  const completed = ENTERPRISE_ONBOARDING_STAGES.filter(s => s.status === 'complete').length;
  const total = ENTERPRISE_ONBOARDING_STAGES.length;
  const clientVisible = ENTERPRISE_ONBOARDING_STAGES.filter(s => s.clientVisible);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Enterprise Client Onboarding Pipeline</h2>
        <span className="text-xs text-slate-400">{completed}/{total} stages complete</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mb-6">
        {clientVisible.length} of {total} stages are client-visible. Internal stages are marked.
      </p>
      <div>
        {ENTERPRISE_ONBOARDING_STAGES.map((stage) => (
          <StageCard key={stage.id} stage={stage} />
        ))}
      </div>
      <div className="mt-4 p-3 bg-slate-800 border border-slate-600 rounded text-xs text-slate-400">
        <strong className="text-slate-300">Disclaimer:</strong> TROPTIONS is not an exchange, broker-dealer, custodian, or investment adviser.
        This pipeline represents operational readiness tracking only.
      </div>
    </div>
  );
}
