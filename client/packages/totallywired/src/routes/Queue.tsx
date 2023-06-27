import { VirtualList } from "@totallywired/ui-components";
import { useQueue } from "../providers/AudioProvider";
import { PlaybackState, TrackState } from "../lib/player";

type QueueItemProps = PlaybackState & {};

const stateClassNames = (state: TrackState) => {
  const classNames: string[] = [];
  if (state & TrackState.Finished) {
    classNames.push("finished");
  } else if (state & TrackState.Playing) {
    classNames.push("playing");
  } else if (state & TrackState.Paused) {
    classNames.push("paused");
  } else if (state & TrackState.Stopped) {
    classNames.push("stopped");
  }
  if (state & TrackState.Loaded) {
    classNames.push("loaded");
  } else if (state & TrackState.Unloaded) {
    classNames.push("unloaded");
  }
  return classNames.join(" ");
};

function QueueItem({ track, state }: QueueItemProps) {
  return (
    <div className={stateClassNames(state)}>
      <span>{track.name}</span>
      <span>{track.releaseName}</span>
      <span>{track.artistName}</span>
      <span>{state}</span>
    </div>
  );
}

export default function Queue() {
  const queue = useQueue();
  return (
    <VirtualList
      items={queue.map((q) => ({ ...q, height: 42 }))}
      renderer={QueueItem}
    />
  );
}
