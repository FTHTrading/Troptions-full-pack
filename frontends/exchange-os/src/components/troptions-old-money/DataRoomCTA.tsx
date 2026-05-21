import Link from "next/link";

type DataRoomCTAProps = {
  label: string;
  href: string;
};

export function DataRoomCTA({ label, href }: DataRoomCTAProps) {
  return (
    <div className="om-cta-wrap">
      <Link href={href} className="om-cta">
        {label}
      </Link>
      <p className="om-cta-note">Documentation access remains subject to policy review and authorization.</p>
    </div>
  );
}
