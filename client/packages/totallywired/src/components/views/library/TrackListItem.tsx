import { ListItemProps } from "@totallywired/ui-components";
import { Link } from "react-router-dom";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import type { Track } from "../../../lib/types";

export type TrackItemProps = ListItemProps<Track>;

export default function TrackItem({ top, height, ...track }: TrackItemProps) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter" title="Enqueue" data-intent="add">
        {track.number}
      </button>
      <span className="col name">{`${track.name}`}</span>
      <span className="col album">
        <Link to={`/lib/albums/${track.releaseId}`}>
          {`${track.releaseName}`}
        </Link>
      </span>
      <span className="col artist">
        <Link to={`/lib/artists/${track.artistId}`}>
          {`${track.artistName}`}
        </Link>
      </span>
      <button className="col liked" data-intent="react">
        {track.liked ? <HeartFilledIcon className="liked" /> : <HeartIcon />}
      </button>
      <span className="col duration rgutter">{`${track.displayLength}`}</span>
    </li>
  );
}
