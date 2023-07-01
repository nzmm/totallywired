import { Link } from "react-router-dom";
import { Track } from "../lib/types";

export type TrackItemProps = Track & {
  onAction(e: React.MouseEvent, action: string, track: Track): void;
};

export default function TrackItem({ onAction, ...track }: TrackItemProps) {
  return (
    <>
      <button
        className="track num"
        title="Play now"
        onClick={(e) => onAction(e, "play", track)}
      >
        {`${track.number}.`}
      </button>
      <span className="track name">{`${track.name}`}</span>
      <Link className="track album" to={`/lib/albums/${track.releaseId}/tracks`}>{`${track.releaseName}`}</Link>
      <Link className="track artist" to={`/lib/artists/${track.artistId}/tracks`}>{`${track.artistName}`}</Link>
      <a className="track liked" href="#">{`${track.liked}`}</a>
      <span className="track duration">{`${track.displayLength}`}</span>
    </>
  );
}
