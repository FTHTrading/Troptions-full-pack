import type { MediaAsset } from "@/content/troptions/mediaRegistry";

type Props = {
  assets: MediaAsset[];
  label?: string;
};

export function MediaStrip({ assets, label }: Props) {
  const images = assets.filter((a) => a.type === "image");

  if (!images.length) return null;

  return (
    <div>
      {label && <span className="tm-label">{label}</span>}
      <div className="tm-strip" role="list" aria-label={label ?? "Media strip"}>
        {images.map((asset) => (
          <div key={asset.id} className="tm-strip-item" role="listitem">
            <img src={asset.src} alt={asset.alt} loading="lazy" />
            <p className="tm-strip-label">{asset.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
