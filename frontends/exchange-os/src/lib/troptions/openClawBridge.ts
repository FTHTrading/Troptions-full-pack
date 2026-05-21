import { discoverOpenClawPaths, getSafeOpenClawPathLabels } from "@/lib/troptions/openClawDiscoveryEngine";

export interface OpenClawBridgeStatus {
  integrationStatus: "connected" | "not-connected" | "local-simulation";
  discoveredPath?: string;
  configPath?: string;
  healthCheckCommand?: string;
  dryRunCommand?: string;
  statusCommand?: string;
  supportedTools: string[];
  discoveredItems: ReturnType<typeof getSafeOpenClawPathLabels>;
  setupInstructions: string[];
}

export function getOpenClawBridgeStatus(): OpenClawBridgeStatus {
  const discovered = discoverOpenClawPaths();
  const executable = discovered.find((item) => item.type === "executable");
  const config = discovered.find((item) => item.type === "config");

  if (executable && config) {
    return {
      integrationStatus: "connected",
      discoveredPath: executable.path,
      configPath: config.path,
      healthCheckCommand: "openclawd.exe --status",
      dryRunCommand: "openclawd.exe --dry-run",
      statusCommand: "openclawd.exe --agents",
      supportedTools: ["status", "agents", "tasks", "site-check", "x402-simulate", "rag-query"],
      discoveredItems: getSafeOpenClawPathLabels(discovered),
      setupInstructions: [],
    };
  }

  return {
    integrationStatus: discovered.length > 0 ? "local-simulation" : "not-connected",
    supportedTools: ["status", "agents", "tasks", "site-check", "x402-simulate", "rag-query"],
    discoveredItems: getSafeOpenClawPathLabels(discovered),
    setupInstructions: [
      "Install or extract OpenClaw runtime to a local OpenClaw folder.",
      "Provide openclawd executable and config files.",
      "Keep live execution disabled until approvals are complete.",
    ],
  };
}
