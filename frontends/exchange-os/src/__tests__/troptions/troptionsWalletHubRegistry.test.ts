import { TROPTIONS_WALLET_HUB_REGISTRY } from "@/content/troptions/troptionsWalletHubRegistry";

describe("troptions wallet hub registry", () => {
  it("contains XRPL issuer wallet", () => {
    expect(
      TROPTIONS_WALLET_HUB_REGISTRY.find(
        (w) => w.id === "troptions-xrpl-issuer" && w.address === "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
      ),
    ).toBeDefined();
  });

  it("contains XRPL distribution wallet", () => {
    expect(
      TROPTIONS_WALLET_HUB_REGISTRY.find(
        (w) => w.id === "troptions-xrpl-distribution" && w.address === "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
      ),
    ).toBeDefined();
  });

  it("contains Stellar distribution wallet", () => {
    expect(
      TROPTIONS_WALLET_HUB_REGISTRY.find(
        (w) =>
          w.id === "troptions-stellar-distribution" &&
          w.address === "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      ),
    ).toBeDefined();
  });

  it("contains operator profile", () => {
    expect(
      TROPTIONS_WALLET_HUB_REGISTRY.find(
        (w) => w.id === "troptions-operator-profile" && w.ownerName === "TROPTIONS Chairman",
      ),
    ).toBeDefined();
  });
});
