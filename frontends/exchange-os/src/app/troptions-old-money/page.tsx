import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { VideoFeature } from "@/components/troptions-media/VideoFeature";
import { MediaStrip } from "@/components/troptions-media/MediaStrip";
import { getMediaByCategory, getApprovedMedia } from "@/content/troptions/mediaRegistry";
import { InstitutionalFuturePanel } from "@/components/troptions-evolution/InstitutionalFuturePanel";
import "@/styles/troptions-evolution.css";

export default function TroptionsOldMoneyPage() {
  const brandVideos = getMediaByCategory("video");
  const primaryVideo = brandVideos[0];
  const imageAssets = getApprovedMedia().filter((m) => m.type === "image").slice(0, 5);

  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.home} />
      {primaryVideo && (
        <div className="om-page" style={{ marginTop: "1.2rem", gap: "1.2rem", display: "flex", flexDirection: "column" }}>
          <VideoFeature
            src={primaryVideo.src}
            title={primaryVideo.title}
            caption={primaryVideo.description}
          />
          {imageAssets.length > 0 && (
            <MediaStrip assets={imageAssets} label="Evidence Gallery" />
          )}
          <InstitutionalFuturePanel />
        </div>
      )}
    </>
  );
}
