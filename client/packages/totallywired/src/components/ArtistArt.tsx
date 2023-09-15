import "./styles/ArtistArt.css";

type ArtistArtProps = {
  artistId?: string;
};

export default function ArtistArt({ artistId }: ArtistArtProps) {
  return (
    <div className="artist-art">
      {artistId ? (
        <img
          src={`/api/v1/artists/${artistId}/art`}
          alt="The current artist art"
        />
      ) : null}
    </div>
  );
}
