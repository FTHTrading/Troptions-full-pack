import { getFastStatus } from "@/lib/troptions/jefeEngine";

export function JefeStatusPanel() {
  const status = getFastStatus();
  const bridge = status.bridge;

  return (
    <section className="openclaw-panel">
      <h3>Jefe Status</h3>
      <p>Status: <strong>{status.jefeStatus}</strong></p>
      <p>Mode: <strong>{status.mode}</strong></p>
      <p>OpenClaw: <strong>{status.openClawStatus}</strong></p>
      <p>Jefe local mode: <strong>{bridge.jefeLocalMode}</strong></p>
      <p>Specialist agents: <strong>{bridge.specialistAgentsMode}</strong></p>
      <p>Action mode: <strong>{bridge.actionsMode}</strong></p>
      <p>x402: <strong>{status.x402Readiness}</strong></p>
      <p>XRPL mainnet enabled: <strong>{String(status.xrplMainnetEnabled)}</strong></p>
    </section>
  );
}
