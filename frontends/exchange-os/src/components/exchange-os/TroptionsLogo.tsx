// TROPTIONS Exchange OS — Official Logo (uses real brand image files)
// Logos available at:
//   /troptions/troptions-logo-new.jpg  (circular coin frame)
//   /troptions/troptions-logo-2.jpg    (rounded-square app icon frame)

/* eslint-disable @next/next/no-img-element */

interface Props {
  size?: number;
  variant?: "full" | "mark" | "wordmark";
  className?: string;
  style?: React.CSSProperties;
}

export function TroptionsLogo({ size = 80, variant = "full", className, style }: Props) {
  const imgSrc = "/troptions/troptions-logo-2.jpg";

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: size * 0.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#C9A24A",
          ...style,
        }}
      >
        TROPTIONS<sup style={{ fontSize: "0.45em", verticalAlign: "super" }}>®</sup>
      </span>
    );
  }

  if (variant === "mark") {
    return (
      <img
        src={imgSrc}
        alt="TROPTIONS"
        width={size}
        height={size}
        className={className}
        style={{
          borderRadius: "18%",
          objectFit: "cover",
          boxShadow: "0 4px 20px rgba(201,162,74,0.35), 0 0 0 1px rgba(201,162,74,0.2)",
          display: "block",
          ...style,
        }}
      />
    );
  }

  // "full" — circular coin + wordmark beneath
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...style }}>
      <img
        src="/troptions/troptions-logo-new.jpg"
        alt="TROPTIONS"
        width={size}
        height={size}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 6px 28px rgba(201,162,74,0.4), 0 0 0 2px rgba(201,162,74,0.25)",
          display: "block",
        }}
      />
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: Math.max(size * 0.18, 11),
        fontWeight: 700,
        letterSpacing: "0.14em",
        color: "#C9A24A",
        textTransform: "uppercase",
      }}>
        Exchange OS
      </span>
    </div>
  );
}

/** The double-T mark as a standalone image */
export function TroptionsMarkSvg({
  size = 48,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src="/troptions/troptions-logo-2.jpg"
      alt="TROPTIONS"
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: "20%",
        objectFit: "cover",
        boxShadow: "0 2px 12px rgba(201,162,74,0.3)",
        display: "block",
        ...style,
      }}
    />
  );
}

/** Sidebar lockup: real logo img + wordmark text */
export function TroptionsSidebarLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : "0.65rem", overflow: "hidden" }}>
      <img
        src="/troptions/troptions-logo-2.jpg"
        alt="TROPTIONS"
        width={collapsed ? 26 : 34}
        height={collapsed ? 26 : 34}
        style={{
          borderRadius: "22%",
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(201,162,74,0.25)",
        }}
      />
      {!collapsed && (
        <div style={{ lineHeight: 1.1, overflow: "hidden" }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#C9A24A",
            whiteSpace: "nowrap",
          }}>
            TROPTIONS<sup style={{ fontSize: "0.55em" }}>®</sup>
          </div>
          <div style={{
            fontSize: "0.62rem",
            color: "var(--xos-text-subtle)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 1,
          }}>
            Exchange OS
          </div>
        </div>
      )}
    </div>
  );
}