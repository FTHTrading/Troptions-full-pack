import { assertNoCriticalBannedTerms } from "@/content/troptions/claimRegistry";

describe("assertNoCriticalBannedTerms — term-level guards", () => {
  // These terms come directly from CRITICAL-level claims' prohibitedTerms arrays in claimRegistry.ts
  const PROHIBITED_TERMS = [
    "gold-backed",
    "gold reserves confirmed",
    "backed by physical gold",
    "guaranteed APY",
    "staking returns",
    "passive income",
    "price appreciation",
    "increases in value",
    "fully reserved",
    "100% backed",
    "instant liquidity",
    "scarcity value",
    "fixed supply drives value",
    "balance sheet enhancement",
    "stablecoin",
  ];

  for (const term of PROHIBITED_TERMS) {
    it(`throws when text contains: "${term}"`, () => {
      expect(() => assertNoCriticalBannedTerms(`Our product offers ${term} benefits`)).toThrow();
    });
  }

  const SAFE_PHRASES = [
    "Troptions is a barter utility instrument",
    "Troptions Pay may be used in peer-to-peer barter transactions",
    "Token value may fluctuate; no return is implied",
    "Past performance does not indicate future results",
  ];

  for (const phrase of SAFE_PHRASES) {
    it(`does not throw on safe phrase: "${phrase.slice(0, 50)}..."`, () => {
      expect(() => assertNoCriticalBannedTerms(phrase)).not.toThrow();
    });
  }
});
