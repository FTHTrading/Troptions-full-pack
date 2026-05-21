import type { MediaAsset } from "@/content/troptions/mediaRegistry";
import { MediaGallery } from "./MediaGallery";

type Props = {
  heading: string;
  subheading?: string;
  assets: MediaAsset[];
  columns?: "auto" | "xl" | "full";
};

export function InstitutionalVisualSection({ heading, subheading, assets, columns }: Props) {
  return (
    <div className="tm-visual-section">
      <h2 className="tm-section-heading">{heading}</h2>
      {subheading && <p className="tm-section-subheading">{subheading}</p>}
      <MediaGallery assets={assets} columns={columns} />
    </div>
  );
}
