import type { LegacyClaimRecord } from "@/content/troptions/legacyClaimRegistry";

interface ClaimRewriteCardProps {
  claim: LegacyClaimRecord;
}

export function ClaimRewriteCard({ claim }: ClaimRewriteCardProps) {
  return (
    <article className="te-claim-card">
      <p className="te-kicker">{claim.category}</p>
      <h3>{claim.claimId}</h3>
      <p><strong>Original:</strong> {claim.originalClaim}</p>
      <p><strong>Institutional rewrite:</strong> {claim.approvedRewrite}</p>
      <p className="te-muted"><strong>Status:</strong> {claim.status} · <strong>Verification:</strong> {claim.verificationStatus}</p>
      <p className="te-risk"><strong>Risk note:</strong> {claim.riskNote}</p>
    </article>
  );
}
