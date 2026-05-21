import { XRPL_IOU_EXPLAINER } from "@/content/troptions/xrplIouRegistry";
import { XRPL_SIGNING_KEY_EXPLAINER } from "@/content/troptions/xrplSigningKeyRegistry";
import {
  XRPL_CONTROL_KEY_QUESTION,
  XRPL_FORENSICS_TIMELINE,
  XRPL_KNOWN_ISSUE_PLAIN_ENGLISH,
} from "@/content/troptions/walletForensicsRegistry";

export function getPlainEnglishSummary() {
  return {
    whereDid81XrpGo: XRPL_KNOWN_ISSUE_PLAIN_ENGLISH,
    keyControlQuestion: XRPL_CONTROL_KEY_QUESTION,
    timeline: XRPL_FORENSICS_TIMELINE,
    suspiciousRegularKeys: [
      "rpKmcC1PevAxTBRQgkYtakdGVup2K2Luqh",
      "rJpKvdn64acBnVGNQ873JpQKujA4TAVbfN",
      "rK3SFG4BVWJyNjbMDeEJcEMoRG51ax2CGR",
    ] as const,
    iouExplainer: XRPL_IOU_EXPLAINER,
    signingKeyExplainer: XRPL_SIGNING_KEY_EXPLAINER,
  };
}
