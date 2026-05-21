import { ControlHubPanel } from "@/components/troptions/ControlHubPanel";
import { getControlHubStateSnapshot } from "@/lib/troptions/controlHubStateStore";
import type { ControlHubStateSnapshot } from "@/lib/troptions/controlHubStateTypes";

export const metadata = {
  title: "Clawd Governance Control Hub | Admin",
  description: "Governed Clawd integration layer — capability matrix, constraint enforcement, intent routing, and audit model.",
};

export default function AdminControlHubPage() {
  let snapshot: ControlHubStateSnapshot | undefined;
  try {
    snapshot = getControlHubStateSnapshot();
  } catch {
    snapshot = undefined;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-6">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Admin — Governed AI Layer
          </p>
          <h1 className="text-4xl font-bold">Clawd Governance Control Hub</h1>
          <p className="max-w-3xl text-base text-slate-400 leading-7">
            Central integration layer connecting Clawd, Jefe, and the OpenClaw agent fleet to the Troptions
            institutional OS. All AI actions are constrained, routed, and audit-logged. No agent may approve,
            sign, trade, or settle without human authorization.
          </p>
        </header>

        <ControlHubPanel snapshot={snapshot} />
      </div>
    </main>
  );
}
