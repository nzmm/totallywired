import {
  ListItemProps,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { useRef } from "react";
import {
  PlaylistItem as Item,
  PlayerTrack,
  AudioPlayer,
  TrackState,
  TRACK_STATE_ARRAY,
} from "../../lib/player";
import "./Playlist.css";
import { Link } from "react-router-dom";

type PlaylistItemProps = ListItemProps<Item<PlayerTrack>>;
type PlaylistProps = {
  player: AudioPlayer;
  items: Item<PlayerTrack>[];
};

const NOOP = () => null;

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

function PlaylistItem({ track, state, i, top, height }: PlaylistItemProps) {
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

export default function Playlist({ player, items }: PlaylistProps) {
  const dragMovingIndex = useRef<number>(0);

  const handlDragStart = (e: React.DragEvent, item: VisibleItem) => {
    e.stopPropagation();
    dragMovingIndex.current = item.i;
  };

  const handleDragOver = (e: React.DragEvent, item: VisibleItem) => {
    e.stopPropagation();

    if (item.i === dragMovingIndex.current) {
      return;
    }

    player.moveTo(dragMovingIndex.current, item.i);
    dragMovingIndex.current = item.i;
  };

  return (
    <VirtualList
      className="tracklist playlist"
      items={items.map((it) => ({ ...it, height: 42, key: it.id }))}
      renderer={PlaylistItem}
      onDragStart={handlDragStart}
      onDragOver={handleDragOver}
      onDrop={NOOP}
    />
  );
}
