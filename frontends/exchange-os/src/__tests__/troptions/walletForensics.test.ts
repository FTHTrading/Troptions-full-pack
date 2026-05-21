import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";
import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";
import { CHANGE_NOW_SUPPORT_TEMPLATE } from "@/content/troptions/walletForensicsRegistry";
import { classifyXrplTransaction } from "@/lib/troptions/xrplTransactionClassifier";
import { buildWalletForensicsReport } from "@/lib/troptions/walletForensicsReportBuilder";

describe("wallet forensics domain", () => {
  it("classifies destination-tagged native XRP transfers to known exchange accounts as exchange deposits", () => {
    const classification = classifyXrplTransaction({
      currency: "XRP",
      classification: "unknown",
      to: "rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE",
      destinationTag: "614122458",
      nativeOrIou: "native",
    });

    expect(classification).toBe("exchange-deposit");
  });

  it("keeps IOU semantics separate from native XRP", () => {
    const classification = classifyXrplTransaction({
      currency: "USD",
      classification: "unknown",
      to: "rExampleIouReceiver",
      destinationTag: undefined,
      nativeOrIou: "iou",
    });

    expect(classification).toBe("issued-currency-iou");
    expect(XRPL_IOU_REGISTRY.length).toBeGreaterThan(0);
  });

  it("preserves exchange destination tags and includes support template in reports", () => {
    const report = buildWalletForensicsReport();
    const deposit = XRPL_EXCHANGE_DEPOSIT_REGISTRY[0];

    expect(deposit.destinationTag).toBe("614122458");
    expect(report.destinationTags.join("\n")).toContain("614122458");
    expect(report.supportTemplates[0]).toContain("ChangeNOW");
    expect(report.supportTemplates[0]).toContain("84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47");
    expect(CHANGE_NOW_SUPPORT_TEMPLATE).toContain("Destination tag");
  });
});
