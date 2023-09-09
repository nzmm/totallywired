import {
  IVirtualListItem,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { usePlayer } from "../providers/AudioProvider";
import { Track } from "../lib/types";
import TrackItem from "./TrackListItem";

export type TrackDataProps = IVirtualListItem & Track;

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const player = usePlayer();

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    const target = e.target as HTMLElement;
    switch (target.dataset.action) {
      case "add": {
        player.addTrack(item.data);
      }
    }
  };

  const handleDoubleClick = (
    _: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    player.playNow(item.data);
  };

  return tracks.length ? (
    <VirtualList
      items={tracks.map((t) => ({ ...t, height: 42 }))}
      renderer={TrackItem}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}
