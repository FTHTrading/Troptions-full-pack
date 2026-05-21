type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  body?: string;
  mediaSrc?: string;
  mediaAlt?: string;
};

export function InstitutionalMediaHero({ kicker, title, subtitle, body, mediaSrc, mediaAlt }: Props) {
  return (
    <div className="tm-hero">
      {kicker && <p className="tm-hero-kicker">{kicker}</p>}
      <h1 className="tm-hero-title">{title}</h1>
      {subtitle && <p className="tm-hero-subtitle">{subtitle}</p>}
      <hr className="tm-gold-rule" />
      {body && <p className="tm-hero-body">{body}</p>}
      {mediaSrc && (
        <div style={{ marginTop: "1.5rem" }}>
          <img
            src={mediaSrc}
            alt={mediaAlt ?? title}
            style={{
              width: "100%",
              maxHeight: "340px",
              objectFit: "cover",
              borderRadius: "0.4rem",
              border: "1px solid rgba(201, 162, 74, 0.2)",
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}
