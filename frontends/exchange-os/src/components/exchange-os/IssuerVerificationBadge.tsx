// TROPTIONS Exchange OS — Issuer Verification Badge

import { isVerifiedIssuer } from "@/lib/exchange-os/risk/issuerChecks";

interface Props {
  issuer: string;
  showAddress?: boolean;
}

export function IssuerVerificationBadge({ issuer, showAddress = false }: Props) {
  const verified = isVerifiedIssuer(issuer);
  const short = `${issuer.slice(0, 8)}...${issuer.slice(-4)}`;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        className={verified ? "xos-badge xos-badge--green" : "xos-badge xos-badge--orange"}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
      >
        {verified ? "✓ Verified Issuer" : "⚠ Unverified Issuer"}
      </span>
      {showAddress && (
        <span style={{ fontFamily: "var(--xos-font-mono)", fontSize: "0.72rem", color: "var(--xos-text-subtle)" }}>
          {short}
        </span>
      )}
    </div>
  );
}
