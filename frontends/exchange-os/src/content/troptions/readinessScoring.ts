import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { PROOF_REGISTRY } from "@/content/troptions/proofRegistry";
import { CUSTODY_WORKFLOW } from "@/content/troptions/custodyWorkflow";
import { FUNDING_ROUTE_REGISTRY } from "@/content/troptions/fundingRouteRegistry";
import { STABLE_UNIT_REGISTRY } from "@/content/troptions/stableUnitRegistry";
import { INVESTOR_READINESS, isInvestorOperationallyReady } from "@/content/troptions/investorReadiness";
import { EXCEPTION_REGISTRY, hasOpenExceptionsForSubject } from "@/content/troptions/exceptionRegistry";

export type ReadinessStatus =
	| "not-started"
	| "intake"
	| "evidence-needed"
	| "legal-review"
	| "custody-review"
	| "board-review"
	| "ready-for-funding"
	| "ready-for-issuance"
	| "ready-for-settlement"
	| "approved"
	| "blocked"
	| "rejected";

export interface ReadinessScore {
	subjectId: string;
	subjectType: string;
	legalScore: number;
	custodyScore: number;
	proofScore: number;
	complianceScore: number;
	fundingScore: number;
	settlementScore: number;
	disclosureScore: number;
	boardApprovalScore: number;
	totalScore: number;
	readinessStatus: ReadinessStatus;
	blockers: string[];
	nextActions: string[];
}

function scoreFromApproval(status: string): number {
	if (status === "approved" || status === "active") return 100;
	if (status === "evaluation" || status === "pending") return 55;
	if (status === "partial") return 65;
	if (status === "not-started") return 35;
	return 20;
}

function clampScore(value: number): number {
	return Math.max(0, Math.min(100, value));
}

export const READINESS_SCORING: ReadinessScore[] = ASSET_REGISTRY.map((asset) => {
	const legalScore = scoreFromApproval(asset.legalStatus);
	const custodyScore = scoreFromApproval(asset.custodyStatus);
	const proofScore = scoreFromApproval(asset.proofStatus);
	const complianceScore = scoreFromApproval(asset.complianceStatus);
	const fundingScore = scoreFromApproval(asset.fundingStatus);
	const settlementScore = Math.round((legalScore + custodyScore + proofScore) / 3);
	const disclosureScore = clampScore(100 - asset.riskScore * 7);
	const boardApprovalScore = scoreFromApproval(asset.boardApprovalStatus);

	const blockers: string[] = [];
	const nextActions: string[] = [asset.nextAction];

	if (legalScore < 80) blockers.push("legal-score-below-80");
	if (custodyScore < 80) blockers.push("custody-score-below-80");
	if (proofScore < 80) blockers.push("proof-score-below-80");
	if (settlementScore < 80) blockers.push("settlement-score-below-80");
	if (boardApprovalScore < 80) blockers.push("board-approval-required");
	if (hasOpenExceptionsForSubject(asset.assetId)) blockers.push("open-exception-present");

	let readinessStatus: ReadinessStatus = "intake";
	if (blockers.includes("legal-score-below-80")) readinessStatus = "legal-review";
	else if (blockers.includes("custody-score-below-80")) readinessStatus = "custody-review";
	else if (blockers.includes("proof-score-below-80")) readinessStatus = "evidence-needed";
	else if (boardApprovalScore < 80) readinessStatus = "board-review";
	else if (fundingScore >= 80) readinessStatus = "ready-for-funding";
	else readinessStatus = "ready-for-issuance";

	if (blockers.length > 0) {
		readinessStatus = blockers.includes("open-exception-present") ? "blocked" : readinessStatus;
	}

	const totalScore = Math.round(
		(legalScore + custodyScore + proofScore + complianceScore + fundingScore + settlementScore + disclosureScore + boardApprovalScore) / 8,
	);

	return {
		subjectId: asset.assetId,
		subjectType: "asset",
		legalScore,
		custodyScore,
		proofScore,
		complianceScore,
		fundingScore,
		settlementScore,
		disclosureScore,
		boardApprovalScore,
		totalScore,
		readinessStatus,
		blockers,
		nextActions,
	};
});

export function getAssetReadiness(assetId: string): ReadinessScore | undefined {
	return READINESS_SCORING.find((item) => item.subjectId === assetId);
}

export function getClaimReadiness(claimId: string): {
	subjectId: string;
	readinessStatus: ReadinessStatus;
	blockers: string[];
	nextActions: string[];
} | undefined {
	const claim = CLAIM_REGISTRY.find((item) => item.id === claimId);
	if (!claim) return undefined;

	const blockers: string[] = [];
	if (claim.evidenceStatus === "missing" || claim.evidenceStatus === "not-started") {
		blockers.push("claim-evidence-missing");
	}
	if (claim.legalStatus !== "approved" && claim.riskLevel === "CRITICAL") {
		blockers.push("critical-claim-legal-review-required");
	}
	if (claim.publishStatus === "blocked") blockers.push("claim-publish-blocked");
	if (hasOpenExceptionsForSubject(claim.id)) blockers.push("open-exception-present");

	return {
		subjectId: claim.id,
		readinessStatus: blockers.length > 0 ? "blocked" : "approved",
		blockers,
		nextActions: [claim.nextAction],
	};
}

export function getProofPackageStatus(proofId: string): {
	proofId: string;
	readinessStatus: ReadinessStatus;
	missingEvidence: string[];
	blockers: string[];
} | undefined {
	const proof = PROOF_REGISTRY.find((item) => item.proofId === proofId);
	if (!proof) return undefined;
	const missingEvidence = [...proof.exceptions];
	const blockers = missingEvidence.length > 0 ? ["proof-evidence-missing"] : [];

	return {
		proofId,
		readinessStatus: blockers.length > 0 ? "evidence-needed" : "approved",
		missingEvidence,
		blockers,
	};
}

export function cannotIssueAsset(assetId: string): boolean {
	const readiness = getAssetReadiness(assetId);
	if (!readiness) return true;
	if (readiness.legalScore < 80) return true;
	if (readiness.custodyScore < 80) return true;
	if (readiness.proofScore < 80) return true;
	if (readiness.blockers.length > 0) return true;
	return false;
}

export function isReadyForFunding(subjectId: string): boolean {
	const score = READINESS_SCORING.find((item) => item.subjectId === subjectId);
	if (!score) return false;
	if (score.readinessStatus === "blocked" || score.readinessStatus === "rejected") return false;

	const fundingRouteLegalMissing = FUNDING_ROUTE_REGISTRY.some(
		(route) => route.routeId === subjectId && route.legalStatus !== "approved",
	);
	if (fundingRouteLegalMissing) return false;

	return score.legalScore >= 80 && score.boardApprovalScore >= 80;
}

export function isReadyForIssuance(subjectId: string): boolean {
	const score = READINESS_SCORING.find((item) => item.subjectId === subjectId);
	if (!score) return false;
	if (score.legalScore < 80 || score.custodyScore < 80 || score.proofScore < 80) return false;
	if (hasOpenExceptionsForSubject(subjectId)) return false;
	return true;
}

export function isReadyForSettlement(subjectId: string): boolean {
	const score = READINESS_SCORING.find((item) => item.subjectId === subjectId);
	if (!score) return false;
	if (score.settlementScore < 80) return false;
	if (score.legalScore < 80 || score.custodyScore < 80 || score.proofScore < 80) return false;
	if (hasOpenExceptionsForSubject(subjectId)) return false;
	return true;
}

export function getBlockingConditions(subjectId: string): string[] {
	const score = READINESS_SCORING.find((item) => item.subjectId === subjectId);
	if (score) return score.blockers;

	const claimReadiness = getClaimReadiness(subjectId);
	if (claimReadiness) return claimReadiness.blockers;

	const proofReadiness = getProofPackageStatus(subjectId);
	if (proofReadiness) return proofReadiness.blockers;

	const relatedExceptions = EXCEPTION_REGISTRY.filter((item) => item.subjectId === subjectId && item.status !== "resolved");
	return relatedExceptions.flatMap((item) => item.blockers);
}

export function getNextActions(subjectId: string): string[] {
	const asset = ASSET_REGISTRY.find((item) => item.assetId === subjectId);
	if (asset) return [asset.nextAction];

	const claim = CLAIM_REGISTRY.find((item) => item.id === subjectId);
	if (claim) return [claim.nextAction];

	const exceptions = EXCEPTION_REGISTRY.filter((item) => item.subjectId === subjectId && item.status !== "resolved");
	if (exceptions.length > 0) return exceptions.map((item) => item.nextAction);

	return ["Review readiness package and assign remediation owner."];
}

export function assertStableUnitLaunchAllowed(unitId: string): boolean {
	const unit = STABLE_UNIT_REGISTRY.find((item) => item.id === unitId);
	if (!unit) return false;
	if (unit.type === "troptions-internal-unit") {
		return unit.licensingStatus === "approved";
	}
	return true;
}

export function isInvestorReady(subjectId: string): boolean {
	const investor = INVESTOR_READINESS.find((item) => item.subjectId === subjectId);
	if (!investor) return false;
	return isInvestorOperationallyReady(investor);
}

export function hasCustodyApproval(assetId: string): boolean {
	const custody = CUSTODY_WORKFLOW.find((item) => item.assetId === assetId);
	return Boolean(custody && custody.custodianApproval);
}

export function getReadinessDashboardSummary(): {
	assetsInIntake: number;
	claimsBlocked: number;
	proofPackagesIncomplete: number;
	legalReviewsPending: number;
	custodyReviewsPending: number;
	boardApprovalsPending: number;
	investorsNotReady: number;
	fundingRoutesNotReady: number;
	issuanceBlocked: number;
	settlementBlocked: number;
	exceptionsOpen: number;
	itemsReadyForApproval: number;
} {
	const assetsInIntake = ASSET_REGISTRY.filter((asset) => asset.issuanceStatus !== "approved").length;
	const claimsBlocked = CLAIM_REGISTRY.filter((claim) => claim.publishStatus === "blocked").length;
	const proofPackagesIncomplete = PROOF_REGISTRY.filter((proof) => proof.exceptions.length > 0).length;
	const legalReviewsPending = CLAIM_REGISTRY.filter((claim) => claim.legalStatus !== "approved").length;
	const custodyReviewsPending = CUSTODY_WORKFLOW.filter((item) => !item.custodianApproval).length;
	const boardApprovalsPending = ASSET_REGISTRY.filter((asset) => asset.boardApprovalStatus !== "approved").length;
	const investorsNotReady = INVESTOR_READINESS.filter((item) => !isInvestorOperationallyReady(item)).length;
	const fundingRoutesNotReady = FUNDING_ROUTE_REGISTRY.filter((route) => route.legalStatus !== "approved").length;
	const issuanceBlocked = READINESS_SCORING.filter((item) => cannotIssueAsset(item.subjectId)).length;
	const settlementBlocked = READINESS_SCORING.filter((item) => !isReadyForSettlement(item.subjectId)).length;
	const exceptionsOpen = EXCEPTION_REGISTRY.filter((item) => item.status !== "resolved").length;
	const itemsReadyForApproval = READINESS_SCORING.filter(
		(item) => item.blockers.length === 0 && item.totalScore >= 80,
	).length;

	return {
		assetsInIntake,
		claimsBlocked,
		proofPackagesIncomplete,
		legalReviewsPending,
		custodyReviewsPending,
		boardApprovalsPending,
		investorsNotReady,
		fundingRoutesNotReady,
		issuanceBlocked,
		settlementBlocked,
		exceptionsOpen,
		itemsReadyForApproval,
	};
}

