import { getFlowNarrative, getFundsFlowEdges } from "@/lib/troptions/xrplFundsFlowAnalyzer";

describe("xrpl funds flow analyzer", () => {
  it("returns flow edges that include the known 81.417325 XRP transfer", () => {
    const edges = getFundsFlowEdges();
    const keyEdge = edges.find(
      (edge) => edge.txHash === "84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47",
    );

    expect(keyEdge).toBeDefined();
    expect(keyEdge?.amount).toBe("81.417325");
    expect(keyEdge?.currency).toBe("XRP");
    expect(keyEdge?.destinationTag).toBe("614122458");
  });

  it("includes destination-tag explanation in the flow narrative", () => {
    const narrative = getFlowNarrative();

    expect(narrative).toContain("81.417325 XRP");
    expect(narrative).toContain("destination tag 614122458");
  });
});
