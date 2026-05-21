/**
 * TROPTIONS Proof Room — Approved Copy Blocks
 */

import type { TroptionsApprovedCopyBlock } from "./types";

export function getMockApprovedCopy(): TroptionsApprovedCopyBlock[] {
  return [
    {
      id: "copy-001",
      blockName: "TROPTIONS Core Identity",
      purpose: "Website, press releases, marketing materials",
      approvedText:
        "TROPTIONS is a utility-based digital asset with a history of merchant adoption and a next-generation infrastructure platform for digital commerce.",
      disclaimer: null,
      publicUseStatus: "approved_public",
      reviewedAt: new Date().toISOString(),
      notes: "Core identity statement. Safe for general use.",
    },
    {
      id: "copy-002",
      blockName: "TROPTIONS Software Platform",
      purpose: "Technical documentation, platform overview",
      approvedText:
        "The TROPTIONS platform provides a modular software infrastructure including namespace management, payout operations, audit trails, and a proof room for evidence-backed claims.",
      disclaimer:
        "The TROPTIONS platform is currently in software-build verification phase. Live production operations require provider configuration and compliance review.",
      publicUseStatus: "approved_with_disclaimer",
      reviewedAt: new Date().toISOString(),
      notes: "Use with disclaimer for public communication.",
    },
    {
      id: "copy-003",
      blockName: "TROPTIONS PayOps",
      purpose: "Product description, demos",
      approvedText:
        "TROPTIONS PayOps is a software module for managing payout operations including payee records, batch management, compliance checks, and receipt generation.",
      disclaimer:
        "Live payout execution requires a production-ready payment provider. TROPTIONS is not a payment processor.",
      publicUseStatus: "approved_with_disclaimer",
      reviewedAt: new Date().toISOString(),
      notes: "Always include provider disclaimer.",
    },
  ];
}
