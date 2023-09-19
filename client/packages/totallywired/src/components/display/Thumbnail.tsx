import "./Thumbnail.css";

type ArtistArtProps = {
  artistId?: string;
};

export function ArtistArt({ artistId }: ArtistArtProps) {
  return (
    <div className="thumbnail artist-art">
      {artistId ? (
        <img
          src={`/api/v1/artists/${artistId}/art`}
          alt="The current artist art"
        />
      ) : null}
    </div>
  );
}

type ReleaseArtProps = {
  releaseId?: string;
};

export function ReleaseArt({ releaseId }: ReleaseArtProps) {
  return (
    <div className="thumbnail release-art">
      {releaseId ? (
        <img
          src={`/api/v1/releases/${releaseId}/art`}
          alt="The current album cover art"
        />
      ) : null}
    </div>
  );
}
