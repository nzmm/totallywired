import {
  IVirtualListItem,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import TrackItem from "./TrackListItem";
import { useToggleTrackReaction } from "../../lib/tracks/hooks";
import { usePlayer } from "../../lib/player/hooks";
import { Track } from "../../lib/types";
import "./TrackList.css";

export type TrackDataProps = IVirtualListItem & Track;

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const player = usePlayer();
  const toggleReaction = useToggleTrackReaction();

  const handleClick = async (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>,
  ) => {
    const target = e.target as HTMLElement;
    switch (target.dataset.intent) {
      case "add": {
        player.addTrack(item.data);
        break;
      }
      case "react": {
        await toggleReaction(item.data);
        break;
      }
    }
  };

  const handleDoubleClick = (
    _: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>,
  ) => {
    player.playNow(item.data);
  };

  return tracks.length ? (
    <VirtualList
      className="tracklist"
      items={tracks.map((t) => ({ ...t, height: 42 }))}
      itemRenderer={TrackItem}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}
