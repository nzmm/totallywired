import { VirtualList } from "@totallywired/ui-components";
import { PlaybackState, useQueue } from "../providers/AudioProvider";

type QueueItemProps = PlaybackState & {
};

function QueueItem({ track, state }: QueueItemProps) {
  return (
    <>
      <span>{track.name}</span>
      <span>{track.releaseName}</span>
      <span>{track.artistName}</span>
      <span>{state}</span>
    </>
  );
}

export default function Queue() {
  const queue = useQueue();

  return <VirtualList items={queue.map(q => ({...q, height: 42}))} renderer={QueueItem} />;
}
