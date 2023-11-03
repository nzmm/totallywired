import { ListItemProps } from "@totallywired/ui-components";
import { Link } from "react-router-dom";
import {
  PlaylistItem as Item,
  PlayerTrack,
  TrackState,
  TRACK_STATE_ARRAY,
} from "../../../lib/player";

type PlaylistItemProps = ListItemProps<Item<PlayerTrack>>;

const stateClassNames = (state: TrackState) => {
  const classNames: string[] = [];

  if (state & TrackState.Finished) {
    classNames.push("finished");
  } else if (state & TrackState.Playing) {
    classNames.push("playing");
  } else if (state & TrackState.Paused) {
    classNames.push("paused");
  }
  return classNames.join(" ");
};

const stateInfo = (state: TrackState) => {
  const tips: string[] = [];
  for (const ts of TRACK_STATE_ARRAY) {
    if (ts & state) {
      tips.push(`🔹${TrackState[ts]}`);
    }
  }
  return tips.join("\n");
};

export default function PlaylistItem({
  track,
  state,
  i,
  top,
  height,
}: PlaylistItemProps) {
  return (
    <li
      tabIndex={0}
      style={{ top, height }}
      className={stateClassNames(state)}
      draggable={(state & TrackState.Queued) > 0}
    >
      <span className="col lgutter">
        <em>{i + 1}.</em>
      </span>
      <span className="col name">{track.name}</span>
      <span className="col album">
        <Link to={`/lib/albums/${track.releaseId}`}>{track.releaseName}</Link>
      </span>
      <span className="col artist">
        <Link to={`/lib/artists/${track.artistId}`}>{track.artistName}</Link>
      </span>
      <span className="col state" title={stateInfo(state)}>
        {state}
      </span>
      <span className="col rgutter">{track.displayLength}</span>
    </li>
  );
}
