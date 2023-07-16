import { ListItemProps } from "@totallywired/ui-components";
import { Link } from "react-router-dom";
import { Track } from "../lib/types";

export type TrackItemProps = ListItemProps<Track>;

export default function TrackItem({
  index,
  top,
  height,
  ...track
}: TrackItemProps) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter" title="Play now" data-action="add">
        {track.number}.
      </button>
      <span className="col name">{`${track.name}`}</span>
      <span className="col album">
        <Link to={`/lib/albums/${track.releaseId}/tracks`}>
          {`${track.releaseName}`}
        </Link>
      </span>
      <span className="col artist">
        <Link to={`/lib/artists/${track.artistId}/tracks`}>
          {`${track.artistName}`}
        </Link>
      </span>
      <a className="col liked" href="#">{`${track.liked}`}</a>
      <span className="duration">{`${track.displayLength}`}</span>
    </li>
  );
}
