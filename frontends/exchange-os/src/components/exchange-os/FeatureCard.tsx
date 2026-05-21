"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accent: "gold" | "cyan" | "green";
  href?: string;
  badge?: string;
  beginnerTip?: string;
}

const accentVars = {
  gold: {
    color: "var(--xos-gold)",
    bg: "var(--xos-gold-glow)",
    border: "var(--xos-gold-muted)",
    badgeClass: "xos-badge--gold",
  },
  cyan: {
    color: "var(--xos-cyan)",
    bg: "var(--xos-cyan-glow)",
    border: "var(--xos-cyan-muted)",
    badgeClass: "xos-badge--cyan",
  },
  green: {
    color: "var(--xos-green)",
    bg: "rgba(34,197,94,0.08)",
    border: "var(--xos-green-muted)",
    badgeClass: "xos-badge--green",
  },
};

export function FeatureCard({
  icon,
  title,
  description,
  accent,
  href,
  badge,
  beginnerTip,
}: FeatureCardProps) {
  const a = accentVars[accent];

  const inner = (
    <div
      className="xos-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "border-color 150ms ease, transform 150ms ease",
        cursor: href ? "pointer" : "default",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = a.border;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "";
        (e.currentTarget as HTMLDivElement).style.transform = "";
      }}
    >
      {/* Icon + badge row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: a.bg,
            border: `1px solid ${a.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
          }}
        >
          {icon}
        </div>
        {badge && (
          <span className={`xos-badge ${a.badgeClass}`}>{badge}</span>
        )}
      </div>

      <div>
        <h3
          style={{
            fontWeight: 700,
            color: "var(--xos-text)",
            fontSize: "1rem",
            marginBottom: "0.375rem",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--xos-text-muted)", lineHeight: 1.55 }}>
          {description}
        </p>
      </div>

      {beginnerTip && (
        <div
          style={{
            fontSize: "0.75rem",
            color: a.color,
            borderTop: `1px solid var(--xos-border)`,
            paddingTop: "0.625rem",
            fontStyle: "italic",
          }}
        >
          💡 {beginnerTip}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        {inner}
      </a>
    );
  }

  return inner;
}
