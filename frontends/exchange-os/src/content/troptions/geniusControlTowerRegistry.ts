import {
  GENIUS_GATES,
  GENIUS_NAMESPACES,
  GENIUS_PROFILE,
  PARTNER_REGISTRY,
  TROP_USD_SIM_TOKEN,
  calculateReadinessScore,
  createPacketSummary,
  getGeniusOverview,
  getMerchantSettlementMap,
  renderPacketMarkdown,
} from "@/lib/troptions/genius";

export const GENIUS_CONTROL_TOWER_REGISTRY = {
  profile: GENIUS_PROFILE,
  token: TROP_USD_SIM_TOKEN,
  gates: GENIUS_GATES,
  partners: PARTNER_REGISTRY,
  namespaces: GENIUS_NAMESPACES,
  overview: getGeniusOverview(GENIUS_PROFILE, GENIUS_GATES),
  readiness: calculateReadinessScore(GENIUS_GATES),
  merchantSettlementMap: getMerchantSettlementMap(),
  exports: {
    partnerPacket: renderPacketMarkdown(
      createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions Partner Readiness Packet", "partner_ready"),
    ),
    regulatorPacket: renderPacketMarkdown(
      createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions Regulator Readiness Packet", "regulator_ready"),
    ),
    boardPacket: renderPacketMarkdown(
      createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions Board Approval Packet", "board_review"),
    ),
    merchantPacket: renderPacketMarkdown(
      createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions Merchant Settlement Packet", "sandbox_ready"),
    ),
    rwaPacket: renderPacketMarkdown(
      createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions RWA Guardrail Packet", "guardrail_review"),
    ),
  },
};