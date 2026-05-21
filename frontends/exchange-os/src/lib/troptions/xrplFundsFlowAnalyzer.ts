import { XRPL_FUNDS_FLOW_REGISTRY } from "@/content/troptions/xrplFundsFlowRegistry";
import { XRPL_TRANSACTION_REGISTRY } from "@/content/troptions/xrplTransactionRegistry";

export interface FundsFlowEdge {
  readonly txHash: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly currency: string;
  readonly destinationTag?: string;
  readonly explanation: string;
}

export function getFundsFlowEdges(): readonly FundsFlowEdge[] {
  return XRPL_FUNDS_FLOW_REGISTRY.map((f) => ({
    txHash: f.txHash,
    from: f.from,
    to: f.to,
    amount: f.amount,
    currency: f.currency,
    destinationTag: f.destinationTag,
    explanation: f.explanation,
  }));
}

export function getFlowNarrative() {
  const tx = XRPL_TRANSACTION_REGISTRY.find(
    (item) => item.txHash === "84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47",
  );

  if (!tx) return "No known flow narrative available.";

  return `Native XRP payment delivered: ${tx.deliveredAmount} XRP from ${tx.from} to ${tx.to} with destination tag ${tx.destinationTag ?? "none"}.`;
}
