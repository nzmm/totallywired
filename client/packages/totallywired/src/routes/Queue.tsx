import { useRef } from "react";
import {
  ListItemProps,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { usePlayer, useQueue } from "../providers/AudioProvider";
import { QueuedTrack, TRACK_STATE_ARRAY, TrackState } from "../lib/player";

type QueueItemProps = ListItemProps<QueuedTrack>;

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
      tips.push(`${TrackState[ts]} ✅`);
    }
  }
  return tips.join("\n");
};

function QueueItem({ track, state, i, top, height }: QueueItemProps) {
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
      <span className="col album">{track.releaseName}</span>
      <span className="col artist">{track.artistName}</span>
      <span className="col rgutter" title={stateInfo(state)}>
        {state}
      </span>
    </li>
  );
}

export default function Queue() {
  const queue = useQueue();
  const player = usePlayer();
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
      items={queue.map((q) => ({ ...q, height: 42, key: q.id }))}
      renderer={QueueItem}
      onDragStart={handlDragStart}
      onDragOver={handleDragOver}
      onDrop={NOOP}
    />
  );
}
