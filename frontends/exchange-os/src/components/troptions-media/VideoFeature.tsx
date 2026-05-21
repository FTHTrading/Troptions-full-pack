type Props = {
  src: string;
  title: string;
  caption?: string;
  className?: string;
};

export function VideoFeature({ src, title, caption }: Props) {
  if (!src) {
    return (
      <div className="tm-video-fallback" role="img" aria-label="Video unavailable">
        Video content not available.
      </div>
    );
  }

  return (
    <div className="tm-video-wrap">
      <div className="tm-video-header">
        <div className="tm-video-dot" aria-hidden="true" />
        <span className="tm-video-label">{title}</span>
      </div>
      <video
        src={src}
        muted
        controls
        playsInline
        preload="metadata"
        aria-label={title}
        style={{ maxHeight: "480px", objectFit: "cover" }}
      />
      {caption && <p className="tm-video-caption">{caption}</p>}
    </div>
  );
}
