type ApprovalGateBannerProps = {
  label?: string;
  blockedReasons: string[];
};

export function ApprovalGateBanner({ label = "Approval Gate", blockedReasons }: ApprovalGateBannerProps) {
  return (
    <section className="cp-card" aria-label="Approval gate">
      <h3>{label}</h3>
      <span className="cp-badge">Blocked by default</span>
      <p>{blockedReasons.join(" | ")}</p>
    </section>
  );
}
