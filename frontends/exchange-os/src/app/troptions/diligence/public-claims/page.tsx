import { ClaimRewriteCard } from "@/components/troptions-evolution/ClaimRewriteCard";
import { getClaimsByStatus } from "@/content/troptions/legacyClaimRegistry";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Public Claims",
  description: "Public claim conversion into approved, needs-evidence, sensitive, blocked, and legacy states.",
};

export default function TroptionsDiligencePublicClaimsPage() {
  const approved = getClaimsByStatus("approved-for-institutional-use");
  const needsEvidence = getClaimsByStatus("needs-evidence");
  const legallySensitive = getClaimsByStatus("legally-sensitive");
  const blocked = getClaimsByStatus("blocked");
  const outdated = getClaimsByStatus("outdated-legacy");

  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Diligence</p>
          <h1 className="te-heading">Public Claims Registry</h1>
          <p className="te-subheading">Legacy claims converted to institutional language with verification and risk states.</p>
        </header>

        <section className="te-panel"><h2>Approved for institutional use</h2><div className="te-claims-grid">{approved.map((claim) => <ClaimRewriteCard key={claim.claimId} claim={claim} />)}</div></section>
        <section className="te-panel"><h2>Needs evidence</h2><div className="te-claims-grid">{needsEvidence.map((claim) => <ClaimRewriteCard key={claim.claimId} claim={claim} />)}</div></section>
        <section className="te-panel"><h2>Legally sensitive</h2><div className="te-claims-grid">{legallySensitive.map((claim) => <ClaimRewriteCard key={claim.claimId} claim={claim} />)}</div></section>
        <section className="te-panel"><h2>Blocked wording</h2><div className="te-claims-grid">{blocked.map((claim) => <ClaimRewriteCard key={claim.claimId} claim={claim} />)}</div></section>
        <section className="te-panel"><h2>Outdated and historical</h2><div className="te-claims-grid">{outdated.map((claim) => <ClaimRewriteCard key={claim.claimId} claim={claim} />)}</div></section>
      </div>
    </main>
  );
}
