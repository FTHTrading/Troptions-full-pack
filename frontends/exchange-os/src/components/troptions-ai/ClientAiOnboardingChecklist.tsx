"use client";

const CHECKLIST_STEPS = [
  {
    id: "step-1",
    label: "Define AI Purpose",
    description: "What does this client need the AI system to do?",
    placeholder: "e.g. Answer customer questions about our services, generate marketing copy…",
  },
  {
    id: "step-2",
    label: "Knowledge Documents",
    description: "What documents, policies, and FAQs should the AI know?",
    placeholder: "e.g. Brand guide, product catalog, FAQ, terms of service…",
  },
  {
    id: "step-3",
    label: "Restrictions & Prohibitions",
    description: "What should the AI never do or say?",
    placeholder: "e.g. Never give medical advice, never quote prices without approval…",
  },
  {
    id: "step-4",
    label: "User Access Roles",
    description: "Which users or roles can access this AI system?",
    placeholder: "e.g. All Troptions members, admin-only, specific team roles…",
  },
  {
    id: "step-5",
    label: "Enabled Tools",
    description: "Which tools should this AI system use?",
    placeholder: "e.g. FAQ lookup, content summarizer, form filler…",
  },
  {
    id: "step-6",
    label: "Output Types",
    description: "What outputs should this AI system create?",
    placeholder: "e.g. Text responses, draft emails, summarized documents…",
  },
  {
    id: "step-7",
    label: "Regulated Data",
    description: "Does this system touch healthcare, finance, legal, private-market, or regulated information?",
    placeholder: "e.g. No regulated data / Healthcare admin only / Financial general info…",
  },
  {
    id: "step-8",
    label: "Deployment Preference",
    description: "Should this be Troptions-hosted, client-hosted later, hybrid, or local model?",
    placeholder: "e.g. Troptions-hosted (recommended for most clients)…",
  },
];

export default function ClientAiOnboardingChecklist() {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
      {/* Header */}
      <div className="mb-4">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          Troptions AI
        </p>
        <h3 className="text-sm font-semibold text-white">AI System Onboarding Checklist</h3>
        <p className="mt-1 text-xs text-gray-500">
          Answer these questions to define your Troptions Sovereign AI system. All fields are simulation-only.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {CHECKLIST_STEPS.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            {/* Step number */}
            <div className="shrink-0 flex flex-col items-center gap-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 text-[10px] font-semibold text-[#C9A84C]">
                {index + 1}
              </div>
              {index < CHECKLIST_STEPS.length - 1 && (
                <div className="w-px flex-1 bg-gray-800" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <p className="mb-0.5 text-xs font-semibold text-white">{step.label}</p>
              <p className="mb-2 text-[10px] text-gray-500">{step.description}</p>
              <input
                type="text"
                placeholder={step.placeholder}
                disabled
                aria-disabled="true"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit (disabled) */}
      <div className="mt-4 rounded-lg border border-yellow-800/30 bg-yellow-900/5 p-3">
        <p className="mb-2 text-[10px] text-yellow-600">
          Onboarding form submission is simulation-only. Control Hub approval required before activation.
        </p>
        <button
          disabled
          aria-disabled="true"
          className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
        >
          Submit Onboarding Request — Simulation Only
        </button>
      </div>
    </div>
  );
}
