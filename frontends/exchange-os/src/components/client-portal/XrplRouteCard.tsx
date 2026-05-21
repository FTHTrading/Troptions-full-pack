type XrplRouteCardProps = {
  routeName: string;
  risk: string;
  status: string;
};

export function XrplRouteCard({ routeName, risk, status }: XrplRouteCardProps) {
  return (
    <article className="cp-card">
      <h3>{routeName}</h3>
      <span className="cp-badge">{status}</span>
      <p>Route risk: {risk}. Mode remains read-only or simulation-only.</p>
    </article>
  );
}
