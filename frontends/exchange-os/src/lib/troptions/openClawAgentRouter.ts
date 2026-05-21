import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";

export function routeOpenClawAgent(command: string) {
  const lower = command.toLowerCase();

  if (lower.includes("x402")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "x402-agent") ?? OPENCLAW_AGENT_REGISTRY[0];
  if (lower.includes("xrpl") || lower.includes("amm") || lower.includes("dex")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "xrpl-agent") ?? OPENCLAW_AGENT_REGISTRY[0];
  if (lower.includes("wallet") || lower.includes("invite") || lower.includes("qr")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "wallet-agent") ?? OPENCLAW_AGENT_REGISTRY[0];
  if (lower.includes("site") || lower.includes("link") || lower.includes("metadata")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "site-ops-agent") ?? OPENCLAW_AGENT_REGISTRY[0];
  if (lower.includes("compliance") || lower.includes("sblc") || lower.includes("pof") || lower.includes("rwa")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "compliance-agent") ?? OPENCLAW_AGENT_REGISTRY[0];
  if (lower.includes("board") || lower.includes("audit") || lower.includes("proof")) return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "clawd") ?? OPENCLAW_AGENT_REGISTRY[0];

  return OPENCLAW_AGENT_REGISTRY.find((agent) => agent.id === "jefe") ?? OPENCLAW_AGENT_REGISTRY[0];
}
