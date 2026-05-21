import { validateReadOnlyPayload } from "@/lib/troptions/walletForensicsApiGuards";

describe("wallet forensics API safety guards", () => {
  it("rejects payloads that contain private-key or mnemonic fields", () => {
    const violations = validateReadOnlyPayload({
      address: "rExample",
      privateKey: "super-secret",
      nested: {
        mnemonic: "word word word",
      },
    });

    expect(violations.length).toBeGreaterThanOrEqual(2);
    expect(violations.join("\n")).toMatch(/Sensitive field rejected/i);
  });

  it("rejects payloads that request signing or fund movement", () => {
    const violations = validateReadOnlyPayload({
      note: "Please sign and submit this transfer",
      action: "move funds now",
    });

    expect(violations.length).toBeGreaterThan(0);
    expect(violations.join("\n")).toMatch(/Forbidden action text detected/i);
  });

  it("accepts normal read-only forensic payloads", () => {
    const violations = validateReadOnlyPayload({
      wallet: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
      txHash: "84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47",
      destinationTag: "614122458",
      mode: "forensic-read-only",
    });

    expect(violations).toHaveLength(0);
  });
});
