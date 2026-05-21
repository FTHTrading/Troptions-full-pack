import { SignupForm } from "@/components/exchange-os/SignupForm";
import { PARTNER_PACKAGES } from "@/config/exchange-os/packages";

export const metadata = { title: "Get Access — TROPTIONS Exchange OS" };

export default function SignupPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-section-header">
        <div className="xos-gold-line" />
        <h1 className="xos-section-title">Get Exchange OS Access</h1>
        <p className="xos-section-subtitle">
          Choose your partner type. We&apos;ll set up your account and walk you through the platform.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 560px) 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <SignupForm />

        {/* Package overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <h3 style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.25rem" }}>
            What&apos;s Included
          </h3>
          {PARTNER_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="xos-card" style={{ padding: "0.875rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.375rem",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--xos-gold)", fontSize: "0.9rem" }}>
                  {pkg.name}
                </span>
                {pkg.price && (
                  <span className="xos-badge xos-badge--gold">{pkg.price}</span>
                )}
              </div>
              <p style={{ color: "var(--xos-text-muted)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
                {pkg.priceNote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
