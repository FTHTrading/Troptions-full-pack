import type { MediaAsset } from "@/content/troptions/mediaRegistry";

type Props = {
  assets: MediaAsset[];
  columns?: "auto" | "xl" | "full";
};

export function MediaGallery({ assets, columns = "auto" }: Props) {
  if (!assets.length) {
    return (
      <div
        className="tm-video-fallback"
        role="img"
        aria-label="No media available for this section"
      >
        No approved media available for this section.
      </div>
    );
  }

  const cls = `tm-gallery${columns === "xl" ? " tm-gallery-xl" : columns === "full" ? " tm-gallery-full" : ""}`;

  return (
    <div className={cls}>
      {assets.map((asset) =>
        asset.type === "image" ? (
          <div key={asset.id} className="tm-asset-card">
            <div className="tm-asset-card-img-wrap">
              <img src={asset.src} alt={asset.alt} loading="lazy" />
            </div>
            <div className="tm-asset-card-body">
              <span className="tm-asset-card-category">{asset.category}</span>
              <p className="tm-asset-card-title">{asset.title}</p>
              <p className="tm-asset-card-caption">{asset.description}</p>
              <p className="tm-asset-card-compliance">{asset.complianceNote}</p>
            </div>
          </div>
        ) : (
          <div key={asset.id} className="tm-video-wrap">
            <div className="tm-video-header">
              <div className="tm-video-dot" aria-hidden="true" />
              <span className="tm-video-label">Video — {asset.title}</span>
            </div>
            <video
              src={asset.src}
              muted
              controls
              playsInline
              preload="metadata"
              aria-label={asset.alt}
            />
            <p className="tm-video-caption">{asset.description}</p>
          </div>
        )
      )}
    </div>
  );
}
