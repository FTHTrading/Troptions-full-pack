import {
  CHANGE_NOW_SUPPORT_TEMPLATE,
  XRPL_CONTROL_KEY_QUESTION,
  XRPL_FORENSICS_TIMELINE,
} from "@/content/troptions/walletForensicsRegistry";
import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";
import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";
import { XRPL_TRANSACTION_REGISTRY } from "@/content/troptions/xrplTransactionRegistry";
import { XRPL_TRUSTLINE_EXPLAINER } from "@/content/troptions/xrplTrustlineForensicsRegistry";
import { XRPL_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/xrplWalletInventoryRegistry";

export interface WalletForensicsReport {
  readonly executiveSummary: string;
  readonly keyControlQuestion: string;
  readonly walletInventory: readonly string[];
  readonly timeline: readonly string[];
  readonly nativeXrpMovements: readonly string[];
  readonly iouMovements: readonly string[];
  readonly exchangeDeposits: readonly string[];
  readonly destinationTags: readonly string[];
  readonly trustlineChanges: readonly string[];
  readonly nftActivity: readonly string[];
  readonly signingKeyChanges: readonly string[];
  readonly riskNotes: readonly string[];
  readonly nextActions: readonly string[];
  readonly supportTemplates: readonly string[];
}

export function buildWalletForensicsReport(): WalletForensicsReport {
  const nativeXrp = XRPL_TRANSACTION_REGISTRY.filter((tx) => tx.nativeOrIou === "native")
    .map((tx) => `${tx.txHash}: ${tx.deliveredAmount} ${tx.currency} ${tx.from} -> ${tx.to}`);

  const iou = XRPL_IOU_REGISTRY.map((item) => `${item.currency}: ${item.note}`);

  const deposits = XRPL_EXCHANGE_DEPOSIT_REGISTRY.map(
    (item) => `${item.exchangeName} deposit ${item.amount} ${item.currency} tag ${item.destinationTag}`,
  );

  return {
    executiveSummary:
      "Read-only XRPL wallet forensics indicates the known 81.417325 XRP movement was a destination-tagged exchange deposit to ChangeNOW.",
    keyControlQuestion: XRPL_CONTROL_KEY_QUESTION,
    walletInventory: XRPL_WALLET_INVENTORY_REGISTRY.map((wallet) => `${wallet.label} (${wallet.address})`),
    timeline: XRPL_FORENSICS_TIMELINE,
    nativeXrpMovements: nativeXrp,
    iouMovements: iou,
    exchangeDeposits: deposits,
    destinationTags: XRPL_EXCHANGE_DEPOSIT_REGISTRY.map((item) => `${item.txHash} -> ${item.destinationTag}`),
    trustlineChanges: XRPL_TRUSTLINE_EXPLAINER.bullets,
    nftActivity: ["No NFT forensics records loaded in starter dataset."],
    signingKeyChanges: XRPL_WALLET_INVENTORY_REGISTRY.filter((w) => w.masterKeyStatus === "disabled")
      .map((w) => `${w.address}: master key disabled; verify regular key controls.`),
    riskNotes: [
      "Distinguish native XRP from issued-currency IOUs.",
      "Exchange-internal routing after destination-tagged deposit requires support lookup.",
      "Failed AccountDelete tecHAS_OBLIGATIONS indicates unresolved ledger objects (for example trustlines/offers/other obligations).",
      "Do not expose or collect private keys, seeds, or mnemonics.",
    ],
    nextActions: [
      "Submit support template to ChangeNOW with tx hash and destination tag.",
      "Verify payout asset and destination from exchange order mapping.",
      "If payout failed, request refund workflow from exchange support.",
    ],
    supportTemplates: [CHANGE_NOW_SUPPORT_TEMPLATE],
  };
}

export function renderWalletForensicsReportHtml(report: WalletForensicsReport): string {
  const renderList = (items: readonly string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Troptions Wallet Forensics Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
      h1, h2 { color: #0b1f36; }
      section { margin-bottom: 20px; }
      .warn { background: #fff7ed; border-left: 4px solid #f59e0b; padding: 12px; }
      pre { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <h1>Troptions Wallet Forensics Report</h1>
    <section><h2>1. Executive summary</h2><p>${report.executiveSummary}</p></section>
    <section class="warn"><h2>2. Key control question</h2><p>${report.keyControlQuestion}</p></section>
    <section><h2>3. Wallet inventory</h2>${renderList(report.walletInventory)}</section>
    <section><h2>4. Timeline</h2>${renderList(report.timeline)}</section>
    <section><h2>5. Native XRP movements</h2>${renderList(report.nativeXrpMovements)}</section>
    <section><h2>6. IOU movements</h2>${renderList(report.iouMovements)}</section>
    <section><h2>7. Exchange deposits</h2>${renderList(report.exchangeDeposits)}</section>
    <section><h2>8. Destination tags</h2>${renderList(report.destinationTags)}</section>
    <section><h2>9. Trustline changes</h2>${renderList(report.trustlineChanges)}</section>
    <section><h2>10. NFT activity</h2>${renderList(report.nftActivity)}</section>
    <section><h2>11. Signing key changes</h2>${renderList(report.signingKeyChanges)}</section>
    <section class="warn"><h2>12. Risk notes</h2>${renderList(report.riskNotes)}</section>
    <section><h2>13. Next actions</h2>${renderList(report.nextActions)}</section>
    <section><h2>14. Support templates</h2><pre>${report.supportTemplates.join("\n\n")}</pre></section>
  </body>
</html>`;
}
