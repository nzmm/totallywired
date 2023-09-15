import "./styles/ReleaseArt.css";

type ReleaseArtProps = {
  releaseId?: string;
};

export default function ReleaseArt({ releaseId }: ReleaseArtProps) {
  return (
    <div className="release-art">
      {releaseId ? (
        <img
          src={`/api/v1/releases/${releaseId}/art`}
          alt="The current album cover art"
        />
      ) : null}
    </div>
  );
}
