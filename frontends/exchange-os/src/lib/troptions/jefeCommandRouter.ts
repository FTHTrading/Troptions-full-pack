import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";
import { JEFE_ROUTING_REGISTRY } from "@/content/troptions/jefeRoutingRegistry";

export function routeJefeCommand(input: string) {
  const lower = input.toLowerCase();
  const quick = JEFE_COMMAND_REGISTRY.find((command) => lower.includes(command.prompt.toLowerCase()));
  if (quick) {
    return {
      commandId: quick.id,
      routedAgent: quick.routedAgents[0] ?? "jefe",
      sources: quick.sources,
    };
  }

  const keywordMatch = JEFE_ROUTING_REGISTRY.find((route) => lower.includes(route.keyword));
  return {
    commandId: "jefe.dynamic",
    routedAgent: keywordMatch?.routedAgent ?? "jefe",
    sources: ["jefe-routing-registry"],
  };
}
