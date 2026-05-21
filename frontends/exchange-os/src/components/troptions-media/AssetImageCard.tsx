type Props = {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  category?: string;
  complianceNote?: string;
};

export function AssetImageCard({ src, alt, title, caption, category, complianceNote }: Props) {
  return (
    <div className="tm-asset-card">
      <div className="tm-asset-card-img-wrap">
        <img src={src} alt={alt} loading="lazy" />
      </div>
      <div className="tm-asset-card-body">
        {category && <span className="tm-asset-card-category">{category}</span>}
        <p className="tm-asset-card-title">{title}</p>
        {caption && <p className="tm-asset-card-caption">{caption}</p>}
        {complianceNote && <p className="tm-asset-card-compliance">{complianceNote}</p>}
      </div>
    </div>
  );
}
