import type { ComplianceGate, PacketSummary, TroptionsGeniusProfile } from "@/lib/troptions/genius/types";
import { createRegulatorPacketSummary } from "@/lib/troptions/genius/readiness";

export function createPacketSummary(profile: TroptionsGeniusProfile, gates: ComplianceGate[], title: string, status: string): PacketSummary {
  const base = createRegulatorPacketSummary(profile, gates);
  return {
    ...base,
    title,
    status,
  };
}

export function renderPacketMarkdown(packet: PacketSummary, repoCommitHash = "unavailable"): string {
  return [
    `# ${packet.title}`,
    "",
    `- Date generated: ${packet.generatedAt}`,
    `- Repo commit hash: ${repoCommitHash}`,
    `- Status: ${packet.status}`,
    `- Readiness score: sandbox ${packet.readinessScore.sandboxScore}, partner ${packet.readinessScore.partnerScore}, regulator ${packet.readinessScore.regulatorScore}, live ${packet.readinessScore.liveScore}`,
    "",
    "## Approved Gates",
    ...packet.approvedGates.map((gate) => `- ${gate}`),
    "",
    "## Missing Gates",
    ...packet.missingGates.map((gate) => `- ${gate}`),
    "",
    "## Blockers",
    ...packet.blockers.map((blocker) => `- ${blocker}`),
    "",
    "## Next Actions",
    ...packet.nextActions.map((item) => `- ${item}`),
    "",
    "## Legal Disclaimer",
    packet.legalDisclaimer,
    "",
    "## Live Issuance Blocked Notice",
    packet.liveIssuanceBlockedNotice,
    "",
  ].join("\n");
}