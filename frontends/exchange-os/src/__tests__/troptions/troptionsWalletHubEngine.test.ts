import { PDF_DOCUMENT_REGISTRY } from "@/lib/troptions/pdfDocumentRegistry";
import {
  createTransferIntent,
  generateWalletReceipt,
  getTroptionsWalletHubSnapshot,
  simulateTransfer,
  validateTransferIntent,
} from "@/lib/troptions/troptionsWalletHubEngine";

describe("troptions wallet hub engine", () => {
  it("defaults transfer intent to simulation", () => {
    const intent = createTransferIntent({
      fromWalletId: "troptions-xrpl-distribution",
      toWalletId: "troptions-xrpl-amm-pool",
      assetCode: "TROPTIONS",
      amount: "10",
      routeType: "XRPL_IOU_PAYMENT",
    });

    expect(intent.isSimulation).toBe(true);
    expect(intent.status).toBe("DRAFT");
    expect(intent.liveRequested).toBe(false);
  });

  it("blocks live signing by default when live is requested without gates", () => {
    const intent = createTransferIntent({
      fromWalletId: "troptions-xrpl-distribution",
      toWalletId: "troptions-xrpl-amm-pool",
      assetCode: "TROPTIONS",
      amount: "10",
      routeType: "XRPL_IOU_PAYMENT",
      liveRequested: true,
    });

    const validation = validateTransferIntent(intent);
    expect(validation.ok).toBe(false);
    expect(validation.liveAllowed).toBe(false);
    expect(validation.blockedReasons.join(" ")).toMatch(/approval|Runtime/i);
  });

  it("blocks transfer with insufficient balance", () => {
    const intent = createTransferIntent({
      fromWalletId: "troptions-xrpl-amm-pool",
      toWalletId: "troptions-xrpl-distribution",
      assetCode: "XRP",
      amount: "9999999",
      routeType: "XRPL_IOU_PAYMENT",
    });

    const simulated = simulateTransfer(intent);
    expect(simulated.status).toBe("BLOCKED");
    expect(simulated.blockedReasons.join(" ")).toMatch(/Insufficient asset balance/i);
  });

  it("does not expose secret terms in snapshot and receipt payloads", () => {
    const snapshot = getTroptionsWalletHubSnapshot();
    const intent = createTransferIntent({
      fromWalletId: "troptions-xrpl-distribution",
      toWalletId: "troptions-xrpl-amm-pool",
      assetCode: "TROPTIONS",
      amount: "10",
      routeType: "XRPL_IOU_PAYMENT",
    });
    const receipt = generateWalletReceipt({ intent });

    const payload = JSON.stringify({ snapshot, receipt }).toLowerCase();
    expect(payload).not.toContain("seed");
    expect(payload).not.toContain("privatekey");
    expect(payload).not.toContain("mnemonic");
    expect(payload).not.toContain("secretkey");
  });

  it("generates receipt data for transfer intents", () => {
    const intent = createTransferIntent({
      fromWalletId: "troptions-xrpl-distribution",
      toWalletId: "troptions-xrpl-amm-pool",
      assetCode: "TROPTIONS",
      amount: "25",
      routeType: "XRPL_IOU_PAYMENT",
    });
    const receipt = generateWalletReceipt({ intent });

    expect(receipt.transferId).toBe(intent.id);
    expect(receipt.simulated).toBe(true);
    expect(receipt.liveTxHash).toBeNull();
  });

  it("registers wallet hub PDF docs", () => {
    const ids = PDF_DOCUMENT_REGISTRY.map((d) => d.id);
    expect(ids).toContain("troptions-wallet-hub-guide");
    expect(ids).toContain("troptions-wallet-transfer-procedure");
    expect(ids).toContain("x402-mesh-pay-overview");
  });
});
