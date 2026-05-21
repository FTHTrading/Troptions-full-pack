import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { CUSTODY_WORKFLOW } from "@/content/troptions/custodyWorkflow";
import { EXCEPTION_REGISTRY, hasOpenExceptionsForSubject } from "@/content/troptions/exceptionRegistry";
import { FUNDING_ROUTE_REGISTRY, assertFundingRouteCanActivate } from "@/content/troptions/fundingRouteRegistry";
import { INVESTOR_READINESS, isInvestorOperationallyReady } from "@/content/troptions/investorReadiness";
import {
  cannotIssueAsset,
  getAssetReadiness,
  getClaimReadiness,
  getProofPackageStatus,
  isReadyForFunding,
  isReadyForIssuance,
  isReadyForSettlement,
  assertStableUnitLaunchAllowed,
  hasCustodyApproval,
} from "@/content/troptions/readinessScoring";

describe("Phase 3 - Troptions Institutional Execution Layer", () => {
  it("asset readiness blocks issuance below required scores", () => {
    const firstAsset = getAssetReadiness("ASSET-TPAY-001");
    expect(firstAsset).toBeDefined();
    expect(cannotIssueAsset("ASSET-TPAY-001")).toBe(true);
  });

  it("claim readiness blocks unsupported claims", () => {
    const blockedClaim = CLAIM_REGISTRY.find((claim) => claim.evidenceStatus === "missing");
    expect(blockedClaim).toBeDefined();
    const readiness = getClaimReadiness(blockedClaim!.id);
    expect(readiness).toBeDefined();
    expect(readiness!.readinessStatus).toBe("blocked");
    expect(readiness!.blockers).toContain("claim-evidence-missing");
  });

  it("proof package status returns missing evidence", () => {
    const status = getProofPackageStatus("POA-001");
    expect(status).toBeDefined();
    expect(status!.missingEvidence.length).toBeGreaterThan(0);
    expect(status!.readinessStatus).toBe("evidence-needed");
  });

  it("custody review blocks assets without custodian approval", () => {
    const blockedCustody = CUSTODY_WORKFLOW.find((item) => !item.custodianApproval);
    expect(blockedCustody).toBeDefined();
    expect(hasCustodyApproval(blockedCustody!.assetId)).toBe(false);
  });

  it("board approval blocks funding release", () => {
    const route = FUNDING_ROUTE_REGISTRY.find((item) => item.boardApprovalStatus !== "approved");
    expect(route).toBeDefined();
    expect(isReadyForFunding(route!.routeId)).toBe(false);
    expect(() => assertFundingRouteCanActivate(route!)).toThrow();
  });

  it("stable unit public launch requires licensing approval", () => {
    expect(assertStableUnitLaunchAllowed("SU-TROP-USD-001")).toBe(false);
  });

  it("investor readiness requires KYC/sanctions/accreditation/docs/wallet allowlist", () => {
    const pendingInvestor = INVESTOR_READINESS.find((item) => item.subjectId === "INV-002");
    expect(pendingInvestor).toBeDefined();
    expect(isInvestorOperationallyReady(pendingInvestor!)).toBe(false);
  });

  it("funding route cannot activate without legal approval", () => {
    const routeWithoutLegal = FUNDING_ROUTE_REGISTRY.find((route) => route.legalStatus !== "approved");
    expect(routeWithoutLegal).toBeDefined();
    expect(() => assertFundingRouteCanActivate(routeWithoutLegal!)).toThrow();
  });

  it("settlement readiness requires custody, proof, and legal approval", () => {
    expect(isReadyForSettlement("ASSET-TPAY-001")).toBe(false);
  });

  it("exceptions prevent approval until resolved", () => {
    const openException = EXCEPTION_REGISTRY.find((item) => item.status !== "resolved");
    expect(openException).toBeDefined();
    expect(hasOpenExceptionsForSubject(openException!.subjectId)).toBe(true);
    expect(isReadyForIssuance(openException!.subjectId)).toBe(false);
  });
});
