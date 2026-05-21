import TroptionsGeniusControlTowerPage from "@/app/troptions/genius-control-tower/page";
import { GENIUS_CONTROL_TOWER_REGISTRY } from "@/content/troptions/geniusControlTowerRegistry";

describe("GENIUS control tower registry and page", () => {
  it("keeps live issuance blocked in the overview registry", () => {
    expect(GENIUS_CONTROL_TOWER_REGISTRY.overview.liveIssuanceStatus).toBe("blocked");
    expect(GENIUS_CONTROL_TOWER_REGISTRY.profile.liveActionsEnabled).toBe(false);
  });

  it("renders a page tree", () => {
    const page = TroptionsGeniusControlTowerPage();
    expect(page).toBeTruthy();
  });

  it("contains merchant settlement entries requiring licensed issuer before live money movement", () => {
    expect(
      GENIUS_CONTROL_TOWER_REGISTRY.merchantSettlementMap.every(
        (item) => item.requiresLicensedIssuerBeforeLiveMoneyMovement,
      ),
    ).toBe(true);
  });
});