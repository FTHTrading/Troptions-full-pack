import Link from "next/link";

type OldMoneyNavProps = {
  links: ReadonlyArray<{ label: string; href: string }>;
};

export function OldMoneyNav({ links }: OldMoneyNavProps) {
  return (
    <nav aria-label="Old Money Institutional Sections" className="om-nav">
      {links.map((item) => (
        <Link key={item.href} href={item.href} className="om-nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
