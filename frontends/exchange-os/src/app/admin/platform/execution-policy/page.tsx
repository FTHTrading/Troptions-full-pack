export const metadata = { title: "Execution Policy — TROPTIONS Platform" };

const POLICY_RULES = [
  {
    id: "rule-01",
    rule: "Mock adapters cannot reach executed_confirmed",
    description:
      'Any adapter with category "mock", "mock_only", "manual_proof", or "simulation" is permanently blocked from producing an executed_confirmed execution result.',
    status: "enforced",
  },
  {
    id: "rule-02",
    rule: "Credentials must be present",
    description:
      "Execution is blocked if required provider credentials are not configured. A CredentialsRequiredError is thrown.",
    status: "enforced",
  },
  {
    id: "rule-03",
    rule: "Compliance must be approved or not_required",
    description:
      "Compliance status must be 'approved' or 'not_required'. Any other value (pending, rejected, under_review) blocks execution.",
    status: "enforced",
  },
  {
    id: "rule-04",
    rule: "Sandbox mode blocks execution",
    description:
      "Adapters in sandbox mode return execution_disabled. Live execution requires a non-sandbox production adapter.",
    status: "enforced",
  },
  {
    id: "rule-05",
    rule: "Adapter must be production_ready",
    description:
      'Only adapters with status "production_ready" may proceed past execution guards. All other statuses are blocked.',
    status: "enforced",
  },
  {
    id: "rule-06",
    rule: "Provider confirmation required for executed_confirmed",
    description:
      'executed_confirmed may only be set when a real provider returns a confirmation string. An empty or whitespace confirmation triggers ExecutionBlockedError.',
    status: "enforced",
  },
  {
    id: "rule-07",
    rule: "No FTH/FTHX/FTHG references in TROPTIONS platform",
    description:
      "assertNoFthReference guard blocks any code path where FTH brand terms appear in TROPTIONS platform contexts.",
    status: "enforced",
  },
];

export default function ExecutionPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — All execution guards are enforced. No live execution today.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS SR PLATFORM FOUNDATION
        </div>
        <h1 className="text-2xl font-bold text-white">Execution Policy</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Hard execution guards enforced by the platform. Cannot be bypassed by adapter configuration alone.
        </p>
      </div>

      <div className="space-y-4">
        {POLICY_RULES.map((rule) => (
          <div key={rule.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-white text-sm">{rule.rule}</div>
              <span className="shrink-0 rounded px-2 py-1 text-xs border text-green-300 bg-green-900/40 border-green-700/50">
                {rule.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400">{rule.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
