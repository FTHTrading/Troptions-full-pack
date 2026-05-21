/**
 * TROPTIONS Proof Room — Regulatory History Records
 */

import type { TroptionsRegulatoryRecord } from "./types";

export function getMockRegulatoryRecords(): TroptionsRegulatoryRecord[] {
  return [
    {
      id: "reg-001",
      title: "TROPTIONS Regulatory Status — General Position",
      jurisdiction: "United States",
      date: "2024-01-01",
      recordType: "correspondence",
      summary:
        "TROPTIONS is a utility token with merchant-adoption history. No specific registration or exemption has been publicly filed at this time.",
      status: "under_review",
      publicDisclosureRequired: false,
      riskNotes:
        "Regulatory framework for utility tokens is evolving. Legal review recommended before public claims about regulatory status.",
      approvedPublicLanguage:
        "TROPTIONS is a utility-based digital asset. Its regulatory classification is subject to ongoing legal review.",
      internalNotes:
        "No SEC registration. No specific exemption on file. Legal counsel review required before any public regulatory claim.",
    },
  ];
}

export function getPublicRegulatoryLanguage(record: TroptionsRegulatoryRecord): string {
  return record.approvedPublicLanguage;
}
