type Props = {
  reportType: string;
  title: string;
  description: string;
  period: string;
  href?: string;
};

export function ReportCoverCard({ reportType, title, description, period, href }: Props) {
  const Inner = (
    <div className="tm-report-card">
      <span className="tm-report-card-type">{reportType}</span>
      <h3 className="tm-report-card-title">{title}</h3>
      <p className="tm-report-card-desc">{description}</p>
      <p className="tm-report-card-date">{period}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} aria-label={`Open report: ${title}`} style={{ textDecoration: "none", display: "block" }}>
        {Inner}
      </a>
    );
  }

  return Inner;
}
