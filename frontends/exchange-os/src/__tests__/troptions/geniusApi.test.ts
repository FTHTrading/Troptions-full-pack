import { POST as evaluateAction } from "@/app/api/genius/evaluate-action/route";
import { POST as simulateMint } from "@/app/api/genius/simulate-mint/route";
import { POST as simulateRedemption } from "@/app/api/genius/simulate-redemption/route";
import {
  GENIUS_GATES,
  GENIUS_NAMESPACES,
  GENIUS_PROFILE,
  createPacketSummary,
  evaluateRwaPrivateMarketLanguage,
  evaluateStablecoinAction,
  normalizePartnerRecord,
  renderPacketMarkdown,
} from "@/lib/troptions/genius";

describe("GENIUS stablecoin and readiness layer", () => {
  it("default status blocks live issuance", () => {
    const decision = evaluateStablecoinAction(GENIUS_PROFILE, GENIUS_GATES, "live_mint");
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toMatch(/licensed|partnered/i);
  });

  it("API action evaluation blocks live_mint", async () => {
    const response = await evaluateAction(
      new Request("http://localhost/api/genius/evaluate-action", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "live_mint" }),
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.allowed).toBe(false);
    expect(body.risk_rating).toBe("critical");
  });

  it("sandbox simulator does not create live ledger entries", async () => {
    const namespace = GENIUS_NAMESPACES.find((item) => item.namespaceType === "member");
    const response = await simulateMint(
      new Request("http://localhost/api/genius/simulate-mint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memberNamespace: namespace?.namespaceId, amount: "25.00" }),
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.event.status).toBe("simulated_only");
    expect(body.event.tokenSymbol).toBe("TROP-USD-SIM");
    expect(JSON.stringify(body)).not.toMatch(/live_enabled|minted_live/i);
  });

  it("missing reserve attestation blocks live readiness", () => {
    const decision = evaluateStablecoinAction(GENIUS_PROFILE, GENIUS_GATES, "live_burn");
    expect(decision.reasons.join(" ")).toMatch(/reserve attestation/i);
  });

  it("missing regulator approval blocks live readiness", () => {
    const decision = evaluateStablecoinAction(GENIUS_PROFILE, GENIUS_GATES, "live_redemption");
    expect(decision.reasons.join(" ")).toMatch(/regulator approval/i);
  });

  it("missing KYC/KYB blocks namespace settlement", () => {
    const blockedNamespace = {
      ...GENIUS_NAMESPACES[0],
      kycStatus: "missing" as const,
      kybStatus: "missing" as const,
    };
    const decision = evaluateStablecoinAction(GENIUS_PROFILE, GENIUS_GATES, "simulate_mint", blockedNamespace);
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toMatch(/mock-approved/i);
  });

  it("tokenized deposit lane is separate from stablecoin lane", () => {
    expect(GENIUS_PROFILE.issuerMode).toBe("sandbox_simulation");
    expect(GENIUS_PROFILE.liveActionsEnabled).toBe(false);
  });

  it("RWA/private market guardrail blocks yield and guarantee language", () => {
    const result = evaluateRwaPrivateMarketLanguage("This RWA stablecoin offers guaranteed yield and guaranteed redemption.");
    expect(result.blocked).toBe(true);
    expect(result.requiredReview).toBe("legal_and_securities_review");
  });

  it("partner registry handles missing partner data", () => {
    const partner = normalizePartnerRecord({ name: undefined, summary: undefined });
    expect(partner.name).toBe("Unassigned partner candidate");
    expect(partner.readiness).toBe("missing");
    expect(partner.allowedForLive).toBe(false);
  });

  it("export packet includes blockers", () => {
    const packet = createPacketSummary(GENIUS_PROFILE, GENIUS_GATES, "Troptions Partner Packet", "partner_ready");
    const markdown = renderPacketMarkdown(packet, "abc123");
    expect(packet.blockers.length).toBeGreaterThan(0);
    expect(markdown).toMatch(/Blockers/);
    expect(markdown).toMatch(/Live Issuance Blocked Notice/);
  });

  it("sandbox redemption remains simulated only", async () => {
    const response = await simulateRedemption(
      new Request("http://localhost/api/genius/simulate-redemption", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memberNamespace: "member-001", amount: "10.00" }),
      }),
    );
    const body = await response.json();
    expect(body.redemption.status).toBe("simulated_only");
    expect(body.redemption.blockedLiveReason).toMatch(/blocked/i);
  });
});