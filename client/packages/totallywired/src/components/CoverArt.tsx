import "./styles/CoverArt.css";

type CoverArtProps = {
  releaseId?: string;
};

export default function CoverArt({ releaseId }: CoverArtProps) {
  return (
    <div className="cover-art">
      {releaseId ? (
        <img
          src={`/api/v1/releases/${releaseId}/art`}
          alt="The current album cover art"
        />
      ) : null}
    </div>
  );
}
