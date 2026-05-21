import { MEDIA_REGISTRY, MEDIA_STATS, getMediaByCategory } from "@/content/troptions/mediaRegistry";
import { OLD_MONEY_DISCLAIMER } from "@/content/troptions-old-money/pages";
import { VideoFeature } from "@/components/troptions-media/VideoFeature";
import { AssetImageCard } from "@/components/troptions-media/AssetImageCard";
import { ReportCoverCard } from "@/components/troptions-media/ReportCoverCard";
import "@/styles/troptions-media.css";

export const metadata = {
  title: "Media Library — Troptions Institutional",
  description: "Approved institutional media assets: brand narrative, RWA evidence, gold reserve, energy namespace, and certificates.",
};

const CATEGORY_META: Record<string, { label: string; description: string; icon: string }> = {
  video: {
    label: "Institutional Narrative",
    description: "Brand-level motion sequences for institutional overview and settlement narrative.",
    icon: "▶",
  },
  rwa: {
    label: "Real World Asset Evidence",
    description: "Vault marks, intake flow diagrams, and token-readiness reference materials.",
    icon: "◈",
  },
  gold: {
    label: "Gold Reserve Programme",
    description: "Serial-numbered reserve evidence and digital twin programme visuals.",
    icon: "◆",
  },
  energy: {
    label: "Energy Asset Namespace",
    description: "Oil and carbon environmental namespace institutional marks.",
    icon: "⬡",
  },
  certificate: {
    label: "Institutional Certificates",
    description: "Certificate facsimiles retained in the evidence and diligence track.",
    icon: "✦",
  },
};

export default function TroptionsOldMoneyMediaPage() {
  const videos = getMediaByCategory("video");
  const rwaAssets = getMediaByCategory("rwa");
  const goldAssets = getMediaByCategory("gold");
  const energyAssets = getMediaByCategory("energy");
  const certAssets = getMediaByCategory("certificate");

  return (
    <div className="om-page">

      {/* Hero */}
      <div className="tm-hero">
        <p className="tm-hero-kicker">Institutional Media Library</p>
        <h1 className="tm-hero-title">Approved Visual Assets</h1>
        <p className="tm-hero-subtitle">Evidence-backed imagery and narrative for institutional reference.</p>
        <hr className="tm-gold-rule" />
        <p className="tm-hero-body">
          All assets shown here have been reviewed and approved for institutional display.
          Each is classified by category, assigned a compliance note, and tied to the
          routes where it is authorised to appear.
        </p>
        {/* Media Stats */}
        <div className="tm-stat-row" style={{ marginTop: "1.5rem" }}>
          <div className="tm-stat">
            <span className="tm-stat-value">{MEDIA_STATS.total}</span>
            <span className="tm-stat-label">Total Assets</span>
          </div>
          <div className="tm-stat">
            <span className="tm-stat-value">{MEDIA_STATS.images}</span>
            <span className="tm-stat-label">Images</span>
          </div>
          <div className="tm-stat">
            <span className="tm-stat-value">{MEDIA_STATS.videos}</span>
            <span className="tm-stat-label">Videos</span>
          </div>
          <div className="tm-stat">
            <span className="tm-stat-value">{MEDIA_STATS.approved}</span>
            <span className="tm-stat-label">Approved</span>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {videos.length > 0 && (
        <div className="tm-cat-section">
          <div className="tm-cat-header">
            <div className="tm-cat-icon" aria-hidden="true">{CATEGORY_META.video.icon}</div>
            <div>
              <span className="tm-label">{CATEGORY_META.video.label}</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(247,242,232,0.6)", fontFamily: "var(--tm-font-sans)" }}>
                {CATEGORY_META.video.description}
              </p>
            </div>
          </div>
          <div className="tm-gallery">
            {videos.map((v) => (
              <VideoFeature key={v.id} src={v.src} title={v.title} caption={v.description} />
            ))}
          </div>
        </div>
      )}

      {/* RWA Section */}
      {rwaAssets.length > 0 && (
        <div className="tm-cat-section">
          <div className="tm-cat-header">
            <div className="tm-cat-icon" aria-hidden="true">{CATEGORY_META.rwa.icon}</div>
            <div>
              <span className="tm-label">{CATEGORY_META.rwa.label}</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(247,242,232,0.6)", fontFamily: "var(--tm-font-sans)" }}>
                {CATEGORY_META.rwa.description}
              </p>
            </div>
          </div>
          <div className="tm-gallery">
            {rwaAssets.map((a) => (
              <AssetImageCard
                key={a.id}
                src={a.src}
                alt={a.alt}
                title={a.title}
                caption={a.description}
                category={a.category}
                complianceNote={a.complianceNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gold Section */}
      {goldAssets.length > 0 && (
        <div className="tm-cat-section">
          <div className="tm-cat-header">
            <div className="tm-cat-icon" aria-hidden="true">{CATEGORY_META.gold.icon}</div>
            <div>
              <span className="tm-label">{CATEGORY_META.gold.label}</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(247,242,232,0.6)", fontFamily: "var(--tm-font-sans)" }}>
                {CATEGORY_META.gold.description}
              </p>
            </div>
          </div>
          <div className="tm-gallery">
            {goldAssets.map((a) => (
              <AssetImageCard
                key={a.id}
                src={a.src}
                alt={a.alt}
                title={a.title}
                caption={a.description}
                category={a.category}
                complianceNote={a.complianceNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Energy Section */}
      {energyAssets.length > 0 && (
        <div className="tm-cat-section">
          <div className="tm-cat-header">
            <div className="tm-cat-icon" aria-hidden="true">{CATEGORY_META.energy.icon}</div>
            <div>
              <span className="tm-label">{CATEGORY_META.energy.label}</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(247,242,232,0.6)", fontFamily: "var(--tm-font-sans)" }}>
                {CATEGORY_META.energy.description}
              </p>
            </div>
          </div>
          <div className="tm-gallery">
            {energyAssets.map((a) => (
              <AssetImageCard
                key={a.id}
                src={a.src}
                alt={a.alt}
                title={a.title}
                caption={a.description}
                category={a.category}
                complianceNote={a.complianceNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Certificate Section */}
      {certAssets.length > 0 && (
        <div className="tm-cat-section">
          <div className="tm-cat-header">
            <div className="tm-cat-icon" aria-hidden="true">{CATEGORY_META.certificate.icon}</div>
            <div>
              <span className="tm-label">{CATEGORY_META.certificate.label}</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(247,242,232,0.6)", fontFamily: "var(--tm-font-sans)" }}>
                {CATEGORY_META.certificate.description}
              </p>
            </div>
          </div>
          <div className="tm-gallery">
            {certAssets.map((a) => (
              <AssetImageCard
                key={a.id}
                src={a.src}
                alt={a.alt}
                title={a.title}
                caption={a.description}
                category={a.category}
                complianceNote={a.complianceNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full Registry Reference */}
      <div className="tm-visual-section">
        <h2 className="tm-section-heading">Registry Reference</h2>
        <p className="tm-section-subheading">All {MEDIA_STATS.total} approved assets with route and compliance metadata.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", fontFamily: "var(--tm-font-sans)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(201,162,74,0.25)" }}>
                {["ID", "Title", "Type", "Category", "Route Use", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.5rem 0.75rem",
                      color: "rgba(201,162,74,0.8)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEDIA_REGISTRY.map((asset, i) => (
                <tr
                  key={asset.id}
                  style={{
                    borderBottom: "1px solid rgba(201,162,74,0.1)",
                    background: i % 2 === 0 ? "transparent" : "rgba(201,162,74,0.03)",
                  }}
                >
                  <td style={{ padding: "0.5rem 0.75rem", color: "rgba(201,162,74,0.7)", fontFamily: "monospace" }}>{asset.id}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "rgba(247,242,232,0.85)" }}>{asset.title}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "rgba(247,242,232,0.55)", whiteSpace: "nowrap" }}>{asset.type}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "rgba(247,242,232,0.55)" }}>{asset.category}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "rgba(247,242,232,0.45)", fontSize: "0.68rem" }}>
                    {asset.routeUse.join(", ")}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.75rem",
                      color: asset.status === "approved" ? "rgba(74,201,123,0.85)" : "rgba(201,162,74,0.7)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {asset.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.5rem",
          background: "rgba(7,20,38,0.7)",
          border: "1px solid rgba(201,162,74,0.2)",
          fontSize: "0.72rem",
          lineHeight: "1.6",
          color: "rgba(247,242,232,0.45)",
          fontFamily: "var(--tm-font-sans)",
        }}
      >
        <strong style={{ color: "rgba(201,162,74,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Media Disclosure —{" "}
        </strong>
        {OLD_MONEY_DISCLAIMER}
      </div>

    </div>
  );
}
