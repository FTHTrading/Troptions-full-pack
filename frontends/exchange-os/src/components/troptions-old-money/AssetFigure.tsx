import Image from "next/image";

type AssetFigureProps = {
  src?: string;
  alt?: string;
  caption?: string;
};

export function AssetFigure({ src, alt, caption }: AssetFigureProps) {
  if (!src) {
    return (
      <figure className="om-figure om-figure-placeholder">
        <div className="om-placeholder">Media placeholder</div>
        <figcaption>Approved media will render here when available.</figcaption>
      </figure>
    );
  }

  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

  return (
    <figure className="om-figure">
      {isVideo ? (
        <video className="om-media" controls preload="metadata" muted playsInline>
          <source src={src} />
          Media preview is unavailable in this browser.
        </video>
      ) : (
        <Image
          className="om-media"
          src={src}
          alt={alt ?? "Institutional media"}
          width={1440}
          height={900}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <figcaption>{caption ?? "Institutional media"}</figcaption>
    </figure>
  );
}
