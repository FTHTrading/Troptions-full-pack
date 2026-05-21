type ModuleAccessCardProps = {
  moduleName: string;
  allowed: boolean;
  blockedReasons?: string[];
};

export function ModuleAccessCard({ moduleName, allowed, blockedReasons = [] }: ModuleAccessCardProps) {
  return (
    <article className="cp-card">
      <h3>{moduleName}</h3>
      <span className="cp-badge">{allowed ? "Allowed" : "Blocked"}</span>
      <p>{allowed ? "Access currently enabled within policy controls." : blockedReasons.join(" | ")}</p>
    </article>
  );
}
