type InstitutionalHeaderProps = {
  title: string;
  subtitle: string;
  intro: string;
};

export function InstitutionalHeader({ title, subtitle, intro }: InstitutionalHeaderProps) {
  return (
    <header className="om-hero">
      <p className="om-kicker">Troptions Institutional Program</p>
      <h1>{title}</h1>
      <p className="om-subtitle">{subtitle}</p>
      <p className="om-intro">{intro}</p>
    </header>
  );
}
