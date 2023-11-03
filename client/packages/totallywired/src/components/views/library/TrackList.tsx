import { useState } from "react";
import {
  IVirtualListItem,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import TrackItem from "./TrackListItem";
import { useToggleTrackReaction } from "../../../lib/tracks/hooks";
import { usePlayer } from "../../../lib/player/hooks";
import { ReactionType, Track } from "../../../lib/types";
import TrackListHeader from "./TrackListHeader";
import "./TrackList.css";

export type TrackDataProps = IVirtualListItem & Track;

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const player = usePlayer();
  const toggleReaction = useToggleTrackReaction();
  const [cachedTracks, setCachedTracks] = useState(tracks);

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
        const reaction = await toggleReaction(item.data);
        setCachedTracks((prev) =>
          prev.map((t) =>
            t.id === item.data.id
              ? { ...t, liked: reaction === ReactionType.Liked }
              : t,
          ),
        );
        break;
      }
      default: {
        console.log(target);
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
    <>
      <TrackListHeader player={player} tracks={tracks} />
      <VirtualList
        className="tracklist"
        items={cachedTracks.map((t) => ({ ...t, height: 42 }))}
        itemRenderer={TrackItem}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />
    </>
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}
