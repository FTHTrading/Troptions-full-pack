const ARCH_LAYERS = [
  {
    title: "Experience Layer",
    items: ["Web interface", "Operator console", "Client portals"],
  },
  {
    title: "API and Services",
    items: ["Control-plane APIs", "Workflow routing", "Approval engine"],
  },
  {
    title: "Data Layer",
    items: ["Registry content", "Proof records", "Readiness datasets"],
  },
  {
    title: "Automation Layer",
    items: ["Agentic planning", "Simulation jobs", "Policy gates"],
  },
  {
    title: "Reporting Layer",
    items: ["Insights feed", "Audit exports", "Executive summaries"],
  },
] as const;

export function ArchitectureFlow() {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {ARCH_LAYERS.map((layer, index) => (
        <article
          key={layer.title}
          className="relative rounded-2xl border border-[#2d426e] bg-[#0f182c]/90 p-4"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#c4a84a]">Layer {index + 1}</p>
          <h3 className="mt-2 text-base font-semibold text-[#f5f1e8]">{layer.title}</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-[#b7c3d8]">
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {index < ARCH_LAYERS.length - 1 ? (
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-[#c4a84a]/65 md:block"
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}
