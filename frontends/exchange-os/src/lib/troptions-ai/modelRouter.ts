/**
 * Troptions Sovereign AI — Model Router
 *
 * Defines the model routing scaffold for Troptions AI systems.
 *
 * SAFETY INVARIANTS:
 * - No real API calls are made
 * - externalApiCallsEnabled is false by default
 * - All providers are placeholder stubs
 * - Sensitive data cannot route to external providers without explicit approval
 * - Unknown providers default to blocked
 * - All routing decisions are simulation-only
 */

import type { TroptionsKnowledgeSensitivity } from "@/content/troptions-ai/knowledgeVaultRegistry";

// ─── Provider Types ───────────────────────────────────────────────────────────

export type TroptionsModelProvider =
  | "troptions_placeholder"
  | "openai_placeholder"
  | "anthropic_placeholder"
  | "google_placeholder"
  | "ollama_local_placeholder"
  | "custom_private_model_placeholder";

// ─── Route ────────────────────────────────────────────────────────────────────

export interface TroptionsModelRoute {
  id: string;
  provider: TroptionsModelProvider;
  modelLabel: string;
  description: string;
  isExternal: boolean;
  isLocal: boolean;
  isAvailable: false;              // always false — simulation only
  requiresApproval: boolean;
  blockedSensitivities: TroptionsKnowledgeSensitivity[];
  simulationOnly: true;
  liveExecutionEnabled: false;
  externalApiCallsEnabled: false;
}

// ─── Policy ───────────────────────────────────────────────────────────────────

export interface TroptionsModelPolicy {
  id: string;
  name: string;
  rule: string;
  enforcement: "advisory" | "blocking";
}

// ─── Routing Decision ─────────────────────────────────────────────────────────

export interface TroptionsModelRoutingDecision {
  allowed: false;                  // all routing is blocked in simulation phase
  provider: TroptionsModelProvider | "blocked";
  routeId: string | null;
  blockers: string[];
  warnings: string[];
  simulationOnly: true;
  auditNote: string;
}

// ─── Available Routes (All Placeholders) ──────────────────────────────────────

export const MODEL_ROUTES: TroptionsModelRoute[] = [
  {
    id: "route-001",
    provider: "troptions_placeholder",
    modelLabel: "Troptions AI (Placeholder)",
    description: "Troptions-hosted AI model — placeholder pending infrastructure setup and Control Hub approval.",
    isExternal: false,
    isLocal: false,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: ["healthcare_restricted", "financial_restricted", "legal_restricted"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
  {
    id: "route-002",
    provider: "openai_placeholder",
    modelLabel: "OpenAI (Placeholder — External)",
    description: "OpenAI API route — placeholder. External API calls disabled by default. Requires Control Hub approval and explicit enable.",
    isExternal: true,
    isLocal: false,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: ["confidential", "regulated", "healthcare_restricted", "financial_restricted", "legal_restricted"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
  {
    id: "route-003",
    provider: "anthropic_placeholder",
    modelLabel: "Anthropic Claude (Placeholder — External)",
    description: "Anthropic API route — placeholder. External API calls disabled by default. Requires Control Hub approval and explicit enable.",
    isExternal: true,
    isLocal: false,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: ["confidential", "regulated", "healthcare_restricted", "financial_restricted", "legal_restricted"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
  {
    id: "route-004",
    provider: "google_placeholder",
    modelLabel: "Google Gemini (Placeholder — External)",
    description: "Google AI API route — placeholder. External API calls disabled by default. Requires Control Hub approval and explicit enable.",
    isExternal: true,
    isLocal: false,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: ["confidential", "regulated", "healthcare_restricted", "financial_restricted", "legal_restricted"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
  {
    id: "route-005",
    provider: "ollama_local_placeholder",
    modelLabel: "Ollama Local Model (Placeholder)",
    description: "Local Ollama model route — placeholder pending local infrastructure setup and client configuration.",
    isExternal: false,
    isLocal: true,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: ["healthcare_restricted"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
  {
    id: "route-006",
    provider: "custom_private_model_placeholder",
    modelLabel: "Custom Private Model (Placeholder)",
    description: "Client-hosted private model route — placeholder for future client infrastructure setup.",
    isExternal: false,
    isLocal: false,
    isAvailable: false,
    requiresApproval: true,
    blockedSensitivities: [],
    simulationOnly: true,
    liveExecutionEnabled: false,
    externalApiCallsEnabled: false,
  },
];

// ─── Model Policies ───────────────────────────────────────────────────────────

export const MODEL_POLICIES: TroptionsModelPolicy[] = [
  {
    id: "mp-001",
    name: "No External Calls Default",
    rule: "All external API calls are disabled by default. Activation requires explicit Control Hub approval.",
    enforcement: "blocking",
  },
  {
    id: "mp-002",
    name: "Sensitive Data External Block",
    rule: "Confidential, regulated, healthcare-restricted, financial-restricted, and legal-restricted knowledge cannot route to external providers without explicit approval.",
    enforcement: "blocking",
  },
  {
    id: "mp-003",
    name: "Unknown Provider Blocked",
    rule: "Any routing request for an unknown or unlisted provider defaults to blocked.",
    enforcement: "blocking",
  },
  {
    id: "mp-004",
    name: "Approval Required",
    rule: "All model routes require Control Hub approval before activation, regardless of provider type.",
    enforcement: "blocking",
  },
  {
    id: "mp-005",
    name: "Simulation Only",
    rule: "All routing decisions are simulation-only in this phase. No live inference calls are made.",
    enforcement: "blocking",
  },
];

// ─── Router Function ──────────────────────────────────────────────────────────

export function routeModel(
  requestedProvider: string,
  dataSensitivity: TroptionsKnowledgeSensitivity,
  externalApiCallsEnabled: boolean
): TroptionsModelRoutingDecision {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Always blocked — simulation only
  blockers.push("All model routing is simulation-only. No live inference calls are made.");

  // Check if provider is known
  const route = MODEL_ROUTES.find((r) => r.provider === requestedProvider);
  if (!route) {
    blockers.push(`Unknown provider '${requestedProvider}' is blocked by default.`);
    return {
      allowed: false,
      provider: "blocked",
      routeId: null,
      blockers,
      warnings,
      simulationOnly: true,
      auditNote: `Routing blocked: unknown provider '${requestedProvider}' requested for sensitivity '${dataSensitivity}'.`,
    };
  }

  // Check external calls flag
  if (route.isExternal && !externalApiCallsEnabled) {
    blockers.push(`External API calls are disabled. Provider '${route.provider}' requires explicit Control Hub approval to enable external calls.`);
  }

  // Check sensitivity restrictions
  if (route.blockedSensitivities.includes(dataSensitivity)) {
    blockers.push(`Data sensitivity '${dataSensitivity}' is blocked for provider '${route.provider}'.`);
  }

  // Warnings for high-sensitivity data
  if (dataSensitivity === "regulated" || dataSensitivity === "confidential") {
    warnings.push(`Routing ${dataSensitivity} data requires compliance review before production use.`);
  }

  return {
    allowed: false,
    provider: route.provider,
    routeId: route.id,
    blockers,
    warnings,
    simulationOnly: true,
    auditNote: `Routing simulation: provider '${route.provider}' requested for sensitivity '${dataSensitivity}'. Blocked (simulation-only phase).`,
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getRouteByProvider(provider: TroptionsModelProvider): TroptionsModelRoute | undefined {
  return MODEL_ROUTES.find((r) => r.provider === provider);
}

export function getProviderLabel(provider: TroptionsModelProvider | "blocked"): string {
  if (provider === "blocked") return "Blocked";
  const route = getRouteByProvider(provider);
  return route?.modelLabel ?? provider.replace(/_/g, " ");
}
