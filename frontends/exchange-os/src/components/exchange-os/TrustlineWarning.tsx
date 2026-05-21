// TROPTIONS Exchange OS — Trustline Warning Banner

interface Props {
  currency: string;
  issuer: string;
  compact?: boolean;
}

export function TrustlineWarning({ currency, issuer, compact = false }: Props) {
  const short = `${issuer.slice(0, 12)}...`;

  if (compact) {
    return (
      <div className="xos-badge xos-badge--orange" style={{ display: "inline-flex", gap: "0.25rem" }}>
        ⚠ Trustline required for {currency}
      </div>
    );
  }

  return (
    <div className="xos-risk-box" style={{ borderLeft: "3px solid var(--xos-amber)" }}>
      <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>⚠ Trustline Required</div>
      <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.5 }}>
        To hold or receive <strong>{currency}</strong>, your XRPL wallet must have an active
        trustline set to issuer <code style={{ fontFamily: "var(--xos-font-mono)", fontSize: "0.78rem" }}>{short}</code>.
      </p>
      <p style={{ margin: "0.5rem 0 0", fontSize: "0.78rem", color: "var(--xos-text-subtle)" }}>
        Use the <a href="/exchange-os/trade" style={{ color: "var(--xos-cyan)" }}>Trade page</a> to
        prepare a trustline transaction. Your wallet must sign it — TROPTIONS never holds keys.
      </p>
    </div>
  );
}
