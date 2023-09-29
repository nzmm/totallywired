import "./Thumbnail.css";

type ThumbnailProps = {
  className?: string;
  src?: string;
  alt: string;
};

export function Thumbnail({ src, alt, className }: ThumbnailProps) {
  return (
    <div className={`thumbnail ${className}`}>
      {src ? <img src={src} alt={alt} /> : null}
    </div>
  );
}

type ArtistArtProps = {
  artistId?: string;
};

export function ArtistArt({ artistId }: ArtistArtProps) {
  return (
    <Thumbnail
      className="artist-art"
      alt="The artist thumbnail"
      src={artistId ? `/api/v1/artists/${artistId}/art` : undefined}
    />
  );
}

type ReleaseArtProps = {
  releaseId?: string;
};

export function ReleaseArt({ releaseId }: ReleaseArtProps) {
  return (
    <Thumbnail
      className="release-art"
      alt="The release cover art"
      src={releaseId ? `/api/v1/releases/${releaseId}/art` : undefined}
    />
  );
}
